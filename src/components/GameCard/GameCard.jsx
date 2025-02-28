import React from "react";

const GameCard = ({ game, type, onAdd, onRemove }) => {
  return (
    <div className="game-card">
      {game.image && <img src={game.image} alt={game.title} className="game-card-image" />}
      <h3 className="game-card-title">{game.title}</h3>
      <p className="game-card-date">Release Date: {game.releaseDate}</p>
      <p className="game-card-rating">Rating: {game.rating}</p>
      <p className="game-card-genres">Genres: {game.genres}</p>
      <p className="game-card-storyline">Description: {game.storyline}</p>
      
      <div className="game-card-buttons">
        {type === "search" ? (
          <>
            <button className="btn-add" onClick={() => onAdd(game)}>Add to Collection</button>
            <button className="btn-add" onClick={() => onAdd(game)}>Add to Wishlist</button>
          </>
        ) : type === "wishlist" ? (
          <>
            <button className="btn-add" onClick={() => onAdd(game)}>Move to Collection</button>
            <button className="btn-remove" onClick={() => onRemove(game)}>Remove from Wishlist</button>
          </>
        ) : type === "collection" ? (
          <>
            <button className="btn-remove" onClick={() => onRemove(game)}>Remove from Collection</button>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default GameCard;
