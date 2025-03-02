import React from "react";
import './GameCard.css'

const GameCard = ({ game, type, onAddToCollection, onAddToWishlist, onRemove, onMoveToCollection, onViewGame }) => {
    const imageUrl = game.cover || game.image || "https://via.placeholder.com/150"; 
  
    return (
      <div className="game-card">
        {imageUrl && <img src={imageUrl} alt={game.title} className="game-card-image" />}
        <h3 className="game-card-title">{game.title}</h3>
        <p className="game-card-date"><span className="bold-label">Release Date:</span> {game.releaseDate}</p>
        <p className="game-card-rating"><span className="bold-label">Rating:</span> {game.rating}</p>
        <p className="game-card-genres"><span className="bold-label">Genres:</span> {game.genres}</p>
        <p className="game-card-storyline"><span className="bold-label">Description:</span> {game.storyline}</p>
        
        <div className="game-card-buttons">
          {type === "search" ? (
            <>
              <button className="btn-add" onClick={() => onAddToCollection(game)}>Add to Collection</button>
              <button className="btn-add" onClick={() => onAddToWishlist(game)}>Add to Wishlist</button>
            </>
          ) : type === "wishlist" ? (
            <>
              <button className="btn-add" onClick={() => onMoveToCollection(game)}>Move to Collection</button>
              <button className="btn-remove" onClick={() => onRemove(game)}>Remove from Wishlist</button>
            </>
          ) : type === "collection" ? (
            <>
              <button className="btn-add" onClick={() => onViewGame(game.id)}>View Game</button>
              <button className="btn-remove red-btn" onClick={() => onRemove(game.id)}>Remove Game</button>
            </>
          ) : null}
        </div>
      </div>
    );
};

export default GameCard;
