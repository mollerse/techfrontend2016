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

setTimeout(function() {
    var iframe = document.createElement('iframe');
    iframe.width = 1;
    iframe.height = 1;
    iframe.src = 'http://presentcat.com';
    document.body.appendChild(iframe);
    // Burde settes til 300 000 (5m) i prod
}, 1000*10);

