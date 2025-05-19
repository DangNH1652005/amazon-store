const xhr = new XMLHttpRequest(); //create a new HTTP massage send to backend

xhr.addEventListener('load', ()=>{
    console.log(xhr.response);
});

xhr.open('GET', 'https://supersimplebackend.dev');
xhr.send();

