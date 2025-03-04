import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { callAnilistApi } from "../../utils/callApi"
import { HOME_DATA_QUERY } from "../../queries/anime"
import {
  getCurrentSeason,
  getCurrentYear,
  getNextSeason
} from "../../utils/utils"

// fetch all required data for homepage
export const getHomeAnimes = async () => {
  const { value: currentSeason } = getCurrentSeason()
  const { value: nextSeason } = getNextSeason()
  const currentYear = getCurrentYear()
  const nextSeasonYear = nextSeason === "SPRING" ? currentYear + 1 : currentYear
  const { data } = await callAnilistApi(HOME_DATA_QUERY, {
    currentSeason,
    nextSeason,
    currentYear,
    nextSeasonYear
  })
  return { data }
}

const initialState = {
  loading: null,
  error: null,
  data: null
}

// fetch and cache homepage data until 7:00AM in the next day
// TODO: store home data in personal server instead of local storage
export const fetchHomeAnimes = createAsyncThunk("home", async () => {
  let data
  const homeStorage = JSON.parse(localStorage.getItem("homeStorage"))
  const isExpired = homeStorage?.expired <= new Date().toISOString()
  if (!homeStorage || isExpired) {
    let tomorrow = new Date()
    tomorrow.setHours(7)
    tomorrow.setMinutes(0)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const res = await getHomeAnimes()
    data = await res.data
    data.trendingNow.title = "TRENDING NOW"
    data.mostPopularThisSeason.title = "POPULAR THIS SEASON"
    data.mostPopularNextSeason.title = "UPCOMING NEXT SEASON"
    data.mostPopular.title = "ALL TIME POPULAR"
    data.topScore.title = "TOP 10 ANIME"
    const newHomeStorage = await { expired: tomorrow, data: data }
    localStorage.setItem("homeStorage", JSON.stringify(newHomeStorage))
  } else {
    data = homeStorage.data
  }
  return { data }
})

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeAnimes.pending, (state) => {
        state.loading = true
        state.data = null
        state.error = null
      })
      .addCase(fetchHomeAnimes.fulfilled, (state, action) => {
        state.loading = null
        state.data = action.payload.data
        state.error = null
      })
      .addCase(fetchHomeAnimes.rejected, (state, action) => {
        state.loading = null
        state.data = null
        state.error = action.error
      })
  }
})

export const homeActions = homeSlice.actions
export const selectHome = (state) => state.home
export default homeSlice.reducer
