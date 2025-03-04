import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { callAnimeApi, callAnilistApi } from "../../utils/callApi"
import { MEDIA_CONSTANTS } from "../../utils/constants"
import { generateDate } from "../../utils/utils"
import { ANIME_DETAILS_QUERY } from "../../queries/anime"

const extractSubInfo = (animeInfo, studios, producers) => {
  const results = []
  const {
    averageScore,
    duration,
    startDate,
    endDate,
    format,
    genres,
    season,
    seasonYear,
    status,
    title,
    synonyms,
    episodes
  } = animeInfo

  results.push({
    type: "Format",
    value: MEDIA_CONSTANTS.FORMATS[animeInfo.type][format]
  })
  results.push({ type: "Episodes", value: episodes || "unknown" })
  results.push({
    type: "Duration",
    value: duration ? duration + " mins" : "unknown"
  })
  results.push({
    type: "Status",
    value: MEDIA_CONSTANTS.STATUS[animeInfo.type][status]
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
    type: "Season",
    value: MEDIA_CONSTANTS.SEASON.ANIME[season] + " " + seasonYear
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

const refactorAnimeDetails = (animeInfo) => {
  const {
    characters,
    recommendations,
    relations,
    staff,
    streamingEpisodes,
    ...rest
  } = animeInfo.data.Media
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

export const fetchAnimeById = createAsyncThunk("anime", async (anime_id) => {
  const res = await callAnilistApi(ANIME_DETAILS_QUERY, { id: anime_id })
  const data = refactorAnimeDetails(res)
  return { data }
})

const animeSlice = createSlice({
  name: "anime",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnimeById.pending, (state) => {
        state.loading = true
        state.data = null
        state.error = null
      })
      .addCase(fetchAnimeById.fulfilled, (state, action) => {
        state.loading = null
        state.data = action.payload.data
        state.error = null
      })
      .addCase(fetchAnimeById.rejected, (state, action) => {
        state.loading = null
        state.data = null
        state.error = action.error
      })
  }
})

export const animeActions = animeSlice.actions
export const selectAnime = (state) => state.anime
export default animeSlice.reducer
