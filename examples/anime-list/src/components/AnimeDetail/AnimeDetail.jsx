import React, { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Tooltip, CircularProgress } from '@mui/material';
import './AnimeDetail.css';

function AnimeDetail() {
  const { category } = useParams();
  const [anime, setAnime] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const imgUrl = require(`../../assets/images/MAL.png`);

  const fetchAnime = async (category) => {
    try {
      setIsLoading(true);
      const temp = await fetch(
        `https://api.jikan.moe/v4/anime/${category}`
      ).then((res) => res.json());

      setAnime(temp.data);
    } catch (error) {
      console.error('Error fetching anime:', error);
    }
  };

  const fetchCharacters = async (anime) => {
    try {
      const temp = await fetch(
        `https://api.jikan.moe/v4/anime/${anime}/characters`
      ).then((res) => res.json());

      let sortedData = temp?.data.sort((a, b) =>
        a.favorites < b.favorites ? 1 : -1
      );
      setCharacters(sortedData?.slice(0, 10));
    } catch (error) {
      console.error('Error fetching characters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (category) {
      fetchAnime(category);
      fetchCharacters(category);
    }
  }, [category]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <CircularProgress size={60} thickness={4} color="primary" />
        <h2>Loading anime details...</h2>
      </div>
    );
  }

  return (
    <div>
      <h1 className="title">
        <NavLink to="/">
          <Tooltip title="Back">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 12H5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 19L5 12L12 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Tooltip>
        </NavLink>
        {anime?.title_english || anime?.title_japanese}
        <a href={anime?.url} target="_blank" rel="noreferrer">
          <img
            src={imgUrl}
            height="28px"
            width="28px"
            alt=""
            title="View at MyAnimeList.net"
          />
        </a>
      </h1>
      <div className="background-text">
        <div>{anime?.synopsis}</div>
        <div>{anime?.background}</div>
      </div>
      <div className="list-group">
        <div className="image-container">
          <img src={anime?.images?.jpg?.image_url} alt=""></img>
        </div>
        <div className="text-container">
          <div>
            <span className="dark-text">Rank: </span>
            <span>{anime?.rank}</span>
          </div>
          <div>
            <span className="dark-text">Popularity: </span>
            <span>{anime?.popularity}</span>
          </div>
          <div>
            <span className="dark-text">Score: </span>
            <span>{anime?.score}</span>
          </div>
          <div>
            <span className="dark-text">Members: </span>
            <span>{anime?.members}</span>
          </div>
          <div>
            <span className="dark-text">Source: </span>
            <span>{anime?.source}</span>
          </div>
          <div>
            <span className="dark-text">Duration: </span>
            <span>{anime?.duration}</span>
          </div>
          <div>
            <span className="dark-text">Status: </span>
            <span>{anime?.status}</span>
          </div>
          <div>
            <span className="dark-text">Rating: </span>
            <span>{anime?.rating}</span>
          </div>
        </div>
      </div>
      {characters?.length > 0 && (
        <div className="character-section">
          <h1 className="title">Characters</h1>
          <div className="character">
            {characters?.map((item, index) => {
              return (
                <div className="character-item" key={index}>
                  <span>{item.character.name}</span>
                  <div>
                    <img
                      width="150"
                      height="200"
                      src={item.character.images.jpg.image_url}
                      alt=""
                    ></img>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {anime?.trailer?.embed_url ? (
        <div className="trailer-section">
          <h1 className="title">Trailer</h1>
          <div align="center">
          <iframe
              id="inlineFrameExample"
              title={`${anime?.title_english || anime?.title} Trailer`}
              width="1000"
              height="500"
              src={anime?.trailer?.embed_url}
              allowFullScreen
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default AnimeDetail;
