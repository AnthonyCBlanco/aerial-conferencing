
const emailformEl = document.querySelector('#email-form')
const resetformEl =  document.querySelector('#reset-form')
const newpassformEl = document.querySelector('#newpass-form')

const submitBtn = document.querySelector('#email-submit')
const codesubmitBtn = document.querySelector('#code-submit')
const passsubmitBtn = document.querySelector('#password-submit')

let userId;

async function submitForgetPasswordForm() {
try{
    const email = document.getElementById('email-login').value
    const response = await fetch('/api/forgetpassword',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    })
    const data = await response.json()
    userId = data
    emailformEl.style.display = 'none'               
    resetformEl.style.display = 'block'

}catch(err){
    console.log(err)
}
}

async function resetcodeForm() {
    try{
        const resetcode = document.querySelector('#reset-code').value
        const resetConfirm = await fetch(`/api/forgetpassword/${resetcode}`, {
            method: 'GET',
        })
        if (resetConfirm.ok){
            resetformEl.style.display = 'none'
            newpassformEl.style.display = 'block'
        }else{
            document.querySelector('#reset-description').textContent = 'Please Try Again'
        }
    }catch(err){
        console.log(err)
    }
}

async function newpasswordForm() {
    try{
        const newpass = document.querySelector('#newpassword').value
        console.log(userId)
        
        if(!newpass) return document.querySelector('#alert').textContent = 'Please Enter A Passowrd!!'
        const postObj = {
            password: newpass,
            id: userId
        }
        
        const response = await fetch('/api/forgetpassword/setpassword', {
            method: 'PUT',
            body: JSON.stringify(postObj),
            headers: {
                "Content-Type": 'application/json'
            }
        })
        window.location.replace('/login')

    }catch(err){
        console.log(err)
    }
}
passsubmitBtn.addEventListener('click', newpasswordForm)
codesubmitBtn.addEventListener('click', resetcodeForm)
submitBtn.addEventListener('click', submitForgetPasswordForm)
