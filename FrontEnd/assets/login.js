
const form = document.querySelector("#login form");

// Ecoute du formulaire au clic sur le bouton submit
form.addEventListener("submit", async (event) => {
    try {
        event.preventDefault();

        displayErrorMessage(""); // pour effacer le message d'erreur

        const email = document.getElementById("email").value;
        checkEmail(email);
        const password = document.getElementById("password").value;
        checkPassword(password)

        // Demande d'authentification
        const authentification = await requestAuth(email, password);

        if (authentification.ok) { // authentification ok
            
            let authentificationOk = await authentification.json();
            // on garde sur le localStorage l'userId et le token
            memorizeUser(authentificationOk);
            // on charge la page principale
            window.location.assign("./../index.html");

        } else { // authentification KO
            
            AuthErrorHandle(authentification.status);
        }

    } catch(error) {
        displayErrorMessage(error.message);
    }
});


/*
 * FONCTIONS
 */

/**************************************************
 * Vérifie le format d'email saisi et que le mot de passe ne soit pas vide
 **************************************************/
function checkEmail(email) {
    let regex = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\.[a-z0-9._-]+");
    if (!regex.test(email)) {
        throw new Error("Veuillez saisir un email.");
    }
}
function checkPassword(password) {
    if (password === "") {
        throw new Error("Veuillez saisir le mot de passe.");
    }
}
/**************************************************
 * Affiche un message d'erreur sur le formulaire si :
 * - Erreur de saisie dans l'un des champs
 * - l'authentification a échouée
 **************************************************/
function displayErrorMessage(message) {
    let spanErrorMessage = document.getElementById("errorMessage");
    if (!spanErrorMessage) {
        spanErrorMessage = document.createElement("span");
        spanErrorMessage.id = "errorMessage";
        form.prepend(spanErrorMessage);
    }
    spanErrorMessage.innerText = message;
}
/**************************************************
 * Requête d'authentification
 **************************************************/
async function requestAuth(email, password) {
    // prépare le body pour la requête d'authentification
    const credentials = {email: email, password: password};
    const requestBody = JSON.stringify(credentials);
    // requête d'authentification
    let responseAPI = await fetch('http://localhost:5678/api/users/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestBody,
    });
    return responseAPI;
}
/**************************************************
 * Récupère le statut de la requête d'authentification
 * et gère les messages d'erreur suivant le cas
 **************************************************/
function AuthErrorHandle(statusCode) {
    switch(statusCode) {
        case 200:
            throw new Error("Connexion réussie."); // ce cas ne devrait pas se produire car testé en amont
        case 401:
            throw new Error("Mot de passe incorrect.");
        case 404:
            throw new Error("Email inconnu.");
        default:
            throw new Error("Erreur d'authentification inconnue."); // erreur inconnue
    }
}
/**************************************************
 * Utilise le localStorage pour mémoriser l'userId et le token
 **************************************************/
function memorizeUser(authentificationOk) {
    window.localStorage.setItem("userId", authentificationOk.userId);
    window.localStorage.setItem("token", authentificationOk.token);
}
