import Home from "../containers/HomeTemplate/Home"
import SignUp from "../containers/HomeTemplate/SignUp"
import Login from "../containers/HomeTemplate/Login"
import ForgotPassword from "../containers/HomeTemplate/ForgotPassword"
import AnimeList from "../containers/HomeTemplate/AnimeList"
import Anime from "../containers/HomeTemplate/Anime"
import Character from "../containers/HomeTemplate/Character"
import Staff from "../containers/HomeTemplate/Staff"
import Manga from "../containers/HomeTemplate/Manga"
import MangaList from "../containers/HomeTemplate/MangaList"
import StaffList from "../containers/HomeTemplate/StaffList"
import CharacterList from "../containers/HomeTemplate/CharacterList"
import ComingSoon from "../containers/HomeTemplate/ComingSoon"

// all endpoints
const PATHS = {
  ANIME: {
    SEARCH: "/search/anime",
    DETAILS: "/anime"
  },
  MANGA: {
    SEARCH: "/search/manga",
    DETAILS: "/manga"
  },
  CHARACTER: {
    SEARCH: "/search/characters",
    DETAILS: "/character"
  },
  CHARACTERS: {
    SEARCH: "/search/characters",
    DETAILS: "/character"
  },
  STAFF: {
    SEARCH: "/search/staff",
    DETAILS: "/staff"
  },
  FORUM: "/forum",
  SIGNUP: "/signup",
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  PROFILE: "/profile",
  NOTIFICATIONS: "/notifications",
  SETTINGS: "/settings",
  LOGOUT: "/logout"
}

const routeHome = [
  {
    exact: true,
    path: "/",
    component: Home
  },
  {
    exact: false,
    path: PATHS.ANIME.SEARCH,
    component: AnimeList
  },
  {
    exact: false,
    path: `${PATHS.ANIME.DETAILS}/:id`,
    component: Anime
  },
  {
    exact: false,
    path: PATHS.MANGA.SEARCH,
    component: MangaList
  },
  {
    exact: false,
    path: `${PATHS.MANGA.DETAILS}/:id`,
    component: Manga
  },
  {
    exact: false,
    path: PATHS.STAFF.SEARCH,
    component: StaffList
  },
  {
    exact: false,
    path: `${PATHS.STAFF.DETAILS}/:id`,
    component: Staff
  },
  {
    exact: false,
    path: PATHS.CHARACTER.SEARCH,
    component: CharacterList
  },
  {
    exact: false,
    path: `${PATHS.CHARACTER.DETAILS}/:id`,
    component: Character
  },
  {
    exact: false,
    path: PATHS.FORUM,
    component: ComingSoon
  },
  {
    exact: true,
    path: PATHS.SIGNUP,
    component: SignUp
  },
  {
    exact: true,
    path: PATHS.LOGIN,
    component: Login
  },
  {
    exact: true,
    path: PATHS.FORGOT_PASSWORD,
    component: ForgotPassword
  },
  {
    exact: true,
    path: PATHS.PROFILE,
    component: ComingSoon
  },
  {
    exact: true,
    path: PATHS.NOTIFICATIONS,
    component: ComingSoon
  },
  {
    exact: true,
    path: PATHS.SETTINGS,
    component: ComingSoon
  },
  {
    exact: true,
    path: PATHS.LOGOUT,
    component: ComingSoon
  }
]

export { routeHome, PATHS }
