import { MEDIA_CONSTANTS } from "./constants"

const { SEASON } = MEDIA_CONSTANTS

// get the current season
export const getCurrentSeason = (d = new Date()) => {
  const seasonArray = [
    {
      value: "WINTER",
      label: "Winter",
      date: new Date(
        d.getFullYear(),
        11,
        d.getFullYear() % 4 === 0 ? 20 : 21
      ).getTime()
    },
    {
      value: "SPRING",
      label: "Spring",
      date: new Date(
        d.getFullYear(),
        2,
        d.getFullYear() % 4 === 0 ? 19 : 20
      ).getTime()
    },
    {
      value: "SUMMER",
      label: "Summer",
      date: new Date(
        d.getFullYear(),
        5,
        d.getFullYear() % 4 === 0 ? 20 : 21
      ).getTime()
    },
    {
      value: "FALL",
      label: "Fall",
      date: new Date(
        d.getFullYear(),
        8,
        d.getFullYear() % 4 === 0 ? 22 : 23
      ).getTime()
    }
  ]

  const season = seasonArray.filter(({ date }) => date <= d).slice(-1)[0] || {
    value: "WINTER",
    label: "Winter"
  }
  return season
}

export const getNextSeason = () => {
  const { value: currentSeason } = getCurrentSeason()

  const seasons = Object.keys(SEASON.ANIME).map((key, idx) => {
    return { value: key, label: SEASON.ANIME[key], idx }
  })
  return seasons[
    seasons.find((season) => season.value === currentSeason).idx + 1
  ]
}

export const getCurrentYear = () => {
  return new Date().getFullYear()
}

export const generateDate = ({ day, month, year }) => {
  if (!day && !month && !year) return "unknown"

  const res = []

  if (day) {
    res.push(day < 10 ? `0${day}` : day)
  }
  if (month) {
    res.push(month < 10 ? `0${month}` : month)
  }
  if (year) {
    res.push(year)
  }
  return res.join("-")
}

export const checkEmail = (value) => {
  if (value.trim().length === 0) return "Email is required"
  if (
    !value
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  )
    return "Please enter your email"
}

export const checkPassword = (value) => {
  if (value.trim().length === 0) return "Password is required"
  if (value.trim().length < 6) return "Password must be at least 6 characters"
}

export const checkConfirmPassword = (password, confirmPassword) => {
  if (confirmPassword.trim().length === 0) return "Confirm password is required"
  if (confirmPassword !== password)
    return "Please make sure your passwords match"
}
