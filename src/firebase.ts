// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCzS_34TKewrVJCAHKLoMy43w4UdIzJd5g',
  authDomain: 'vue-user-management-649ca.firebaseapp.com',
  projectId: 'vue-user-management-649ca',
  storageBucket: 'vue-user-management-649ca.firebasestorage.app',
  messagingSenderId: '675852474709',
  appId: '1:675852474709:web:8cdffea66696635a8537dc',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const storage = getStorage(app)
