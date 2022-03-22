// Firebase
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

//Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZ70cdaIdr7-Od3fnhztu9aFLC4EOtSfQ",
  authDomain: "my-tennis-platform.firebaseapp.com",
  databaseURL: "https://my-tennis-platform-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "my-tennis-platform",
  storageBucket: "my-tennis-platform.appspot.com",
  messagingSenderId: "880323333265",
  appId: "1:880323333265:web:69ab96fa2058c4c5a74330"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);