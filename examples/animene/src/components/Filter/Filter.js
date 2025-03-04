import { useMemo, memo } from "react"
import useMediaQuery from "@mui/material/useMediaQuery"
import Select from "react-select"
import { useHistory, useLocation } from "react-router-dom"

import styles from "./styles.module.scss"
import { PATHS } from "../../routes"

const customTextStyles = {
  fontSize: "15px",
  fontWeight: "500"
}

const colorPrimary = "#18c1f0"

const customStyles = {
  container: (provided) => ({
    ...provided,
    boxShadow:
      "0 14px 30px rgba(103,132,187,.1),0 4px 4px rgba(103,132,187,.04)"
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#8ba0b2",
    ...customTextStyles
  }),
  control: (provided) => ({
    ...provided,
    height: "32px",
    overflow: "hidden",
    border: "none"
  }),
  valueContainer: (provided) => ({
    ...provided,
    height: "32px",
    overflow: "hidden"
  }),
  indicatorSeparator: (provided) => ({
    display: "none"
  }),
  option: (provided, state) => {
    let color = state.isSelected ? colorPrimary : "#748899"
    let backgroundColor = provided.backgroundColor
    backgroundColor = state.isSelected ? "#EDF1F5" : "white"
    if (state.isFocused) color = colorPrimary
    return { ...provided, color, backgroundColor, ...customTextStyles }
  },
  menu: (provided) => ({
    ...provided,
    border: "none",
    animation: "slideFromTop 0.15s"
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1
    const transition = "opacity 300ms"
    return {
      ...provided,
      opacity,
      transition,
      color: colorPrimary,
      ...customTextStyles
    }
  },
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: colorPrimary,
    borderRadius: "6px",
    color: "#fbfbfb"
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#fbfbfb"
  })
}

const Component = ({ options, type, multiple, dataType }) => {
  const location = useLocation()
  const history = useHistory()
  const isMedium = useMediaQuery("(min-width:600px)")
  const params = useMemo(() => {
    return new URLSearchParams(location.search)
  }, [location.search])

  // calculate the default value for the filters
  const defaultValue = useMemo(() => {
    const paramsValue = params.get(type)
    // multiple value filters
    if (multiple && paramsValue) {
      const res = []
      for (const value of paramsValue.split(",")) {
        res.push(options.find((option) => option.value === value))
      }
      return res
      // single value filters
    } else if (paramsValue) {
      return options.find((option) => option.value === paramsValue)
    }
  }, [multiple, options, params, type])

  const handleChange = (selectedOptions) => {
    let value = ""
    if (multiple) {
      value = selectedOptions.map((option) => option.value).join(",")
    } else {
      value = selectedOptions ? selectedOptions.value : ""
    }
    value === "" ? params.delete(type) : params.set(type, value)
    history.replace({
      pathname: PATHS[dataType].SEARCH,
      search: params.toString()
    })
  }

  return (
    <Select
      isClearable
      isSearchable={isMedium}
      closeMenuOnSelect={!multiple}
      onChange={handleChange}
      hideSelectedOptions={false}
      placeholder="Any"
      isMulti={multiple}
      styles={customStyles}
      options={options}
      defaultValue={defaultValue}
    />
  )
}

export default memo(Component)
