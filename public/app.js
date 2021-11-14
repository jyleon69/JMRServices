document.addEventListener("DOMContentLoaded", event =>{
    const app = firebase.app();
    const db = firebase.firestore();

    //references to html elemnents
    const requestList = document.querySelector('#new-request-list');
    const progressList = document.querySelector('#in-progress-request-list');
    const completedList = document.querySelector('#completed-request-list');
    const trashList = document.querySelector('#trash-list');
    const form = document.querySelector('#request-form');

    //create element and render request to website
    function renderRequests(doc, doc2, list){
        let div = document.createElement('div');
        let div2 = document.createElement('div');
        let div3 = document.createElement('div');
        let div4 = document.createElement('div');
        let div5 = document.createElement('div');
        let input = document.createElement('input');
        let span = document.createElement('span');
        let span2 = document.createElement('span');

        let name = document.createElement('p');
        let email = document.createElement('p');
        let phone = document.createElement('p');
        let message = document.createElement('p');
        let m= document.createElement('p');
        let photo = document.createElement('img');
        let userIP = document.createElement('p');
        let userC = document.createElement('p');
        let userD = document.createElement('p');

        input.setAttribute('data-id', doc.id);
        input.setAttribute('id', doc2.id);
        // var str = new String("Name: ");
        // var strB = str.bold();
        name.textContent = "Name: " + doc.data().name;
        email.textContent = 'Email: ' + doc.data().email;
        phone.textContent = 'Phone: ' + doc.data().phone;
        m.textContent ='Message: ';
        message.textContent = doc2.data().message;
        userIP.textContent = 'Processed by: ' +doc2.data().userIP;
        userC.textContent = 'Completed by: ' + doc2.data().userC;
        userD.textContent = 'Deleted by: ' + doc2.data().userD;
        const pic = doc2.data().photo;

        div2.appendChild(name);
        div2.appendChild(email);
        div2.appendChild(phone);
        div3.appendChild(m);
        div3.appendChild(message);
        if(doc2.data().userIP){
            div3.appendChild(userIP);
        }
        if(doc2.data().userC){
            div3.appendChild(userC);
        }
        if(doc2.data().userD){
            div3.appendChild(userD);
        }
        div4.appendChild(photo);
        div5.appendChild(div2);
        div5.appendChild(div3);
       
        if(list){
            list.appendChild(div);
        }
        div.appendChild(span);
        div.appendChild(span2);
        span.appendChild(input);
        span2.appendChild(div5);
        span2.appendChild(div4);
        
        input.type = ['checkbox'];
        input.name = ['check'];
        div.classList = ['request-bullet'];
        input.classList = ['new-check'];
        span.classList = ['request-check'];
        span2.classList = ['request-info'];
        div2.classList = ['first-info'];
        div3.classList = ['second-info'];
        div4.classList = ['photo-cont'];
        div5.classList = ['request-text'];
        name.classList = ['request-elements'];
        email.classList = ['request-elements'];
        phone.classList = ['request-elements'];
        message.classList = ['request-elements'];
        userIP.classList = ['request-elements'];
        userC.classList = ['request-elements'];
        userD.classList = ['request-elements'];
        if(doc2.data().photo){
            photo.classList = ['request-photos'];
            photo.id = [pic];

            const storageRef = firebase.storage().ref();
            const ref = storageRef.child(pic);
            ref.getDownloadURL()
            .then((url) => {
                photo.setAttribute('src', url);
            })
        } 

    }

    //getting data from the collection of request and for each render request
    const request = db.collection('new-requests');
        request
        .get()
        .then(collec =>{

            collec.docs.forEach(d =>{
                db.collection('new-requests')
                .doc(d.id)
                .collection('requests')
                .get()
                .then(c =>{
                    c.docs.forEach(a =>{
                        // console.log(a.data())
                        renderRequests(d,a,requestList);
                    })
                })
            })
        })

    //getting data from the collection of in-progress and for each render request
    const progress = db.collection('in-progress');
        progress
        .get()
        .then(collec =>{

            collec.docs.forEach(d =>{
                db.collection('in-progress')
                .doc(d.id)
                .collection('requests')
                .get()
                .then(c =>{
                    c.docs.forEach(a =>{
                        // console.log(a.data())
                        renderRequests(d,a,progressList);
                    })
                })
            })
        })

     //getting data from the collection of completed and for each render request
     const complete = db.collection('completed');
     complete
     .get()
     .then(collec =>{

         collec.docs.forEach(d =>{
             db.collection('completed')
             .doc(d.id)
             .collection('requests')
             .get()
             .then(c =>{
                 c.docs.forEach(a =>{
                     // console.log(a.data())
                     renderRequests(d,a,completedList);
                 })
             })
         })
     })

      //getting data from the collection of atrash and for each render request
      const trash = db.collection('trash');
      trash
      .get()
      .then(collec =>{
          collec.docs.forEach(d =>{
              db.collection('trash')
              .doc(d.id)
              .collection('requests')
              .get()
              .then(c =>{
                  c.docs.forEach(a =>{
                      // console.log(a.data())
                      renderRequests(d,a,trashList);
                  })
              })
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
            })
            .then(docRef => {
                const ID = docRef.id;
                // const photoRef = ID;
                // savePhoto(ID);
                db.collection('new-requests')
                .doc(ID)
                .collection('requests').add({
                    message:form.message.value,
                    photo: ''

                })
                .then(subdocRef =>{
                    savePhoto(ID,subdocRef.id, form.message.value);
                    form.name.value= '',
                    form.email.value = '',
                    form.phone.value= '' ,
                    form.message.value = '',
                    form. photo.value = ''
                })
            })
            .catch(error => console.error("Error adding document: ", error))
            
        })
    }

    //function to save photo of request
    function savePhoto(ID, subID, mssg){
        const storageRef = firebase.storage().ref();
        const input = document.querySelector('#photoUpload');
        if(input.files.item(0)){
            const ref= storageRef.child(subID);
            const file = input.files.item(0);
            const task = ref.put(file);
            db.collection('new-requests')
            .doc(ID)
            .collection('requests')
            .doc(subID).set({
                message :mssg,
                photo: subID

            })
            
        }
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
function getUsername(callback){
    const db = firebase.firestore();
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
        // User logged in already or has just logged in.
        console.log('got in to getUsername function')
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
                                callback(a.data().name)
                            }           
                        })
                    })
                })
            })
        } else {
        // User not logged in or has just logged out.
        }
  });
}

