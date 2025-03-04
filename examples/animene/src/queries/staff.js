export const STAFF_HOME_DATA_QUERY = `
{
  birthday: Page(page: 1, perPage: 30) {
    staff(isBirthday: true) {
      id
      image {
        large
        medium
      }
      name {
        first
        middle
        last
        full
        native
        userPreferred
      }
      gender
      dateOfBirth {
        year
        month
        day
      }
      age
      bloodType
    }
  }
  mostFavorite: Page(page: 1, perPage: 30) {
    staff(sort: FAVOURITES_DESC) {
      id
      image {
        large
        medium
      }
      name {
        first
        middle
        last
        full
        native
        userPreferred
      }
      gender
      dateOfBirth {
        year
        month
        day
      }
      age
      bloodType
    }
  }
}
`

export const SEARCH_STAFFS_QUERY = `
query($search: String, $page: Int) {
  data: Page(page: $page, perPage: 50) {
    staff(search: $search) {
      id
      image {
        large
        medium
      }
      name {
        first
        middle
        last
        full
        native
        userPreferred
      }
      gender
      dateOfBirth {
        year
        month
        day
      }
      age
      bloodType
    }
  }
}
`

export const STAFF_DETAILS_QUERY = `
  query($id: Int) {
    Staff(id: $id) {
      id
      name {
        first
        middle
        last
        full
        native
        userPreferred
      }
      image {
        large
        medium
      }
      description
      gender
      dateOfBirth {
        year
        month
        day
      }
      age
      bloodType
      siteUrl
      staffMedia {
        edges {
          node {
            id
            type
            genres
            averageScore
            popularity
            format
            episodes
            season
            seasonYear
            status
            startDate {
              day
              month
              year
            }
            endDate {
              day
              month
              year
            }
            coverImage {
              large
              medium
            }
            title {
              romaji
              english
              native
            }
            studios {
              nodes {
                id
                name
                isAnimationStudio
              }
            }
          }
        }
      }
    }
  }
`
