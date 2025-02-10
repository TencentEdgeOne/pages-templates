import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import parse from "html-react-parser"

const Layout = ({ isHomePage, children }) => {
  const {
    wp: {
      generalSettings: { title },
    },
  } = useStaticQuery(graphql`
    query LayoutQuery {
      wp {
        generalSettings {
          title
          description
        }
      }
    }
  `)

  return (
    <div className="global-wrapper" data-is-root-path={isHomePage}>
      <header className="global-header">
        {isHomePage ? (
          <h1 className="main-heading">
            <Link to="/">{parse(title)}</Link>
          </h1>
        ) : (
          <Link className="header-link-home" to="/">
            {title}
          </Link>
        )}
      </header>

      <main>{children}</main>

      <footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.com" target="_blank">
          Gatsby
        </a>
        {` `}
        And{" "}
        <a href="https://wordpress.org/" target="_blank">
          WordPress
        </a>
        {`, `}
        Hosted on{" "}
        <a href="https://edgeone.ai/products/pages" target="_blank">
          EdgeOne Pages
        </a>
      </footer>
    </div>
  )
}

export default Layout
