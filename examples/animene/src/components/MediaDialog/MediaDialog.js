import Card from "@mui/material/Card"

import { useLayoutEffect, useRef } from "react"

import Chip from "../ui/Chip"
import RatingIcon from "../ui/RatingIcon"

import styles from "./styles.module.scss"

import { MEDIA_CONSTANTS } from "../../utils/constants"

const MediaDialog = ({ data }) => {
  const { SEASON, FORMATS } = MEDIA_CONSTANTS

  const MEDIA_SEASON = SEASON[data.type]
  const MEDIA_FORMATS = FORMATS[data.type]

  const windowWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth

  const ref = useRef(null)
  // check the current position and popup on the left side if current width > window width
  useLayoutEffect(() => {
    if (ref && ref.current.getBoundingClientRect().x + 300 > windowWidth) {
      ref.current.className += ` ${styles.left}`
    }
  }, [windowWidth])

  return (
    <Card className={styles.dialogInfo} ref={ref}>
      <div className={`${styles.infoContainer} ${styles.first}`}>
        {data.season && (
          <span>
            {MEDIA_SEASON[data.season]} {data.seasonYear}
          </span>
        )}
        {!data.season && (
          <span>
            {data.startDate?.year}{" "}
            {data.endDate?.year && `- ${data.endDate?.year}`}
          </span>
        )}
        <div className={styles.ratingContainer}>
          <RatingIcon score={data.averageScore} />
          <span>
            {data.averageScore}
            {data.averageScore && "%"}
          </span>
        </div>
      </div>
      {data.studios?.edges?.[0]?.node?.name && (
        <div className={styles.infoContainer}>
          <span className={styles.studio}>
            {data.studios?.edges[0]?.node?.name}
          </span>
        </div>
      )}
      {data.studios?.nodes?.[0]?.name && (
        <div className={styles.infoContainer}>
          <span className={styles.studio}>
            {data.studios?.nodes?.[0]?.name}
          </span>
        </div>
      )}
      <div className={styles.formatEpisodeContainer}>
        <span className={styles.format}>{MEDIA_FORMATS[data.format]}</span>
        {data.episodes && (
          <span className={styles.episode}>{data.episodes} episodes</span>
        )}
        {data.chapters && (
          <span className={styles.episode}>{data.chapters} chapters</span>
        )}
      </div>
      <div className={styles.chipContainer}>
        {data.genres.map((genre) => (
          <Chip className={styles.chip} type={data.type} key={genre}>
            {genre}
          </Chip>
        ))}
      </div>
    </Card>
  )
}
export default MediaDialog
