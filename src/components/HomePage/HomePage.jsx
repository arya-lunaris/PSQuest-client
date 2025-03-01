import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";

const HomePage = () => {
  const { user } = useContext(UserContext);

  return (
    <div>
      <header>
        <h1>Welcome to PSQuest</h1>
        <p>Your journey to discover and track your favourite PlayStation games!</p>
      </header>

      {!user ? (
        <section>
          <h2>Sign Up Now!</h2>
          <p>Join PSQuest and start discovering and tracking your PlayStation games today!</p>
          <button>
            <Link to="/signup">Sign Up</Link>
          </button>
        </section>
      ) : (
        <>
          <nav>
            <h2>Navigate</h2>
            <ul>
              <li><Link to="/collection">Your Games</Link></li>
              <li><Link to={`/profile/${user.id}`}>Your Profile</Link></li>
            </ul>
          </nav>

          <section>
            <h2>See What's Out There!</h2>
            <p>Explore the best games on PlayStation. Track your progress and share your thoughts!</p>
            <button>
              <Link to="/search">Start Looking 👀</Link>
            </button>
          </section>
        </>
      )}

      <footer>
        <p>&copy; 2025 PSQuest. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
