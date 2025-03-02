import React, { useEffect, useState } from "react";
import { getUserGamesByStatus, removeGameFromUser, saveGameFromIGDB } from "../../services/usergameService"; 
import GameCard from "../../components/GameCard/GameCard"; 
import './WishlistPage.css'

const WishlistPage = () => {
  const [wishlistGames, setWishlistGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistGames = async () => {
      try {
        const games = await getUserGamesByStatus("wishlist");
        setWishlistGames(games);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching wishlist games", error);
        setLoading(false);
      }
    };

    fetchWishlistGames();
  }, []);

  const handleRemove = async (userGameId) => {
    try {
      await removeGameFromUser(userGameId); 
      setWishlistGames((prevGames) => prevGames.filter((g) => g.id !== userGameId)); 
    } catch (error) {
      console.error("Failed to remove game from wishlist", error);
    }
  };

  const handleMoveToCollection = async (userGame) => {
    try {
      const updatedGame = { ...userGame.game, status: 'collection' }; 

      const savedGame = await saveGameFromIGDB(updatedGame); 
      setWishlistGames((prevGames) => prevGames.filter((g) => g.id !== userGame.id));  
    } catch (error) {
      console.error("Error moving game to collection", error);
    }
  };

  return (
    <div className="wishlistPage">
      <h1 className="wishlist-title">Your Wishlist</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="gameResults">
          {wishlistGames.length === 0 ? (
            <p>No games in your wishlist.</p>
          ) : (
            wishlistGames.map((userGame) => {
              const game = userGame.game;  
              const genres = Array.isArray(game.genres) ? game.genres.join(", ") : game.genres || "Genres unavailable";
              return (
                <GameCard
                  key={userGame.id} 
                  game={{
                    id: game.id,
                    title: game.title,
                    image: game.cover || "placeholder.jpg",
                    releaseDate: game.first_release_date || "Release Date unavailable",
                    rating: game.total_rating ? game.total_rating.toFixed(1) : "Rating unavailable",
                    genres: genres,
                    storyline: game.storyline || "Storyline unavailable.",
                  }}
                  userGameId={userGame.id} 
                  type="wishlist"
                  onRemove={() => handleRemove(userGame.id)}  
                  onMoveToCollection={() => handleMoveToCollection(userGame)}  
                />
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
