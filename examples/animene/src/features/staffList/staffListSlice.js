import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { callAnilistApi } from "../../utils/callApi"
import { STAFF_HOME_DATA_QUERY, SEARCH_STAFFS_QUERY } from "../../queries/staff"
import { MEDIA_CONSTANTS } from "../../utils/constants"

// fetch all required data for homepage
export const getHomeStaffs = async () => {
  const { data } = await callAnilistApi(STAFF_HOME_DATA_QUERY)

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

const getAllStaffs = async (searchString, page) => {
  const variables = generateVariables(searchString, page)
  const { data } = await callAnilistApi(SEARCH_STAFFS_QUERY, variables)
  for (let staff of data.data.staff) {
    staff.type = "STAFF"
  }
  return { data }
}

export const fetchAllStaffs = createAsyncThunk(
  "staff-list",
  async ({ searchString }) => {
    const { data } = await getAllStaffs(searchString, 1)
    return { data: data.data.staff }
  }
)

export const fetchMoreStaffs = createAsyncThunk(
  "more-staff-list",
  async ({ searchString, page }) => {
    const { data } = await getAllStaffs(searchString, page)
    return { data: data.data.staff }
  }
)

export const fetchHomeStaffs = createAsyncThunk("staffHome", async () => {
  let data
  const res = await getHomeStaffs()
  data = await res.data
  data.birthday.title = "BIRTHDAYS"
  data.birthday.staff.forEach((staff) => {
    staff.type = "STAFF"
  })
  data.mostFavorite.title = "FAVORITE STAFFS"
  data.mostFavorite.staff.forEach((staff) => {
    staff.type = "STAFF"
  })
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

const staffListSlice = createSlice({
  name: "staffList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeStaffs.pending, (state) => {
        state.isDefault = true
        state.loading = true
        state.data = []
        state.error = null
      })
      .addCase(fetchHomeStaffs.fulfilled, (state, action) => {
        state.loading = null
        state.data = action.payload.data
        state.error = null
      })
      .addCase(fetchHomeStaffs.rejected, (state, action) => {
        state.loading = null
        state.data = []
        state.error = action.error
      })
      .addCase(fetchAllStaffs.pending, (state) => {
        state.isDefault = false
        state.loading = true
        state.data = []
        state.error = null
      })
      .addCase(fetchAllStaffs.fulfilled, (state, action) => {
        if (action.payload.data.length === 0) state.allLoaded = true
        state.loading = null
        state.page = 2
        state.data = action.payload.data
        state.error = null
      })
      .addCase(fetchAllStaffs.rejected, (state, action) => {
        state.loading = null
        state.page = 1
        state.allLoaded = false
        state.data = []
        state.error = action.error
      })
      .addCase(fetchMoreStaffs.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMoreStaffs.fulfilled, (state, action) => {
        if (action.payload.data.length === 0) state.allLoaded = true
        state.loading = null
        ++state.page
        state.data.push(...action.payload.data)
        state.error = null
      })
      .addCase(fetchMoreStaffs.rejected, (state, action) => {
        state.loading = null
        state.page = 1
        state.allLoaded = false
        state.data = []
        state.error = action.error
      })
  }
})

export const staffListActions = staffListSlice.actions
export const selectStaffList = (state) => state.staffList
export default staffListSlice.reducer