//change to in progress database
function changeProgress(){
    const db = firebase.firestore();
    const checkboxes = document.querySelectorAll('input[name = "check"]:checked');

    checkboxes.forEach((checkbox) => {
        console.log(checkboxes)
        var ID = checkbox.getAttribute('data-id');
        const oldID = checkbox.getAttribute('data-id');
        const subID = checkbox.getAttribute('id');
        const old = db.collection('new-requests').doc(ID);
        var userName = '';
        
        exists('new-requests', 'in-progress', oldID, (matchID) => {
            console.log('hey 1st')
            console.log('matchID ' + matchID)
            console.log('ID ' + ID)
            if(!matchID){
                console.log('inside if')
                console.log('matchID' + matchID)
                old
                .get()
                .then( d =>{
                    console.log(d.data())
                    console.log('doesnt exist')
                    db.collection('in-progress')
                    .doc(ID).set({
                        name: d.data().name,
                        email:d.data().email,
                        phone:d.data().phone
                    })
                })
            }else{
                console.log('it exists')
                // console.log(await exists('new-requests', 'in-progress', oldID))
                ID = matchID;
                
            }
            getUsername((userName) =>{
                console.log('hey 2nd')
                const sub = db.collection('new-requests').doc(oldID).collection('requests').doc(subID);
                sub
                .get()
                .then(c =>{
                    console.log(c.data())
                    db.collection('in-progress')
                    .doc(ID)
                    .collection('requests')
                    .doc(subID).set({
                        // message:c.data() ? c.data().message : '',
                        // photo: c.data()? c.data().photo : '',
                        message:c.data().message,
                        photo: c.data().photo,
                        userIP: userName

                    })
                    .then(() =>{
                        db.collection("new-requests").doc(oldID).collection("requests").doc(subID).delete()
                        db.collection("new-requests").doc(oldID).delete()
                    })
                }) 
            })
        })
    })
}
function exists(fromCollection, toCollection, ID, callback){
    console.log('got in to exist function')
    const db = firebase.firestore();
    const fromParent = db.collection(fromCollection);
    const toParent = db.collection(toCollection);
    var matchID = null;
    let found = false;
    toParent
    .get()
    .then(collec => {
        if(collec.docs.length == 0){
            callback(matchID)
        }
        for(let i = 0; i < collec.docs.length; i++){
            let t = collec.docs[i];
            if(found) break;
            console.log(t.data())
            console.log(t.data().name)
            fromParent.doc(ID)
            .get()
            .then( f => {
                console.log(f.data())
                console.log(f.data().name)
                if(t.data().name == f.data().name && t.data().email == f.data().email && t.data().phone == f.data().phone){
                    matchID = t.id;
                    console.log('this is the saved ID')
                    console.log(matchID)
                    found = true;
                    callback(matchID);
                } else if(i === (collec.docs.length-1) && !found){
                    callback(null);
                }
            });
        } 
    });  
}

