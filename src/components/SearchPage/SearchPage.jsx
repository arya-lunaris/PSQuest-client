import React, { useState } from "react";
import { gameFetchFromIGDB } from "../../services/gameService";  
import { saveGameFromIGDB } from "../../services/gameService"; 
import GameCard from "../../components/GameCard/GameCard";  
import styles from "./search.module.css";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState(""); 
  const [games, setGames] = useState([]);  
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(""); 
  const [searched, setSearched] = useState(false); 

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); 
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      setError("Please enter a search term");
      return;
    }

    setLoading(true);
    setError("");
    setSearched(true); 

    try {
      const response = await gameFetchFromIGDB(searchTerm);
      console.log("API Response: ", response);

      if (response.data) {
        setGames(response.data);
      } else {
        setGames(response);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCollection = async (game) => {
    try {
      const savedGame = await saveGameFromIGDB(game);
      console.log("Game added to collection:", savedGame);

    } catch (error) {
      console.error("Failed to add game to collection", error);
    }
  };

  return (
    <div className={styles.searchPage}>
      <h1>Search for Games</h1>

      <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
        <input
          type="text"
          placeholder="Search for a game"
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>Search</button>
      </form>

      {error && <p className={styles.error}>{error}</p>}
      {loading && <p>Loading...</p>}
      
      <div className={styles.gameResults}>
        {searched && games.length === 0 && !loading && <p>No results found</p>}

        {!loading && games.length > 0 && games.map((game) => (
          <GameCard
            key={game.id ? game.id : `${game.name}-${Math.random()}`}
            game={{
              id: game.id,
              title: game.title,
              image: game.cover ? game.cover : "placeholder.jpg",
              releaseDate: game.first_release_date || "Release Date unavailable",
              rating: game.total_rating ? game.total_rating.toFixed(1) : "Rating unavailable",
              genres: game.genres && game.genres.length > 0 ? game.genres.join(", ") : "Genres unavailable",
              storyline: game.storyline || "Storyline unavailable."
            }}
            type="search"
            onAdd={handleAddToCollection} 
            onRemove={() => {}}  
          />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
