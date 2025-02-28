import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ topAnime, popularAnime }) {
  const imgUrl = require(`../../assets/images/MAL.png`);

  return (
    <div>
      <aside>
        <nav>
          <h3>Top Anime</h3>
          <div>
            {topAnime &&
              topAnime.map((anime, index) => (
                <div className="sidebar-card" key={anime.mal_id}>
                  <span className="sidebar-rank">
                    {index + 1}
                    <a href={anime?.url} target="_blank" rel="noreferrer">
                      <img
                        src={imgUrl}
                        height="28px"
                        width="28px"
                        alt=""
                        title="View at MyAnimeList.net"
                      />
                    </a>
                  </span>
                  <NavLink
                    key={`${anime.mal_id}-link`}
                    to={`/anime/${anime.mal_id}` && `/anime/${anime.mal_id}`}
                  >
                    <img src={anime.images.jpg.small_image_url} alt="top" />
                    <span className="sidebar-title">{anime.title}</span>
                  </NavLink>
                </div>
              ))}
          </div>
        </nav>
        <nav>
          <h3>Popular Anime</h3>
          <div>
            {popularAnime &&
              popularAnime.map((anime, index) => (
                <div className="sidebar-card" key={anime.mal_id}>
                  <span className="sidebar-rank">
                    {index + 1}
                    <a href={anime?.url} target="_blank" rel="noreferrer">
                      <img src={imgUrl} height="32px" width="32px" alt="" />
                    </a>
                  </span>
                  <NavLink
                    key={`${anime.mal_id}-link`}
                    to={`/anime/${anime.mal_id}` && `/anime/${anime.mal_id}`}
                  >
                    <img src={anime.images.jpg.small_image_url} alt="popular" />
                    <span className="sidebar-title">{anime.title}</span>
                  </NavLink>
                </div>
              ))}
          </div>
        </nav>
      </aside>
    </div>
  );
}

export default Sidebar;
