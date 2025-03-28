import React, { useEffect, useState, useContext } from "react";
import { getUserGamesByStatus, removeGameFromUser, saveGameFromIGDB } from "../../services/usergameService"; 
import GameCard from "../../components/GameCard/GameCard"; 
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import './WishlistPage.css';

const WishlistPage = () => {
  const { user } = useContext(UserContext);
  const [wishlistGames, setWishlistGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchWishlistGames = async () => {
      try {
        const games = await getUserGamesByStatus("wishlist");
        setWishlistGames(games);
      } catch (error) {
        console.error("Error fetching wishlist games", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistGames();
  }, [user]);

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
      await saveGameFromIGDB(updatedGame); 
      setWishlistGames((prevGames) => prevGames.filter((g) => g.id !== userGame.id));  
    } catch (error) {
      console.error("Error moving game to collection", error);
    }
  };

  return (
    <div className="wishlistPage">
      <div className="wishlist-banner">
        <h1 className="wishlist-title">Your Wishlist</h1>
      </div>

      {!user ? (
        <div className="wishlist-login-message">
          <p>Log in to see your wishlist!</p>
          <Link to="/login">
            <button className="btn-thin">Go to Login</button>
          </Link>
        </div>
      ) : loading ? (
        <p>Loading...</p>
      ) : (
        <div className="gameResults">
          {wishlistGames.length === 0 ? (
            <p>No games in your wishlist</p>
          ) : (
            wishlistGames.map((userGame) => {
              const game = userGame.game;  
              return (
                <GameCard
                  key={userGame.id} 
                  game={{
                    id: game.id,
                    title: game.title,
                    image: game.cover || "placeholder.jpg",
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
