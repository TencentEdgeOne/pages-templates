import styles from "./styles.module.scss"

const ResultNotFound = ({ message = "Something went wrong" }) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.resultNotFound}>{message}</h3>
    </div>
  )
}
export default ResultNotFound
