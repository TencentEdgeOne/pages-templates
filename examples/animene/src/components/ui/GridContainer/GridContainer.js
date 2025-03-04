import Grid from "@mui/material/Grid"

import clsx from "clsx"
import "./styles.scss"

const Component = ({ children, className, spacing, ...props }) => {
  return (
    <Grid container spacing={spacing || 3}>
      {children}
    </Grid>
  )
}
export default Component
