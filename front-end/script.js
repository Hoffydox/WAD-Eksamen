const myStorage = window.localStorage;

const serverURL = 'http://127.0.0.1:8171';

const loginName = document.querySelector('#loginNavn');
const loginPassword = document.querySelector('#loginPassword');
const loginBtn = document.querySelector('#loginBtn');

const logoutBtn = document.querySelector('#logoutBtn');
const secretBtn = document.querySelector('#enterProtectedArea');

const signUpEmail = document.querySelector('#signUpEmail');
const signUpFirstName = document.querySelector('#signUpFirstName');
const signUpLastName = document.querySelector('#signUpLastName');
const signUpPassword = document.querySelector('#signUpPassword');
const signUpBtn = document.querySelector('#signUpBtn');


const pNavn = document.querySelector('#pNavn');
const bTekst = document.querySelector('#bTekst');
const dMål = document.querySelector('#dMål');
const pbillede = document.querySelector('#pbillede');
const ptimelimit = document.querySelector('#ptimelimit');
 // const createProjectBtn = document.querySelector('#createProjectBtn');



// const serverURL = "https://mmd.ucn.dk:8171";

// login (ikke create)
loginBtn.addEventListener('click', (e) => {
    console.log(e);
    //e.preventDefault(); // to avoid page refresh and lose all the data from the input fields!

    // // basic html5 validation for e-mail:: a@a.a
    // check if there is input (both e-mail and password)
    // send "login" request to api

    if (!(loginName.value && loginPassword.value)) {
        alert('Enter e-mail and password!')
    } else {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                alert(`Login successful: ${xhttp.responseText}`);
                const data = JSON.parse(xhttp.responseText);
                console.log(data);
                // render DOM elements with the info we got back -e.g. 'hello user'
                myStorage.setItem('currentUser', xhttp.responseText);
                window.location.href = `http://127.0.0.1:5500/front-end/index.html`;
            }
            if (this.readyState == 4 && this.status >= 400) {
                alert(`Login unsuccessful, error: ${this.status}`);
            }
        }
        xhttp.open('POST', `${serverURL}/api/login`);
        xhttp.setRequestHeader('Content-Type', 'application/json');

        const payload = {
            email: loginName.value,
            password: loginPassword.value
        }

        xhttp.send(JSON.stringify(payload));

    }

}, false);

// Sign up (CREATE)
/*
signUpEmail
signUpFirstName
signUpLastName
signUpPassword
signUpBtn
*/
signUpBtn.addEventListener('click', (e) => {
    console.log(e);
    if (!(signUpEmail.value && signUpFirstName.value && signUpLastName.value && signUpPassword.value)) {
        alert('Udfyld alle felterne!')
    } else {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                alert(`Velkommen til Backers: ${xhttp.responseText}`);
                const data = JSON.parse(xhttp.responseText);
                console.log(data);
                // render DOM elements with the info we got back -e.g. 'hello user'
                //myStorage.setItem('created user', xhttp.responseText);

                // window.location.href = `${serverURL}/front-end/index.html`; // skifter side
            }
            if (this.readyState == 4 && this.status >= 400) {
                alert(`Fejl i oprettelsen, error: ${this.status}`);
            }
        }
        xhttp.open('POST', `${serverURL}/api/users`);
        xhttp.setRequestHeader('Content-Type', 'application/json');

        const payload = {
            userEmail: signUpEmail.value,
            userFirstName: signUpFirstName.value,
            userLastName: signUpLastName.value,
            password: signUpPassword.value
        }

        xhttp.send(JSON.stringify(payload));

    }

}, false);



logoutBtn.addEventListener('click', (e) => {
    console.log(e);
    myStorage.removeItem('currentUser');

});



function createProject () {
    console.log("started");
    console.log(localStorage.getItem("currentUser", "token:"));
    //var token = JSON.parse(localStorage.getItem("currentUser", "token:"));
    //console.log(token);

    if (!(pNavn.value && bTekst.value && dMål.value && pbillede.value && ptimelimit.value)) {
        alert('Udfyld alle felterne!')
    } else {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                alert(`Projekt oprettet!: ${xhttp.responseText}`);
                const data = JSON.parse(xhttp.responseText);
                console.log(data);
                // render DOM elements with the info we got back -e.g. 'hello user'
                //myStorage.setItem('created user', xhttp.responseText);

                // window.location.href = `${serverURL}/front-end/index.html`; // skifter side
            }
            if (this.readyState == 4 && this.status >= 400) {
                alert(`Fejl i oprettelsen af projektet, error: ${this.status}`);
            }
        }
        xhttp.open('POST', `${serverURL}/api/projects`);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        //xhttp.setRequestHeader('x-authentication-token', token);

        if (myStorage.getItem('currentUser')) {
            const { token } = JSON.parse(myStorage.getItem('currentUser'));
            xhttp.setRequestHeader('x-authentication-token', token);
        }

        const payload = {
            projectName: pNavn.value,
            projectDescription: bTekst.value,
            projectGoal: dMål.value,
            projectPicture: pbillede.value,
            projectTimeLimit: ptimelimit.value
        }

        xhttp.send(JSON.stringify(payload));

    }
}



/*
secretBtn.addEventListener('click', (e) => {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const data = JSON.parse(this.responseText);
            console.log(data);
            // can do any kind of DOM or othermanipulation here with the data
            // ...
        }
        if (this.readyState == 4 && this.status >= 400) {
            const errorData = JSON.parse(this.responseText);
            console.log(errorData);
            // display it or do something useful with the error message, warn the user, etc...
            // ...
        }
    }
    xhttp.open('GET', 'http://127.0.0.1:8171/api/users/protected');

    if (myStorage.getItem('currentUser')) {
        const { token } = JSON.parse(myStorage.getItem('currentUser'));
        xhttp.setRequestHeader('x-authentication-token', token);
    }
    xhttp.send();
});
*/

