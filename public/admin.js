document.addEventListener("DOMContentLoaded", event =>{
    const app = firebase.app();
    const db = firebase.firestore();
    firebase.auth().onAuthStateChanged((user) => { 
        debugger
        if (user) {
            debugger
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
                // c.docs.forEach(a => {
                //     console.log(a.data().UID)
                //     console.log(uid)
                //     if(a.data().UID == uid){
                        
                //     }else{
                        
                //     }
                // })
            })
        } else {
            debugger
            window.location.replace("index.html")
            // User is signed out
            // ...
        }
    });
})