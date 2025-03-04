import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { callAnilistApi } from "../../utils/callApi"
import { generateDate } from "../../utils/utils"
import { CHARACTER_DETAILS_QUERY } from "../../queries/character"

const initialState = {
  loading: null,
  error: null,
  data: null
}

export const fetchCharacterById = createAsyncThunk(
  "character",
  async (character_id) => {
    const res = await callAnilistApi(CHARACTER_DETAILS_QUERY, {
      id: character_id
    })

    const character = res.data.Character

    character.dateOfBirth = generateDate(character.dateOfBirth)
    const medias = character?.media?.edges?.map((media) => media.node)
    return { data: { person: character, medias } }
  }
)

const characterSlice = createSlice({
  name: "character",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCharacterById.pending, (state) => {
        state.loading = true
        state.data = null
        state.error = null
      })
      .addCase(fetchCharacterById.fulfilled, (state, action) => {
        state.loading = null
        state.data = action.payload.data
        state.error = null
      })
      .addCase(fetchCharacterById.rejected, (state, action) => {
        state.loading = null
        state.data = null
        state.error = action.error
      })
  }
})

export const characterActions = characterSlice.actions
export const selectCharacter = (state) => state.character
export default characterSlice.reducer
