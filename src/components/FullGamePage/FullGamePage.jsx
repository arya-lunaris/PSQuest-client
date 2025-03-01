import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getFullUserGame, updateUserGame } from "../../services/usergameService";

const FullGamePage = () => {
  const { usergameId } = useParams();
  const [userGameDetails, setUserGameDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [rating, setRating] = useState(null);
  const [review, setReview] = useState(""); 
  const [gameStatus, setGameStatus] = useState(""); 

  useEffect(() => {
    const fetchUserGameDetails = async () => {
      try {
        const gameDetails = await getFullUserGame(usergameId);
        setUserGameDetails(gameDetails);
        setRating(gameDetails.rating);
        setReview(gameDetails.review);
        setGameStatus(gameDetails.game_status);
      } catch (error) {
        setError("Failed to fetch game details.");
      } finally {
        setLoading(false);
      }
    };

    if (usergameId) {
      fetchUserGameDetails();
    }
  }, [usergameId]);

  const handleUpdate = async () => {
    try {
      const updatedData = { rating, review, game_status: gameStatus };
      await updateUserGame(usergameId, updatedData);
    } catch (error) {
      setError("Failed to update game details.");
    }
  };

  if (loading) return <p>Loading...</p>;

  if (error) return <p>{error}</p>;

  if (!userGameDetails) return <p>Game details not found.</p>;

  const { game } = userGameDetails;

  return (
    <div>
      <h1>{game?.title || "Game Title Unavailable"}</h1>
      <img src={game?.cover || "placeholder.jpg"} alt={game?.title || "No Cover"} />
      <p>{game?.first_release_date || "Release Date unavailable"}</p>
      <p>Rating: {game?.total_rating ? game.total_rating.toFixed(1) : "Rating unavailable"}</p>
      <p>Genres: {Array.isArray(game?.genres) && game.genres.length ? game.genres.join(", ") : "Genres unavailable"}</p>
      <p>Description: {game?.storyline || "Storyline unavailable"}</p>


      <div>
        <label>
          Rating (1-5):
          <input 
            type="number" 
            min="1" 
            max="5" 
            value={rating} 
            onChange={(e) => setRating(e.target.value)} 
          />

        </label>
        <br />
        <label>
          Review:
          <textarea 
            value={review} 
            onChange={(e) => setReview(e.target.value)} 
          />
        </label>
        <br />
        
        <label>
          Game Status:
          <select 
            value={gameStatus} 
            onChange={(e) => setGameStatus(e.target.value)} 
          >
            <option value="currently_playing">Currently Playing</option>
            <option value="completed">Completed</option>
            <option value="not_started">Not Started</option>
          </select>
        </label>
        <br />
        <button onClick={handleUpdate}>Update</button>
      </div>
    </div>
  );
};

export default FullGamePage;
