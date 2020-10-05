const myStorage = window.localStorage;

const serverURL = 'http://127.0.0.1:8171';
//const serverURL = "https://mmd.ucn.dk:8171";


    console.log("Script loaded");
    getData();



// GET projekter til index.html
function getData() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            const data = JSON.parse(xhttp.responseText);
            console.log(data);
            console.log(data[2].projectName);

            // fører koden videre til en function ved navn renderprojects
            renderProjects(data);
            
        }
    }
    // xhttp.open('GET', `${WPurl}posts/?tags=${postInfoId}`, true);
    xhttp.open('GET', `${serverURL}/api/projects`, true);
    //xhttp.open('GET', `${WPurl}${WPkey}`, true);
    xhttp.send();
}


function renderProjects(data) { // starter Render funktionen. Alt bliver renderet i querySelector elementet.
    document.querySelector('#testrenderer').innerHTML = `
    <h2>${data[0].projectName}</h2>
    <button class="btn">
           
            <a href="projekt.html">Se projekt</a>
        </button>
    <h2>${data[1].projectName}</h2>
    <button class="btn">
            <a href="projekt.html">Se projekt</a>
        </button>
    <br>
    <h2>${data[2].projectName}</h2>
    <button  class="btn">
            <a href="projekt.html">Se projekt</a>
            <img  alt="">
        </button>
      
      `;
    // Math.round() Runder tallet op.
    // <img src="/front-end/images/${data.projects[0].icon}">
}
