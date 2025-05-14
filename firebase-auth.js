import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile, updateEmail, EmailAuthProvider, reauthenticateWithCredential, sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

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

// Status Elm
const statusElm = document.getElementById('status');

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
            statusElm.textContent = "User Created & Signed In.";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("Error Code:", errorCode);
            console.log("Error Message:", errorMessage);
            statusElm.textContent = errorCode;
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
            statusElm.textContent = "User Signed In.";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("Error:", errorCode, errorMessage);
            statusElm.textContent = errorCode;
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
        if (user.photoURL !== null) {
            const profilePicElm = document.getElementById('profile-pic');
            profilePicElm.src = user.photoURL;
        }
        userInfoElm.innerHTML = `
            User Email: ${userEmail}<br>
            UID: ${uid}<br>
            Display Name: ${user.displayName}<br>
            Photo URL: ${user.photoURL}<br>
            Email Verified: ${user.emailVerified}
            `;
        restrcitedContentElm.style.display = 'block';
        statusElm.textContent = "User Signed In.";
        userProviderInfo();
    } else {
        // User is signed out
        console.log("State change signed out.");
        userInfoElm.textContent = `No User logged in.`;
        restrcitedContentElm.style.display = 'none';
        statusElm.textContent = "User Not Signed In.";
    }
});

const signoutElm = document.getElementById('signout');
signoutElm.addEventListener("click", function(e){
    // Sign out a signed in user.
    signOut(auth).then(() => {
        // Sign-out successful.
        console.log("User signed out");
        statusElm.textContent = "User Signed Out.";
    }).catch((error) => {
        // An error happened.
        console.error("Sign-out error:", error);
        statusElm.textContent = error.code;
    });
});

async function userProviderInfo() {
    const user = auth.currentUser;
    console.log("Current User:", user);
    const userInfoProvidersElm = document.getElementById('user-info-providers');
    let html = "";
    if (user !== null) {
        user.providerData.forEach((profile) => {
            html = html + `
                Sign-in Provider: ${profile.providerId}<br>
                Provider Specific UID: ${profile.uid}<br>
                Provider Display Name: ${profile.displayName}<br>
                Provider Email: ${profile.email}<br>
                Provider Photo URL: ${profile.photoURL}<br>
                ---end of provider---<br>
            `
        });
        userInfoProvidersElm.innerHTML = html;
    }
};

const updateProfileDisplayNameElm = document.getElementById('update-profile-displayname');
updateProfileDisplayNameElm.addEventListener("click", function(e){
    e.preventDefault();
    updateProfile(auth.currentUser, {
        displayName: document.getElementById('prfoile-update-displayName').value
            }).then(() => {
                // Profile updated!
                statusElm.textContent = "Display Name updated.";
                console.log("Display Name updated.");
            }).catch((error) => {
                // An error occurred
                statusElm.textContent = error.code;
                console.log(error)
            });
});

const updateProfilePhotoURLElm = document.getElementById('update-profile-photoURL');
updateProfilePhotoURLElm.addEventListener("click", function(e){
    e.preventDefault();
    updateProfile(auth.currentUser, {
        photoURL: document.getElementById('prfoile-update-photoURL').value
            }).then(() => {
                // Profile updated!
                statusElm.textContent = "Photo URL updated.";
                console.log("Photo URL updated.");
            }).catch((error) => {
                // An error occurred
                statusElm.textContent = error.code;
                console.log(error)
            });
});

// ********************
// Change primary email.
// Disabled because need to understand the workflow for this.
// ********************
// const updateProfileEmailElm = document.getElementById('update-profile-email');
// updateProfileEmailElm.addEventListener("click", function(e){
//     e.preventDefault();
//     const email = prompt("Current Email");
//     const password = prompt("Password");
//     const credential = EmailAuthProvider.credential(email, password);
//     reauthenticateWithCredential(auth.currentUser, credential)
//         .then(() => {
//             // User reauthenticated.
//             console.log("Reauthenticated.");
//             statusElm.textContent = "Reauthenticated.";
//             const newEmail = document.getElementById("prfoile-update-email").value;
//             updateEmail(auth.currentUser, newEmail).then(() => {
//                 // Email updated!
//                 console.log("Email update initiated.");
//                 statusElm.textContent = "Email update initated.";
//                 // Send verification email.
//                 sendEmailVerification(auth.currentUser).then(() => {
//                     // Email verification sent!
//                     console.log("Verification email sent. Click verification link to proceed.");
//                     statusElm.textContent = "Verification email sent. Click verification link to proceed.";
//                 });
//                 }).catch((error) => {
//                     // An error occurred
//                     console.log("Update email error.", error);
//                 statusElm.textContent = error.code;
//                 });
//         }).catch((error) => {
//             console.log("Reauthenticated error.", error);
//             statusElm.textContent = error.code;
//         });
// });

// BOOKMARK


// Do the below later.
// Update a user's primary email: https://firebase.google.com/docs/auth/web/manage-users#set_a_users_email_address
// Figue out how this flow works. Also look into FirebaseUI https://firebase.google.com/docs/auth/web/firebaseui

