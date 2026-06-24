// === DÉBUT FICHIER : assets/js/auth.js ===
import { auth } from "./firebase-init.js";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

export function initAuth() {
    onAuthStateChanged(auth, (user) => {
        const publicLinks = document.querySelectorAll('[data-auth]');
        publicLinks.forEach(link => {
            if (link.dataset.auth === "in" && user) link.style.display = "inline";
            if (link.dataset.auth === "out" && !user) link.style.display = "inline";
        });
    });
}

export async function signup(email, password, username) {
    try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(cred.user);
        alert("Compte créé ! Vérifie ton email.");
        return cred.user;
    } catch (e) {
        alert("Erreur : " + e.message);
    }
}

export async function login(email, password) {
    try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "dashboard.html";
    } catch (e) {
        alert("Erreur connexion : " + e.message);
    }
}

export async function logout() {
    await signOut(auth);
    window.location.href = "cyberhub.html";
}
// === FIN FICHIER ===