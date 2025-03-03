import React, { useEffect, useState, useContext } from "react";
import { getUserGamesByStatus, removeGameFromUser } from "../../services/usergameService";
import GameCard from "../../components/GameCard/GameCard"; 
import { useNavigate, Link } from "react-router-dom";  
import { UserContext } from "../../contexts/UserContext";
import './CollectionPage.css';

const CollectionPage = () => {
  const { user } = useContext(UserContext);
  const [collectionGames, setCollectionGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();  

  useEffect(() => {
    if (!user) return;  

    const fetchCollectionGames = async () => {
      try {
        const games = await getUserGamesByStatus('collection');
        setCollectionGames(games);
      } catch (error) {
        console.error("Error fetching collection games", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionGames();
  }, [user]);

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

  return (
    <div className="collectionPage">
      <h1 className="collection-title">Your Collection</h1>

      {!user ? (
        <div className="collection-login-message">
          <p>Log in see your collection!</p>
          <Link to="/login">
            <button className="btn-thin">Login</button>
          </Link>
        </div>
      ) : loading ? (
        <p>Loading...</p>
      ) : (
        <div className="gameResults">
          {collectionGames.length === 0 ? (
            <p>No games in your collection.</p>
          ) : (
            collectionGames.map((userGame) => {
              const game = userGame.game;  
              const genres = Array.isArray(game.genres) ? game.genres.join(", ") : game.genres || 'Genres unavailable';
              return (
                <GameCard
                  key={userGame.id}
                  game={{
                    id: game.id,
                    title: game.title,
                    image: game.cover || 'placeholder.jpg',
                    releaseDate: game.first_release_date || 'Release Date unavailable',
                    rating: game.total_rating ? game.total_rating.toFixed(1) : 'Rating unavailable',
                    genres: genres,
                    storyline: game.storyline || 'Storyline unavailable.',
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
    </div>
  );
};

export default CollectionPage;
