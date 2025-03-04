import Stack from "@mui/material/Stack"

import { Link } from "react-router-dom"

import styles from "./styles.module.scss"

import Chip from "../../ui/Chip"
import RatingIcon from "../../ui/RatingIcon"

import { MEDIA_CONSTANTS } from "../../../utils/constants"
import { PATHS } from "../../../routes"

const MediaCardSquare = ({ data }) => {
  const { SEASON, FORMATS } = MEDIA_CONSTANTS

  const MEDIA_SEASON = SEASON[data.type]
  const MEDIA_FORMATS = FORMATS[data.type]

  const linkTo = `${PATHS[data.type].DETAILS}/${data.id}`

  return (
    <Stack className={styles.card} direction="row">
      <div className={styles.coverImageContainer}>
        <Link to={linkTo}>
          <img
            className={styles.coverImage}
            src={data.coverImage?.large || data.image?.large}
            alt={data.title.romaji || data.title.english || data.title.native}
          />
          <div className={styles.titleContainer}>
            <h5 className={styles.title}>
              {data.title.romaji || data.title.english || data.title.native}
            </h5>
          </div>
        </Link>
      </div>
      <Stack className={styles.cardContainer} justifyContent="space-between">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          style={{ padding: "16px" }}
        >
          <div>
            {data.season && (
              <span className={styles.season}>
                {MEDIA_SEASON[data.season]} {data.seasonYear}
              </span>
            )}
            {!data.season && (
              <span className={styles.season}>
                {data.startDate?.year}{" "}
                {data.endDate?.year && `- ${data.endDate?.year}`}
              </span>
            )}
            <div>
              <span className={styles.format}>
                {MEDIA_FORMATS[data.format]}
              </span>
              <span className={styles.divider}>•</span>
              {data.episodes && (
                <span className={styles.episode}>{data.episodes} episodes</span>
              )}
              {data.chapters && (
                <span className={styles.episode}>{data.chapters} chapters</span>
              )}
            </div>
          </div>
          <div className={styles.ratingContainer}>
            <RatingIcon score={data.averageScore} />
            <span className={styles.score}>{data.averageScore}%</span>
          </div>
        </Stack>
        <div
          className={styles.descriptionContainer}
          dangerouslySetInnerHTML={{
            __html: data.description || "No Description"
          }}
        ></div>
        <Stack
          className={styles.chipContainer}
          direction="row"
          alignItems="center"
        >
          <div className={styles.genresContainer}>
            {data.genres.map((genre) => (
              <Chip key={genre} type={data.type} className={styles.chip}>
                {genre}
              </Chip>
            ))}
          </div>
        </Stack>
      </Stack>
    </Stack>
  )
}
export default MediaCardSquare
