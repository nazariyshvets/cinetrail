import { useState, useContext, useEffect, useCallback } from "react";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import Header from "../components/Header";
import SnakeButton from "../components/SnakeButton";
import ImageUploader from "../components/ImageUploader";
import { db, storage } from "../firebaseConfig";
import { AuthContext } from "../contexts/AuthContext";
import { TrContext } from "../contexts/TrContext";
import { ProfilePageTr } from "../translations/translations";
import "../styles/ProfilePage.css";
import logo from "../images/big_logo.png";

function ProfilePage() {
  const [images, setImages] = useState([]);
  const [isImageUploaderActive, setIsImageUploaderActive] = useState(false);
  const { user, signOutUser } = useContext(AuthContext);
  const { langCode } = useContext(TrContext);

  function toggleImageUploader() {
    setIsImageUploaderActive(
      (prevIsImageUploaderActive) => !prevIsImageUploaderActive
    );
  }

  async function handleSelectImage(imageName) {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    let imagesData = docSnap.data().images;

    imagesData = imagesData.map((imageData) => ({
      ...imageData,
      isSelected: imageData.name === imageName,
    }));

    try {
      await setDoc(docRef, { images: imagesData }, { merge: true });
      setImages((prevImages) =>
        prevImages.map((image) => ({
          ...image,
          isSelected: image.name === imageName,
        }))
      );
    } catch (error) {
      console.error("Error updating image selection:", error);
    }
  }

  const fetchImages = useCallback(async () => {
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      const imagesData = docSnap.data().images || [];
      const imagesDataPromises = imagesData.map(async (image) => {
        const imageRef = ref(storage, `images/${image.name}`);
        const fullPath = await getDownloadURL(imageRef);
        return { ...image, path: fullPath };
      });

      const imagesDataWithUrls = await Promise.all(imagesDataPromises);
      setImages(imagesDataWithUrls);
    } catch (error) {
      console.error("Error retrieving images:", error);
    }
  }, [user.uid]);

  useEffect(() => {
    const docRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) =>
        snapshot.data().images.length > images.length && fetchImages()
    );

    return () => unsubscribe();
  }, [fetchImages, images, user.uid]);

  const sidebarImages = images.map((image, index) => (
    <div
      key={index}
      className={`profile-page--sidebar--img-wrapper ${
        image.isSelected ? "selected" : ""
      }`}
      onClick={() => handleSelectImage(image.name)}
    >
      <img src={image.path} alt="profile" draggable="false" />
    </div>
  ));
  const selectedImage = images.find((image) => image.isSelected)?.path;

  return (
    <div className="profile-page">
      <Header />
      <section className="profile-page--sidebar-main">
        <section className="profile-page--sidebar">{sidebarImages}</section>
        <section className="profile-page--main">
          <div className="profile-page--logout" onClick={signOutUser}>
            <i className="fa-solid fa-right-from-bracket icon"></i>
            <p className="profile-page--logout--tooltip">
              {ProfilePageTr.logOut[langCode]}
            </p>
          </div>
          <div className="profile-page--profile-img-wrapper">
            <img src={selectedImage || logo} alt="profile" draggable="false" />
          </div>
          <p className="profile-page--username">{user.email}</p>
          <div className="profile-page--buttons">
            <SnakeButton
              text={ProfilePageTr.uploadImage[langCode]}
              onClick={toggleImageUploader}
            />
          </div>
        </section>

        {isImageUploaderActive && (
          <ImageUploader onClose={() => setIsImageUploaderActive(false)} />
        )}
      </section>
    </div>
  );
}

export default ProfilePage;
