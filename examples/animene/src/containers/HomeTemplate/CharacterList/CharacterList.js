import { useDispatch, useSelector } from "react-redux"
import { useEffect, useCallback, Fragment } from "react"
import { useLocation } from "react-router-dom"
import styles from "./styles.module.scss"
import Grid from "@mui/material/Grid"
import SearchBar from "../../../components/SearchBar"
import MediaCardList from "../../../components/MediaCardList"
import InfiniteCardList from "../../../components/InfiniteCardList"
import ResultNotFound from "../../../components/ResultNotFound"
import Loading from "../../../components/Loading"
import LoadingCardSkeleton from "../../../components/LoadingCardSkeleton"
import GridContainer from "../../../components/ui/GridContainer"
import { CARD_TYPES } from "../../../utils/constants"

import {
  selectCharacterList,
  fetchHomeCharacters,
  fetchAllCharacters,
  fetchMoreCharacters
} from "../../../features/characterList/characterListSlice"

const CharacterList = () => {
  const location = useLocation()

  const { loading, data, error, page, allLoaded, isDefault } =
    useSelector(selectCharacterList)

  const dispatch = useDispatch()

  useEffect(() => {
    location.search === "" && dispatch(fetchHomeCharacters())
    location.search !== "" &&
      dispatch(fetchAllCharacters({ searchString: location.search }))
    window.scrollTo(0, 0)
  }, [dispatch, location.search])

  const fetchMoreData = useCallback(() => {
    dispatch(fetchMoreCharacters({ searchString: location.search, page: page }))
  }, [dispatch, location.search, page])

  return (
    <>
      {isDefault && (
        <>
          <div className="space-top-40"></div>
          <GridContainer>
            <Grid item xs={12}>
              <h2 className={styles.mainTitle}>Search Character</h2>
              <h5 className={styles.filterTitle}>Search</h5>
              <SearchBar />
            </Grid>
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
              return (
                <Fragment key={medias.title}>
                  <div className={styles.titleContainer} key={medias.title}>
                    <h4 className={styles.title}>{medias.title}</h4>
                  </div>
                  <MediaCardList medias={medias.characters} />
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
          <div className="space-top-40"></div>
          <GridContainer>
            <Grid item xs={12}>
              <h2 className={styles.mainTitle}>Search Character</h2>
              <h5 className={styles.filterTitle}>Search</h5>
              <SearchBar />
            </Grid>
          </GridContainer>
          <div className="space-top-40"></div>
          {loading && (
            <>
              <Loading />
              <LoadingCardSkeleton type={CARD_TYPES.DEFAULT} />
            </>
          )}
          {data && data.length > 0 && (
            <>
              <InfiniteCardList
                data={data}
                allLoaded={allLoaded}
                cardType={CARD_TYPES.DEFAULT}
                fetchMoreData={fetchMoreData}
              />
            </>
          )}
          {data && data.length === 0 && <ResultNotFound message="No Results" />}
          {error && <ResultNotFound message={error.message} />}
        </>
      )}
    </>
  )
}
export default CharacterList
