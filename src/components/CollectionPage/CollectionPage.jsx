import React, { useEffect, useState } from "react";
import { getUserGamesByStatus } from "../../services/usergameService";
import GameCard from "../../components/GameCard/GameCard"; 
import { removeGameFromUser } from "../../services/usergameService"; 

const CollectionPage = () => {
  const [collectionGames, setCollectionGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollectionGames = async () => {
      try {
        const games = await getUserGamesByStatus('collection');
        setCollectionGames(games);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching collection games", error);
        setLoading(false);
      }
    };

    fetchCollectionGames();
  }, []);

  const handleRemoveFromCollection = async (userGameId) => {
    try {
      await removeGameFromUser(userGameId);
      setCollectionGames(collectionGames.filter(game => game.id !== userGameId)); 
    } catch (error) {
      console.error("Failed to remove game from collection", error);
    }
  };

  return (
    <div>
      <h1>Your Collection</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {collectionGames.length === 0 ? (
            <p>No games in your collection.</p>
          ) : (
            <div>
              {collectionGames.map((userGame) => {
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
                    type="collection"
                    onRemove={() => handleRemoveFromCollection(userGame.id)}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CollectionPage;
