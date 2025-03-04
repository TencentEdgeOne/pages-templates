import Stack from "@mui/material/Stack"
import Divider from "@mui/material/Divider"
import Select from "react-select"
import Grid from "@mui/material/Grid"
import ViewComfyIcon from "@mui/icons-material/ViewComfy"
import GridViewSharpIcon from "@mui/icons-material/GridViewSharp"
import VerticalSplitIcon from "@mui/icons-material/VerticalSplit"

import { memo, useMemo } from "react"
import { useHistory, useLocation } from "react-router-dom"
import useMediaQuery from "@mui/material/useMediaQuery"

import styles from "./styles.module.scss"
import clsx from "clsx"

import { MEDIA_CONSTANTS, CARD_TYPES } from "../../utils/constants"

const customTextStyles = {
  fontSize: "14px",
  fontWeight: "500"
}

const colorPrimary = "#18c1f0"

const customStyles = {
  control: (provided) => ({
    ...provided,
    height: "32px",
    overflow: "hidden",
    border: "none",
    outline: "none",
    backgroundColor: "transparent"
  }),
  valueContainer: (provided) => ({
    ...provided,
    height: "32px",
    minWidth: "80px",
    overflow: "hidden",
    outline: "none",
    textAlign: "right"
  }),
  indicatorSeparator: (provided) => ({
    display: "none"
  }),
  menu: (provided) => ({
    ...provided,
    border: "none",
    animation: "slideFromTop 0.15s"
  }),
  option: (provided, state) => {
    let color = state.isSelected ? colorPrimary : "#748899"
    let backgroundColor = provided.backgroundColor
    backgroundColor = state.isSelected ? "#EDF1F5" : "white"
    if (state.isFocused) color = colorPrimary
    return { ...provided, color, backgroundColor, ...customTextStyles }
  },
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1
    const transition = "opacity 300ms"
    return {
      ...provided,
      opacity,
      transition,
      color: "#748899",
      ...customTextStyles
    }
  },
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: colorPrimary,
    borderRadius: "6px",
    color: "#fff"
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#fff"
  })
}

const SubFilters = ({ cardType, handleViewChange }) => {
  const history = useHistory()
  const location = useLocation()
  const isSmall = useMediaQuery("(max-width:600px)")
  const { SORTS } = MEDIA_CONSTANTS

  const params = useMemo(() => {
    return new URLSearchParams(location.search)
  }, [location.search])

  // calculate the default value for the filters
  const defaultValue = useMemo(() => {
    const paramsValue = params.get("sort")
    // multiple value filters
    return paramsValue && SORTS.find((option) => option.value === paramsValue)
  }, [SORTS, params])

  const handleSortChange = (option) => {
    params.set("sort", option.value)
    history.push({
      pathname: location.pathname,
      search: params.toString()
    })
  }

  return (
    <Grid item xs={12}>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="flex-end"
        style={{ padding: "4px" }}
      >
        <Select
          isSearchable={false}
          onChange={handleSortChange}
          hideSelectedOptions={false}
          styles={customStyles}
          options={SORTS}
          defaultValue={defaultValue || SORTS[2]}
        />
        {!isSmall && (
          <>
            <Divider orientation="vertical" variant="middle" flexItem />
            <Stack direction="row" spacing={1} alignItems="center">
              <ViewComfyIcon
                onClick={() => handleViewChange(CARD_TYPES.DEFAULT)}
                className={clsx(styles.icon, {
                  [styles.active]: cardType === CARD_TYPES.DEFAULT
                })}
              />
              <GridViewSharpIcon
                onClick={() => handleViewChange(CARD_TYPES.SQUARE)}
                className={clsx(styles.icon, {
                  [styles.active]: cardType === CARD_TYPES.SQUARE
                })}
              />
              <VerticalSplitIcon
                onClick={() => handleViewChange(CARD_TYPES.HORIZONTAL)}
                className={clsx(styles.icon, {
                  [styles.active]: cardType === CARD_TYPES.HORIZONTAL
                })}
              />
            </Stack>
          </>
        )}
      </Stack>
    </Grid>
  )
}
export default memo(SubFilters)
