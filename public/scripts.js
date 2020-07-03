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
      // `http://localhost:8080/get`
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

let imgOneOff = true;
let imgTwoOff = true;

function showMobileInfo(imgId) {
  let image = document.querySelector(`#${imgId}`);
  if (imgOneOff && imgTwoOff) {
    image.style.opacity = 0;
    if (imgId === 'one') {
      imgOneOff = !imgOneOff;
    } else {
      imgTwoOff = !imgTwoOff;
    }
  } else if (!imgOneOff) {
    imgOneOff = true;
    image.style.opacity = 1;
  } else {
    imgTwoOff = !imgTwoOff;
    image.style.opacity = 1;
  }
}

// document.addEventListener('touchstart', handleTouchStart, false);
// document.addEventListener('touchmove', handleTouchMove, false);

// let xDown = null;
// let yDown = null;

// function getTouches(evt) {
//   return evt.touches; // browser API
// }

// function handleTouchStart(evt) {
//   const firstTouch = getTouches(evt)[0];
//   xDown = firstTouch.clientX;
//   yDown = firstTouch.clientY;
// }

// function handleTouchMove(evt) {
//   if (!xDown || !yDown) {
//     return;
//   }

//   let xUp = evt.touches[0].clientX;
//   let yUp = evt.touches[0].clientY;

//   let xDiff = xDown - xUp;
//   let yDiff = yDown - yUp;

//   if (Math.abs(xDiff) > Math.abs(yDiff)) {
//     if (xDiff > 0) {
//       alert('left swipe');
//     } else {
//       alert('right swipe');
//     }
//   } else {
//     if (yDiff > 0) {
//       /* up swipe */
//     } else {
//       /* down swipe */
//     }
//   }
//   xDown = null;
//   yDown = null;
// }
