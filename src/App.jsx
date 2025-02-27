import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
// import CollectionPage from "./components/CollectionPage/CollectionPage";
// import FullGamePage from "./components/FullGamePage/FullGamePage";
// import HomePage from "./components/HomePage/HomePage";
import LoginPage from "./components/LoginPage/LoginPage";
import ProfilePage from "./components/ProfilePage/ProfilePage";
// import SearchPage from "./components/SearchPage/SearchPage";
import SignupPage from "./components/SignupPage/SignupPage";
// import WishlistPage from "./components/WishlistPage/WishlistPage";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<HomePage />} /> */}
        {/* <Route path="/search" element={<SearchPage />} /> */}
        {/* <Route path="/game/:gameId" element={<FullGamePage />} /> */}
        {/* <Route path="/collection" element={<CollectionPage />} /> */}
        {/* <Route path="/wishlist" element={<WishlistPage />} /> */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
      </Routes>
    </>
  );
}

export default App;
