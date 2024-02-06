const wrapper=document.querySelector('.wrapper');
const signUpLink=document.querySelector('.signup-link');
const signInLink=document.querySelector('.signIn-link');

signUpLink.addEventListener('click',() =>{
    wrapper.classList.add('animate-signIn');
    wrapper.classList.remove('animate-signIn');
});

signInLink.addEventListener('click',() =>{
    wrapper.classList.add('animate-signup');
    wrapper.classList.remove('animate-signIn');
});