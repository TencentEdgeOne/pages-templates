import Grid from "@mui/material/Grid"
import Lazyload from "react-lazyload"
import useCardMediaQuery from "../../hooks/useCardMediaQuery"
import { CARD_TYPES } from "../../utils/constants"

import DefaultCard from "../cards/DefaultCard"
import MediaCardHorizontal from "../cards/MediaCardHorizontal"
import MediaCardSquare from "../cards/MediaCardSquare"
import GridContainer from "../ui/GridContainer"
import CardSkeleton from "../ui/CardSkeleton"

const MediaCardList = ({ medias, cardType = CARD_TYPES.DEFAULT }) => {
  const [spacing, cardGridSize] = useCardMediaQuery(cardType)

  let Card

  if (cardType === CARD_TYPES.HORIZONTAL) {
    Card = MediaCardHorizontal
  } else if (cardType === CARD_TYPES.SQUARE) {
    Card = MediaCardSquare
  } else {
    Card = DefaultCard
  }
  return (
    <GridContainer spacing={spacing}>
      {medias.map((media) => (
        <Grid
          item
          xs={cardGridSize.xs}
          xsm={cardGridSize.xsm}
          sm={cardGridSize.sm}
          md={cardGridSize.md}
          key={media.id}
        >
          <Lazyload
            key={cardType}
            height={200}
            offset={50}
            placeholder={<CardSkeleton type={cardType} />}
          >
            <Card data={media} />
          </Lazyload>
        </Grid>
      ))}
    </GridContainer>
  )
}
export default MediaCardList
