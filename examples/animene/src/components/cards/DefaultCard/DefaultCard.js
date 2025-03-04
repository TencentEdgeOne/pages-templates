import Card from "@mui/material/Card"
import CardMedia from "@mui/material/CardMedia"
import Typography from "@mui/material/Typography"

import { useState } from "react"
import { Link } from "react-router-dom"
import { PATHS } from "../../../routes"
import MediaDialog from "../../MediaDialog"

import styles from "./styles.module.scss"

const Component = ({ data, noDialog }) => {
  const [showDialog, setShowDialog] = useState(false)
  const hasDialog =
    !noDialog && (data.type === "ANIME" || data.type === "MANGA")
  const windowWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth
  const linkTo = `${PATHS[data.type].DETAILS}/${data.id}`

  const handleMouseEnter = (e) => {
    setShowDialog(true)
  }

  const handleMouseLeave = () => {
    setShowDialog(false)
  }

  return (
    <div className={styles.cardContainer}>
      <Card
        className={styles.card}
        sx={{ maxWidth: 345 }}
        onMouseEnter={hasDialog ? handleMouseEnter : undefined}
        onMouseLeave={hasDialog ? handleMouseLeave : undefined}
      >
        <Link to={linkTo}>
          <CardMedia
            className={styles.cardImage}
            component="img"
            image={data.coverImage?.large || data.image?.large}
            alt={
              data.title
                ? data.title.romaji || data.title.english || data.title.native
                : data.name.full
            }
          />
        </Link>
        <Typography
          className={styles.cardTitle}
          gutterBottom
          variant="h5"
          component={Link}
          to={linkTo}
        >
          {data.title
            ? data.title.romaji || data.title.english || data.title.native
            : data.name.full}
        </Typography>
      </Card>
      {windowWidth > 890 && showDialog && hasDialog && (
        <MediaDialog data={data} />
      )}
    </div>
  )
}

export default Component
