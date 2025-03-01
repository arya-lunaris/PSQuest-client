import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFullUserGame } from "../../services/usergameService"; 

const getToken = () => {
  return localStorage.getItem("gsky_token");
};

const FullGamePage = () => {
  const [userGameDetails, setUserGameDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const { usergameId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();  

    if (!token) {
      console.warn("⚠️ No token found! You will not be able to fetch user game details.");
      setError("You need to be logged in to view this page.");
      setLoading(false); 
      return;
    }

    const fetchUserGameDetails = async () => {
      try {
        const gameDetails = await getFullUserGame(usergameId, token);
        setUserGameDetails(gameDetails);
      } catch (error) {
        setError("Failed to fetch game details.");
      } finally {
        setLoading(false);
      }
    };

    if (usergameId) {
      fetchUserGameDetails();
    }
  }, [usergameId, navigate]); 

  if (loading) return <p>Loading...</p>;

  if (error) {
    return <p>{error}</p>; 
  }

  if (!userGameDetails) return <p>Game details not found.</p>;

  const { game, gameStatus, rating, review } = userGameDetails;
  return (
    <div>
      <h1>{game?.title || "Game Title Unavailable"}</h1>
      <img src={game?.cover || "placeholder.jpg"} alt={game?.title || "No Cover"} />
      <p>{game?.first_release_date || "Release Date unavailable"}</p>
      <p>Rating: {game?.total_rating ? game.total_rating.toFixed(1) : "Rating unavailable"}</p>
      <p>Genres: {Array.isArray(game?.genres) ? game.genres.join(", ") : "Genres unavailable"}</p>
      <p>Description: {game?.storyline || "Storyline unavailable"}</p>

      <p>Status: {gameStatus || "Status unavailable"}</p>
      <p>Rating: {rating !== null ? rating : "No rating yet"}</p>
      <p>Review: {review || "No review yet"}</p>
    </div>
  );
};

export default FullGamePage;
