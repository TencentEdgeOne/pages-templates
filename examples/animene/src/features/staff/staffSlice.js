import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { callAnilistApi } from "../../utils/callApi"
import { generateDate } from "../../utils/utils"
import { STAFF_DETAILS_QUERY } from "../../queries/staff"

const initialState = {
  loading: null,
  error: null,
  data: null
}

export const fetchStaffById = createAsyncThunk("staff", async (staff_id) => {
  const res = await callAnilistApi(STAFF_DETAILS_QUERY, { id: staff_id })
  const staff = res.data.Staff
  staff.dateOfBirth = generateDate(staff.dateOfBirth)
  const medias = staff?.staffMedia?.edges?.map((media) => media.node)
  return { data: { person: staff, medias } }
})

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaffById.pending, (state) => {
        state.loading = true
        state.data = null
        state.error = null
      })
      .addCase(fetchStaffById.fulfilled, (state, action) => {
        state.loading = null
        state.data = action.payload.data
        state.error = null
      })
      .addCase(fetchStaffById.rejected, (state, action) => {
        state.loading = null
        state.data = null
        state.error = action.error
      })
  }
})

export const staffActions = staffSlice.actions
export const selectStaff = (state) => state.staff
export default staffSlice.reducer
