export const HOME_DATA_QUERY = `
  query($currentSeason: MediaSeason, $nextSeason: MediaSeason, $currentYear: Int, $nextSeasonYear: Int) {
    trendingNow: Page(page: 1, perPage: 6) {
      media(type: ANIME, sort: TRENDING_DESC) {
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
        season
        seasonYear
        status
      }
    }
    mostPopularThisSeason: Page(page: 1, perPage: 6) {
      media(type: ANIME, sort: POPULARITY_DESC, season: $currentSeason, seasonYear: $currentYear) {
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
        season
        seasonYear
        status
      }
    }
    mostPopularNextSeason: Page(page: 1, perPage: 6) {
      media(type: ANIME, sort: POPULARITY_DESC, season: $nextSeason, seasonYear: $nextSeasonYear) {
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
        season
        seasonYear
        status
      }
    }
    mostPopular: Page(page: 1, perPage: 6) {
      media(type: ANIME, sort: POPULARITY_DESC) {
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
        season
        seasonYear
        status
      }
    }
    topScore: Page(page: 1, perPage: 10) {
      media(type: ANIME, sort: SCORE_DESC) {
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
        season
        seasonYear
        status
      }
    }
  }
`

const SEARCH_ANIMES_QUERY_VARIABLES =
  "$season: MediaSeason, $seasonYear: Int, $status: MediaStatus" +
  "$search: String, $sort: [MediaSort], $page: Int, $countryOfOrigin: CountryCode" +
  "$genre_in: [String], $format_in: [MediaFormat]"

export const SEARCH_ANIMES_QUERY = `
  query(${SEARCH_ANIMES_QUERY_VARIABLES}) {
    data: Page(page: $page, perPage: 50) {
      media(type: ANIME, sort: $sort,
          season: $season, seasonYear: $seasonYear,
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
        meanScore
        averageScore
        studios {
          edges {
            node {
              id
              name
            }
          }
        }
        type
        popularity
        format
        description(asHtml: true)
        episodes
        season
        seasonYear
        status
      }
    }
  }
`

export const ANIME_DETAILS_QUERY = `
  query($id: Int) {
    Media(id: $id, type: ANIME) {
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
      streamingEpisodes {
        title
        thumbnail
        url
        site
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
      season
      seasonYear
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
