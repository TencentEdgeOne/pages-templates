import clsx from "clsx"
import { Link } from "react-router-dom"

import "./styles.scss"

const Button = ({ children, className, href, ...props }) => {
  if (href) {
    return (
      <Link to={href} className={clsx("btn", className)} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <button className={clsx("btn", className)} {...props}>
      {children}
    </button>
  )
}
export default Button
