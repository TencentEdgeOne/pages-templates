import React from "react";
import AnimeCard from "./AnimeCard";
import Filter from "./Filter/Filter";
import { Button, Menu, Fade } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

function MainContent(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchFilter = (name) => {
    props.handleFilter(name);
  };

  const filters = [
    { name: "popular", icon: <FavoriteIcon /> },
    { name: "upcoming", icon: <CalendarMonthIcon /> },
    { name: "favorite", icon: <StarIcon /> },
    { name: "airing", icon: <LiveTvIcon /> },
  ];

  return (
    <main>
      <div className="main-head">
        <form className="search-box" onSubmit={props.handleSearch}>
          <Button
            className="filter-anime"
            id="fade-button"
            aria-controls={open ? "fade-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            variant="contained"
          >
            Filter Anime
          </Button>
          <Menu
            id="fade-menu"
            MenuListProps={{
              "aria-labelledby": "fade-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            TransitionComponent={Fade}
          >
            {filters.map((filter) => {
              return (
                <Filter
                  fetchFilter={fetchFilter}
                  filter={filter}
                  handleClose={handleClose}
                />
              );
            })}
          </Menu>
          <input
            type="search"
            placeholder="Search for an anime"
            required
            value={props.search}
            onChange={(e) => props.setSearch(e.target.value)}
          />
        </form>
      </div>
      <div className="anime-list">
        {props &&
          props.animeList?.map((anime) => (
            <AnimeCard anime={anime} key={anime.mal_id} />
          ))}
      </div>
    </main>
  );
}

export default MainContent;
