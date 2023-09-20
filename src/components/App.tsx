import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import AppLoading from "./AppLoading";
import MainPage from "pages/MainPage";
import WelcomePage from "pages/WelcomePage";
import LoginSignupPage from "pages/LoginSignupPage";
import HomePage from "pages/HomePage";
import SearchPage from "pages/SearchPage";
import GenrePage from "pages/GenrePage";
import MoviePage from "pages/MoviePage";
import ProfilePage from "pages/ProfilePage";
import WatchlistPage from "pages/WatchlistPage";
import PrivatePage from "pages/PrivatePage";
import useAuth from "hooks/useAuth";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />}>
          <Route index element={<WelcomePage />} />
          <Route path="login-signup" element={<LoginSignupPage />} />
          <Route
            path="home"
            element={
              <PrivatePage>
                <HomePage />
              </PrivatePage>
            }
          />
          <Route
            path="search"
            element={
              <PrivatePage>
                <SearchPage />
              </PrivatePage>
            }
          />
          <Route
            path="genre"
            element={
              <PrivatePage>
                <GenrePage />
              </PrivatePage>
            }
          />
          <Route
            path="movie/:id"
            element={
              <PrivatePage>
                <MoviePage />
              </PrivatePage>
            }
          />
          <Route
            path="profile"
            element={
              <PrivatePage>
                <ProfilePage />
              </PrivatePage>
            }
          />
          <Route
            path="watchlist"
            element={
              <PrivatePage>
                <WatchlistPage />
              </PrivatePage>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace={true} />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  const { isLoading } = useAuth();

  return isLoading ? <AppLoading /> : <Router />;
}

export default App;
