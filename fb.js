/**
 * Configuração do firebase para site da Jaydee
 */
const firebaseConfig = {
    apiKey: "AIzaSyDlwbotbd_Wn8EsYa3w9HJt1R8Jjg4dqLw",
    authDomain: "frontendeiros-jayd.firebaseapp.com",
    projectId: "frontendeiros-jayd",
    storageBucket: "frontendeiros-jayd.appspot.com",
    messagingSenderId: "829641295649",
    appId: "1:829641295649:web:4211a50b7d80faca772060"
  };

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Importa o Authentication.
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
// Your web app's Firebase configuration
// Initialize Firebase
const fbapp = initializeApp(firebaseConfig);
// Especifica o provedor de autenticação.
const provider = new GoogleAuthProvider();

const auth = getAuth();

signInWithPopup(auth, provider)

var user;

onAuthStateChanged(auth, (user) => {
    if (user) {
        sessionStorage.userData = JSON.stringify({
            name: user.displayName,
            email: user.email,
            photo: user.photoURL,
            uid: user.uid
        })
    } else {
        delete sessionStorage.userData
    }
});