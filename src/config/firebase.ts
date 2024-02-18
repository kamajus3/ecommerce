import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyAdWe2HJj1PXzNovLzm_sGAzGWcC71Q0to',
  authDomain: 'raciuscareangola.firebaseapp.com',
  projectId: 'raciuscareangola',
  storageBucket: 'raciuscareangola.appspot.com',
  messagingSenderId: '1001132858853',
  appId: '1:1001132858853:web:9db27a9af6944c86fbe30c',
  measurementId: 'G-VESQJ89YJ3',
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const database = getDatabase(app)
