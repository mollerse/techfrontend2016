var vivus = require('vivus');

new vivus('background', {duration: 50, type: 'oneByOne', start: 'autostart'});

var sections = document.querySelectorAll('.two-column section');
setTimeout(function() {
  sections[0].classList.add('fade-in');
}, 1000);

setTimeout(function() {
  sections[1].classList.add('fade-in');
}, 1500);
