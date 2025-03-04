import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { ThemeProvider } from "@mui/material/styles"

import "./index.scss"
import "./styles/styles.scss"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import store from "./features/store"
import theme from "./theme"

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <App />
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
