// this file for BASE js functions

//! learning 
let signUpBtnVerify = document.getElementById('sign-up-btn-verify')
const event = new Event('build', {
    boolin: true,
    detail: {text: () => signUpBtnVerify.value}
});

Element.addEventListener('build', function (e) {
    detail: Element.dataset.time
})

function eventHandler(e) {
    console.log('the time is: ' + e.detail)
}