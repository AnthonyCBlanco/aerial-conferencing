
function submitForgetPasswordForm() {
const email = document.getElementById('email-login').value;

fetch('api/users/forgetpassword', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
})
.then(response => response.json())
.then(data => {
    console.log(data);
})
.catch(error => {
    console.error('Error:', error);
});
}

