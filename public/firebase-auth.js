import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile, updateEmail, EmailAuthProvider, reauthenticateWithCredential, sendEmailVerification, updatePassword, sendPasswordResetEmail, deleteUser, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

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

// Sign Up.
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
            // Send verification email
            sendEmailVerification(auth.currentUser).then(() => {
                // Email verification sent!
                console.log("New user signed up. Verification email sent:", user);
                statusElm.textContent = "User Created & Signed In. Verification email sent";
            })
            .catch((error) => {
                console.log("sendEmailVerification error", error.code);
            });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("Error Code:", errorCode);
            console.log("Error Message:", errorMessage);
            statusElm.textContent = errorCode;
        });
});

// Sign In.
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

// Sign Out.
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

// Info for all providers.
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

// Update displayName
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

// Update profile photo URL.
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

// Change primary email.
const updateProfileEmailElm = document.getElementById('update-profile-email');
updateProfileEmailElm.addEventListener("click", function(e){
    e.preventDefault();
    const newEmail = document.getElementById('prfoile-update-email').value;
    // 👇 Call this when user clicks "Change Email"
    async function changeEmailAddress(currentPassword) {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("No user is signed in.");
        }
        try {
            // 1. Re-authenticate the user
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);
            console.log("Re-authentication successful.");
            statusElm.textContent = "Re-authentication successful.";

            // 2. Update the email
            // IMPORTANT!!!: Uncheck email enumeration protection
            // Authentication > Settings > User Actions
            // Enumeration Docs: https://firebase.google.com/docs/auth/web/password-auth#enumeration-protection
            await updateEmail(user, newEmail);
            statusElm.textContent = "Email change successful.";

            // 3. Send verification to the new email
            await sendEmailVerification(user);
            statusElm.textContent = "Verification email sent.";
            console.log("Email updated. Verification email sent.");
        } catch (error) {
            console.error("Error changing email:", error);
            alert(error.message); // For UI feedback
        }
    };
    const currentPassword = prompt("Password");
    changeEmailAddress(currentPassword);
});

// Update Password.
const updatePasswordElm = document.getElementById("update-password");
updatePasswordElm.addEventListener("click", function(e){
    e.preventDefault();
    const newPassword = document.getElementById("new-password").value;
    async function updatePasswordProcess() {
        try {
            const user = auth.currentUser;

            // 0. Get login info
            const currentEmail = prompt("Current Email");
            const currentPassword = prompt("Current Password");

            // 1. Re-authenticate the user
            const credential = EmailAuthProvider.credential(currentEmail, currentPassword);
            await reauthenticateWithCredential(user, credential);
            console.log("Re-authentication successful.");
            statusElm.textContent = "Re-authentication successful.";

            // 2. Update password
            await updatePassword(user, newPassword).then(() => {
                statusElm.textContent = "Password change successful.";
                console.log("Password change successful.");
            }).catch((error) => {
                statusElm.textContent = error.code;
            });
        } catch (error) {
            console.error("Error changing password:", error);
            alert(error.message); // For UI feedback
        }
    };
    updatePasswordProcess();
});

// Send password reset email.
const sendPasswordResetEmailElm = document.getElementById("send-password-reset-email");
sendPasswordResetEmailElm.addEventListener("click", function(e){
    e.preventDefault();
    const email = document.getElementById("password-reset-email").value;
    sendPasswordResetEmail(auth, email).then(() => {
        // Password reset email sent!
        console.log("Password reset email sent.");
        statusElm.textContent = "Password reset email sent.";
    })
    .catch((error) => {
        console.log(error.code);
        statusElm.textContent = error.code;
    });
});

// Delete User
const deleteUserElm = document.getElementById("delete-user");
deleteUserElm.addEventListener("click", function(e){
    const deleteConfirmation = prompt("Type YES to delete");
    if (deleteConfirmation === "YES") {
        async function deleteUserProcess() {
            try {
                const user = auth.currentUser;

                // 0. Get login info
                const currentEmail = prompt("Current Email");
                const currentPassword = prompt("Current Password");

                // 1. Re-authenticate the user
                const credential = EmailAuthProvider.credential(currentEmail, currentPassword);
                await reauthenticateWithCredential(user, credential);
                console.log("Re-authentication successful.");
                statusElm.textContent = "Re-authentication successful.";

                // 2. Delete User
                await deleteUser(user).then(() => {
                    statusElm.textContent = "User Delete successful.";
                    console.log("User Delete successful.");
                    signoutElm.click();
                }).catch((error) => {
                    statusElm.textContent = error.code;
                    console.log(error.code);
                });
            } catch (error) {
                console.error("Error deleteing user:", error);
                alert(error.message); // For UI feedback
            }
        };
        deleteUserProcess();
    } else {
        console.log("Did not type YES to delete user.");
        statusElm.textContent = "Did not type YES to delete user.";
        return;
    }
});

// Authenticate with Firebase Using Email Link
// *******************************************
// Didn't look into it too much because it isn't widely used. But something worth looking into later. https://firebase.google.com/docs/auth/web/email-link-auth

// Google Provider
// Docs: https://firebase.google.com/docs/auth/web/google-signin
const provider = new GoogleAuthProvider();
// Popup
const googleSigninPopupElm = document.getElementById("google-signin-popup");
googleSigninPopupElm.addEventListener("click", function(e){
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // IdP data available using getAdditionalUserInfo(result)
            console.log(`User ${user.email} signed in`);
            statusElm.textContent = `User ${user.email} signed in`;
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            console.log("errorCode:", errorCode);
            console.log("error.customData.email", email);
            statusElm.textContent = errorCode;
        });
});
// ********************
// Redirect 
// ********************
// When using signInWithRedirect, getRedirectResult doesn't return a value to the result object. Research suggests this won't be an issue when hosted on a subdomain of firebaseapp.com. Will need to look into this farther.


// BOOKMARK
// Authenticate Using Google with JavaScript: https://firebase.google.com/docs/auth/web/google-signin

// Wrapping up authentication at this point because I have gained enough knowledge to start integrating auth into apps. 