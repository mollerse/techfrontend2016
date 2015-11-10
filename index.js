var scrollTo = require('scroll-to');
var vivus = require('vivus');

function handleDown(e) {
  e.preventDefault();

  scrollTo(0, window.innerHeight, {
    ease: 'outSine',
    duration: 500
  });
}

document.querySelector('.down a').addEventListener('click', handleDown);
document.querySelector('.down a').addEventListener('touchdown', handleDown);

new vivus('background', {duration: 100, type: 'oneByOne'});
