import { initializeApp} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js"; // Added getAnalytics import
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
    getDoc,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import {
    getAuth,
    onAuthStateChanged,
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
const db = getFirestore(app);
const auth = getAuth();

const checkSignIn = () => {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            window.location.href = 'index.html';
        }
    });
}
checkSignIn();

let userName, userEmail;

onAuthStateChanged(auth, (user) => {
    if (user) {
        getUserData(user.uid);
    } else {
        console.log('User is signed out');
    }
});


function getUserData(userId) {
    const userRef = doc(db, 'users', userId);
    getDoc(userRef)
        .then((doc) => {
            if (doc.exists()) {
                const userData = doc.data();
                userName = userData.name;
                userEmail = userData.email;
            } else {
                console.log('User document does not exist');
            }
        })
        .catch((error) => {
            console.error('Error getting user document:', error);
        });
}

const addDataInFirestore = async (e) => {
    e.preventDefault();
    const inputImage = document.getElementById('image').files[0];
    const inputTitle = document.getElementById('title').value;
    const inputDescription = document.getElementById('description').value;
    const reader = new FileReader();
    if (!inputImage) {
        alert('Please select an image');
        return;
    }
    reader.onload = async function(event) {
        const base64Image = event.target.result;

        const now = new Date();
        const options = {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        const formattedDateTime = now.toLocaleString('en-US', options).replace(/,/g, '');

        const userBlog = {
            name: userName,
            email: userEmail,
            image: base64Image,
            title: inputTitle,
            description: inputDescription,
            timestamp: formattedDateTime
        };

        console.log(userBlog);

        try {
            const docRef = await addDoc(collection(db, "blogs"), userBlog);
            alert('Data added successfully');
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }

        document.getElementById('title').value = "";
        document.getElementById('image').value = "";
        document.getElementById('description').value = "";
    };
    if (inputImage) {
        reader.readAsDataURL(inputImage);
    }
};

const addPost = document.getElementById('addPostBtn');
addPost.addEventListener('click', addDataInFirestore);

document.getElementById('description').addEventListener('input', function() {
    if( document.getElementById('description').value === '' ){
        this.style.height = 'fit-content';
    }
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

document.getElementById('logout').addEventListener('click', (e) => {
    e.preventDefault();
    signOut(auth).then(() => {
        window.location.href = 'index.html'
    }).catch((error) => {
        alert(error.message);
    });
});