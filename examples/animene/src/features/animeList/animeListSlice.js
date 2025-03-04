import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { callAnilistApi } from "../../utils/callApi"
import { SEARCH_ANIMES_QUERY } from "../../queries/anime"
import { MEDIA_CONSTANTS } from "../../utils/constants"

const initialState = {
  loading: null,
  error: null,
  data: [],
  page: 1,
  allLoaded: false
}

const generateVariables = (searchString, page) => {
  const variables = { sort: "SCORE_DESC", page: page || 1 }
  const { PARAMETERS } = MEDIA_CONSTANTS
  const rawParams = searchString.slice(1).split("&")
  rawParams.forEach((rawParam) => {
    let [rawType, rawValue] = rawParam.split("=")
    if (rawValue && rawValue.includes("+"))
      rawValue = rawValue.split("+").join(" ")
    let value
    let type = PARAMETERS[rawType]
    switch (rawType) {
      case "genres":
      case "formats":
        value = rawValue.split("%2C")
        variables[type] = value
        break
      case "year":
        value = parseInt(rawValue)
        break
      default:
        value = rawValue
        break
    }
    variables[type] = value
  })
  return variables
}

const getAllAnimes = async (searchString, page) => {
  const variables = generateVariables(searchString, page)
  const { data } = await callAnilistApi(SEARCH_ANIMES_QUERY, variables)
  return { data }
}

export const fetchAllAnimes = createAsyncThunk(
  "anime-list",
  async ({ searchString }) => {
    const { data } = await getAllAnimes(searchString, 1)
    return { data: data.data.media }
  }
)

export const fetchMoreAnimes = createAsyncThunk(
  "more-anime-list",
  async ({ searchString, page }) => {
    const { data } = await getAllAnimes(searchString, page)
    return { data: data.data.media }
  }
)

const animeListSlice = createSlice({
  name: "animeList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAnimes.pending, (state) => {
        state.loading = true
        state.data = []
        state.error = null
      })
      .addCase(fetchAllAnimes.fulfilled, (state, action) => {
        if (action.payload.data.length === 0) state.allLoaded = true
        state.loading = null
        state.page = 2
        state.data = action.payload.data
        state.error = null
      })
      .addCase(fetchAllAnimes.rejected, (state, action) => {
        state.loading = null
        state.page = 1
        state.allLoaded = false
        state.data = []
        state.error = action.error
      })
      .addCase(fetchMoreAnimes.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMoreAnimes.fulfilled, (state, action) => {
        if (action.payload.data.length === 0) state.allLoaded = true
        state.loading = null
        ++state.page
        state.data.push(...action.payload.data)
        state.error = null
      })
      .addCase(fetchMoreAnimes.rejected, (state, action) => {
        state.loading = null
        state.page = 1
        state.allLoaded = false
        state.data = []
        state.error = action.error
      })
  }
})

export const animeListActions = animeListSlice.actions
export const selectAnimeList = (state) => state.animeList
export default animeListSlice.reducer
