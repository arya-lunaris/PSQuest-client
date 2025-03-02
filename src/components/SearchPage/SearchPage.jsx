import React, { useState } from "react";
import { gameFetchFromIGDB } from "../../services/gameService";  
import { saveGameFromIGDB } from "../../services/usergameService"; 
import GameCard from "../../components/GameCard/GameCard";  
import './SearchPage.css';

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
        const savedGame = await saveGameFromIGDB(gameWithStatus); 
      } catch (error) {
        console.error("Failed to add game to collection", error);
      }
    };
  
    const handleAddToWishlist = async (game) => {
      try {
        const gameWithStatus = { ...game, status: 'wishlist' };  
        const savedGame = await saveGameFromIGDB(gameWithStatus); 
      } catch (error) {
        console.error("Failed to add game to wishlist", error);
      }
    };
  
    return (
      <div className="searchPage">
        <h1 className="text-center text-3xl text-gray-900">Search for Games</h1>
  
        <form onSubmit={handleSearchSubmit} className="searchForm">
          <input
            type="text"
            placeholder="Search for a game"
            value={searchTerm}
            onChange={handleSearchChange}
            className="searchInput"
          />
          <button type="submit" className="btn-thin">Search</button>
        </form>
  
        {error && <p className="error text-center text-red-500">{error}</p>}
        {loading && <p className="text-center">Loading...</p>}
      
      <div className="gameResults">
        {searched && games.length === 0 && !loading && <p className="text-center">No results found</p>}

        {!loading && games.length > 0 && games.map((game) => {
          const imageUrl = game.cover ? game.cover : "https://via.placeholder.com/150";
          
          return (
            <GameCard
              key={game.id ? game.id : `${game.name}-${Math.random()}`}
              game={{
                id: game.id,
                title: game.title,
                image: game.cover || game.image ? game.cover : "placeholder.jpg",
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
          );
        })}
      </div>
    </div>
  );
};

export default SearchPage;
