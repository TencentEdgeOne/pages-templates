import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { callAnilistApi } from "../../utils/callApi"
import { MANGA_HOME_DATA_QUERY, SEARCH_MANGAS_QUERY } from "../../queries/manga"
import { MEDIA_CONSTANTS } from "../../utils/constants"

// fetch all required data for homepage
export const getHomeMangas = async () => {
  const { data } = await callAnilistApi(MANGA_HOME_DATA_QUERY)
  return { data }
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

const getAllMangas = async (searchString, page) => {
  const variables = generateVariables(searchString, page)
  const { data } = await callAnilistApi(SEARCH_MANGAS_QUERY, variables)
  return { data }
}

export const fetchAllMangas = createAsyncThunk(
  "manga-list",
  async ({ searchString }) => {
    const { data } = await getAllMangas(searchString, 1)
    return { data: data.data.media }
  }
)

export const fetchMoreMangas = createAsyncThunk(
  "more-manga-list",
  async ({ searchString, page }) => {
    const { data } = await getAllMangas(searchString, page)
    return { data: data.data.media }
  }
)

export const fetchHomeMangas = createAsyncThunk("mangaHome", async () => {
  let data
  const res = await getHomeMangas()
  data = await res.data
  data.trendingNow.title = "TRENDING NOW"
  data.mostPopularManhwa.title = "POPULAR MANHWA"
  data.mostPopular.title = "ALL TIME POPULAR"
  data.topScore.title = "TOP 10 MANGA"
  return { data }
})

const initialState = {
  loading: null,
  error: null,
  data: [],
  page: 1,
  allLoaded: false,
  isDefault: true
}

const mangaListSlice = createSlice({
  name: "mangaList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeMangas.pending, (state) => {
        state.isDefault = true
        state.loading = true
        state.data = []
        state.error = null
      })
      .addCase(fetchHomeMangas.fulfilled, (state, action) => {
        state.loading = null
        state.data = action.payload.data
        state.error = null
      })
      .addCase(fetchHomeMangas.rejected, (state, action) => {
        state.loading = null
        state.data = []
        state.error = action.error
      })
      .addCase(fetchAllMangas.pending, (state) => {
        state.isDefault = false
        state.loading = true
        state.data = []
        state.error = null
      })
      .addCase(fetchAllMangas.fulfilled, (state, action) => {
        if (action.payload.data.length === 0) state.allLoaded = true
        state.loading = null
        state.page = 2
        state.data = action.payload.data
        state.error = null
      })
      .addCase(fetchAllMangas.rejected, (state, action) => {
        state.loading = null
        state.page = 1
        state.allLoaded = false
        state.data = []
        state.error = action.error
      })
      .addCase(fetchMoreMangas.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMoreMangas.fulfilled, (state, action) => {
        if (action.payload.data.length === 0) state.allLoaded = true
        state.loading = null
        ++state.page
        state.data.push(...action.payload.data)
        state.error = null
      })
      .addCase(fetchMoreMangas.rejected, (state, action) => {
        state.loading = null
        state.page = 1
        state.allLoaded = false
        state.data = []
        state.error = action.error
      })
  }
})

export const mangaListActions = mangaListSlice.actions
export const selectMangaList = (state) => state.mangaList
export default mangaListSlice.reducer
