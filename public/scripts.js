async function getRandom(img) {
  let infoBlock;
  if (img === 'one') {
    infoBlock = document.querySelector(`.one-info`);
  } else {
    infoBlock = document.querySelector(`.two-info`);
  }
  try {
    let response = await fetch(`http://localhost:3000/get`);
    let { filename, artist, title, year } = await response.json();
    let node = document.getElementById(img);
    let id = fileCheck(filename);
    node.src = `https://art-camp-library.s3.amazonaws.com/${id}`;
    infoBlock.innerHTML = `${artist}, ${title}, ${year}`;
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
