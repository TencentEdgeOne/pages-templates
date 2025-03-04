import { createTheme } from "@mui/material/styles"
import { CARD_TYPES } from "../utils/constants"
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      xsm: 450,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536
    }
  },
  customSpacing: {
    xs: 1.5,
    xsm: 1.5,
    sm: 2,
    md: 3,
    lg: 4.5,
    xl: 4.5
  },
  cardGridSize: {
    [CARD_TYPES.DEFAULT]: {
      xs: 6,
      xsm: 4,
      sm: 3,
      md: 2.4,
      lg: 2.4,
      xl: 2.4
    },
    [CARD_TYPES.SQUARE]: {
      xs: 12,
      xsm: 12,
      sm: 12,
      md: 6,
      lg: 6,
      xl: 6
    },
    [CARD_TYPES.HORIZONTAL]: {
      xs: 12,
      xsm: 12,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 12
    }
  }
})

export default theme
