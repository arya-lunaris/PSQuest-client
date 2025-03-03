import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";  
import { gameFetchFromIGDB } from "../../services/gameService";  
import { saveGameFromIGDB } from "../../services/usergameService"; 
import GameCard from "../../components/GameCard/GameCard";  
import "./SearchPage.css";

const SearchPage = () => {
  const { user } = useContext(UserContext); 

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
      const gameWithStatus = { ...game, status: 'collection' };  
      await saveGameFromIGDB(gameWithStatus); 
    } catch (error) {
      console.error("Failed to add game to collection", error);
    }
  };
  
  const handleAddToWishlist = async (game) => {
    try {
      const gameWithStatus = { ...game, status: 'wishlist' };  
      await saveGameFromIGDB(gameWithStatus); 
    } catch (error) {
      console.error("Failed to add game to wishlist", error);
    }
  };

  if (!user) {
    return (
      <div className="searchPage">
        <div className="image-container">
          <img 
            src="https://imgur.com/qZWr1EO.png" 
            alt="Banner" 
            className="banner-image"
          />
          <h1 className="title">Search for Games</h1>
        </div>
  
        <div className="search-login-message">
          <p>You must be logged in to search for games!</p>
          <Link to="/login">
            <button className="btn-thin">Go to Login</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="searchPage">
      <div className="image-container">
        <img 
          src="https://imgur.com/qZWr1EO.png" 
          alt="Banner" 
          className="banner-image"
        />
        <h1 className="title">Search for Games</h1>
        <form onSubmit={handleSearchSubmit} className="searchForm">
          <input
            type="text"
            placeholder="Search for a game"
            value={searchTerm}
            onChange={handleSearchChange}
            className="searchInput"
          />
          <button type="submit" className="btn-thin">
            <img 
              src="https://imgur.com/sjDimfB.png" 
              alt="Search" 
              className="search-image"
            />
          </button>
        </form>
      </div>

      {error && <p className="error text-center text-red-500">{error}</p>}
      {loading && <p className="text-center">Loading...</p>}
    
      <div className="gameResults">
        {searched && games.length === 0 && !loading && <p className="text-center">No results found</p>}

        {!loading && games.length > 0 && games.map((game) => (
          <GameCard
            key={game.id ? game.id : `${game.name}-${Math.random()}`}
            game={{
              id: game.id,
              title: game.title,
              image: game.cover || "placeholder.jpg",
              releaseDate: game.first_release_date || "Release Date unavailable",
              rating: game.total_rating ? game.total_rating.toFixed(1) : "Rating unavailable",
              genres: game.genres && game.genres.length > 0 ? game.genres.join(", ") : "Genres unavailable",
              storyline: game.storyline || "Storyline unavailable."
            }}
            type="search"
            onAddToCollection={handleAddToCollection} 
            onAddToWishlist={handleAddToWishlist}
            onRemove={() => {}}  
          />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
