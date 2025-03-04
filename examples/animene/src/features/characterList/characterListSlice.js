import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { callAnilistApi } from "../../utils/callApi"
import {
  CHARACTER_HOME_DATA_QUERY,
  SEARCH_CHARACTERS_QUERY
} from "../../queries/character"
import { MEDIA_CONSTANTS } from "../../utils/constants"

// fetch all required data for homepage
export const getHomeCharacters = async () => {
  const { data } = await callAnilistApi(CHARACTER_HOME_DATA_QUERY)
  return { data }
}

const generateVariables = (searchString, page) => {
  const variables = { page: page || 1 }
  const { PARAMETERS } = MEDIA_CONSTANTS
  const rawParams = searchString.slice(1).split("&")
  rawParams.forEach((rawParam) => {
    let [rawType, rawValue] = rawParam.split("=")
    if (rawValue && rawValue.includes("+"))
      rawValue = rawValue.split("+").join(" ")
    let type = PARAMETERS[rawType]
    variables[type] = rawValue
  })
  return variables
}

const getAllCharacters = async (searchString, page) => {
  const variables = generateVariables(searchString, page)
  const { data } = await callAnilistApi(SEARCH_CHARACTERS_QUERY, variables)
  for (let character of data.data.characters) {
    character.type = "CHARACTER"
  }
  return { data }
}

export const fetchAllCharacters = createAsyncThunk(
  "character-list",
  async ({ searchString }) => {
    const { data } = await getAllCharacters(searchString, 1)
    return { data: data.data.characters }
  }
)

export const fetchMoreCharacters = createAsyncThunk(
  "more-character-list",
  async ({ searchString, page }) => {
    const { data } = await getAllCharacters(searchString, page)
    return { data: data.data.characters }
  }
)

export const fetchHomeCharacters = createAsyncThunk(
  "characterHome",
  async () => {
    let data
    const res = await getHomeCharacters()
    data = await res.data
    data.birthday.title = "BIRTHDAYS"
    data.birthday.characters.forEach((character) => {
      character.type = "CHARACTER"
    })
    data.mostFavorite.title = "FAVORITE CHARACTERS"
    data.mostFavorite.characters.forEach((character) => {
      character.type = "CHARACTER"
    })
    return { data }
  }
)

const initialState = {
  loading: null,
  error: null,
  data: [],
  page: 1,
  allLoaded: false,
  isDefault: true
}

const characterListSlice = createSlice({
  name: "characterList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeCharacters.pending, (state) => {
        state.isDefault = true
        state.loading = true
        state.data = []
        state.error = null
      })
      .addCase(fetchHomeCharacters.fulfilled, (state, action) => {
        state.loading = null
        state.data = action.payload.data
        state.error = null
      })
      .addCase(fetchHomeCharacters.rejected, (state, action) => {
        state.loading = null
        state.data = []
        state.error = action.error
      })
      .addCase(fetchAllCharacters.pending, (state) => {
        state.isDefault = false
        state.loading = true
        state.data = []
        state.error = null
      })
      .addCase(fetchAllCharacters.fulfilled, (state, action) => {
        if (action.payload.data.length === 0) state.allLoaded = true
        state.loading = null
        state.page = 2
        state.data = action.payload.data
        state.error = null
      })
      .addCase(fetchAllCharacters.rejected, (state, action) => {
        state.loading = null
        state.page = 1
        state.allLoaded = false
        state.data = []
        state.error = action.error
      })
      .addCase(fetchMoreCharacters.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMoreCharacters.fulfilled, (state, action) => {
        if (action.payload.data.length === 0) state.allLoaded = true
        state.loading = null
        ++state.page
        state.data.push(...action.payload.data)
        state.error = null
      })
      .addCase(fetchMoreCharacters.rejected, (state, action) => {
        state.loading = null
        state.page = 1
        state.allLoaded = false
        state.data = []
        state.error = action.error
      })
  }
})

export const characterListActions = characterListSlice.actions
export const selectCharacterList = (state) => state.characterList
export default characterListSlice.reducer
