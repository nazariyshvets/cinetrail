import "css/ProfilePage.css";
import { useState, useEffect, useCallback } from "react";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import SnakeButton from "components/SnakeButton";
import ImageUploader from "components/ImageUploader";
import { db, storage } from "firebaseConfig";
import useAuth from "hooks/useAuth";
import useTr from "hooks/useTr";
import useDocumentTitle from "hooks/useDocumentTitle";
import { ProfilePageTr } from "translations/pagesTr";

function ProfilePage() {
  const [images, setImages] = useState<{ name: string; path: string }[]>([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [isImageUploaderActive, setIsImageUploaderActive] = useState(false);
  const { user, signOutUser } = useAuth();
  const { langCode } = useTr();

  useDocumentTitle(ProfilePageTr.title[langCode]);

  async function handleSelectImage(imageName: string) {
    if (!user) {
      return;
    }

    const docRef = doc(db, "users", user.uid);

    try {
      await setDoc(docRef, { selectedImage: imageName }, { merge: true });
      setSelectedImage(imageName);
    } catch (error) {
      console.error("Error updating image selection:", error);
    }
  }

  const fetchData = useCallback(async () => {
    if (!user) {
      return;
    }

    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      const docData = docSnap.data();
      const imagesData = docData?.images || [];
      const selectedImageData = docData?.selectedImage || "";
      const imagesDataPromises = imagesData.map(async (image: string) => {
        const imageRef = ref(storage, `images/${image}`);
        const fullPath = await getDownloadURL(imageRef);
        return { name: image, path: fullPath };
      });
      const imagesDataWithUrls = await Promise.all(imagesDataPromises);

      setImages(imagesDataWithUrls);
      setSelectedImage(selectedImageData);
    } catch (error) {
      console.error("Error retrieving images:", error);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const docRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) =>
        snapshot.data()?.images.length !== images.length && fetchData()
    );

    return () => unsubscribe();
  }, [fetchData, images, user]);

  const sidebarImages = images.map(({ name, path }) => (
    <div
      key={name}
      className={`profile-page--sidebar--img-wrapper ${
        name === selectedImage ? "selected" : ""
      }`}
      onClick={() => handleSelectImage(name)}
    >
      <img src={path} alt="profile" draggable="false" />
    </div>
  ));
  const selectedImageUrl =
    images.find((image) => image.name === selectedImage)?.path || "";

  return (
    <div className="profile-page">
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
            <img
              src={selectedImageUrl || "/images/big_logo.png"}
              alt="profile"
              draggable="false"
            />
          </div>

          <p className="profile-page--username">{user?.email}</p>

          <div className="profile-page--buttons">
            <SnakeButton
              text={ProfilePageTr.uploadImage[langCode]}
              onClick={() => setIsImageUploaderActive(true)}
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
