import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { getFullUserGame, updateUserGame } from "../../services/usergameService";
import './FullGamePage.css';

const FullGamePage = () => {
  const { user } = useContext(UserContext);
  const { usergameId } = useParams();
  const [userGameDetails, setUserGameDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");
  const [pageStatus, setPageStatus] = useState(""); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserGameDetails = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const gameDetails = await getFullUserGame(usergameId);
        setUserGameDetails(gameDetails);
        setRating(gameDetails.rating || "");
        setReview(gameDetails.review || "");
        setPageStatus(gameDetails.page_status || "");  
      } catch (error) {
        setError("Failed to fetch game details.");
      } finally {
        setLoading(false);
      }
    };

    if (usergameId) {
      fetchUserGameDetails();
    }
  }, [usergameId, user, navigate]);

  const handleUpdate = async () => {
    if (!user) {
      setError("You must be logged in to update game details.");
      return;
    }

    try {
      const updatedData = { rating, review, page_status: pageStatus };  
      await updateUserGame(usergameId, updatedData);
    } catch (error) {
      setError("Failed to update game details.");
    }
  };

  const handleMoveToCollection = async () => {
    try {
      const updatedData = { page_status: 'collection' };
      await updateUserGame(usergameId, updatedData);
      setPageStatus('collection');
    } catch (error) {
      console.error("Failed to move game to collection", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  if (error) return <p>{error}</p>;

  if (!userGameDetails) return <p>Game details not found.</p>;

  const { game } = userGameDetails;

  return (
    <div className="full-game-page">
      
      <div className="full-game-left">
        <h1 className="full-game-title">{game?.title || "Game Title Unavailable"}</h1>
        <img className="full-game-cover" src={game?.cover || "placeholder.jpg"} alt={game?.title || "No Cover"} />
        <div className="full-game-details">
          <p><strong>Release Date:</strong> {game?.first_release_date || "Unavailable"}</p>
          <p><strong>Rating:</strong> {game?.total_rating ? game.total_rating.toFixed(1) : "Unavailable"}</p>
          <p><strong>Genres:</strong> {Array.isArray(game?.genres) && game.genres.length ? game.genres.join(", ") : "Unavailable"}</p>
          <p><strong>Description:</strong> {game?.storyline || "Unavailable"}</p>
        </div>
      </div>
  
      <div className="full-game-right">
        {pageStatus !== "wishlist" && (
          <>
            <div className="full-game-status">
              <label>Game Status:</label>
              <select value={pageStatus} onChange={(e) => setPageStatus(e.target.value)}>
                <option value="not_started">Not Started</option>
                <option value="currently_playing">Currently Playing</option>
                <option value="completed">Completed</option>
              </select>

              <label>Rating (1-5):</label>
              <input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(e.target.value)} />

              <label>Review:</label>
              <textarea value={review} onChange={(e) => setReview(e.target.value)} />
            </div>

            <div className="full-game-buttons">
              <button onClick={handleUpdate}>Update</button>
            </div>
          </>
        )}

        {pageStatus === "wishlist" && (
          <div className="wishlist-info">
            <p>To rate and review this game, move it to your collection!</p>
            <button onClick={handleMoveToCollection} className="btn-move-to-collection">
              Move Game
            </button>
          </div>
        )}
      </div>
  
    </div>
  );
};

export default FullGamePage;
