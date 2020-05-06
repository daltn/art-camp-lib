async function getRandom() {
  console.log('hyyyy');
  let response = await fetch(`http://localhost:3000/get`);
  let data = await response.json();
  console.log(data);
  return data;
}

function hey() {
  console.log('yyyyyyys');
}
