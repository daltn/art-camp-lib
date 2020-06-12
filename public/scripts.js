async function getRandom(img) {
  let infoBlock;
  if (img === 'one') {
    infoBlock = document.querySelector(`.one-info`);
  } else {
    infoBlock = document.querySelector(`.two-info`);
  }
  try {
    let response = await fetch(
      // `http://ec2-100-26-18-204.compute-1.amazonaws.com/get`
      `http://localhost:8080/get`
    );
    let { filename, artist, title, year } = await response.json();
    let node = document.getElementById(img);
    let id = fileCheck(filename);
    node.src = `https://art-camp-library.s3.amazonaws.com/${id}`;
    setTimeout(() => {
      infoBlock.innerHTML = `${artist}, ${title}, ${year}`;
    }, 100);
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

let dragItem = document.querySelector('.info');
let container = document.querySelector('body');

let active = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

container.addEventListener('touchstart', dragStart, false);
container.addEventListener('touchend', dragEnd, false);
container.addEventListener('touchmove', drag, false);

container.addEventListener('mousedown', dragStart, false);
container.addEventListener('mouseup', dragEnd, false);
container.addEventListener('mousemove', drag, false);

function dragStart(e) {
  if (e.type === 'touchstart') {
    initialX = e.touches[0].clientX - xOffset;
    initialY = e.touches[0].clientY - yOffset;
  } else {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
  }

  if (e.target === dragItem) {
    active = true;
  }
}

function dragEnd(e) {
  initialX = currentX;
  initialY = currentY;

  active = false;
}

function drag(e) {
  if (active) {
    e.preventDefault();

    if (e.type === 'touchmove') {
      currentX = e.touches[0].clientX - initialX;
      currentY = e.touches[0].clientY - initialY;
    } else {
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
    }

    xOffset = currentX;
    yOffset = currentY;

    setTranslate(currentX, currentY, dragItem);
  }
}

function setTranslate(xPos, yPos, el) {
  el.style.transform = 'translate3d(' + xPos + 'px, ' + yPos + 'px, 0)';
}

const info = document.querySelector('.info');
const modal = document.querySelector('.modal');

info.ondblclick = function () {
  modal.style.display = 'block';
};

modal.onclick = function () {
  modal.style.display = 'none';
};
