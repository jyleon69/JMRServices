//this checks if user is signed in and part of employee database, and if not, will be redirected to index
//when trying to access employee pages
document.addEventListener("DOMContentLoaded", event =>{
    const app = firebase.app();
    const db = firebase.firestore();
    firebase.auth().onAuthStateChanged((user) => { 
        //if there is user signed in
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            var uid = user.uid;
            const db = firebase.firestore();
            const users = db.collection('users').doc('employees').collection('info');
            users
            .get()
            .then(c => {
                const array = c.docs.filter(x => x.data().UID == uid)
                //if array contains element then to nothing
                if(array.length){
                //else redirect them to index
                }else{
                    window.location.replace("index.html");
                }
            })
        //if no user signed in then redirect them to index
        } else {
            window.location.replace("index.html")
            // User is signed out
            // ...
        }
    });
})