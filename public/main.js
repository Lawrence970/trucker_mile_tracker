// this file for BASE js functions








//! {sign-up & login form}----------------------------------------------------------------------------
//? setFormMessage(loginForm, "success", "youre logged in")

function setFormMessage(formElement, type, message) {
    const messageElement = formElement.querySelector(".form-message");
    messageElement.textContent = message;
    messageElement.classList.remove("form-message-success", "form-message-error");
    messageElement.classList.add(`form-message-${type}`)
}

function setInputError(inputElement, message) {
    inputElement.classList.add("form-input-error");
    inputElement.parentElement.querySelector(".form-input-error-message").textContent = message;
}

function clearInputError (inputElement) {
    inputElement.classList.remove("form-input-error");
    inputElement.parentElement.querySelector(".form-input-error-message").textContent = "";
}

document.addEventListener("DOMContentLoaded", () => {
    const landingContainer = document.querySelector("#landing-container");
    const formContainer = document.querySelector("#form-container")
    const loginForm = document.querySelector("#login");
    const createAccountForm = document.querySelector("#createAccount");


    //* landing container logic >>>

    //? listening for click on 'Sign Up' button on landing container
    document.querySelector("#redirect-form-signUp").addEventListener("click", (e) =>{
        e.preventDefault();        
        landingContainer.classList.add("container-hidden");
        formContainer.classList.remove("container-hidden")
        createAccountForm.classList.remove("form-hidden")
    });

    //? listening for click on 'Sign In' button on landing container
    document.querySelector("#redirect-form-login").addEventListener("click", (e) =>{
        e.preventDefault();
        landingContainer.classList.add("container-hidden");
        formContainer.classList.remove("container-hidden")
        loginForm.classList.remove("form-hidden")
    });
    //* end of landing container logic <<<

    //! -------------

    //* form container logic >>> 
    document.querySelector("#linkCreateAccount").addEventListener("click", (e) =>{
        e.preventDefault();
        loginForm.classList.add("form-hidden");
        createAccountForm.classList.remove("form-hidden");
    });

    document.querySelector("#linkLogin", "#redirect-form-login").addEventListener("click", (e) =>{
        e.preventDefault();
        console.log(" Account")
        loginForm.classList.remove("form-hidden");
        createAccountForm.classList.add("form-hidden");
    });

    loginForm.addEventListener("submit", (e) =>{
        e.preventDefault();

        // TODO
        // perform the login fetch method
        // error if(statements)
    });

    document.querySelectorAll(".form-input").forEach(inputElement =>{
        inputElement.addEventListener("blur", (e) =>{
            if(e.target.id === "signUpEmail" && e.target.value.length > 0 && e.target.value.length < 10){
                setInputError(inputElement, "username must be at least 10 char long");
            }
        });
        inputElement.addEventListener("input", (e) =>{
            clearInputError(inputElement);
        })
    })

    //* end of form container logic <<<
});
//! end of {sign up login form} -----------------------------------------------------------------