import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
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
    getDoc,
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
const checkSignIn = () => {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            window.location.href = 'index.html';
        }
    });
}
checkSignIn();


async function getAllUsersData() {
    document.getElementById('loader').style = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    }
    const querySnapshot = await getDocs(collection(db, "blogs"));
    querySnapshot.forEach((doc) => {
        let imageData = doc.data().image;
        let img = document.createElement('img');
        img.src = imageData;
        img.style.width = '200px';
        img.style.height = '200px';
        img.style.margin = '30px';
        img.style.border = "2px solid black";
        img.style.borderRadius = "10px";
        let li = document.createElement('li');
        li.style.minWidth = '17rem';
        li.classList.add('col-4', 'mx-auto', 'my-3');
        li.innerHTML = `
                        <div class="post-container">
                            <div class="login-container" id="loginContainer">
                                <div class="login-header">
                                    <h6>${doc.data().name.toUpperCase()}</h6>
                                    <p>${doc.data().timestamp}</p>
                                </div>
                                <div class="login-form">
                                    <form>
                                        <h2 class="title text-center">${doc.data().title}</h2>
                                        <img src="${imageData}" alt="image" class="image">
                                        <p>${doc.data().description}</p>
                                    </form>
                                </div>
                            </div>
                        </div>    
                        `;
        // console.log(doc.data().description)
        document.getElementById('blogList').appendChild(li);
    });
    document.getElementById('loader').style.display = 'none';

}

getAllUsersData().catch((error) => {
    alert(error.message);
})
document.getElementById('logout').addEventListener('click', (e) => {
    e.preventDefault();
    signOut(auth).then(() => {
        window.location.href = 'index.html'
    }).catch((error) => {
        alert(error.message);
    });
});

