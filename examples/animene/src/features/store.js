import { configureStore } from "@reduxjs/toolkit"
import animeReducer from "./anime/animeSlice"
import mangaReducer from "./manga/mangaSlice"
import characterReducer from "./character/characterSlice"
import staffReducer from "./staff/staffSlice"
import animeListReducer from "./animeList/animeListSlice"
import homeReducer from "./home/homeSlice"
import mangaListReducer from "./mangaList/mangaListSlice"
import staffListReducer from "./staffList/staffListSlice"
import characterListReducer from "./characterList/characterListSlice"

const store = configureStore({
  reducer: {
    anime: animeReducer,
    manga: mangaReducer,
    character: characterReducer,
    staff: staffReducer,
    animeList: animeListReducer,
    home: homeReducer,
    mangaList: mangaListReducer,
    staffList: staffListReducer,
    characterList: characterListReducer
  }
})

export default store
