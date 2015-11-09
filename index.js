var scrollTo = require('scroll-to');

function handleDown(e) {
  e.preventDefault();

  scrollTo(0, window.innerHeight, {
    ease: 'outSine',
    duration: 500
  });
}

document.querySelector('.down a').addEventListener('click', handleDown);
document.querySelector('.down a').addEventListener('touchdown', handleDown);
