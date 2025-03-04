// Render Prop
import React from "react"
import "./styles.scss"
import clsx from "clsx"
const Component = ({ children }) => (
  <div className={clsx("form-container__outer")}>
    <div className={clsx("form-container__inner")}>{children}</div>
  </div>
)

export default Component
