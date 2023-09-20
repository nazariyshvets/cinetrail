import "css/Header.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { useWindowSize } from "usehooks-ts";
import LanguageSelect from "./LanguageSelect";
import HamburgerMenu from "./HamburgerMenu";
import { storage, db } from "firebaseConfig";
import useAuth from "hooks/useAuth";
import useTr from "hooks/useTr";
import { TABLET_WIDTH_THRESHOLD } from "constants/constants";
import { HeaderTr } from "translations/componentsTr";

interface NavigationLinksProps {
  user: User | null;
  profileImage: string;
}

const logo = "/images/small_logo.png";

function NavigationLinks({ user, profileImage }: NavigationLinksProps) {
  const { langCode } = useTr();

  return user ? (
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
        <img src={profileImage} alt="profile" draggable="false" />
      </Link>
    </>
  ) : (
    <Link to="/login-signup">
      <i className="fa-solid fa-right-to-bracket"></i>&nbsp;
      {HeaderTr.logIn[langCode]}
    </Link>
  );
}

function Header() {
  const [profileImage, setProfileImage] = useState({ name: "", path: "" });
  const [isMenuActive, setIsMenuActive] = useState(false);
  const { user } = useAuth();
  const { width: windowWidth } = useWindowSize();

  async function loadProfileImage(imageName: string) {
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
      const docData = snapshot.data();
      const selectedImage = docData?.selectedImage || "";

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
        <NavigationLinks user={user} profileImage={profileImage.path || logo} />

        <LanguageSelect />
      </nav>

      {windowWidth <= TABLET_WIDTH_THRESHOLD && (
        <HamburgerMenu
          isActive={isMenuActive}
          onClick={() =>
            setIsMenuActive((prevIsMenuActive) => !prevIsMenuActive)
          }
        />
      )}
    </header>
  );
}

export default Header;
