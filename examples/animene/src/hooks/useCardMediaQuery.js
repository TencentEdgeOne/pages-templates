import useMediaQuery from "@mui/material/useMediaQuery"
import { useTheme } from "@mui/styles"
import { CARD_TYPES } from "../utils/constants"

const useCardMediaQuery = (cardType = CARD_TYPES.DEFAULT) => {
  const theme = useTheme()
  const lg = useMediaQuery(`(min-width:${theme.breakpoints.values.lg}px)`)
  const md = useMediaQuery(`(min-width:${theme.breakpoints.values.md}px)`)
  const sm = useMediaQuery(`(min-width:${theme.breakpoints.values.sm}px)`)
  const xsm = useMediaQuery(`(min-width:${theme.breakpoints.values.xsm}px)`)
  const xs = useMediaQuery(`(min-width:${theme.breakpoints.values.xs}px)`)
  let spacing
  if (lg) spacing = theme.customSpacing.lg
  else if (md) spacing = theme.customSpacing.md
  else if (sm) spacing = theme.customSpacing.sm
  else if (xsm) spacing = theme.customSpacing.xsm
  else if (xs) spacing = theme.customSpacing.xs
  const cardGridSize = {
    xs: theme.cardGridSize[cardType].xs,
    xsm: theme.cardGridSize[cardType].xsm,
    sm: theme.cardGridSize[cardType].sm,
    md: theme.cardGridSize[cardType].md,
    lg: theme.cardGridSize[cardType].lg
  }
  return [spacing, cardGridSize]
}

export default useCardMediaQuery
