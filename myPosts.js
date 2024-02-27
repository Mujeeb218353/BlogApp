import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
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

let userName, userEmail;
const checkSignIn = () => {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            window.location.href = 'index.html';
        }
    });
}
checkSignIn();


// Function to get user data from the database
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, fetch the user's name from the database
        getUserData(user.uid);
        // console.log('onauthState',user)
    } else {
        // User is signed out
        console.log('User is signed out');
    }
});

function getUserData(userId) {
    // Assuming 'users' is the collection where user documents are stored in Firestore
    const userRef = doc(db, 'users', userId);
    document.getElementById('loader').style = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    }
    getDoc(userRef)
        .then((doc) => {
            if (doc.exists()) {
                // User document exists, retrieve the user's name
                const userData = doc.data();
                userName = userData.name;
                userEmail = userData.email;

                const getData = async () => {
                const querySnapshot = await getDocs( query(
                    collection(db, "blogs"),
                    where('email', '==', userEmail),
                    where('name', '==', userName)
                ));
                    // console.log(userName, userEmail);
                    querySnapshot.forEach((doc) => {
                        // console.log(`${doc.id} => ${doc.data()}`);
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
                                        <div>
                                            <button id="${doc.id}" class="btn btn-primary editBtn" data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</button>
                                            <button id="${doc.id}" class="btn btn-primary deleteBtn">Delete</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>    
                        `;
                        // console.log(doc.data().description)
                        document.getElementById('blogList').appendChild(li);
                        // console.log('User name:', userName, 'User email:', userEmail);
                    });
                    document.getElementById('loader').style.display = 'none';
                    document.querySelectorAll('.editBtn').forEach(button => {
                        button.addEventListener('click', (e) => {
                            updateNote(e, button.id);
                        });
                    });
                    document.querySelectorAll('.deleteBtn').forEach(button => {
                        button.addEventListener('click', (e) => {
                            deleteNote(e, button.id);
                        });
                    });
                }
                getData();
            } else {
                alert('User document does not exist');
            }
        })
        .catch((error) => {
            alert(error.message);
        });

    // console.log('User name:', userName, 'User email:', userEmail);

}

document.getElementById('logout').addEventListener('click', (e) => {
    e.preventDefault();
    signOut(auth).then(() => {
        window.location.href = 'index.html'
    }).catch((error) => {
        alert(error.message);
    });
});


async function deleteNote(e, id){
    e.preventDefault();
    console.log(id,'Deleted');
    await deleteDoc(doc(db, 'blogs', id));
    window.location.reload();
}



async function updateNote(e,id) {
    e.preventDefault();
    fetchDoc(id).then(
        async (data) => {
            let updateData = document.getElementById('updateData');
            updateData.innerHTML = `
               <div class="mb-3">
                   <label for="exampleInputEmail1" class="form-label">Title</label>
                   <input type="text" class="form-control" id="exampleTitle" aria-describedby="emailHelp" value="${data.data().title}">
               </div>
               <div class="mb-3">
                   <label for="exampleInputPassword1" class="form-label">Description</label>
                   <input type="text" class="form-control" id="exampleDescription" value="${data.data().description}">
               </div>
               <div class="mb-3">
                    <label for="exampleInputPassword1" class="form-label">Image</label>
                    <input type="file" class="form-control" id="exampleImageInput" accept="image/*">
                    <img id="exampleImage" src="${data.data().image}" alt="image" onclick="document.getElementById('exampleImageInput').click()">
               </div>
            `;
            document.getElementById('exampleImageInput').addEventListener('change', loadImage);
            document.getElementById('updateBtn').addEventListener('click', async (e) => {
                e.preventDefault();
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
                const updateDocs = doc(db, "blogs", id);
                console.log(document.getElementById('exampleImage').src)
                await updateDoc(updateDocs, {
                    title: document.getElementById('exampleTitle').value,
                    description: document.getElementById('exampleDescription').value,
                    image: document.getElementById('exampleImage').src,
                    timestamp: formattedDateTime
                }).then(
                    () => {
                        // console.log('data updated successfully');
                        window.location.reload();
                        document.getElementById('closeBtn').click();
                    }
                ).catch((error) => {
                    console.log(error.message);
                });
            });
        }
    )
}

function loadImage(event) {
    const imageElement = document.getElementById('exampleImage');
    // Check if a file was selected
    if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imageElement.src = e.target.result;
        };
        reader.readAsDataURL(event.target.files[0]);
    }
}



async function fetchDoc(id) {
    const docRef = doc(db, 'blogs', id);
    return await getDoc(docRef);
}