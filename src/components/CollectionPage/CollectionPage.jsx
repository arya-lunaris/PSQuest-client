import React, { useEffect, useState, useContext } from "react";
import { getUserGamesByStatus, removeGameFromUser, getFilteredGames } from "../../services/usergameService";
import GameCard from "../../components/GameCard/GameCard"; 
import { useNavigate, Link } from "react-router-dom";  
import { UserContext } from "../../contexts/UserContext";
import './CollectionPage.css';

const CollectionPage = () => {
  const { user } = useContext(UserContext);
  const [collectionGames, setCollectionGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gameStatus, setGameStatus] = useState("all"); 
  const navigate = useNavigate();  

  useEffect(() => {
    if (!user) return;  

    const fetchFilteredGamesFromAPI = async () => {
      try {
        const games = await getFilteredGames('collection', gameStatus);
        setCollectionGames(games);
      } catch (error) {
        console.error("Error fetching collection games", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredGamesFromAPI();
  }, [user, gameStatus]);

  const handleRemoveFromCollection = async (userGameId) => {
    try {
      await removeGameFromUser(userGameId);
      setCollectionGames(collectionGames.filter(game => game.id !== userGameId)); 
    } catch (error) {
      console.error("Failed to remove game from collection", error);
    }
  };

  const handleViewGame = (userGameId) => {
    navigate(`/game/${userGameId}`);
  };

  const handleGameStatusChange = (e) => {
    setGameStatus(e.target.value); 
  };

  return (
    <div className="collectionPage">
      <div className="banner-container">
        <h1 className="collection-title">Your Collection</h1>
      </div>

      {!user ? (
        <div className="collection-login-message">
          <p>Log in to see your collection!</p>
          <Link to="/login">
            <button className="btn-thin">Go to Login</button>
          </Link>
        </div>
      ) : (
        <>
          <div className="filter">
            <label>Filter Games:</label>
            <select value={gameStatus} onChange={handleGameStatusChange}>
              <option value="all">All</option>
              <option value="not_started">Not Started</option>
              <option value="currently_playing">Currently Playing</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="gameResults">
              {collectionGames.length === 0 ? (
                <div className="collection-messages">
                  {gameStatus === 'completed' ? (
                    <p>No games you have completed</p>
                  ) : gameStatus === 'currently_playing' ? (
                    <p>No games you're currently playing</p>
                  ) : gameStatus === 'not_started' ? (
                    <p>No games you haven't started yet</p>
                  ) : (
                    <p>No games in your collection</p> 
                  )}
                </div>
              ) : (
                collectionGames.map((userGame) => {
                  const game = userGame.game;  
                  return (
                    <GameCard
                      key={userGame.id}
                      game={{
                        id: game.id,
                        title: game.title,
                        image: game.cover || 'placeholder.jpg', 
                      }}
                      userGameId={userGame.id} 
                      type="collection"
                      onRemove={() => handleRemoveFromCollection(userGame.id)}
                      onViewGame={() => handleViewGame(userGame.id)}  
                    />
                  );
                })
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CollectionPage;
