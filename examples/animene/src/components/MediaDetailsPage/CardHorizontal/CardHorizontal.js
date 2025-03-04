import { Link } from "react-router-dom"
import styles from "./styles.module.scss"

import { PATHS } from "../../../routes"

const CardHorizontal = ({ data }) => {
  const linkTo = `${PATHS[data.type].DETAILS}/${data.id}`

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <Link to={linkTo}>
          <img
            className={styles.image}
            src={data.image?.large || data.image?.medium}
            alt={data.name.full}
          />
        </Link>
      </div>
      <div className={styles.cardContainer}>
        <div className={styles.infoContainer}>
          <div>
            <Link to={linkTo} className={styles.name}>
              {data.name.full}
            </Link>
            <div className={styles.role}>
              <p>{data.role.toLowerCase()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default CardHorizontal
