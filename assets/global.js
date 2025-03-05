
// Events

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('body').style = "animation-name: load;" +
                                         "animation-duration: 1s;";
  loadSpin();
});

// :P

document.addEventListener('keypress', function() {
  let key = event.keyCode || event.charCode;
  if(key == 33) window.alert('Hello!');
});

let elems = [];
let rotate = 0;
let run = true;
let trigger = '@';

function loadSpin(){
  elems = document.getElementsByTagName('*');
}

function spin() {
  rotate += 180;
  
  for(let i = 0; i < elems.length; i ++) elems[i].style.rotate = '' + rotate + 'deg';
}

document.addEventListener('keypress', function() {
    if(event.key == trigger && run) {
        run = false;
        spin();
        window.setTimeout(spin, 5 * 1000);
        window.setTimeout(function runTrue(){
            run = true;
        }, 5 * 1000 * 2);
    }
});
