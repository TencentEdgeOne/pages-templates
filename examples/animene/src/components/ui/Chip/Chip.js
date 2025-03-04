import clsx from "clsx"
import { Link } from "react-router-dom"
import { PATHS } from "../../../routes"
import "./styles.scss"

const Chip = ({ children, className, type, ...props }) => {
  const mediaType = type || "ANIME"
  const linkTo = `${PATHS[mediaType].SEARCH}?genres=${children
    .split(" ")
    .join("+")}`

  return (
    <Link {...props} to={linkTo} className={clsx("chip", className)}>
      {children}
    </Link>
  )
}
export default Chip
