import React from "react";
import { NavLink } from "react-router-dom";

function AnimeCard({ anime }) {
  return (
    <article className="anime-card">
      <NavLink
        key={`${anime.mal_id}-link`}
        to={`/anime/${anime.mal_id}` && `/anime/${anime.mal_id}`}
      >
        <figure>
          <img src={anime.images.jpg.large_image_url} alt="Anime" />
        </figure>
        <h3>{anime.title}</h3>
      </NavLink>
    </article>
  );
}

export default AnimeCard;
