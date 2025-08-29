import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';
import { useState } from 'react';

export const useFirebaseUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadFile = async (file, folder = 'images') => {
    try {
      setIsLoading(true);
      setError(null);
      
      const fileName = `${Date.now()}-${file.name}`;
      const storageRef = ref(storage, `${folder}/${fileName}`);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { uploadFile, isLoading, error };
};