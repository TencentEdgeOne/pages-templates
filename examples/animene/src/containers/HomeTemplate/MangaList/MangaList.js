import { useDispatch, useSelector } from "react-redux"
import { useState, useEffect, useCallback, Fragment } from "react"
import { useLocation } from "react-router-dom"
import useMediaQuery from "@mui/material/useMediaQuery"
import styles from "./styles.module.scss"

import MediaCardList from "../../../components/MediaCardList"
import InfiniteCardList from "../../../components/InfiniteCardList"
import MangaFilters from "../../../components/MangaFilters"
import SubFilters from "../../../components/SubFilters"
import Tags from "../../../components/Tags"
import ResultNotFound from "../../../components/ResultNotFound"
import Loading from "../../../components/Loading"
import LoadingCardSkeleton from "../../../components/LoadingCardSkeleton"
import GridContainer from "../../../components/ui/GridContainer"
import { CARD_TYPES } from "../../../utils/constants"

import {
  selectMangaList,
  fetchHomeMangas,
  fetchAllMangas,
  fetchMoreMangas
} from "../../../features/mangaList/mangaListSlice"

const MangaList = () => {
  const location = useLocation()
  const [cardType, setCardType] = useState(CARD_TYPES.DEFAULT)
  const { loading, data, error, page, allLoaded, isDefault } =
    useSelector(selectMangaList)
  const md = useMediaQuery("(max-width:900px)")
  const sm = useMediaQuery("(max-width:600px)")
  const numberOfCards = sm ? 6 : md ? 4 : 5

  const dispatch = useDispatch()

  useEffect(() => {
    location.search === "" && dispatch(fetchHomeMangas())
    location.search !== "" &&
      dispatch(fetchAllMangas({ searchString: location.search }))
    window.scrollTo(0, 0)
  }, [dispatch, location.search])

  useEffect(() => {
    setCardType(
      sm
        ? CARD_TYPES.DEFAULT
        : localStorage.getItem("cardType") || CARD_TYPES.DEFAULT
    )
  }, [sm])

  const handleViewChange = useCallback((option) => {
    setCardType(option)
    localStorage.setItem("cardType", option)
  }, [])

  const fetchMoreData = useCallback(() => {
    dispatch(fetchMoreMangas({ searchString: location.search, page: page }))
  }, [dispatch, location.search, page])

  return (
    <>
      {isDefault && (
        <>
          <div className="space-top-80"></div>
          <GridContainer>
            <MangaFilters />
          </GridContainer>
          {loading && (
            <>
              <Loading />
              <div className="space-top-60"></div>
              <LoadingCardSkeleton />
            </>
          )}
          {data &&
            Object.values(data).map((medias) => {
              if (medias.title.includes("TOP 10")) {
                return (
                  <Fragment key={medias.title}>
                    <div className={styles.titleContainer}>
                      <h4 className={styles.title}>{medias.title}</h4>
                    </div>
                    <MediaCardList
                      cardType={sm ? CARD_TYPES.DEFAULT : CARD_TYPES.HORIZONTAL}
                      medias={medias.media}
                    />
                  </Fragment>
                )
              }
              return (
                <Fragment key={medias.title}>
                  <div className={styles.titleContainer} key={medias.title}>
                    <h4 className={styles.title}>{medias.title}</h4>
                  </div>
                  <MediaCardList
                    medias={medias.media?.slice(0, numberOfCards)}
                  />
                </Fragment>
              )
            })}
          {data && data.status_code === 404 && (
            <ResultNotFound message="No Results" />
          )}
          {error && <ResultNotFound message={error.message} />}
        </>
      )}
      {!isDefault && (
        <>
          <div className="space-top-80"></div>
          <GridContainer>
            <MangaFilters />
            <SubFilters
              cardType={cardType}
              handleViewChange={handleViewChange}
            />
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
      )}
    </>
  )
}
export default MangaList
