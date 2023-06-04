import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  query,
  orderBy,
  limit,
  where,
  onSnapshot,
  serverTimestamp,
  addDoc,
  deleteDoc,
} from '@firebase/firestore';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: 'AIzaSyBTFHjEpMJ7wZGM--hxjr8MrNnq8pZU6zc',
  authDomain: 'color-pallete-app-e1a21.firebaseapp.com',
  databaseURL: 'https://your-database-name.firebaseio.com',
  projectId: 'color-pallete-app-e1a21',
  storageBucket: 'color-pallete-app-e1a21.appspot.com',
  messagingSenderId: '817401085747',
  appId:
    Platform.OS === 'android'
      ? '1:817401085747:android:614d35cf911d1f2287c846'
      : '1:817401085747:ios:025e2f6634d12cab87c846',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export {
  app,
  auth,
  db,
  doc,
  collection,
  setDoc,
  getDoc,
  query,
  orderBy,
  limit,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  serverTimestamp,
};
