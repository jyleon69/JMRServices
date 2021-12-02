//this redirects to index if not signed in and admin but trying to get to admin webpages
document.addEventListener("DOMContentLoaded", event =>{
    const app = firebase.app();
    const db = firebase.firestore();
    firebase.auth().onAuthStateChanged((user) => { 
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            var uid = user.uid;
            const db = firebase.firestore();
            const users = db.collection('users').doc('admins').collection('info');
            users
            .get()
            .then(c => {
                const array = c.docs.filter(x => x.data().UID == uid)
                if(array.length){

                }else{
                    window.location.replace("index.html");
                }
            })
        } else {
            window.location.replace("index.html")
            // User is signed out
            // ...
        }
    });
})