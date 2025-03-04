import Box from "@mui/material/Box"
import LinearProgress from "@mui/material/LinearProgress"

import styles from "./styles.module.scss"

export default function Loading() {
  return (
    <Box sx={{ width: "100%" }} className={styles.loading}>
      <LinearProgress color="inherit" />
    </Box>
  )
}
