/**
 * Configuração do Firebase
 * By Jaydee Guedes
 * MIT License 
 **/

/**
 * Configurações so Firebase
 * 
 * IMPORTANTE!
 * Troque os valores de 'firebaseConfig' pelos dados do SEU FIREBASE!
 **/
const firebaseConfig = {
    apiKey: "AIzaSyDlwbotbd_Wn8EsYa3w9HJt1R8Jjg4dqLw",
    authDomain: "frontendeiros-jayd.firebaseapp.com",
    projectId: "frontendeiros-jayd",
    storageBucket: "frontendeiros-jayd.appspot.com",
    messagingSenderId: "829641295649",
    appId: "1:829641295649:web:4211a50b7d80faca772060"
};

// Incializa o Firebase
firebase.initializeApp(firebaseConfig);

// Incializa o Firebase Authentication
const auth = firebase.auth();

// Define o provedor de autenticação
var provider = new firebase.auth.GoogleAuthProvider();