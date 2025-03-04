export const MANGA_HOME_DATA_QUERY = `
{
  trendingNow: Page(page: 1, perPage: 6) {
    media(type: MANGA, sort: TRENDING_DESC) {
      id
      coverImage {
        extraLarge
        large
        medium
        color
      }
      title {
        english
        romaji
        native
      }
      genres
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      averageScore
      type
      popularity
      format
      chapters
      status
    }
  }
  mostPopular: Page(page: 1, perPage: 6) {
    media(type: MANGA, sort: POPULARITY_DESC) {
      id
      coverImage {
        extraLarge
        large
        medium
        color
      }
      title {
        english
        romaji
        native
      }
      genres
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      averageScore
      type
      popularity
      format
      chapters
      status
    }
  }
  mostPopularManhwa: Page(page: 1, perPage: 6) {
    media(type: MANGA, sort: POPULARITY_DESC, countryOfOrigin: KR) {
      id
      coverImage {
        extraLarge
        large
        medium
        color
      }
      title {
        english
        romaji
        native
      }
      genres
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      averageScore
      type
      popularity
      format
      chapters
      status
    }
  }
  
  topScore: Page(page: 1, perPage: 10) {
    media(type: MANGA, sort: SCORE_DESC) {
      id
      coverImage {
        extraLarge
        large
        medium
        color
      }
      title {
        english
        romaji
        native
      }
      genres
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      averageScore
      type
      popularity
      format
      chapters
      status
    }
  }
}
`
const SEARCH_MANGAS_QUERY_VARIABLES =
  "$status: MediaStatus, $search: String, " +
  "$sort: [MediaSort], $page: Int, $countryOfOrigin: CountryCode" +
  "$genre_in: [String], $format_in: [MediaFormat]"

export const SEARCH_MANGAS_QUERY = `
query(${SEARCH_MANGAS_QUERY_VARIABLES}) {
  data: Page(page: $page, perPage: 50) {
    media(type: MANGA, sort: $sort,
        search: $search, genre_in: $genre_in,
        format_in: $format_in, status: $status,
        countryOfOrigin: $countryOfOrigin) {
      id
      coverImage {
        extraLarge
        large
        medium
        color
      }
      title {
        english
        romaji
        native
      }
      genres
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      averageScore
      type
      description(asHtml: true)
      popularity
      format
      chapters
      status
    }
  }
}
`

export const MANGA_DETAILS_QUERY = `
  query($id: Int) {
    Media(id: $id, type: MANGA) {
      trailer {
        id
        site
      }
      recommendations {
        edges {
          node {
            id
            mediaRecommendation {
              coverImage {
                extraLarge
                large
                medium
                color
              }
              title {
                romaji
                english
                native
                userPreferred
              }
              id
              type
              genres
              meanScore
              averageScore
              studios {
                edges {
                  node {
                    id
                    name
                    isAnimationStudio
                  }
                }
              }
              type
              popularity
              format
              episodes
              chapters
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
            }
          }
        }
      }
      stats{
        scoreDistribution {
          score
          amount
        }
        statusDistribution {
          status
          amount
        }
      }
      staff {
        edges{
          node {
            image {
              large
              medium
            }
            name {
              first
              last
              full
              native
            }
            id
          }
          role
          id
        }
      }
      characters(sort: ID){
        edges {
          voiceActors(language: JAPANESE){
            image {
              medium
            }
            language
            name {
              full
              native
            }
            id
          }
          role
          node {
            image {
              medium
            }
            name {
              first
              last
              full
              native
            }
            id
          }
          id
        }
      }
      id
      bannerImage
      description(asHtml: true)
      coverImage {
        extraLarge
        large
        medium
        color
      }
      title {
        english
        romaji
        native
      }
      relations {
        edges {
          relationType
          node {
            coverImage {
              extraLarge
              large
              medium
              color
            }
            title {
              romaji
              english
              native
              userPreferred
            }
            id
            type
            genres
            meanScore
            averageScore
            studios {
              edges {
                node {
                  id
                  name
                  isAnimationStudio
                }
              }
            }
            type
            popularity
            format
            episodes
            chapters
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
          }
          id
        }
      }
      genres
      meanScore
      averageScore
      type
      popularity
      format
      episodes
      chapters
      duration
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      status
      hashtag
      studios {
        edges {
          node {
            id
            name
            isAnimationStudio
          }
        }
      }
      source
      synonyms
      favourites
      tags {
        name
        isMediaSpoiler
        id
        rank
      }
      externalLinks {
        id
        site
        url
      }
    }
  }
`
