import "css/ImageUploader.css";
import { useState, ChangeEvent } from "react";
import { doc, setDoc, arrayUnion } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { nanoid } from "nanoid";
import { useAlert } from "react-alert";
import FoldedButton from "./FoldedButton";
import { db, storage } from "firebaseConfig";
import useAuth from "hooks/useAuth";
import useTr from "hooks/useTr";
import { ImageUploaderTr } from "translations/componentsTr";

interface ImageUploaderProps {
  onClose: () => void;
}

const maxImageSize = 1 * 1024 * 1024;

function ImageUploader({ onClose }: ImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const { langCode } = useTr();
  const alert = useAlert();

  async function handleImageUpload() {
    if (!file || !user || isUploading) {
      return;
    }
    if (file.size > maxImageSize) {
      alert.info(ImageUploaderTr.fileExceedsLimit[langCode]);
      return;
    }

    setIsUploading(true);

    try {
      const storageRef = ref(storage, `images/${nanoid()}`);
      const snapshot = await uploadBytes(storageRef, file);
      const imageName = snapshot.metadata.name;
      const docRef = doc(db, "users", user.uid);

      await setDoc(
        docRef,
        {
          images: arrayUnion(imageName),
          selectedImage: imageName,
        },
        { merge: true }
      );

      setFile(null);
      alert.success(ImageUploaderTr.imageUploaded[langCode]);
      onClose();
    } catch (error) {
      alert.error(ImageUploaderTr.error[langCode]);
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;

    if (!files || files.length <= 0) {
      return;
    }

    const selectedFile = files[0];

    if (selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
    } else {
      alert.error(ImageUploaderTr.invalidFileType[langCode]);
      console.error(ImageUploaderTr.invalidFileType[langCode]);
    }
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
