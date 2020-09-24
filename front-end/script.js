const loginName = document.querySelector('#loginNavn');
const loginPassword = document.querySelector('#loginPassword');
const loginBtn = document.querySelector('#loginBtn');
const logoutBtn = document.querySelector('#logoutBtn');
const secretBtn = document.querySelector('#enterProtectedArea');
const myStorage = window.localStorage;



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
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                alert(`Login successful: ${xhttp.responseText}`);
                const data = JSON.parse(xhttp.responseText);
                console.log(data);
                // render DOM elements with the info we got back -e.g. 'hello user'
                myStorage.setItem('currentUser', xhttp.responseText);
            }
            if (this.readyState == 4 && this.status >= 400) {
                alert(`Login unsuccessful, error: ${this.status}`);
            }
        }
        xhttp.open('POST', 'http://127.0.0.1:8171/api/login');
        xhttp.setRequestHeader('Content-Type', 'application/json');

        const payload = {
            email: loginName.value,
            password: loginPassword.value
        }

        xhttp.send(JSON.stringify(payload));
    }

}, false);

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

logoutBtn.addEventListener('click', (e) => {
    myStorage.removeItem('currentUser');
});