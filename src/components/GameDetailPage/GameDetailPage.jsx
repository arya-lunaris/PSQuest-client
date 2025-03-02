import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { getGameById } from "../../services/gameService";
import { addGameToUserList } from "../../services/usergameService";
import "./GameDetailPage.css";

const GameDetailPage = () => {
  const { user } = useContext(UserContext);
  const { gameId } = useParams();
  const [gameDetails, setGameDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGameDetails = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const gameData = await getGameById(gameId);
        setGameDetails(gameData);
      } catch (error) {
        setError("Failed to fetch game details.");
      } finally {
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [gameId, user, navigate]);

  const handleAddToWishlist = async () => {
    try {
      await addGameToUserList(gameId, "wishlist");
      alert("Game added to your wishlist!");
    } catch (error) {
      console.error("Failed to add game to wishlist", error);
    }
  };

  const handleAddToCollection = async () => {
    try {
      await addGameToUserList(gameId, "collection");
      alert("Game added to your collection!");
    } catch (error) {
      console.error("Failed to add game to collection", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!gameDetails) return <p>Game details not found.</p>;

  return (
    <div className="full-game-page">
      <div className="full-game-left">
        <h1 className="full-game-title">{gameDetails.title || "Game Title Unavailable"}</h1>
        <img className="full-game-cover" src={gameDetails.cover || "placeholder.jpg"} alt={gameDetails.title || "No Cover"} />
        <div className="full-game-details">
          <p><strong>Release Date:</strong> {gameDetails.first_release_date || "Unavailable"}</p>
          <p><strong>Rating:</strong> {gameDetails.total_rating ? gameDetails.total_rating.toFixed(1) : "Unavailable"}</p>
          <p><strong>Genres:</strong> {Array.isArray(gameDetails.genres) && gameDetails.genres.length ? gameDetails.genres.join(", ") : "Unavailable"}</p>
          <p><strong>Description:</strong> {gameDetails.storyline || "Unavailable"}</p>
        </div>
      </div>

      <div className="full-game-right">
        <div className="wishlist-info">
          <p>Add this game to your wishlist or collection!</p>
          <button onClick={handleAddToWishlist} className="btn-move-to-collection">Add to Wishlist</button>
          <button onClick={handleAddToCollection} className="btn-move-to-collection">Add to Collection</button>
        </div>
      </div>
    </div>
  );
};

export default GameDetailPage;
