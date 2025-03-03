import React from "react";
import { useNavigate } from 'react-router-dom';
import './GameCard.css';

const GameCard = ({ game, userGameId, type, onAddToCollection, onAddToWishlist, onRemove, onMoveToCollection, onViewGame }) => {
  const navigate = useNavigate();

  const imageUrl = game.cover || game.image || "https://via.placeholder.com/150";

  const handleImageClick = () => {
    if (type === "collection" || type === "wishlist") {
      navigate(`/game/${userGameId}`);
    } else {
      navigate(`/game-detail/${game.id}`, { state: { game } }); 
    }
  };

  return (
    <div className="game-card">
      <div className="game-card-image-container" onClick={handleImageClick}>
        <img src={imageUrl} alt={game.title} className="game-card-image" />
      </div>


      <h3 className="game-card-title">{game.title}</h3>

      <div className="game-card-buttons">
        {type === "search" ? (
          <>
            <button className="btn-add" onClick={() => onAddToCollection(game)}>Add to Collection</button>
            <button className="btn-add" onClick={() => onAddToWishlist(game)}>Add to Wishlist</button>
          </>
        // ) : type === "wishlist" ? (
        //   <>
        //     <button className="btn-add" onClick={() => onMoveToCollection(game)}>Move to Collection</button>
        //     <button className="btn-remove" onClick={() => onRemove(game)}>Remove</button>
        //   </>
        // ) : type === "collection" ? (
        //   <>
        //     <button className="btn-add" onClick={() => onViewGame(game.id)}>View Game</button>
        //     <button className="btn-remove red-btn" onClick={() => onRemove(game.id)}>Remove Game</button>
        //   </>
        ) : null}
      </div>
    </div>
  );
};

export default GameCard;
