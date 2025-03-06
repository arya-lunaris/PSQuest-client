import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { getFullUserGame, updateUserGame, removeGameFromUser } from "../../services/usergameService";
import Modal from "../../components//Modal/Modal";
import './FullGamePage.css';
import StarRating from "../../components//StarRating/StarRating";

const FullGamePage = () => {
  const { user } = useContext(UserContext);
  const { usergameId } = useParams();
  const [userGameDetails, setUserGameDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");
  const [gameStatus, setGameStatus] = useState("");
  const [pageStatus, setPageStatus] = useState("");
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserGameDetails = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const gameDetails = await getFullUserGame(usergameId);
        setUserGameDetails(gameDetails);
        setRating(gameDetails.rating || "");
        setReview(gameDetails.review || "");
        setPageStatus(gameDetails.page_status || "");
        setGameStatus(gameDetails.game_status || "");
      } catch (error) {
        setError("Failed to fetch game details.");
      } finally {
        setLoading(false);
      }
    };

    if (usergameId) {
      fetchUserGameDetails();
    }
  }, [usergameId, user, navigate]);

  const handleUpdate = async () => {
    if (!user) {
      setError("You must be logged in to update game details.");
      return;
    }

    try {
      let updatedData = { game_status: gameStatus, review };
      if (rating) {
        updatedData.rating = Number(rating);
      }

      await updateUserGame(usergameId, updatedData);
      setUserGameDetails((prev) => ({ ...prev, ...updatedData }));
      setIsUpdateModalOpen(true);
    } catch (error) {
      setError("Failed to update game details.");
    }
  };

  const handleMoveToCollection = async () => {
    try {
      const updatedData = { page_status: 'collection' };
      await updateUserGame(usergameId, updatedData);
      setIsMoveModalOpen(true);
      setPageStatus('collection');
    } catch (error) {
      console.error("Failed to move game to collection", error);
    }
  };

  const handleRemoveGame = async () => {
    if (!user) {
      setError("You must be logged in to delete this game.");
      return;
    }

    try {
      await removeGameFromUser(usergameId);
      setIsRemoveModalOpen(true);
      setTimeout(() => navigate(-1), 1000);
    } catch (error) {
      setError("Failed to delete game.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!userGameDetails) return <p>Game details not found.</p>;

  const { game } = userGameDetails;

  return (
    <div className="full-game-page">
      <div className="full-game-left">
        <h1 className="full-game-title">{game?.title || "Game Title Unavailable"}</h1>
        <img className="full-game-cover" src={game?.cover || "placeholder.jpg"} alt={game?.title || "No Cover"} />
        <div className="full-game-details">
          <p><strong>Release Date:</strong> {game?.first_release_date || "Unavailable"}</p>
          <p><strong>Rating:</strong> {game?.total_rating ? game.total_rating.toFixed(1) : "Unavailable"}</p>
          <p><strong>Genres:</strong> {Array.isArray(game?.genres) && game.genres.length ? game.genres.join(", ") : "Unavailable"}</p>

          <div className="description-wrapper">
            <strong>Description:</strong>
            <div className="scrollable-description">
              <p>{game?.storyline || "Unavailable"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="full-game-right">
        {pageStatus !== "wishlist" && (
          <>
            <h2 className="feedback-title">Feedback</h2>
            <div className="full-game-status">
              <label>Game Status:</label>
              <select value={gameStatus} onChange={(e) => setGameStatus(e.target.value)}>
                <option value="not_started">Not Started</option>
                <option value="currently_playing">Currently Playing</option>
                <option value="completed">Completed</option>
              </select>

              <label>Rating:</label>
              <StarRating rating={rating} setRating={setRating} />


              <label>Review:</label>
              <textarea value={review} onChange={(e) => setReview(e.target.value)} />
            </div>

            <div className="full-game-buttons">
              <button onClick={handleUpdate}>Update</button>
            </div>
          </>
        )}

        {pageStatus === "wishlist" && (
          <div className="wishlist-info">
            <p>To rate and review this game, move it to your collection!</p>
            <button onClick={handleMoveToCollection} className="btn-move-to-collection">
              Move Game
            </button>
          </div>
        )}
      </div>

      <div className="delete-game-button-container">
        <button onClick={handleRemoveGame} className="btn-remove red-btn">
          Remove Game
        </button>
      </div>

      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        message="Feedback updated!"
      />

      <Modal
        isOpen={isMoveModalOpen}
        onClose={() => setIsMoveModalOpen(false)}
        message="Game moved to collection!"
      />

      <Modal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        message="Removing game..."
      />
    </div>
  );
};

export default FullGamePage;
