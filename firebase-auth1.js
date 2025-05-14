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
     const email = document.getElementById('email-signup').value;
     const password = document.getElementById('password-signup').value;
     createUserWithEmailAndPassword(auth, email, password)
         .then((userCredential) => {
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
     const email = document.getElementById('email-signin').value;
     const password = document.getElementById('password-signin').value;
     signInWithEmailAndPassword(auth, email, password)
         .then((userCredential) => {
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

 onAuthStateChanged(auth, (user) => {
     const userInfoElm = document.getElementById('user-info');
     const restrcitedContentElm = document.getElementById('restrcited-content');
     if (user) {
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
         console.log("State change signed out.");
         userInfoElm.textContent = `No User logged in.`;
         restrcitedContentElm.style.display = 'none';
         statusElm.textContent = "User Not Signed In.";
     }
 });

 const signoutElm = document.getElementById('signout');
 signoutElm.addEventListener("click", function(e){
     signOut(auth).then(() => {
         console.log("User signed out");
         statusElm.textContent = "User Signed Out.";
     }).catch((error) => {
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
                 statusElm.textContent = "Display Name updated.";
                 console.log("Display Name updated.");
             }).catch((error) => {
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
                 statusElm.textContent = "Photo URL updated.";
                 console.log("Photo URL updated.");
             }).catch((error) => {
                 statusElm.textContent = error.code;
                 console.log(error)
             });
 });

 const updateProfileEmailElm = document.getElementById('update-profile-email');
 updateProfileEmailElm.addEventListener("click", function(e){
     e.preventDefault();
     const currentEmail = prompt("Current Email");
     const password = prompt("Password");
     const newEmailInput = document.getElementById("prfoile-update-email");
     const newEmail = newEmailInput.value;

     if (!currentEmail || !password || !newEmail) {
         statusElm.textContent = "Please provide current email, password, and the new email.";
         return;
     }

     const credential = EmailAuthProvider.credential(currentEmail, password);

     reauthenticateWithCredential(auth.currentUser, credential)
         .then(() => {
             // User reauthenticated.
             console.log("User reauthenticated.");
             statusElm.textContent = "Reauthenticated. Now sending verification email to: " + newEmail;

             // Send verification email to the *new* email address.
             sendEmailVerification(auth.currentUser, {
                 handleCodeInApp: true, // Optional: specify how to handle the code
                 url: 'https://ramithwork.github.io/Firebase-Authentication-Practice/'
                 // You can also customize the email further with 'url' etc.
             }).then(() => {
                 // Verification email sent.
                 console.log(`Verification email sent to ${newEmail}. Instruct user to check their inbox.`);
                 statusElm.textContent = `Verification email sent to ${newEmail}. Please check your inbox and click the link to verify. After verification, you may need to sign in again for the change to fully reflect.`;
                 // Optionally clear the input field after sending verification
                 newEmailInput.value = "";
             }).catch((error) => {
                 console.error("Error sending verification email:", error);
                 statusElm.textContent = `Error sending verification email: ${error.code}`;
             });
         })
         .catch((error) => {
             console.error("Reauthentication error:", error);
             statusElm.textContent = `Reauthentication error: ${error.code}`;
         });
 });