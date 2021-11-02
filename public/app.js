document.addEventListener("DOMContentLoaded", event =>{
    const app = firebase.app();
    const db = firebase.firestore();
    const request = db.collection('requests').doc('firstrequest');
    request.onSnapshot(doc => {
            const data = doc.data();
            document.querySelector('#name').innerHTML = data.name
    })
});
function logIn(){
    
}
firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            // ...
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
        });

function logOut(){
    firebase.auth().signOut()
        .then(() => {
            
        })
        .catch(console.log)

}