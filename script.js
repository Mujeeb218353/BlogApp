import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
const firebaseConfig = {
    apiKey: "AIzaSyAglJ4Tt_PEqmLT5_V_TC1j598vwte3IS0",
    authDomain: "blog-test-fce5e.firebaseapp.com",
    projectId: "blog-test-fce5e",
    storageBucket: "blog-test-fce5e.appspot.com",
    messagingSenderId: "616615182065",
    appId: "1:616615182065:web:25e035c474ce1283097350",
    measurementId: "G-9EJJYJ5SXQ",
    databaseURL: "https://blog-test-fce5e-default-rtdb.firebaseio.com",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById('login').addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            alert("Login successfully");
            window.location.href = "home.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
        });
});
document.getElementById('forgot').addEventListener('click',(e) =>{
    e.preventDefault();
    const email = prompt('Please enter your email:');
    sendPasswordResetEmail(auth, email)
        .then(() => {
            alert("Password reset email sent!");
        })
        .catch((error) => {
                alert(error.message);
            }
        );
});

