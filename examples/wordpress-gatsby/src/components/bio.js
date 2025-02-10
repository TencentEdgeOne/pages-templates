import React from "react"
import { useStaticQuery, graphql } from "gatsby"

const Bio = () => {
  const { author } = useStaticQuery(graphql`
    query BioQuery {
      # if there was more than one user, this would need to be filtered
      author: wpUser {
        firstName
        twitter: name
        description
        avatar {
          url
        }
      }
    }
  `)

  return (
    <div className="bio">
      {author?.firstName && (
        <p>
          Written by <strong>{author.firstName}.</strong>
          {` `}
          {author?.description || null}
          {` `}
        </p>
      )}
    </div>
  )
}

export default Bio
