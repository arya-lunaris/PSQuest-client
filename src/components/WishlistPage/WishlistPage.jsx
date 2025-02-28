import React, { useEffect, useState } from "react";
import { getUserGamesByStatus } from "../../services/usergameService";
import GameCard from "../../components/GameCard/GameCard"; 

const WishlistPage = () => {
  const [wishlistGames, setWishlistGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistGames = async () => {
      try {
        const games = await getUserGamesByStatus('wishlist'); 
        setWishlistGames(games);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching wishlist games", error);
        setLoading(false);
      }
    };

    fetchWishlistGames();
  }, []);

  return (
    <div>
      <h1>Your Wishlist</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {wishlistGames.length === 0 ? (
            <p>No games in your wishlist.</p>
          ) : (
            <div>
              {wishlistGames.map((userGame) => {
                const game = userGame.game;  
                const genres = Array.isArray(game.genres) ? game.genres.join(", ") : game.genres || "Genres unavailable";
                return (
                  <GameCard
                    key={game.id}
                    game={{
                      id: game.id,
                      title: game.title,
                      image: game.cover || 'placeholder.jpg',
                      releaseDate: game.first_release_date || 'Release Date unavailable',
                      rating: game.total_rating ? game.total_rating.toFixed(1) : 'Rating unavailable',
                      genres: genres,
                      storyline: game.storyline || 'Storyline unavailable.',
                    }}
                    type="wishlist"
                    onAdd={() => {}} 
                    onRemove={() => {}} 
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

export default WishlistPage;