function completed(){
    const db = firebase.firestore();
    const checkboxes = document.querySelectorAll('input[name = "check"]:checked');

    checkboxes.forEach((checkbox) => {
        var ID = checkbox.getAttribute('data-id');
        const oldID = checkbox.getAttribute('data-id');
        const subID = checkbox.getAttribute('id');
        const old = db.collection('in-progress').doc(ID);
        var userName = '';
        
        exists('in-progress', 'completed', oldID, (matchID) => {
            if(!matchID){
                old
                .get()
                .then( d =>{
                    console.log(d.data())
                    db.collection('completed')
                    .doc(ID).set({
                        name: d.data().name,
                        email:d.data().email,
                        phone:d.data().phone
                    })
                })
            }else{
                console.log('it exists')
                ID = matchID;
                
            }
            getUsername((userName) =>{
                const sub = db.collection('in-progress').doc(oldID).collection('requests').doc(subID);
                sub
                .get()
                .then(c =>{
                    console.log(c.data())
                    console.log(c)
                    db.collection('completed')
                    .doc(ID)
                    .collection('requests')
                    .doc(subID).set({
                        message:c.data().message,
                        photo: c.data().photo,
                        userIP: c.data().userIP,
                        userC: userName

                    })
                    .then(() =>{
                        db.collection('in-progress').doc(oldID).collection('requests')
                        .get()
                        .then( r => {
                            var l = r.docs.length;
                            if(l > 1){
                                db.collection("in-progress").doc(oldID).collection("requests").doc(subID).delete()
                            }else{
                                db.collection("in-progress").doc(oldID).collection("requests").doc(subID).delete()
                                db.collection("in-progress").doc(oldID).delete()
                            }  
                        })
                         
                    })
                }) 
            })
        })
    })
}
//moving to trash box from new request
function moveTrashNR(){
    const db = firebase.firestore();
    const checkboxes = document.querySelectorAll('input[name = "check"]:checked');

    checkboxes.forEach((checkbox) => {
        var ID = checkbox.getAttribute('data-id');
        const oldID = checkbox.getAttribute('data-id');
        const subID = checkbox.getAttribute('id');
        const old = db.collection('new-requests').doc(ID);
        var userName = '';
        
        exists('new-requests', 'trash', oldID, (matchID) => {
            if(!matchID){
                old
                .get()
                .then( d =>{
                    console.log(d.data())
                    db.collection('trash')
                    .doc(ID).set({
                        name: d.data().name,
                        email:d.data().email,
                        phone:d.data().phone
                    })
                })
            }else{
                console.log('it exists')
                // console.log(await exists('new-requests', 'in-progress', oldID))
                ID = matchID;
                
            }
            getUsername((userName) =>{
                const sub = db.collection('new-requests').doc(oldID).collection('requests').doc(subID);
                sub
                .get()
                .then(c =>{
                    db.collection('trash')
                    .doc(ID)
                    .collection('requests')
                    .doc(subID).set({
                        message:c.data().message,
                        photo: c.data().photo,
                        userD: userName

                    })
                    .then(() =>{
                        db.collection("new-requests").doc(oldID).collection("requests").doc(subID).delete()
                        db.collection("new-requests").doc(oldID).delete()
                    })
                }) 
            })
        })
    })
}
//moving to trash box from in-progress
function moveTrashIP(){
    const db = firebase.firestore();
    const checkboxes = document.querySelectorAll('input[name = "check"]:checked');

    checkboxes.forEach((checkbox) => {
        var ID = checkbox.getAttribute('data-id');
        const oldID = checkbox.getAttribute('data-id');
        const subID = checkbox.getAttribute('id');
        const old = db.collection('in-progress').doc(ID);
        var userName = '';
        
        exists('in-progress', 'trash', oldID, (matchID) => {
            if(!matchID){
                old
                .get()
                .then( d =>{
                    db.collection('trash')
                    .doc(ID).set({
                        name: d.data().name,
                        email:d.data().email,
                        phone:d.data().phone
                    })
                })
            }else{
                console.log('it exists')
                // console.log(await exists('new-requests', 'in-progress', oldID))
                ID = matchID;
                
            }
            getUsername((userName) =>{
                const sub = db.collection('in-progress').doc(oldID).collection('requests').doc(subID);
                sub
                .get()
                .then(c =>{
                    db.collection('trash')
                    .doc(ID)
                    .collection('requests')
                    .doc(subID).set({
                        message:c.data().message,
                        photo: c.data().photo,
                        userIP: c.data().userIP,
                        userD: userName

                    })
                    .then(() =>{
                        db.collection('in-progress').doc(oldID).collection('requests')
                        .get()
                        .then( r => {
                            var l = r.docs.length;
                            if(l > 1){
                                db.collection("in-progress").doc(oldID).collection("requests").doc(subID).delete()
                            }else{
                                db.collection("in-progress").doc(oldID).collection("requests").doc(subID).delete()
                                db.collection("in-progress").doc(oldID).delete()
                            }  
                        })  
                    })
                }) 
            })
        })
    })
}
//moving to trash box from completed
function moveTrashC(){
    const db = firebase.firestore();
    const checkboxes = document.querySelectorAll('input[name = "check"]:checked');

    checkboxes.forEach((checkbox) => {
        var ID = checkbox.getAttribute('data-id');
        const oldID = checkbox.getAttribute('data-id');
        const subID = checkbox.getAttribute('id');
        const old = db.collection('completed').doc(ID);
        var userName = '';
        
        exists('completed', 'trash', oldID, (matchID) => {
            if(!matchID){
                old
                .get()
                .then( d =>{
                    db.collection('trash')
                    .doc(ID).set({
                        name: d.data().name,
                        email:d.data().email,
                        phone:d.data().phone
                    })
                })
            }else{
                console.log('it exists')
                // console.log(await exists('new-requests', 'in-progress', oldID))
                ID = matchID;
                
            }
            getUsername((userName) =>{
                const sub = db.collection('completed').doc(oldID).collection('requests').doc(subID);
                sub
                .get()
                .then(c =>{
                    db.collection('trash')
                    .doc(ID)
                    .collection('requests')
                    .doc(subID).set({
                        message:c.data().message,
                        photo: c.data().photo,
                        userIP: c.data().userIP,
                        userC: c.data().userC,
                        userD: userName

                    })
                    .then(() =>{
                        db.collection('completed').doc(oldID).collection('requests')
                        .get()
                        .then( r => {
                            var l = r.docs.length;
                            if(l > 1){
                                db.collection("completed").doc(oldID).collection("requests").doc(subID).delete()
                            }else{
                                db.collection("completed").doc(oldID).collection("requests").doc(subID).delete()
                                db.collection("completed").doc(oldID).delete()
                            }  
                        })  
                    })
                }) 
            })
        })
    })
}
function destroy(){
    const db = firebase.firestore();
    const checkboxes = document.querySelectorAll('input[name = "check"]:checked');

    checkboxes.forEach((checkbox) => {
        const ID = checkbox.getAttribute('data-id');
        const subID = checkbox.getAttribute('id');
        const storageRef = firebase.storage().ref();
        const ref = storageRef.child(subID);
        db.collection("trash")
        .doc(ID)
        .collection("requests")
        .doc(subID)
        .get()
        .then( d =>{
            if(d.data().photo){
                console.log('there is a photo')
                ref.delete().then(() => {
                    // File deleted successfully
                }).catch((error) => {
                    // Uh-oh, an error occurred!
                });
            }
            db.collection("trash").doc(ID).collection("requests")
            .get()
            .then( r => {
                var l = r.docs.length;
                if(l > 1){
                    db.collection("trash").doc(ID).collection("requests").doc(subID).delete()
                }else{
                    db.collection("trash").doc(ID).collection("requests").doc(subID).delete()
                    db.collection("trash").doc(ID).delete()
                }  
            })  
        })      
            
    })

}

