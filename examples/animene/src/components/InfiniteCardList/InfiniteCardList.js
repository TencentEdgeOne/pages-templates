import useCardMediaQuery from "../../hooks/useCardMediaQuery"

import Grid from "@mui/material/Grid"
import Lazyload from "react-lazyload"
import InfiniteScroll from "react-infinite-scroll-component"

import { CARD_TYPES } from "../../utils/constants"

import styles from "./styles.module.scss"
import DefaultCard from "../cards/DefaultCard"
import MediaCardHorizontal from "../cards/MediaCardHorizontal"
import MediaCardSquare from "../cards/MediaCardSquare"
import LoadingCardSkeleton from "../LoadingCardSkeleton"
import CardSkeleton from "../ui/CardSkeleton"

const InfiniteCardList = ({ data, cardType, fetchMoreData, allLoaded }) => {
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
    <InfiniteScroll
      className={styles.infiniteScrollContainer}
      dataLength={data.length}
      next={fetchMoreData}
      hasMore={!allLoaded}
      scrollThreshold="600px"
      loader={
        <>
          <div className="space-top-28"></div>
          <LoadingCardSkeleton type={cardType} />
        </>
      }
    >
      {data.map((dataItem) => (
        <Grid
          className={styles.infiniteScrollItem}
          item
          xs={cardGridSize.xs}
          xsm={cardGridSize.xsm}
          sm={cardGridSize.sm}
          md={cardGridSize.md}
          lg={cardGridSize.lg}
          key={dataItem.id}
        >
          <Lazyload
            key={cardType}
            height={200}
            offset={50}
            placeholder={<CardSkeleton type={cardType} />}
          >
            <Card data={dataItem} />
          </Lazyload>
        </Grid>
      ))}
    </InfiniteScroll>
  )
}
export default InfiniteCardList
