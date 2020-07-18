async function getRandom(img) {
  let infoBlock;
  if (img === 'one') {
    infoBlock = document.querySelector(`.one-info`);
    infoBlock.opacity = 0;
  } else {
    infoBlock = document.querySelector(`.two-info`);
    infoBlock.opacity = 0;
  }
  try {
    let response = await fetch(
      // `http://artcamplibrary.com/get`
      `http://localhost:8080/get`
    );
    let { filename, artist, title, year } = await response.json();
    let node = document.getElementById(img);
    let id = fileCheck(filename);
    node.onload = () => {
      setTimeout(() => {
        infoBlock.innerHTML = `${artist}, ${title}, ${year}`;
        infoBlock.opacity = 1;
      }, 300);
    };
    node.src = `https://art-camp-library.s3.amazonaws.com/${id}`;
  } catch (e) {
    console.error(e);
  }
}

let viewportWidth

function setViewport() {
  viewportWidth = window.innerWidth || document.documentElement.clientWidth;
}

setViewport()

window.addEventListener('resize', setViewport)

async function init() {
  getRandom('one');
  getRandom('two');
}

function fileCheck(file) {
  if (file[file.length - 2] === 'e') {
    return `${file.slice(0, -2)}g`;
  } else {
    return file;
  }
}

const info = document.querySelector('.info');
const modal = document.querySelector('.modal');

info.onclick = function () {
  modal.style.display = 'block';
};

modal.onclick = function () {
  modal.style.display = 'none';
};

const imgOne = document.querySelector('#one')
const imgTwo = document.querySelector('#two')

function toggleMobileInfo(key) {
  key === 'one' ?
  imgOne.classList.toggle('blur') :
  imgTwo.classList.toggle('blur')
}

const hammerOne = new Hammer(imgOne)
const hammerTwo = new Hammer(imgTwo)

hammerOne.on('swipe', () => toggleMobileInfo('one'))
hammerTwo.on('swipe', () => toggleMobileInfo('two'))

