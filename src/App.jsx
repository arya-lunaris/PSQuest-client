import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import CollectionPage from "./components/CollectionPage/CollectionPage";
import FullGamePage from "./components/FullGamePage/FullGamePage";
import HomePage from "./components/HomePage/HomePage";
import LoginPage from "./components/LoginPage/LoginPage";
import ProfilePage from "./components/ProfilePage/ProfilePage";
import SearchPage from "./components/SearchPage/SearchPage";
import SignupPage from "./components/SignupPage/SignupPage";
import WishlistPage from "./components/WishlistPage/WishlistPage";
import GameDetailPage from "./components/GameDetailPage/GameDetailPage";
import './index.css'

function App() {
  const location = useLocation();

  React.useEffect(() => {
    if (
      location.pathname === "/signup" ||
      location.pathname === "/login" ||
      location.pathname.startsWith("/profile")
    ) {
      document.body.classList.add("auth-page");
    } else if (location.pathname.startsWith("/game")) {
      document.body.classList.add("game-page");
    } else {
      document.body.classList.remove("auth-page");
      document.body.classList.remove("game-page");
    }
  }, [location]);
  
  const shouldDisplayFooter = !(
    location.pathname === '/signup' ||
    location.pathname === '/login' ||
    location.pathname.startsWith('/profile') ||
    location.pathname.startsWith('/game')
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="content-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/game/:usergameId" element={<FullGamePage />} />
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/game-detail/:gameId" element={<GameDetailPage />} />
        </Routes>
      </div>
      {shouldDisplayFooter && (
        <footer className="text-center text-gray-600 py-4">
          <p>&copy; 2025 PSQuest. All rights reserved.</p>
        </footer>
      )}
    </div>
  );
}

export default App;
