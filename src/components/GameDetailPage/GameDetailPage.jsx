import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { gameShow } from "../../services/gameService";
import { saveGameFromIGDB } from "../../services/usergameService";
import "./GameDetailPage.css";

const GameDetailPage = () => {
    const { user } = useContext(UserContext);
    const { gameId } = useParams();
    const [gameDetails, setGameDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const gameFromState = location.state?.game;

    useEffect(() => {
        const fetchGameDetails = async () => {
            if (!user) {
                navigate("/login");
                return;
            }

            if (gameFromState) {
                const formattedGameDetails = {
                    ...gameFromState,
                    releaseDate: gameFromState.releaseDate ? new Date(gameFromState.releaseDate) : "Unavailable",
                    rating: gameFromState.rating ? parseFloat(gameFromState.rating) : "Unavailable",
                };
                setGameDetails(formattedGameDetails);
                setLoading(false);
            } else {
                try {
                    const gameData = await gameShow(gameId);
                    setGameDetails(gameData);
                } catch (error) {
                    setError("Failed to fetch game details.");
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchGameDetails();
    }, [gameId, user, navigate, gameFromState]);

    const handleAddToWishlist = async () => {
        try {
            await saveGameFromIGDB({ ...gameDetails, status: "wishlist" });
        } catch (error) {
            console.error("Failed to add game to wishlist", error);
        }
    };

    const handleAddToCollection = async () => {
        try {
            await saveGameFromIGDB({ ...gameDetails, status: "collection" });
        } catch (error) {
            console.error("Failed to add game to collection", error);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!gameDetails) return <p>Game details not found.</p>;

    return (
        <div className="full-game-page">
            <div className="full-game-left">
                <h1 className="full-game-title">{gameDetails.title || "Game Title Unavailable"}</h1>
                <img
                    className="full-game-cover"
                    src={gameDetails.image || "placeholder.jpg"}
                    alt={gameDetails.title || "No Cover"}
                />
                <div className="full-game-details">
                    <p>
                        <strong>Release Date:</strong>{" "}
                        {gameDetails.releaseDate !== "Unavailable" ? gameDetails.releaseDate.toLocaleDateString() : "Unavailable"}
                    </p>
                    <p>
                        <strong>Rating:</strong>{" "}
                        {gameDetails.rating !== "Unavailable" ? gameDetails.rating.toFixed(1) : "Unavailable"}
                    </p>
                    <p>
                        <strong>Genres:</strong>{" "}
                        {gameDetails.genres || "Unavailable"}
                    </p>
                    <p>
                        <strong>Description:</strong>
                        <div className="scrollable-description">
                            {gameDetails.storyline || "Unavailable"}
                        </div>
                    </p>

                </div>
            </div>

            <div className="full-game-right">
                <div className="wishlist-collection-info">
                    <p>Add this game to your wishlist or collection!</p>                    
                    <button onClick={handleAddToCollection} className="btn-move-to-collection">Add to Collection</button>
                    <button onClick={handleAddToWishlist} className="btn-move-to-wishlist">Add to Wishlist</button>
                </div>
            </div>
        </div>
    );
};

export default GameDetailPage;
