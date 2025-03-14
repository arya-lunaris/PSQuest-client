import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import './HomePage.css';

const HomePage = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="text-center mt-12 mb-8">
        <h1 className="text-3xl text-gray-900">PSQuest</h1>
        <p className="text-lg text-gray-600 mt-2">Your journey to discover and track your favourite PlayStation games!</p>

        <div className="image-container my-8">
          <img
            src="https://imgur.com/Thz1Tp7.png"
            alt="PlayStation Games"
            className="home-image"
          />
        </div>
      </header>

      {!user ? (
        <section className="text-center mb-8" style={{ marginTop: '-90px' }}>
          <h2 className="text-2xl text-gray-800">Sign Up Now!</h2>
          <p className="text-gray-700 mt-2 mb-4">Join PSQuest and start tracking your PlayStation games today!</p>
          <div className="flex justify-center space-x-4">
            <Link to="/signup">
              <button className="btn-thin">Sign Up</button>
            </Link>
            <Link to="/login">
              <button className="btn-thin">Login</button>
            </Link>
          </div>
        </section>

      ) : (

        <>
          <section className="text-center mb-8 section-two">
            <h2 className="text-2xl text-gray-800">See What's Out There</h2>
            <p className="text-gray-700 mt-2 mb-4">Explore the best games on PlayStation!</p>
            <img
              src="https://imgur.com/JY5az6D.png"
              alt="PlayStation Games"
              className="games-image"
            />
            <Link to="/search">
              <button className="btn-thin">Start Looking</button>
            </Link>
          </section>

          <nav className="mb-8 text-center section-three">
            <h2 className="text-2xl text-gray-800">Navigate</h2>
            <p className="text-gray-700 mt-2 mb-4">See your collection and update your profile!</p>
            <img
              src="https://imgur.com/A1d7QD0.png"
              alt="PlayStation Games"
              className="collection-image"
            />
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/collection" className="btn-thin">Your Games</Link>
              </li>
              <li>
                <Link to={`/profile/${user.id}`} className="btn-thin">Your Profile</Link>
              </li>
            </ul>
          </nav>

        </>
      )}
    </div>
  );
};

export default HomePage;
