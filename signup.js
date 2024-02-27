import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import {
    getFirestore,
    onSnapshot,
    collection,
    addDoc,
    doc,
    setDoc,
    updateDoc,
    query,
    where,
    getDocs,
    deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
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
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById('signup').addEventListener('click', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log(name, email, password);
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            const userId = user.uid;
            console.log(user);
            const userRef = doc(db, 'users', userId);
            return setDoc(userRef, {
                email: email,
                password: password,
                name: name
            });
        })
        .then(() => {
            alert("Sign up successfully");
            window.location.href = "index.html";
        })
        .catch((error) => {
                alert(error.message);
            }
        );
});

