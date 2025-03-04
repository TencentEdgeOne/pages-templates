import Grid from "@mui/material/Grid"
import { useMemo, useState, useCallback, memo } from "react"
import styles from "./styles.module.scss"
import clsx from "clsx"

import Filter from "../Filter"
import SearchBar from "../SearchBar"
import FilterAltIcon from "@mui/icons-material/FilterAlt"

import { MEDIA_CONSTANTS } from "../../utils/constants"

const AnimeFilters = () => {
  const [showFilters, setShowFilters] = useState(false)

  const handleShowFilters = useCallback(() => {
    setShowFilters((prevState) => !prevState)
  }, [])

  const [genres, formats, ...filters] = useMemo(() => {
    const {
      SEASON: { ANIME: ANIME_SEASON },
      FORMATS: { ANIME: ANIME_FORMATS },
      STATUS: { ANIME: ANIME_STATUS },
      GENRES,
      ORIGIN,
      LATEST_YEAR
    } = MEDIA_CONSTANTS

    const seasons = Object.keys(ANIME_SEASON).map((key) => ({
      label: ANIME_SEASON[key],
      value: key
    }))
    const formats = Object.keys(ANIME_FORMATS).map((key) => ({
      label: ANIME_FORMATS[key],
      value: key
    }))
    const statuses = Object.keys(ANIME_STATUS).map((key) => ({
      label: ANIME_STATUS[key],
      value: key
    }))
    const origins = Object.keys(ORIGIN).map((key) => ({
      label: ORIGIN[key],
      value: key
    }))
    const years = [...Array(LATEST_YEAR - 1940 + 1).keys()]
      .reverse()
      .map((x) => ({ label: x + 1940 + "", value: x + 1940 + "" }))

    const genres = GENRES.map((genre) => ({ label: genre, value: genre }))

    const filters = [
      { title: "Genres", type: "genres", options: genres, multiple: true },
      { title: "Format", type: "formats", options: formats, multiple: true },
      { title: "Year", type: "year", options: years, multiple: false },
      { title: "Season", type: "season", options: seasons, multiple: false },
      { title: "Status", type: "status", options: statuses, multiple: false },
      {
        title: "Origin",
        type: "origin",
        options: origins,
        multiple: false
      }
    ]
    return filters
  }, [])

  return (
    <>
      <Grid item xs={10} sm={11}>
        <h5 className={styles.filterTitle}>Search</h5>
        <SearchBar />
      </Grid>
      <Grid item xs={2} sm={1}>
        <div className={styles.filterIconContainer}>
          <FilterAltIcon
            onClick={handleShowFilters}
            className={clsx(styles.filterIcon, {
              [styles.active]: showFilters
            })}
          />
        </div>
      </Grid>
      {showFilters &&
        [genres, formats].map((filter) => (
          <Grid
            className={styles.filter}
            item
            xs={12}
            xsm={6}
            key={filter.type}
          >
            <h5 className={styles.filterTitle}>{filter.title}</h5>
            <Filter dataType="ANIME" {...filter} />
          </Grid>
        ))}

      {showFilters &&
        filters.map((filter) => (
          <Grid className={styles.filter} item xs={6} sm={3} key={filter.type}>
            <h5 className={styles.filterTitle}>{filter.title}</h5>
            <Filter dataType="ANIME" {...filter} />
          </Grid>
        ))}
      <div className={styles.separator}></div>
    </>
  )
}
export default memo(AnimeFilters)
