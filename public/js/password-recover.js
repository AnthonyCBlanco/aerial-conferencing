const emailformEl = document.querySelector('#email-form')
const resetformEl =  document.querySelector('#reset-form')
const newpassformEl = document.querySelector('#newpass-form')

const submitBtn = document.querySelector('#email-submit')

async function submitForgetPasswordForm() {
try{
    const email = document.getElementById('email-login').value
    fetch('/api/forgetpassword',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    })
    emailformEl.style.display = 'none'               
    resetformEl.style.display = 'block'
    
    
}catch(err){
    console.log(err)
}
}

submitBtn.addEventListener('click', submitForgetPasswordForm)
