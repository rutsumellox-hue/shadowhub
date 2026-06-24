// === DÉBUT FICHIER : assets/js/firebase-init.js ===
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "REMPLACE_PAR_TA_CLE",
    authDomain: "ton-projet.firebaseapp.com",
    projectId: "ton-projet",
    storageBucket: "ton-projet.appspot.com",
    messagingSenderId: "123456789",
    appId: "REMPLACE_PAR_TON_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// === FIN FICHIER ===