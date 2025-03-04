import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState, useCallback } from "react"
import { useLocation } from "react-router-dom"
import useMediaQuery from "@mui/material/useMediaQuery"

import styles from "./styles.module.scss"
import InfiniteCardList from "../../../components/InfiniteCardList"
import AnimeFilters from "../../../components/AnimeFilters"
import SubFilters from "../../../components/SubFilters"
import ResultNotFound from "../../../components/ResultNotFound"
import Loading from "../../../components/Loading"
import Tags from "../../../components/Tags"
import LoadingCardSkeleton from "../../../components/LoadingCardSkeleton"
import GridContainer from "../../../components/ui/GridContainer"
import { CARD_TYPES } from "../../../utils/constants"

import {
  selectAnimeList,
  fetchAllAnimes,
  fetchMoreAnimes
} from "../../../features/animeList/animeListSlice"

const AnimeList = () => {
  const { loading, data, error, page, allLoaded } = useSelector(selectAnimeList)

  const [cardType, setCardType] = useState(CARD_TYPES.DEFAULT)
  const location = useLocation()

  const isSmall = useMediaQuery("(max-width:600px)")

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchAllAnimes({ searchString: location.search }))
    window.scrollTo(0, 0)
  }, [dispatch, location.search])

  useEffect(() => {
    setCardType(
      isSmall
        ? CARD_TYPES.DEFAULT
        : localStorage.getItem("cardType") || CARD_TYPES.DEFAULT
    )
  }, [isSmall])

  const handleViewChange = useCallback((option) => {
    setCardType(option)
    localStorage.setItem("cardType", option)
  }, [])

  const fetchMoreData = () => {
    dispatch(fetchMoreAnimes({ searchString: location.search, page: page }))
  }

  return (
    <>
      <div className="space-top-80"></div>
      <GridContainer>
        <AnimeFilters />
        <SubFilters cardType={cardType} handleViewChange={handleViewChange} />
        <Tags />
      </GridContainer>
      <div className="space-top-28"></div>
      {loading && (
        <>
          <Loading />
          <LoadingCardSkeleton type={cardType} />
        </>
      )}
      {data && data.length > 0 && (
        <>
          <InfiniteCardList
            data={data}
            allLoaded={allLoaded}
            cardType={cardType}
            fetchMoreData={fetchMoreData}
          />
        </>
      )}
      {!loading && data && data.length === 0 && (
        <ResultNotFound message="No Results" />
      )}
      {error && <ResultNotFound message={error.message} />}
    </>
  )
}
export default AnimeList
