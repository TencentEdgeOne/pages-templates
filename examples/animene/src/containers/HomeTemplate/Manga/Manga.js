import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState, useCallback } from "react"
import { useLocation, useParams } from "react-router-dom"

import styles from "./styles.module.scss"
import Loading from "../../../components/Loading"
import ResultNotFound from "../../../components/ResultNotFound"
import LoadingDetailsPage from "../../../components/LoadingDetailsPage"
import MediaDetailsPage from "../../../components/MediaDetailsPage"

import { selectManga, fetchMangaById } from "../../../features/manga/mangaSlice"

const Component = ({}) => {
  const { loading, data, error } = useSelector(selectManga)

  const location = useLocation()
  const { id } = useParams()

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchMangaById(id))
    window.scrollTo(0, 0)
  }, [dispatch, id])

  return (
    <>
      {loading && (
        <>
          <Loading />
          <LoadingDetailsPage />
        </>
      )}
      {data && data.data && <MediaDetailsPage data={data} />}
      {error && (
        <>
          <div style={{ marginTop: "140px" }}></div>
          <ResultNotFound />
        </>
      )}
    </>
  )
}
export default Component
