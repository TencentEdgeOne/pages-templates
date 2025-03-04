import clsx from "clsx"
import "./styles.scss"

const Tag = ({ children, className, type, ...props }) => {
  return (
    <span {...props} className={clsx("tag", className)}>
      {children}
    </span>
  )
}
export default Tag
