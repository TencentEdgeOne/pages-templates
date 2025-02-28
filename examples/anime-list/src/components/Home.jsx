import { useEffect, useState } from "react";
import Header from "../components/Header";
import MainContent from "../components/MainContent";
import Sidebar from "../components/Sidebar/Sidebar";

function Home() {
  const [animeList, setAnimeList] = useState([]);
  const [topAnime, setTopAnime] = useState([]);
  const [popularAnime, setPopularAnime] = useState([]);
  const [search, setSearch] = useState("");
  
  // Add loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isTopLoading, setIsTopLoading] = useState(false);
  const [isPopularLoading, setIsPopularLoading] = useState(false);

  const getTopAnime = async () => {
    setIsTopLoading(true);
    try {
      const temp = await fetch(
        `https://api.jikan.moe/v4/top/anime?filter=airing`
      ).then((res) => res.json());

      setTopAnime(temp.data?.slice(0, 5));

      // Initial load to set anime list to the top anime
      setAnimeList(temp.data);
    } catch (error) {
      console.error("Error fetching top anime:", error);
    } finally {
      setIsTopLoading(false);
    }
  };

  const getPopularAnime = async () => {
    setIsPopularLoading(true);
    try {
      const temp = await fetch(
        `https://api.jikan.moe/v4/top/anime?filter=bypopularity`
      ).then((res) => res.json());

      setPopularAnime(temp.data?.slice(0, 5));
    } catch (error) {
      console.error("Error fetching popular anime:", error);
    } finally {
      setIsPopularLoading(false);
    }
  };

  const getFilteredAnime = async (value) => {
    setIsLoading(true);
    try {
      const temp = await fetch(
        `https://api.jikan.moe/v4/top/anime?filter=${value}`
      ).then((res) => res.json());

      setAnimeList(temp.data);
    } catch (error) {
      console.error("Error fetching filtered anime:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAnime(search);
  };

  const handleFilter = (value) => {
    getFilteredAnime(value);
  };

  const fetchAnime = async (query) => {
    setIsLoading(true);
    try {
      const temp = await fetch(
        `https://api.jikan.moe/v4/anime?q=${query}&order_by=popularity&sort=asc&sfw`
      ).then((res) => res.json());

      setAnimeList(temp.data);
    } catch (error) {
      console.error("Error fetching searched anime:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTopAnime();
    getPopularAnime();
  }, []);

  return (
    <div className="App">
      <Header />
      <div className="content-wrap">
        <Sidebar 
          topAnime={topAnime} 
          popularAnime={popularAnime} 
          isTopLoading={isTopLoading}
          isPopularLoading={isPopularLoading}
        />
        <MainContent
          handleSearch={handleSearch}
          handleFilter={handleFilter}
          search={search}
          setSearch={setSearch}
          animeList={animeList}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default Home;