//moving to archive from completed
function archive(){
    const db = firebase.firestore();
    const checkboxes = document.querySelectorAll('input[name = "check"]:checked');

    checkboxes.forEach((checkbox) => {
        var ID = checkbox.getAttribute('data-id');
        const oldID = checkbox.getAttribute('data-id');
        const subID = checkbox.getAttribute('id');
        const old = db.collection('completed').doc(ID);
        var userName = '';
        
        exists('completed', 'archive', oldID, (matchID) => {
            if(!matchID){
                old
                .get()
                .then( d =>{
                    db.collection('archive')
                    .doc(ID).set({
                        name: d.data().name,
                        email:d.data().email,
                        phone:d.data().phone
                    })
                })
            }else{
                console.log('it exists')
                // console.log(await exists('new-requests', 'in-progress', oldID))
                ID = matchID;
                
            }
            getUsername((userName) =>{
                const sub = db.collection('completed').doc(oldID).collection('requests').doc(subID);
                sub
                .get()
                .then(c =>{
                    db.collection('archive')
                    .doc(ID)
                    .collection('requests')
                    .doc(subID).set({
                        message:c.data().message,
                        photo: c.data().photo,
                        userIP: c.data().userIP,
                        userC: c.data().userC,
                        userD: userName

                    })
                    .then(() =>{
                        db.collection('completed').doc(oldID).collection('requests')
                        .get()
                        .then( r => {
                            const l = r.docs.length;
                            if(l > 1){
                                db.collection("completed").doc(oldID).collection("requests").doc(subID).delete()
                            }else{
                                db.collection("completed").doc(oldID).collection("requests").doc(subID).delete()
                                db.collection("completed").doc(oldID).delete()
                            }  
                        })  
                    })
                })   
            })
        })
    })
}
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
//updating img in flooring
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
//updating img in pressure-washing
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
//updating img in siding
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
//updating img in framing
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