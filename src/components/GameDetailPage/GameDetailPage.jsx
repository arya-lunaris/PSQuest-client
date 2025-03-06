import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { gameShow } from "../../services/gameService";
import { saveGameFromIGDB } from "../../services/usergameService";
import Modal from "../../components/Modal/Modal";
import "./GameDetailPage.css";

const GameDetailPage = () => {
    const { user } = useContext(UserContext);
    const { gameId } = useParams();
    const [gameDetails, setGameDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
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

    const formatDisplayDate = (date) => {
        if (date === "Unavailable" || !date || isNaN(new Date(date))) return "Unavailable";
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const formatSubmitDate = (date) => {
        if (date === "Unavailable" || !date || isNaN(new Date(date))) return null;
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleAddToWishlist = async () => {
        try {
            const formattedGameDetails = {
                ...gameDetails,
                releaseDate: formatSubmitDate(gameDetails.releaseDate)
            };

            if (formattedGameDetails.releaseDate === "Unavailable") {
                formattedGameDetails.releaseDate = null;
            }

            await saveGameFromIGDB({ ...formattedGameDetails, status: "wishlist" });
            setModalMessage("Game added to wishlist!");
            setIsModalOpen(true);
        } catch (error) {
            console.error("Failed to add game to wishlist", error);
            setModalMessage("Failed to add game to wishlist.");
            setIsModalOpen(true);
        }
    };

    const handleAddToCollection = async () => {
        try {
            const formattedGameDetails = {
                ...gameDetails,
                releaseDate: formatSubmitDate(gameDetails.releaseDate)
            };

            if (formattedGameDetails.releaseDate === "Unavailable") {
                formattedGameDetails.releaseDate = null;
            }

            await saveGameFromIGDB({ ...formattedGameDetails, status: "collection" });
            setModalMessage("Game added to collection!");
            setIsModalOpen(true);
        } catch (error) {
            console.error("Failed to add game to collection", error);
            setModalMessage("Failed to add game to collection.");
            setIsModalOpen(true);
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
                        <strong>Release Date:</strong>
                        {` ${formatDisplayDate(gameDetails.releaseDate)}`}
                    </p>
                    <p>
                        <strong>Rating:</strong>
                        {gameDetails.rating !== "Unavailable" ? ` ${gameDetails.rating.toFixed(1)}` : " Unavailable"}
                    </p>
                    <p>
                        <strong>Genres:</strong>
                        {gameDetails.genres ? ` ${gameDetails.genres}` : " Unavailable"}
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
                    <div className="button-container">
                        <button onClick={handleAddToCollection} className="btn-move-to-collection">Add to Collection</button>
                        <button onClick={handleAddToWishlist} className="btn-move-to-wishlist">Add to Wishlist</button>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                message={modalMessage}
            />
        </div>
    );
};

export default GameDetailPage;
