import Grid from "@mui/material/Grid"
import { useMemo, useState, useCallback, memo } from "react"

import styles from "./styles.module.scss"
import clsx from "clsx"

import Filter from "../Filter"
import SearchBar from "../SearchBar"
import FilterAltIcon from "@mui/icons-material/FilterAlt"

import { MEDIA_CONSTANTS } from "../../utils/constants"

const MangaFilters = () => {
  const [showFilters, setShowFilters] = useState(false)

  const handleShowFilters = useCallback(() => {
    setShowFilters((prevState) => !prevState)
  }, [])

  const filters = useMemo(() => {
    const {
      FORMATS: { MANGA: MANGA_FORMATS },
      STATUS: { MANGA: MANGA_STATUS },
      GENRES,
      ORIGIN
    } = MEDIA_CONSTANTS

    const formats = Object.keys(MANGA_FORMATS).map((key) => ({
      label: MANGA_FORMATS[key],
      value: key
    }))
    const statuses = Object.keys(MANGA_STATUS).map((key) => ({
      label: MANGA_STATUS[key],
      value: key
    }))
    const origins = Object.keys(ORIGIN).map((key) => ({
      label: ORIGIN[key],
      value: key
    }))

    const genres = GENRES.map((genre) => ({ label: genre, value: genre }))

    const filters = [
      { title: "Genres", type: "genres", options: genres, multiple: true },
      { title: "Format", type: "formats", options: formats, multiple: true },
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
        filters.map((filter) => (
          <Grid
            className={styles.filter}
            item
            xs={12}
            xsm={6}
            sm={3}
            key={filter.type}
          >
            <h5 className={styles.filterTitle}>{filter.title}</h5>
            <Filter dataType="MANGA" {...filter} />
          </Grid>
        ))}
      <div className={styles.separator}></div>
    </>
  )
}
export default memo(MangaFilters)
