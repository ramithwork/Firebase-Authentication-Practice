import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

// Config for Firebase project.
const firebaseConfig = {
    apiKey: "AIzaSyBJY1EQdcG_JpqIkoYuw2ho5Rh2WdlFT60",
    authDomain: "fb-js-crud-module-test.firebaseapp.com",
    databaseURL: "https://fb-js-crud-module-test-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "fb-js-crud-module-test",
    storageBucket: "fb-js-crud-module-test.firebasestorage.app",
    messagingSenderId: "815488085921",
    appId: "1:815488085921:web:9d8129abf53a059e43e5e0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

const signupElm = document.getElementById('signup');
signupElm.addEventListener("click", function(e) {
    e.preventDefault();
    // Get email and password values from input fields
    const email = document.getElementById('email-signup').value;
    const password = document.getElementById('password-signup').value;
    // Sign up new user with Email & Password.
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            console.log("New user signed up:", user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("Error:", errorCode, errorMessage);
        });
});

const signinElm = document.getElementById('signin');
signinElm.addEventListener("click", function(e) {
    e.preventDefault();
    // Get email and password values from input fields
    const email = document.getElementById('email-signin').value;
    const password = document.getElementById('password-signin').value;
    // Sign in user with Email & Password.
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log("Existing user signed in:", user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("Error:", errorCode, errorMessage);
        });
});

// Set an authentication state observer and get user data
onAuthStateChanged(auth, (user) => {
    const userInfoElm = document.getElementById('user-info');
    const restrcitedContentElm = document.getElementById('restrcited-content');
    if (user) {
        // User is signed in
        const uid = user.uid;
        const userEmail = user.email;
        console.log("State change signed in: ", user);
        userInfoElm.textContent = `User Email: ${userEmail}, UID: ${uid}`;
        restrcitedContentElm.style.display = 'block';
    } else {
        // User is signed out
        console.log("State change signed out.");
        userInfoElm.textContent = `No User logged in.`;
        restrcitedContentElm.style.display = 'none';
    }
});

const signoutElm = document.getElementById('signout');
signoutElm.addEventListener("click", function(e){
    // Sign out a signed in user.
    signOut(auth).then(() => {
        // Sign-out successful.
        console.log("User signed out");
    }).catch((error) => {
        // An error happened.
        console.error("Sign-out error:", error);
    });
});