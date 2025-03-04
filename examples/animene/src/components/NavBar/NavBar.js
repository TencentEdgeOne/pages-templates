import IconButton from "@mui/material/IconButton"
import MenuItem from "@mui/material/MenuItem"
import clsx from "clsx"
import { Link } from "react-router-dom"

import styles from "./styles.module.scss"

const Component = ({ isMobile, items }) => {
  if (isMobile) {
    return (
      <>
        {items.map((item) => (
          <MenuItem key={item.label}>
            <Link to={item.linkTo} className={styles.link}>
              <IconButton size="large" aria-label={item.label} color="inherit">
                <item.Icon />
              </IconButton>
            </Link>
            <Link to={item.linkTo} className={styles.link}>
              <p>{item.label}</p>
            </Link>
          </MenuItem>
        ))}
      </>
    )
  }

  return (
    <>
      {items.map((item) => (
        <Link
          to={item.linkTo}
          className={clsx(styles.item, styles.link)}
          key={item.label}
        >
          <IconButton size="large" aria-label={item.label} color="inherit">
            <item.Icon />
            <p className={styles.label}>{item.label}</p>
          </IconButton>
        </Link>
      ))}
    </>
  )
}
export default Component
