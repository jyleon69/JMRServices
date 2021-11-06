document.addEventListener("DOMContentLoaded", event =>{
    const app = firebase.app();
    const db = firebase.firestore();

    //references to html elemnents
    const requestList = document.querySelector('#new-request-list');
    const form = document.querySelector('#request-form');

    //create element and render request to website
    
    function renderRequests(doc){
        let div = document.createElement('div');
        let div2 = document.createElement('div');
        let div3 = document.createElement('div');
        let input = document.createElement('input');
        let span = document.createElement('span');
        let span2 = document.createElement('span');

        let name = document.createElement('p');
        let email = document.createElement('p');
        let phone = document.createElement('p');
        let message = document.createElement('p');
        let photo = document.createElement('p');

        input.setAttribute('data-id', doc.id);
        name.textContent = doc.data().name;
        email.textContent = doc.data().email;
        phone.textContent = doc.data().phone;
        message.textContent = doc.data().message;
        photo.textContent = doc.data().photo;

        div2.appendChild(name);
        div2.appendChild(email);
        div2.appendChild(phone);
        div3.appendChild(message);
        div3.appendChild(photo);
        if(requestList){
            requestList.appendChild(div);
        }
        
        div.appendChild(span);
        div.appendChild(span2);
        span.appendChild(input);
        span2.appendChild(div2);
        span2.appendChild(div3);
        input.type = ['checkbox'];
        div.classList = ['request-bullet'];
        input.classList = ['new-check'];
        span.classList = ['request-check'];
        span2.classList = ['request-info'];
        div2.classList = ['first-info'];
        div3.classList = ['second-info'];
        name.classList = ['request-elements'];
        email.classList = ['request-elements'];
        phone.classList = ['request-elements'];
        message.classList = ['request-elements'];
        photo.classList = ['request-elements'];

    }

    //getting data from the collection of request and for each render request
    db.collection('new-requests').get().then((snapshot)=>{
        snapshot.docs.forEach(doc =>{
            renderRequests(doc);
        })
    })
    //saving data from form
    if(form){
        form.addEventListener('submit', (e) =>{
            e.preventDefault();
            db.collection('new-requests').add({
                name: form.name.value,
                email:form.email.value,
                phone:form.phone.value,
                message:form.message.value,
                photo: form.photo.value
            });
            form.name.value = '';
            form.email.value = '';
            form.phone.value= '' ;
            form.message.value = '';
            form.photo.value = '';
        })
    }
    //if auth changes get username and diaplay it
    firebase.auth().onAuthStateChanged((user) => {
            if (user) {
            // User logged in already or has just logged in.
            console.log(user.uid);
            const users = db.collection('users');
                users
                .get()
                .then(collec =>{
                    collec.docs.forEach(d =>{
                        users
                        .doc(d.id)
                        .collection('info')
                        .get()
                        .then(c =>{
                            c.docs.forEach(a =>{
                                
                                if(user.uid ==a.data().UID){
                                    document.getElementById("userDetails").innerHTML = a.data().name;
                                }           
                            })
                        })
                    })
                })
            } else {
            // User not logged in or has just logged out.
            }
      });
      //start of changing services img
      const storageRef = firebase.storage().ref();

      //changing home background
      const homeRef = storageRef.child('home.jpg');

      homeRef.getDownloadURL()
      .then((url) => {
        document.getElementById("home-background").style.backgroundImage = "url(" + url + ")";
        document.getElementById("home-main").style.backgroundImage = "url(" + url + ")";
        
      })
      //changing request estimate background
      const requestRef = storageRef.child('request.jpg');

      requestRef.getDownloadURL()
      .then((url) => {
        document.getElementById("estimate-main").style.backgroundImage = "url(" + url + ")";
        
      })
      //changing house painting img
      const houseRef = storageRef.child('painting.jpg');

      houseRef.getDownloadURL()
      .then((url) => {
          const img = document.getElementById("house-img");
          img.setAttribute('src', url);
      })
      //changing commercial img
      const commercialRef = storageRef.child('commercial.jpg');

      commercialRef.getDownloadURL()
      .then((url) => {
          const img2 = document.getElementById("commercial-img");
          img2.setAttribute('src', url);
      })
      //changing sheetrock img
      const sheetrockRef = storageRef.child('sheetrock.jpg');

      sheetrockRef.getDownloadURL()
      .then((url) => {
          const img3 = document.getElementById("sheetrock-img");
          img3.setAttribute('src', url);
      })
      //changing roofing img
      const roofingRef = storageRef.child('roofing.jpg');

      roofingRef.getDownloadURL()
      .then((url) => {
          const img4 = document.getElementById("roofing-img");
          img4.setAttribute('src', url);
      })
      //changing flooring img
      const flooringRef = storageRef.child('flooring.jpg');

      flooringRef.getDownloadURL()
      .then((url) => {
          const img5 = document.getElementById("flooring-img");
          img5.setAttribute('src', url);
      })
      //changing washing img
      const washingRef = storageRef.child('washing.jpg');

      washingRef.getDownloadURL()
      .then((url) => {
          const img6 = document.getElementById("washing-img");
          img6.setAttribute('src', url);
      })
      //changing siding img
      const sidingRef = storageRef.child('siding.jpg');

      sidingRef.getDownloadURL()
      .then((url) => {
          const img7 = document.getElementById("siding-img");
          img7.setAttribute('src', url);
      })
      //changing framing img
      const framingRef = storageRef.child('framing.jpg');

      framingRef.getDownloadURL()
      .then((url) => {
          const img8 = document.getElementById("framing-img");
          img8.setAttribute('src', url);
      })
      //changing home background
    //   document.getElementById("home-main").style.backgroundImage = url
});

