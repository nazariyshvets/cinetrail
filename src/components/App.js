import { createBrowserRouter, RouterProvider } from "react-router-dom";
import WelcomePage from "../pages/WelcomePage";
import LoginSignupPage from "../pages/LoginSignupPage";
import HomePage from "../pages/HomePage";
import SearchPage from "../pages/SearchPage";
import GenrePage from "../pages/GenrePage";
import MoviePage from "../pages/MoviePage";
import ProfilePage from "../pages/ProfilePage";
import WatchlistPage from "../pages/WatchlistPage";
import PrivatePage from "../pages/PrivatePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <WelcomePage />,
  },
  {
    path: "/login-signup",
    element: <LoginSignupPage />,
  },
  {
    path: "/home",
    element: (
      <PrivatePage>
        <HomePage />
      </PrivatePage>
    ),
  },
  {
    path: "/search",
    element: (
      <PrivatePage>
        <SearchPage />
      </PrivatePage>
    ),
  },
  {
    path: "/genre",
    element: (
      <PrivatePage>
        <GenrePage />
      </PrivatePage>
    ),
  },
  {
    path: "/movie/:id",
    element: (
      <PrivatePage>
        <MoviePage />
      </PrivatePage>
    ),
  },
  {
    path: "/profile",
    element: (
      <PrivatePage>
        <ProfilePage />
      </PrivatePage>
    ),
  },
  {
    path: "/watchlist",
    element: (
      <PrivatePage>
        <WatchlistPage />
      </PrivatePage>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
