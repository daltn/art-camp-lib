async function getRandom(img) {
  try {
    let response = await fetch(`http://localhost:3000/get`);
    let { filename } = await response.json();
    let node = document.getElementById(img);
    console.log(node);
    let id = fileCheck(filename);
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
