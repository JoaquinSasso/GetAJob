// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
	initializeFirestore,
	persistentLocalCache,
	persistentMultipleTabManager,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1ZTXTVCD5PPuSgc0w9uuHkKNLQbVpAqw",
  authDomain: "founderquest.firebaseapp.com",
  projectId: "founderquest",
  storageBucket: "founderquest.firebasestorage.app",
  messagingSenderId: "227366168227",
  appId: "1:227366168227:web:788cdcf274d21d54528116"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Inicializamos Firestore con caché persistente en IndexedDB.
// El tab manager permite que si abrís la app en varias pestañas,
// todas compartan el mismo caché sin pisarse.
export const db = initializeFirestore(app, {
	localCache: persistentLocalCache({
		tabManager: persistentMultipleTabManager(),
	}),
});

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
