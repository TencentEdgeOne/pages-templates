import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState, useCallback } from "react"
import { useLocation, useParams } from "react-router-dom"

import styles from "./styles.module.scss"
import Loading from "../../../components/Loading"
import LoadingDetailsPage from "../../../components/LoadingDetailsPage"
import PersonDetailsPage from "../../../components/PersonDetailsPage"
import ResultNotFound from "../../../components/ResultNotFound"
import {
  selectCharacter,
  fetchCharacterById
} from "../../../features/character/characterSlice"

const Component = ({}) => {
  const { loading, data, error } = useSelector(selectCharacter)

  const location = useLocation()
  const { id } = useParams()

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchCharacterById(id))
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
      {data && data.person && <PersonDetailsPage data={data} />}
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
