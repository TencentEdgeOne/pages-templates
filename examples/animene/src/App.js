import { BrowserRouter, Route, Switch } from "react-router-dom"

import "./App.scss"
import PageNotFound from "./components/PageNotFound"
import HomeTemplate from "./containers/HomeTemplate"
import { routeHome } from "./routes"

function App() {
  const showLayoutHome = (routes) => {
    if (routes && routes.length > 0) {
      return routes.map((item, index) => {
        return (
          <HomeTemplate
            key={index}
            exact={item.exact}
            path={item.path}
            Component={item.component}
          />
        )
      })
    }
  }

  return (
    <BrowserRouter>
      <Switch>
        {showLayoutHome(routeHome)}
        <Route path="" component={PageNotFound} />
      </Switch>
    </BrowserRouter>
  )
}

export default App
