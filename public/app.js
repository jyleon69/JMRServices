document.addEventListener("DOMContentLoaded", event =>{
    const app = firebase.app();
    const db = firebase.firestore();

    //references to html elemnents
    const requestList = document.querySelector('#new-request-list');
    const progressList = document.querySelector('#in-progress-request-list');
    const completedList = document.querySelector('#completed-request-list');
    const trashList = document.querySelector('#trash-list');
    const form = document.querySelector('#request-form');

    //renders request to website
    //creates element and sticks information from database to those elements
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

    //getting data from the databases of new-requests and calls function to render each one
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
                        renderRequests(d,a,requestList);
                    })
                })
            })
        })

    //getting data from the collection of in-progress and calls function to render each one
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

     //getting data from the collection of completed and calls function to render each one
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

      //getting data from the collection of trash and calls function to render each one
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

    //saving data from form to new-requests database
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
        //gets html input
        const input = document.querySelector('#photoUpload');
        //if there is a file then create storage reference and stick image in it 
        if(input.files.item(0)){
            const ref = storageRef.child(subID);
            const file = input.files.item(0);
            const task = ref.put(file);
            //update databse with name of photo reference and same message
            db.collection('new-requests')
            .doc(ID)
            .collection('requests')
            .doc(subID).set({
                message :mssg,
                photo: subID
            })   
        }
        // window.location.replace("submitRequest.html");
    }

    //if auth changes,get username and display it
    firebase.auth().onAuthStateChanged((user) => {
            if (user) {
            // User logged in already or has just logged in.
            // console.log(user.uid);
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

      //start of updating images
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
      //changing about background
      const aboutRef = storageRef.child('about.jpg');

      aboutRef.getDownloadURL()
      .then((url) => {
        document.getElementById("about-main").style.backgroundImage = "url(" + url + ")";
        
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
});
//
function getUsername(callback){
    const db = firebase.firestore();
    firebase.auth().onAuthStateChanged((user) => {
        // User logged in already or has just logged in.
        if (user) {
        //go to user database
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
                        //when it finds UID match, get username, from that document
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
    //do these for each checked box
    checkboxes.forEach((checkbox) => {
        //get attributes and store them in variables
        var ID = checkbox.getAttribute('data-id');
        const oldID = checkbox.getAttribute('data-id');
        const subID = checkbox.getAttribute('id');
        const old = db.collection('new-requests').doc(ID);
        //call exists function to see if user is already in database that being moved to
        exists('new-requests', 'in-progress', oldID, (matchID) => {
            //if no match found copy documents fields
            if(!matchID){
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
                //else it exists and no need to make new document, just update ID 
                ID = matchID;
                
            }
            //get user name of who is copying document to other database
            getUsername((userName) =>{
                const sub = db.collection('new-requests').doc(oldID).collection('requests').doc(subID);
                sub
                .get()
                .then(c =>{
                    //set subdocument and add username
                    db.collection('in-progress')
                    .doc(ID)
                    .collection('requests')
                    .doc(subID).set({
                        message:c.data().message,
                        photo: c.data().photo,
                        userIP: userName

                    })
                    //delete document from old database
                    .then(() =>{
                        db.collection("new-requests").doc(oldID).collection("requests").doc(subID).delete()
                        db.collection("new-requests").doc(oldID).delete()
                        //last minute changggeeee
                        location.reload();
                    })
                }) 
            })
        })
    })
}
//checks if user(document with same fields) exists in database that document is being copy to)
function exists(fromCollection, toCollection, ID, callback){
    const db = firebase.firestore();
    const fromParent = db.collection(fromCollection);
    const toParent = db.collection(toCollection);
    var matchID = null;
    let found = false;

    toParent
    .get()
    .then(collec => {
        //if database where document is being copied is empty then return the ID
        if(collec.docs.length == 0){
            callback(matchID)
        }
        //go through database and check each document for matching fields
        for(let i = 0; i < collec.docs.length; i++){
            let t = collec.docs[i];
            if(found) break;
            
            fromParent.doc(ID)
            .get()
            .then( f => {
                //if thete is match, return ID from existing document
                if(t.data().name == f.data().name && t.data().email == f.data().email && t.data().phone == f.data().phone){
                    matchID = t.id;
                    found = true;
                    callback(matchID);
                //else return null
                } else if(i === (collec.docs.length-1) && !found){
                    callback(null);
                }
            });
        } 
    });  
}
//change to completed database
function completed(){
    const db = firebase.firestore();
    const checkboxes = document.querySelectorAll('input[name = "check"]:checked');
    //do these for each checked box
    checkboxes.forEach((checkbox) => {
        //get attributes and store them in variables
        var ID = checkbox.getAttribute('data-id');
        const oldID = checkbox.getAttribute('data-id');
        const subID = checkbox.getAttribute('id');
        const old = db.collection('in-progress').doc(ID);
        //call exists function to see if user is already in database that being moved to
        exists('in-progress', 'completed', oldID, (matchID) => {
            //if no match found copy documents fields
            if(!matchID){
                old
                .get()
                .then( d =>{
                    db.collection('completed')
                    .doc(ID).set({
                        name: d.data().name,
                        email:d.data().email,
                        phone:d.data().phone
                    })
                })
            //else it exists and no need to make new document, just update ID 
            }else{
                ID = matchID;
                
            }
            //get user name of who is copying document to other database
            getUsername((userName) =>{
                const sub = db.collection('in-progress').doc(oldID).collection('requests').doc(subID);
                //set subdocument and add username
                sub
                .get()
                .then(c =>{
                    db.collection('completed')
                    .doc(ID)
                    .collection('requests')
                    .doc(subID).set({
                        message:c.data().message,
                        photo: c.data().photo,
                        userIP: c.data().userIP,
                        userC: userName

                    })
                    //delete document from old database
                    .then(() =>{
                        db.collection('in-progress').doc(oldID).collection('requests')
                        .get()
                        .then( r => {
                            var l = r.docs.length;
                            //if there is more than one subdocument(requests), delete only subcollection 
                            if(l > 1){
                                db.collection("in-progress").doc(oldID).collection("requests").doc(subID).delete()
                            //else delete all the document with subcollection
                            }else{
                                db.collection("in-progress").doc(oldID).collection("requests").doc(subID).delete()
                                db.collection("in-progress").doc(oldID).delete()
                            }  
                            //last minute changggeeee
                            location.reload(); 
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
     //do these for each checked box
    checkboxes.forEach((checkbox) => {
        //get attributes and store them in variables
        var ID = checkbox.getAttribute('data-id');
        const oldID = checkbox.getAttribute('data-id');
        const subID = checkbox.getAttribute('id');
        const old = db.collection('new-requests').doc(ID);
        //call exists function to see if user is already in database that being moved to
        exists('new-requests', 'trash', oldID, (matchID) => {
            //if no match found copy documents fields
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
            //else it exists and no need to make new document, just update ID 
            }else{
                ID = matchID; 
            }
            //get user name of who is copying document to other database
            getUsername((userName) =>{
                const sub = db.collection('new-requests').doc(oldID).collection('requests').doc(subID);
                //set subdocument and add username
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
                    //delete document from old database
                    .then(() =>{
                        db.collection("new-requests").doc(oldID).collection("requests").doc(subID).delete()
                        db.collection("new-requests").doc(oldID).delete()
                        //last minute changggeeee
                        location.reload();
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
    //do these for each checked box
    checkboxes.forEach((checkbox) => {
        //get attributes and store them in variables
        var ID = checkbox.getAttribute('data-id');
        const oldID = checkbox.getAttribute('data-id');
        const subID = checkbox.getAttribute('id');
        const old = db.collection('in-progress').doc(ID);
        //call exists function to see if user is already in database that being moved to
        exists('in-progress', 'trash', oldID, (matchID) => {
            //if no match found copy documents fields
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
            //else it exists and no need to make new document, just update ID 
            }else{
                ID = matchID;   
            }
            //get user name of who is copying document to other database
            getUsername((userName) =>{
                const sub = db.collection('in-progress').doc(oldID).collection('requests').doc(subID);
                //set subdocument and add username
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
                    //delete document from old database
                    .then(() =>{
                        db.collection('in-progress').doc(oldID).collection('requests')
                        .get()
                        .then( r => {
                            var l = r.docs.length;
                            //if there is more than one subdocument(requests), delete only subcollection 
                            if(l > 1){
                                db.collection("in-progress").doc(oldID).collection("requests").doc(subID).delete()
                            //else delete all the document with subcollection
                            }else{
                                db.collection("in-progress").doc(oldID).collection("requests").doc(subID).delete()
                                db.collection("in-progress").doc(oldID).delete()
                            } 
                            //last minute changggeeee
                            location.reload();  
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
    //do these for each checked box
    checkboxes.forEach((checkbox) => {
        //get attributes and store them in variables
        var ID = checkbox.getAttribute('data-id');
        const oldID = checkbox.getAttribute('data-id');
        const subID = checkbox.getAttribute('id');
        const old = db.collection('completed').doc(ID);
        //call exists function to see if user is already in database that being moved to
        exists('completed', 'trash', oldID, (matchID) => {
            //if no match found copy documents fields
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
            //else it exists and no need to make new document, just update ID 
            }else{
                ID = matchID;  
            }
            //get user name of who is copying document to other database
            getUsername((userName) =>{
                const sub = db.collection('completed').doc(oldID).collection('requests').doc(subID);
                //set subdocument and add username
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
                    //delete document from old database
                    .then(() =>{
                        db.collection('completed').doc(oldID).collection('requests')
                        .get()
                        .then( r => {
                            var l = r.docs.length;
                            //if there is more than one subdocument(requests), delete only subcollection 
                            if(l > 1){
                                db.collection("completed").doc(oldID).collection("requests").doc(subID).delete()
                            //else delete all the document with subcollection
                            }else{
                                db.collection("completed").doc(oldID).collection("requests").doc(subID).delete()
                                db.collection("completed").doc(oldID).delete()
                            }  
                            //last minute changggeeee
                            location.reload();
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
    //do these for each checked box
    checkboxes.forEach((checkbox) => {
        //get attributes and store them in variables
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
            //if there is photo reference, then delete it
            if(d.data().photo){
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
                //if there is more than one subdocument then delete subdocument only
                if(l > 1){
                    db.collection("trash").doc(ID).collection("requests").doc(subID).delete()
                //else delete the whole document with all subcollection
                }else{
                    db.collection("trash").doc(ID).collection("requests").doc(subID).delete()
                    db.collection("trash").doc(ID).delete()
                }
                //last minute changggeeee
                // location.reload();  
            }) 
        })            
    })
}

//moving to archive from completed
function archive(){
    const db = firebase.firestore();
    const checkboxes = document.querySelectorAll('input[name = "check"]:checked');
    //do these for each checked box
    checkboxes.forEach((checkbox) => {
        //get attributes and store them in variables
        var ID = checkbox.getAttribute('data-id');
        const oldID = checkbox.getAttribute('data-id');
        const subID = checkbox.getAttribute('id');
        const old = db.collection('completed').doc(ID);
        //call exists function to see if user is already in database that being moved to
        exists('completed', 'archive', oldID, (matchID) => {
            //if no match found copy documents fields
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
            //else it exists and no need to make new document, just update ID 
            }else{
                ID = matchID; 
            }
            //get user name of who is copying document to other database
            getUsername((userName) =>{
                const sub = db.collection('completed').doc(oldID).collection('requests').doc(subID);
                //set subdocument and add username
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
                        userA: userName

                    })
                    //delete document from old database
                    .then(() =>{
                        db.collection('completed').doc(oldID).collection('requests')
                        .get()
                        .then( r => {
                            const l = r.docs.length;
                            //if there is more than one subdocument(requests), delete only subcollection 
                            if(l > 1){
                                db.collection("completed").doc(oldID).collection("requests").doc(subID).delete()
                            //else delete all the document with subcollection
                            }else{
                                db.collection("completed").doc(oldID).collection("requests").doc(subID).delete()
                                db.collection("completed").doc(oldID).delete()
                            }  
                            //last minute changggeeee
                            location.reload();
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
    //make photo reference
    const homeRef = storageRef.child('home.jpg');
    const input = document.querySelector('#home-input');

    const file = input.files.item(0);

    const task = homeRef.put(file);
    //get URL from reference 
    homeRef.getDownloadURL()
    .then((url) => {
        //update image source 
        document.getElementById("home-background").style.backgroundImage = "url(" + url + ")";
        document.getElementById("home-main").style.backgroundImage = "url(" + url + ")";
    })
    input.value = '';
}
//updating img in request estimate background
function uploadRequestFile(){
    const storageRef = firebase.storage().ref();
    //make photo reference
    const requestRef = storageRef.child('request.jpg');
    const input = document.querySelector('#request-input');

    const file = input.files.item(0);

    const task = requestRef.put(file);
    //get URL from reference 
    requestRef.getDownloadURL()
    .then((url) => {
        //update image source 
        document.getElementById("estimate-main").style.backgroundImage = "url(" + url + ")";
    })
    input.value = '';
}
//updating img in about background
function uploadAboutFile(){
    const storageRef = firebase.storage().ref();
    //make photo reference
    const aboutRef = storageRef.child('about.jpg');
    const input = document.querySelector('#about-input');

    const file = input.files.item(0);

    const task = aboutRef.put(file);
    //get URL from reference 
    aboutRef.getDownloadURL()
    .then((url) => {
        //update image source 
        document.getElementById("about-main").style.backgroundImage = "url(" + url + ")";
    })
    input.value = '';
}
//updating img in house painting 
function uploadHouseFile(){
    const storageRef = firebase.storage().ref();
    //make photo reference
    const houseRef = storageRef.child('painting.jpg');
    const input = document.querySelector('#house-input');

    const file = input.files.item(0);

    const task = houseRef.put(file);
    //get URL from reference 
    houseRef.getDownloadURL()
    .then((url) => {
        const img = document.getElementById("house-img");
        //update image source 
        img.setAttribute('src', url);
    })
    input.value = '';
}
//updating img in commercial painting 
function uploadCommercialFile(){
    const storageRef = firebase.storage().ref();
     //make photo reference
    const commercialRef = storageRef.child('commercial.jpg');
    const input = document.querySelector('#commercial-input');

    const file = input.files.item(0);

    const task = commercialRef.put(file);
    //get URL from reference 
    commercialRef.getDownloadURL()
    .then((url) => {
        const img = document.getElementById("commercial-img");
        //update image source 
        img.setAttribute('src', url);
    })
    input.value = '';  
}
//updating img in sheetrock
function uploadSheetrockFile(){
    const storageRef = firebase.storage().ref();
     //make photo reference
    const sheetrockRef = storageRef.child('sheetrock.jpg');
    const input = document.querySelector('#sheetrock-input');

    const file = input.files.item(0);

    const task = sheetrockRef.put(file);
    //get URL from reference 
    sheetrockRef.getDownloadURL()
    .then((url) => {
        const img = document.getElementById("sheetrock-img");
        //update image source 
        img.setAttribute('src', url);
    })
    input.value = '';  
}
//updating img in roofing
function uploadRoofingFile(){
    const storageRef = firebase.storage().ref();
     //make photo reference
    const roofingRef = storageRef.child('roofing.jpg');
    const input = document.querySelector('#roofing-input');

    const file = input.files.item(0);

    const task = roofingRef.put(file);
    //get URL from reference 
    roofingRef.getDownloadURL()
    .then((url) => {
        const img = document.getElementById("roofing-img");
        //update image source 
        img.setAttribute('src', url);
    })
    input.value = '';  
}
//updating img in flooring
function uploadFlooringFile(){
    const storageRef = firebase.storage().ref();
     //make photo reference
    const flooringRef = storageRef.child('flooring.jpg');
    const input = document.querySelector('#flooring-input');

    const file = input.files.item(0);

    const task = flooringRef.put(file);
    //get URL from reference 
    flooringRef.getDownloadURL()
    .then((url) => {
        const img = document.getElementById("flooring-img");
        //update image source 
        img.setAttribute('src', url);
    })
    input.value = '';  
}
//updating img in pressure-washing
function uploadWashingFile(){
    const storageRef = firebase.storage().ref();
     //make photo reference
    const washingRef = storageRef.child('washing.jpg');
    const input = document.querySelector('#washing-input');

    const file = input.files.item(0);

    const task = washingRef.put(file);
    //get URL from reference 
    washingRef.getDownloadURL()
    .then((url) => {
        const img = document.getElementById("washing-img");
        //update image source 
        img.setAttribute('src', url);
    })
    input.value = '';  
}
//updating img in siding
function uploadSidingFile(){
    const storageRef = firebase.storage().ref();
     //make photo reference
    const sidingRef = storageRef.child('siding.jpg');
    const input = document.querySelector('#siding-input');

    const file = input.files.item(0);

    const task = sidingRef.put(file);
    //get URL from reference 
    sidingRef.getDownloadURL()
    .then((url) => {
        const img = document.getElementById("siding-img");
        //update image source 
        img.setAttribute('src', url);
    })
    input.value = '';  
}
//updating img in framing
function uploadFramingFile(){
    const storageRef = firebase.storage().ref();
     //make photo reference
    const framingRef = storageRef.child('framing.jpg');
    const input = document.querySelector('#framing-input');

    const file = input.files.item(0);

    const task = framingRef.put(file);
    //get URL from reference 
    framingRef.getDownloadURL()
    .then((url) => {
        const img = document.getElementById("framing-img");
        //update image source 
        img.setAttribute('src', url);
    })
    input.value = '';  
}

//going to log in page
function logIn(){
    window.location.replace("logIn.html");
}

// log in to firebase
function logInFirebase(){
    var email = document.getElementById('typeEmailX');
    var password = document.getElementById('typePasswordX');
    //authenticating
    firebase.auth().signInWithEmailAndPassword(email.value, password.value)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            var uid = user.uid;
            firebase.auth().onAuthStateChanged((user) => {
                //if there is user signed in
                if (user) {
                    // User is signed in, see docs for a list of available properties
                    // https://firebase.google.com/docs/reference/js/firebase.User
                    var uid = user.uid;
                    const db = firebase.firestore();
                    //get user database admin document 
                    const users = db.collection('users').doc('admins').collection('info');
                    users
                    .get()
                    .then(c => {
                        c.docs.forEach(a => {
                                //if there is a match of UID in admin document, then redirect to admin-index
                                if(a.data().UID == uid){
                                    window.location.replace("admin-index.html");
                                //else redirect to employee page
                                }else{
                                    window.location.replace("employee-requests.html");
                            }
                        })
                    })
                    } else {
                    // User is signed out
                    // ...
                    }
                });
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            //if not authenticated and try again
            window.location.replace("retryLogin.html");
        });
}

//logging out by button
function logOut(){
    //signed out of firebase account 
    firebase.auth().signOut()
        .then(() => {
            //then redirect to index
            window.location.replace("index.html");
        })
        .catch(console.log)
}
/* */