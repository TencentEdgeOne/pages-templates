import { Link } from "react-router-dom"
import styles from "./styles.module.scss"

import Chip from "../../ui/Chip"
import RatingIcon from "../../ui/RatingIcon"
import { MEDIA_CONSTANTS } from "../../../utils/constants"
import { PATHS } from "../../../routes"

const MediaCardHorizontal = ({ data }) => {
  const { STATUS, SEASON, FORMATS } = MEDIA_CONSTANTS

  const MEDIA_STATUS = STATUS[data.type]
  const MEDIA_SEASON = SEASON[data.type]
  const MEDIA_FORMATS = FORMATS[data.type]

  const linkTo = `${PATHS[data.type].DETAILS}/${data.id}`

  return (
    <div className={styles.card}>
      <div className={styles.coverImageContainer}>
        <Link to={linkTo}>
          <img
            className={styles.coverImage}
            src={data.coverImage?.large || data.image?.large}
            alt={data.title.romaji || data.title.english || data.title.native}
          />
        </Link>
      </div>
      <div className={styles.cardContainer}>
        <div className={styles.titleGenresContainer}>
          <div>
            <Link to={linkTo} className={styles.title}>
              {data.title
                ? data.title.romaji || data.title.english || data.title.native
                : data.name.full}
            </Link>
            <div className={styles.genresContainer}>
              {data.genres.map((genre) => (
                <Chip key={genre} className={styles.chip} type={data.type}>
                  {genre}
                </Chip>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.infoContainer}>
          <div className={styles.ratingContainer}>
            {data.averageScore && (
              <>
                <RatingIcon score={data.averageScore} />
                <span className={styles.score}>{data.averageScore}%</span>
              </>
            )}
          </div>
          <div className={styles.subInfoContainer}>
            <span className={styles.textBold}>
              {MEDIA_FORMATS[data.format]}
            </span>
            {data.episodes && (
              <span className={styles.textLight}>{data.episodes} episodes</span>
            )}
            {data.chapters && (
              <span className={styles.textLight}>{data.chapters} chapters</span>
            )}
          </div>
          <div className={styles.subInfoContainer}>
            {data.season && (
              <span className={styles.textBold}>
                {MEDIA_SEASON[data.season]} {data.seasonYear}
              </span>
            )}
            {!data.season && (
              <span className={styles.textBold}>
                {data.startDate?.year}{" "}
                {data.endDate?.year && `- ${data.endDate?.year}`}
              </span>
            )}
            <span className={styles.textLight}>
              {MEDIA_STATUS[data.status]}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
export default MediaCardHorizontal
