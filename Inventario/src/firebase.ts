import {getFirestore} from "firebase/firestore";
import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey: "AIzaSyB9hUEk72Eg_CmU6BzyqVZ97xCimMSJ7gU",
  authDomain: "biblioteca-digital-4c006.firebaseapp.com",
  projectId: "biblioteca-digital-4c006",
  storageBucket: "biblioteca-digital-4c006.firebasestorage.app",
  messagingSenderId: "555305813280",
  appId: "1:555305813280:web:1e5395650022cc077c8345"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };