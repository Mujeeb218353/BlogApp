import {initializeApp} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {collection, getDocs, getFirestore,} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
    const loader = document.getElementById('loader');
    loader.style.display = 'flex';
    loader.style.justifyContent = 'center';
    loader.style.alignItems = 'center';
    loader.style.width = '100%';
    const querySnapshot = await getDocs(collection(db, "blogs"));
    querySnapshot.forEach((doc) => {
        let imageData = doc.data().image;
        let img = document.createElement('img');
        img.src = imageData;
        img.style.width = '200px';
        img.style.height = '200px';
        let li = document.createElement('li');
        li.style.minWidth = '17rem';
        li.classList.add('col-6', 'mx-auto', 'mb-3');
        li.style.height = '100%';
        let initialDescription = doc.data().description.slice(0, 28);
        let remainingDescription = doc.data().description.slice(28);
        li.innerHTML = `
            <div class="post-container" >
                <div class="login-container" id="loginContainer">
                    <div class="login-header">
                        <h6>${doc.data().name.toUpperCase()}</h6>
                        <p>${doc.data().timestamp}</p>
                    </div>
                    <div class="login-form">
                        <form>
                            <h2 class="title text-center">${doc.data().title}</h2>
                            <div style="width: 100%; display: flex; justify-content: center; align-items: center; overflow: hidden;">
                                <img src="${imageData}" alt="image" class="image">
                            </div>
                            <p>${initialDescription}<span class="remaining" style="display:none;">${remainingDescription}</span></p>
                            <button class="read-more btn btn-primary" id="rdMoreBtn">Read more...</button>
                        </form>
                    </div>
                </div>
            </div>    
        `;
        if (doc.data().description.length < 30) {
            li.querySelector('.read-more').style.display = 'none';
        }
        li.querySelector('.read-more').addEventListener('click', function readMore(e) {
            e.preventDefault();
            const parent = this.parentElement;
            const remaining = parent.querySelector('.remaining');
            remaining.style.display = (remaining.style.display === 'none') ? 'inline' : 'none';
            this.textContent = (remaining.style.display === 'none') ? 'Read more...' : 'Read less';
        });
        document.getElementById('blogList').appendChild(li);
    });

    loader.style.display = 'none';
}

getAllUsersData().catch((error) => {
    alert(error.message);
});
document.getElementById('logout').addEventListener('click', (e) => {
    e.preventDefault();
    signOut(auth).then(() => {
        window.location.href = 'index.html'
    }).catch((error) => {
        alert(error.message);
    });
});
