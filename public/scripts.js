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
      `http://artcamplibrary.com/get`
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

const info = document.querySelector('.info');
const modal = document.querySelector('.modal');

info.onclick = function () {
  modal.style.display = 'block';
};

modal.onclick = function () {
  modal.style.display = 'none';
};

function toggleMobileInfo(key) {
  key === 'one' ?
  imgOne.classList.toggle('blur') :
  imgTwo.classList.toggle('blur')
}

let viewportWidth

function setViewport() {
  viewportWidth = window.innerWidth || document.documentElement.clientWidth;
}

setViewport()

window.addEventListener('resize', setViewport)

const clickFuncSwap = (id) => {
  if(viewportWidth > 600) getRandom(id)
  else toggleMobileInfo(id)
}

const imgOne = document.querySelector('#one')
const imgTwo = document.querySelector('#two')

imgOne.onclick = () => clickFuncSwap('one')
imgTwo.onclick = () => clickFuncSwap('two')

const hammerOne = new Hammer(imgOne)
const hammerTwo = new Hammer(imgTwo)

hammerOne.on('swipe', () => getRandom('one'))
hammerTwo.on('swipe', () => getRandom('two'))


async function getCatalog() {
  try {
    let response = await fetch(
      `http://artcamplibrary.com/all`
    );
    const catalog = await response.json();
    let node = document.querySelector('.init');
    catalog.forEach(item => {
      const row = document.createElement('tr')
      for (const data in item) {
        const cell = document.createElement('td')
        cell.innerHTML = item[data]
        row.appendChild(cell)
      }
      node.after(row)
    })
  } catch (e) {
    console.error(e);
  }
}

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

document.onkeydown = checkKey;

function checkKey(e) {
    e = e || window.event

    if (e.keyCode == '37') {
      getRandom('one')
    }
    else if (e.keyCode == '39') {
       getRandom('two')
    }
}

