document.addEventListener("DOMContentLoaded", function(){
  // const app = firebase.app();
  // console.log(app)
  //scrolling
  window.addEventListener('scroll', function() {
    if (window.scrollY > 220) {
      document.getElementById('navbar-top').classList.add('fixed-top');
      // document.getElementsByClassName('main-header')[0].style.display = "none";
      // add padding top to show content behind navbar
      navbar_height = document.querySelector('.navbar').offsetHeight;
      document.body.style.paddingTop = navbar_height + 'px';
    } else {
      document.getElementById('navbar-top').classList.remove('fixed-top');
      // document.getElementsByClassName('main-header')[0].style.display = "block";
        // remove padding top from body
      document.body.style.paddingTop = '0';
    } 
  });
});