//updating service images
//updating img in home painting 
function uploadHomeFile(){
    const storageRef = firebase.storage().ref();
    const homeRef = storageRef.child('home.jpg');
    const input = document.querySelector('#home-input');

    const file = input.files.item(0);

    const task = homeRef.put(file);
    homeRef.getDownloadURL()
    .then((url) => {
        document.getElementById("home-background").style.backgroundImage = "url(" + url + ")";
        document.getElementById("home-main").style.backgroundImage = "url(" + url + ")";
    })
    input.value = '';
}
//updating img in request estimate background
function uploadRequestFile(){
    const storageRef = firebase.storage().ref();
    const requestRef = storageRef.child('request.jpg');
    const input = document.querySelector('#request-input');

    const file = input.files.item(0);

    const task = requestRef.put(file);
    requestRef.getDownloadURL()
    .then((url) => {
        document.getElementById("estimate-main").style.backgroundImage = "url(" + url + ")";
    })
    input.value = '';
}
//updating img in house painting 
function uploadHouseFile(){
    const storageRef = firebase.storage().ref();
    const houseRef = storageRef.child('painting.jpg');
    const input = document.querySelector('#house-input');

    const file = input.files.item(0);

    const task = houseRef.put(file);
    houseRef.getDownloadURL()
    .then((url) => {
        const img = document.getElementById("house-img");
        img.setAttribute('src', url);
    })
    input.value = '';
}
//updating img in commercial painting 
function uploadCommercialFile(){
    const storageRef = firebase.storage().ref();
    const commercialRef = storageRef.child('commercial.jpg');
    const input = document.querySelector('#commercial-input');

    const file = input.files.item(0);

    const task = commercialRef.put(file);
    commercialRef.getDownloadURL()
    .then((url) => {
        const img = document.getElementById("commercial-img");
        img.setAttribute('src', url);
    })
    input.value = '';  
}
//updating img in sheetrock
function uploadSheetrockFile(){
    const storageRef = firebase.storage().ref();
    const sheetrockRef = storageRef.child('sheetrock.jpg');
    const input = document.querySelector('#sheetrock-input');

    const file = input.files.item(0);

    const task = sheetrockRef.put(file);
    sheetrockRef.getDownloadURL()
    .then((url) => {
        const img = document.getElementById("sheetrock-img");
        img.setAttribute('src', url);
    })
    input.value = '';  
}
//updating img in roofing
function uploadRoofingFile(){
    const storageRef = firebase.storage().ref();
    const roofingRef = storageRef.child('roofing.jpg');
    const input = document.querySelector('#roofing-input');

    const file = input.files.item(0);

    const task = roofingRef.put(file);
    roofingRef.getDownloadURL()
    .then((url) => {
        const img = document.getElementById("roofing-img");
        img.setAttribute('src', url);
    })
    input.value = '';  
}
function uploadFlooringFile(){
    const storageRef = firebase.storage().ref();
    const flooringRef = storageRef.child('flooring.jpg');
    const input = document.querySelector('#flooring-input');

    const file = input.files.item(0);

    const task = flooringRef.put(file);
    flooringRef.getDownloadURL()
    .then((url) => {
        const img = document.getElementById("flooring-img");
        img.setAttribute('src', url);
    })
    input.value = '';  
}
function uploadWashingFile(){
    const storageRef = firebase.storage().ref();
    const washingRef = storageRef.child('washing.jpg');
    const input = document.querySelector('#washing-input');

    const file = input.files.item(0);

    const task = washingRef.put(file);
    washingRef.getDownloadURL()
    .then((url) => {
        const img = document.getElementById("washing-img");
        img.setAttribute('src', url);
    })
    input.value = '';  
}
function uploadSidingFile(){
    const storageRef = firebase.storage().ref();
    const sidingRef = storageRef.child('siding.jpg');
    const input = document.querySelector('#siding-input');

    const file = input.files.item(0);

    const task = sidingRef.put(file);
    sidingRef.getDownloadURL()
    .then((url) => {
        const img = document.getElementById("siding-img");
        img.setAttribute('src', url);
    })
    input.value = '';  
}
function uploadFramingFile(){
    const storageRef = firebase.storage().ref();
    const framingRef = storageRef.child('framing.jpg');
    const input = document.querySelector('#framing-input');

    const file = input.files.item(0);

    const task = framingRef.put(file);
    framingRef.getDownloadURL()
    .then((url) => {
        const img = document.getElementById("framing-img");
        img.setAttribute('src', url);
    })
    input.value = '';  
}
//going to log in page
function logIn(){
    newwindow =window.open('logIn.html', 'name', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
    if (window.focus) {newwindow.focus()}
        return false;
}

// log in to firebase
function logInFirebase(){
    var email = document.getElementById('typeEmailX');
    var password = document.getElementById('typePasswordX');
    console.log(email.value);
    console.log(password.value);
    firebase.auth().signInWithEmailAndPassword(email.value, password.value)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            console.log(user)
            var uid = user.uid;
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                  // User is signed in, see docs for a list of available properties
                  // https://firebase.google.com/docs/reference/js/firebase.User
                  var uid = user.uid;
                  window.location.replace("admin-index.html");
                  // ...
                } else {
                  // User is signed out
                  // ...
                }
              });
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(error)
            window.history.back();
        });
}

//logging out by button
function logOut(){
    firebase.auth().signOut()
        .then(() => {
            window.location.replace("index.html");
        })
        .catch(console.log)
}
/* */