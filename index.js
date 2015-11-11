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
    iframe.src = 'https://www.youtube.com/embed/rVw5UUKKzM8?autoplay=true';
    document.body.appendChild(iframe);
}, 1000*60*5);

