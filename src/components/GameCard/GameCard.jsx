import React from "react";
import { useNavigate } from 'react-router-dom';
import './GameCard.css';

const GameCard = ({ game, userGameId, type, onAddToCollection, onAddToWishlist, onRemove, onMoveToCollection, onViewGame }) => {
  const navigate = useNavigate();

  const imageUrl = game.cover || game.image || "https://via.placeholder.com/150";

  const handleImageClick = (e) => {
    e.stopPropagation();
    if (type === "collection" || type === "wishlist") {
      navigate(`/game/${userGameId}`);
    } else {
      navigate(`/game-detail/${game.id}`, { state: { game } });
    }
  };

  const handleButtonClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="game-card">
      <div className="game-card-image-container" onClick={handleImageClick}>
        <img src={imageUrl} alt={game.title} className="game-card-image" />
        <div className="game-card-buttons">
          {type === "search" ? (
            <>
              <button className="icon-btn" onClick={(e) => { handleButtonClick(e); onAddToCollection(game); }}>
                <img src="https://imgur.com/BIVw1W8.png" alt="Add to Collection" className="icon" />
              </button>
              <button className="icon-btn" onClick={(e) => { handleButtonClick(e); onAddToWishlist(game); }}>
                <img src="https://imgur.com/db6a8qi.png" alt="Add to Wishlist" className="icon" />
              </button>
            </>
          ) : null}
        </div>
      </div>

      <h3 className="game-card-title">{game.title}</h3>
    </div>
  );
};

export default GameCard;
