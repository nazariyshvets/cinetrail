import { useState, useContext } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { nanoid } from "nanoid";
import FoldedButton from "./FoldedButton";
import { db, storage } from "../firebaseConfig";
import { AuthContext } from "../contexts/AuthContext";
import { TrContext } from "../contexts/TrContext";
import { ImageUploaderTr } from "../translations/translations";
import "../styles/ImageUploader.css";

const maxImageSize = 1 * 1024 * 1024;

function ImageUploader({ onClose }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useContext(AuthContext);
  const { langCode } = useContext(TrContext);

  async function handleImageUpload() {
    if (isUploading) {
      return;
    }
    if (file.size > maxImageSize) {
      alert(ImageUploaderTr.fileExceedsLimit[langCode]);
      return;
    }

    setIsUploading(true);

    try {
      const storageRef = ref(storage, `images/${nanoid()}`);
      const snapshot = await uploadBytes(storageRef, file);
      const imageName = snapshot.metadata.name;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      const imagesData = docSnap.data().images || [];

      const updatedImagesData = imagesData.map((imageData) => ({
        ...imageData,
        isSelected: false,
      }));

      await setDoc(
        docRef,
        {
          images: [...updatedImagesData, { name: imageName, isSelected: true }],
        },
        { merge: true }
      );

      setFile(null);
      alert(ImageUploaderTr.imageUploaded[langCode]);
      onClose();
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(ImageUploaderTr.error[langCode]);
    } finally {
      setIsUploading(false);
    }
  }

  function handleImageChange(event) {
    const file = event.target.files[0];
    setFile(file);
  }

  function getFileName() {
    if (file) {
      const { name: fileName, size } = file;
      const fileSize = (size / 1000).toFixed(2);
      return `${fileName} - ${fileSize}KB`;
    }

    return "";
  }

  const fileName = getFileName();

  return (
    <div className="image-uploader">
      <form method="post" className="image-uploader--form">
        <span className="image-uploader--close" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </span>
        <div className="image-uploader--input-wrapper">
          <input
            type="file"
            accept="image/*"
            id="file"
            className="image-uploader--input"
            onChange={handleImageChange}
          />
          <label htmlFor="file">
            <i className="fa-solid fa-cloud-arrow-up"></i>
            <p className="image-uploader--file-name">{fileName}</p>
          </label>
        </div>
        {file && (
          <FoldedButton
            text={ImageUploaderTr.upload[langCode]}
            onClick={handleImageUpload}
          />
        )}
      </form>
    </div>
  );
}

export default ImageUploader;
