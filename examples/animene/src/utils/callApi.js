import { ANIME_BASE_URL, SERVER_BASE_URL, ANILIST_BASE_URL } from "./constants"

import axios from "axios"

const callApi = (base_url) => {
  return async ({
    endpoint,
    method = "GET",
    payload = {},
    accessToken = null
  }) =>
    await axios({
      method,
      url: base_url + "/" + endpoint,
      data: payload,
      headers: {
        Authorization: "Bearer " + accessToken
      }
    })
}

export const callAnilistApi = (query, variables) => {
  // Define the config we'll need for our Api request
  var url = ANILIST_BASE_URL,
    options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        query: query,
        variables: variables
      })
    }

  // Make the HTTP Api request
  return fetch(url, options)
    .then(handleResponse)
    .then(handleData)
    .catch(handleError)

  function handleResponse(response) {
    return response.json().then(function (json) {
      return response.ok ? json : Promise.reject(json)
    })
  }

  function handleData(data) {
    return data
  }

  function handleError(error) {
    console.error(error)
  }
}

export const callAnimeApi = callApi(ANIME_BASE_URL)
export const callServerApi = callApi(SERVER_BASE_URL)
