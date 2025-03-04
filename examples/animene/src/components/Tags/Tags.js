import styles from "./styles.module.scss"
import { useMemo, memo } from "react"
import { useLocation, useHistory } from "react-router-dom"
import { MEDIA_CONSTANTS } from "../../utils/constants"
import Grid from "@mui/material/Grid"
import Tag from "../ui/Tag"
import clsx from "clsx"
import LocalOfferIcon from "@mui/icons-material/LocalOffer"
const Tags = () => {
  const location = useLocation()
  const history = useHistory()
  const { tags, type } = useMemo(() => {
    const mediaType = location.pathname.split("/")[2]
    const type = mediaType.toUpperCase()
    const params = new URLSearchParams(location.search)

    let tags = []

    for (const [key, value] of params.entries()) {
      switch (key) {
        case "genres":
        case "year":
          tags = tags.concat(value.split(","))
          break
        case "formats":
        case "status":
        case "season":
          const constant = MEDIA_CONSTANTS[key.toUpperCase()]
          const res = value.split(",").map((param) => constant[type][param])
          tags = tags.concat(res)
          break
        case "origin":
          tags.push(MEDIA_CONSTANTS.ORIGIN[value])
          break
        default:
          continue
      }
    }
    return { tags, type: mediaType }
  }, [location.pathname, location.search])

  const handleClear = () => {
    const pathname = type === "manga" ? `/search/${type}` : "/"
    history.push({
      pathname: pathname,
      search: ""
    })
  }

  return (
    <>
      {tags && tags.length > 0 && (
        <Grid className={styles.tagsContainer} item xs={12}>
          <LocalOfferIcon className={styles.tagsIcon} />
          {tags.map((tag) => (
            <Tag className={styles.tag} key={tag}>
              {tag}
            </Tag>
          ))}
          <Tag
            className={clsx(styles.tag, styles.clearTag)}
            onClick={handleClear}
          >
            Clear All
          </Tag>
        </Grid>
      )}
    </>
  )
}

export default memo(Tags)
