import { useState, useContext, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";  
import { gameFetchFromIGDB } from "../../services/gameService";  
import { saveGameFromIGDB } from "../../services/usergameService"; 
import GameCard from "../../components/GameCard/GameCard";  
import Modal from "../../components/Modal/Modal";  
import "./SearchPage.css";

const SearchPage = () => {
  const { user } = useContext(UserContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const savedSearchTerm = sessionStorage.getItem("searchTerm") || "";
  const savedGames = JSON.parse(sessionStorage.getItem("games")) || [];

  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || savedSearchTerm);
  const [games, setGames] = useState(savedGames);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(!!savedSearchTerm || !!searchParams.get("query"));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const handlePageRefresh = () => {
      sessionStorage.removeItem("searchTerm");
      sessionStorage.removeItem("games");
    };
  
    window.addEventListener("beforeunload", handlePageRefresh);
    return () => window.removeEventListener("beforeunload", handlePageRefresh);
  }, []);
  
  const fetchGames = async (query) => {
    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const response = await gameFetchFromIGDB(query);
      const fetchedGames = response.data || response;

      setGames(fetchedGames);
      sessionStorage.setItem("searchTerm", query);
      sessionStorage.setItem("games", JSON.stringify(fetchedGames)); 
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setError("Please enter a search term");
      return;
    }

    setSearchParams({ query: searchTerm });
    fetchGames(searchTerm);
  };

  const handleAddToCollection = async (game) => {
    try {
      const gameWithStatus = { ...game, status: 'collection' };
      const response = await saveGameFromIGDB(gameWithStatus);

      setModalMessage(response?.message.includes("already") ? "Game is already in your collection!" : "Game added to collection!");
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to add game to collection", error);
    }
  };

  const handleAddToWishlist = async (game) => {
    try {
      const gameWithStatus = { ...game, status: 'wishlist' };
      const response = await saveGameFromIGDB(gameWithStatus);

      setModalMessage(response?.message.includes("already") ? "Game is already in your wishlist!" : "Game added to wishlist!");
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to add game to wishlist", error);
    }
  };

  if (!user) {
    return (
      <div className="searchPage">
        <div className="image-container">
          <img src="https://imgur.com/qZWr1EO.png" alt="Banner" className="banner-image" />
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
        <img src="https://imgur.com/qZWr1EO.png" alt="Banner" className="banner-image" />
        <h1 className="title">Search for Games</h1>
        <form onSubmit={handleSearchSubmit} className="searchForm">
          <input
            type="text"
            placeholder="Search for a game"
            value={searchTerm}
            onChange={handleSearchChange}
            className="searchInput"
          />
          <button type="submit" className="btn-search">
            <img src="https://imgur.com/sjDimfB.png" alt="Search" className="search-image" />
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} message={modalMessage} />
    </div>
  );
};

export default SearchPage;
