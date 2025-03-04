import styles from "./styles.module.scss"
import Grid from "@mui/material/Grid"
import CardSkeleton from "../ui/CardSkeleton"
import GridContainer from "../ui/GridContainer"
import useCardMediaQuery from "../../hooks/useCardMediaQuery"

export default function Loading({ type }) {
  const [spacing, cardGridSize] = useCardMediaQuery(type)

  const dummy = new Array(10).fill(0)
  return (
    <GridContainer spacing={spacing}>
      {dummy.map((_, idx) => (
        <Grid
          item
          xs={cardGridSize.xs}
          xsm={cardGridSize.xsm}
          sm={cardGridSize.sm}
          md={cardGridSize.md}
          lg={cardGridSize.lg}
          key={idx}
        >
          <CardSkeleton type={type} />
        </Grid>
      ))}
    </GridContainer>
  )
}
