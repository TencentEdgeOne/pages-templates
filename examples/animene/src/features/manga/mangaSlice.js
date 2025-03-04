import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { callMangaApi, callAnilistApi } from "../../utils/callApi"
import { MEDIA_CONSTANTS } from "../../utils/constants"
import { generateDate } from "../../utils/utils"
import { MANGA_DETAILS_QUERY } from "../../queries/manga"

const extractSubInfo = (mangaInfo, studios, producers) => {
  const results = []
  const {
    averageScore,
    startDate,
    endDate,
    format,
    genres,
    status,
    title,
    synonyms,
    chapters
  } = mangaInfo

  results.push({
    type: "Format",
    value: MEDIA_CONSTANTS.FORMATS[mangaInfo.type][format]
  })
  results.push({ type: "Chapters", value: chapters || "unknown" })
  results.push({
    type: "Status",
    value: MEDIA_CONSTANTS.STATUS[mangaInfo.type][status]
  })
  results.push({
    type: "Start date",
    value: generateDate(startDate)
  })
  results.push({
    type: "End date",
    value: generateDate(endDate)
  })
  results.push({
    type: "Average Score",
    value: averageScore ? averageScore + "%" : "unknown"
  })
  if (studios.length > 0)
    results.push({
      type: "Studios",
      value: studios
    })
  if (producers.length > 0)
    results.push({
      type: "Producers",
      value: producers
    })
  results.push({
    type: "Genres",
    value: genres
  })
  results.push({
    type: "Romaji",
    value: title.romaji
  })
  results.push({
    type: "English",
    value: title.english
  })
  results.push({
    type: "Native",
    value: title.native
  })
  results.push({
    type: "Synonyms",
    value: synonyms[0]
  })

  return results
}

const refactorMangaDetails = (mangaInfo) => {
  const {
    characters,
    recommendations,
    relations,
    staff,
    streamingEpisodes,
    ...rest
  } = mangaInfo.data.Media
  let transformedCharacters = []
  let transformedRecommendations = []
  let transformedRelations = []
  let transformedStaff = []
  let transformedDesc = ""
  let studios = []
  let producers = []
  transformedCharacters = characters.edges.map((character) => {
    return {
      role: character.role,
      ...character.node,
      type: "CHARACTER"
    }
  })
  transformedStaff = staff.edges.map((staffItem) => {
    return {
      role: staffItem.role,
      ...staffItem.node,
      type: "STAFF"
    }
  })
  transformedRecommendations = recommendations.edges.map((recommendation) => {
    return recommendation.node.mediaRecommendation
  })

  transformedRelations = relations.edges.map((relation) => {
    return relation.node
  })

  if (rest) {
    rest.description.split("<br />").forEach((part, i) => {
      if (i % 2 === 0) {
        transformedDesc += `<p>${part}<p/>`
      }
    })
    rest.description = transformedDesc
  }
  rest?.studios.edges.map((studio) => {
    if (studio.node.isAnimationStudio) {
      studios.push(studio.node.name)
    } else {
      producers.push(studio.node.name)
    }
  })

  const subInfo = extractSubInfo(rest, studios, producers)
  return {
    data: rest,
    subInfo: subInfo,
    characters: transformedCharacters,
    recommendations: transformedRecommendations,
    relations: transformedRelations,
    staff: transformedStaff,
    streamingEpisodes
  }
}

const initialState = {
  loading: null,
  error: null,
  data: null
}

export const fetchMangaById = createAsyncThunk("manga", async (manga_id) => {
  const res = await callAnilistApi(MANGA_DETAILS_QUERY, { id: manga_id })
  const data = refactorMangaDetails(res)
  return { data }
})

const mangaSlice = createSlice({
  name: "manga",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMangaById.pending, (state) => {
        state.loading = true
        state.data = null
        state.error = null
      })
      .addCase(fetchMangaById.fulfilled, (state, action) => {
        state.loading = null
        state.data = action.payload.data
        state.error = null
      })
      .addCase(fetchMangaById.rejected, (state, action) => {
        state.loading = null
        state.data = null
        state.error = action.error
      })
  }
})

export const mangaActions = mangaSlice.actions
export const selectManga = (state) => state.manga
export default mangaSlice.reducer
