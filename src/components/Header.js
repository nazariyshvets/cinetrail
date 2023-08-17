import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import LanguageSelect from "./LanguageSelect";
import { storage, db } from "../firebaseConfig";
import { AuthContext } from "../contexts/AuthContext";
import { TrContext } from "../contexts/TrContext";
import { HeaderTr } from "../translations/translations";
import "../styles/Header.css";
import logo from "../images/small_logo.png";

function Header() {
  const [profileImage, setProfileImage] = useState({ name: "", path: "" });
  const [isMenuActive, setIsMenuActive] = useState(false);
  const { user } = useContext(AuthContext);
  const { langCode } = useContext(TrContext);

  async function loadProfileImage(imageName) {
    if (!imageName) {
      return;
    }

    try {
      const imageRef = ref(storage, `images/${imageName}`);
      const fullPath = await getDownloadURL(imageRef);

      setProfileImage({ name: imageName, path: fullPath });
    } catch (error) {
      console.error("Error loading profile image:", error);
    }
  }

  useEffect(() => {
    if (!user) {
      return;
    }

    const docRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      const selectedImage = snapshot.data()?.selectedImage || "";

      if (profileImage.name !== selectedImage) {
        loadProfileImage(selectedImage);
      }
    });

    return () => unsubscribe();
  }, [profileImage, user]);

  return (
    <header className="header">
      <Link to={user ? "/home" : "/"} className="header--logo--link">
        <img src={logo} className="header--logo" alt="logo" draggable="false" />
      </Link>
      <nav className={`header--nav ${isMenuActive ? "active" : ""}`}>
        {user ? (
          <>
            <Link to="/home">
              <i className="fa-solid fa-house"></i>&nbsp;
              {HeaderTr.home[langCode]}
            </Link>
            <Link to="/search">
              <i className="fa-solid fa-magnifying-glass"></i>&nbsp;
              {HeaderTr.search[langCode]}
            </Link>
            <Link to="/watchlist">
              <i className="fa-regular fa-bookmark"></i>&nbsp;
              {HeaderTr.watchlist[langCode]}
            </Link>
            <Link to="/profile" className="header--nav--profile">
              <img
                src={profileImage.path || logo}
                alt="profile"
                draggable="false"
              />
            </Link>
          </>
        ) : (
          <Link to="/login-signup">
            <i className="fa-solid fa-right-to-bracket"></i>&nbsp;
            {HeaderTr.logIn[langCode]}
          </Link>
        )}

        <LanguageSelect />
      </nav>
      <div
        className={`header--menu ${isMenuActive ? "active" : ""}`}
        onClick={() => setIsMenuActive((prevIsMenuActive) => !prevIsMenuActive)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    </header>
  );
}

export default Header;
