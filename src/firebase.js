import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAWQjELVQPvs3ssddWUcyEV90yBulE_wI8',
  authDomain: 'gymfit-notes.firebaseapp.com',
  projectId: 'gymfit-notes',
  storageBucket: 'gymfit-notes.firebasestorage.app',
  messagingSenderId: '150681008302',
  appId: '1:150681008302:web:041c300a130384f96b553f',
  measurementId: 'G-3N7K5GW0E0',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
