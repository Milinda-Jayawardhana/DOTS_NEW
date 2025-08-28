// filepath: e:\MERN\DOTS\DOTS_TShirt\DOTS_NEW\backend\utils\fileUpload.js
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const storage = require('../config/firebaseConfig');

const uploadFileToFirebase = async (file, path) => {
  try {
    const storageRef = ref(storage, `${path}/${Date.now()}-${file.originalname}`);
    const snapshot = await uploadBytes(storageRef, file.buffer);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

module.exports = { uploadFileToFirebase };