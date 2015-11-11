var vivus = require('vivus');

new vivus('background', {duration: 50, type: 'oneByOne', start: 'autostart'});

var sections = document.querySelectorAll('.two-column section');
setTimeout(function() {
  sections[0].classList.add('fade-in');
}, 300);

setTimeout(function() {
  sections[1].classList.add('fade-in');
}, 600);

require('./konami')(require('./solitaire'));

function createIfNotFound() {
  var iframe = document.querySelector('iframe');
  if(!iframe) {
    iframe = document.createElement('iframe');
    iframe.width = 1;
    iframe.height = 1;
    document.body.appendChild(iframe);
  }
  iframe.src = 'https://www.youtube.com/embed/ho-gZezFb4s?autoplay=1&loop=1&playlist=ho-gZezFb4s';
}

function toggleWithSpace(e) {
  if(e.keyCode === 32) {
    e.preventDefault();
    createIfNotFound();
    document.removeEventListener('keydown', toggleWithSpace);
  }
}

setTimeout(createIfNotFound, 1000*60*5);
document.addEventListener('keydown', toggleWithSpace);
