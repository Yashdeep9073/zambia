import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject 
} from "firebase/storage";
import { storage } from "../firebase";

// --- STORAGE SERVICE ---

export const uploadFile = async (
  file: File, 
  userId: string, 
  folder: string, 
  onProgress?: (progress: number) => void
) => {
  try {
    const storageRef = ref(storage, `${folder}/${userId}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise<string>((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(progress);
        },
        (error) => {
          console.error("Upload failed:", error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const deleteFile = async (fileUrl: string) => {
  try {
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};
