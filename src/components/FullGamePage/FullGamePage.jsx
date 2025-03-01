import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFullUserGame } from "../../services/usergameService"; 

const FullGamePage = () => {
  const [userGameDetails, setUserGameDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const { usergameId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("gsky_token");

    if (!token) {
      console.warn("⚠️ No token found! You will not be able to fetch user game details.");
      setError("You need to be logged in to view this page.");
      setLoading(false); 
      return;
    }

    const fetchUserGameDetails = async () => {
      try {
        const gameDetails = await getFullUserGame(usergameId);
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

  const { game, page_status, game_status, rating, review } = userGameDetails;
  
  const displayRating = rating !== null ? rating : "No rating yet";
  const displayReview = review || "No review yet";
  const displayGameStatus = game_status || "No game status available";

  return (
    <div>
      <h1>{game?.title || "Game Title Unavailable"}</h1>
      <img src={game?.cover || "placeholder.jpg"} alt={game?.title || "No Cover"} />
      <p>{game?.first_release_date || "Release Date unavailable"}</p>
      <p>Rating: {game?.total_rating ? game.total_rating.toFixed(1) : "Rating unavailable"}</p>
      <p>Genres: {game?.genres?.length ? game.genres.join(", ") : "Genres unavailable"}</p>
      <p>{game?.storyline || "Storyline unavailable"}</p>

      <p>Game Status: {displayGameStatus}</p>
      <p>Rating: {displayRating}</p>
      <p>Review: {displayReview}</p>
    </div>
  );
};

export default FullGamePage;
