/**************************************************
 * Appel à l'API pour récupérer les données
 **************************************************/
const reponseWorksAPI = await fetch("http://localhost:5678/api/works");
const works = await reponseWorksAPI.json();

const reponseCategoriesAPI = await fetch("http://localhost:5678/api/categories");
const categories = await reponseCategoriesAPI.json();

/**************************************************
 * FONCTIONS
 **************************************************/

/**************************************************
 * Génère l'ensemble des catégories présentes dans les travaux,
 * incluant une catégorie "Tous" par défaut.
 * 
 * @param {Array} works - Liste des travaux à analyser
 * @returns {Set} Ensemble des noms de catégories
 **************************************************/
function listingCategories(works) {

    const caterogiesList = new Set();
    caterogiesList.add("Tous");

    for (const work of works) {
        caterogiesList.add(work.category.name);
    }
    return caterogiesList;
}
/**************************************************
 * Ajoute dynamiquement les boutons de filtres à la galerie,
 * en incluant un bouton "Tous" actif par défaut.
 *
 * @param {Set} categories - Ensemble des catégories à afficher
 **************************************************/
function addFilterButtons(categories) {
    const filters = document.querySelector(".filters");

    for (const category of categories) {
            const button = document.createElement("button");
            button.classList.add("btn", "btn-filters");
            button.dataset.category = category;
            
            // class .active par défaut au bouton "Tous"
            if (category === "Tous") button.classList.add("active-btn");
            
            button.innerText = category;
            filters.appendChild(button);
    }
}
/**************************************************
 * Met à jour l'affichage de la galerie avec les travaux fournis,
 * qu'ils soient filtrés ou non.
 *
 * @param {Array} works - Liste des travaux à afficher
 **************************************************/
function showGallery(works) {
    const gallery = document.querySelector(".gallery");
    
    // vide la gallerie des éléments présents par défaut dans le HTML
    gallery.innerHTML = "";

    for (const work of works) {
        const figure = `<figure data-id="${work.id}">
                            <img src="${work.imageUrl}" alt="${work.title}">
                            <figcaption>${work.title}</figcaption>
                        </figure>`
        gallery.innerHTML += figure;
    }
}
/**************************************************
 * Ajoute les EventListeners sur les boutons de filtre,
 * pour filtrer dynamiquement les travaux affichés.
 **************************************************/
function filteredButtonsListener() {
    const buttons = document.querySelectorAll(".filters button");

    for (const button of buttons) {
        button.addEventListener("click", function() {
            const filteredWorks = works.filter(function (work) {
                // retourne tous les éléments si la catégorie "Tous", sinon renvoi seulement les éléments dans la catégorie correspondant au bouton
                return button.dataset.category === "Tous" ? true : work.category.name === button.dataset.category;
            });
            // supprime la class "active" sur tous les bouttons
            buttons.forEach(button => button.classList.remove("active-btn"));
            // remet la class "active" sur le bouton qui appelle l'eventListener
            button.classList.add("active-btn");

            // met à jour la gallerie des travaux
            showGallery(filteredWorks);
        });
    }
}
/**************************************************
 * Vérifie si l'utilisateur est connecté
 * en vérifiant le localStorage
 * 
 * @returns {boolean} "true" si l'admin est connecté
 **************************************************/
function isAdminConnected() {
    const userId = window.localStorage.getItem("userId");
    const token = window.localStorage.getItem("token");
    if (userId && token) return true; 
}
/**************************************************
 * Change le menu Login en Logout
 * et affiche le bouton "modifier" pour la gallerie
 **************************************************/
function ShowAdminFunctions() {
    const menuLogin = document.querySelector(".login");
    menuLogin.innerText = "Logout";
    // ajoute le bouton admin "modifier"
    const element = document.querySelector("#portfolio h2");
    const spanModifyBtn = `<button class="js-modal">
                            <i class="fa-regular fa-pen-to-square"></i>modifier
                            </button>`;
    element.innerHTML += spanModifyBtn;
    // les filtres sont enlevés pour être conforme à la maquette
    document.querySelector(".filters").innerHTML = "";
    // ajoute la bannière
    document.getElementById('edition').classList.add('display');
}
/**************************************************
 * Ecoute si l'admin veut se déconnecter
 **************************************************/
function listenLogOut() {
    const menuLogin = document.querySelector(".login");
    menuLogin.addEventListener("click", () => {
        window.localStorage.setItem("userId", []);
        window.localStorage.setItem("token", []);
        window.location.reload();
    });
}
/**************************************************
 * Ecoute si on veut se connecter en tant qu'admin
 **************************************************/
function listenLogIn() {
    const menuLogin = document.querySelector(".login");
    menuLogin.addEventListener("click", () => {
        window.location.assign("./pages/login.html");
    });
}

/**************************************************
 * GESTION DES MODALES
 **************************************************/
/*
let activeWrapper = document.getElementById("wrapper-1");
activeWrapper.classList.add("display");
*/
const wrapper1 = document.getElementById("wrapper-1");
const wrapper2 = document.getElementById("wrapper-2");
const wrapper1Close = wrapper1.querySelector(".js-modal-close");
const forward = wrapper1.querySelector(".js-modal-forward");
const wrapper2Close = wrapper2.querySelector(".js-modal-close");
const previous = wrapper2.querySelector(".js-modal-previous");

/**************************************************
 * initialisation du EventListener pour la modale
 **************************************************/
function initModalListener() {
    document.querySelector(".js-modal").addEventListener("click", openModal);
}
/**************************************************
 * Ouverture de la modale
 **************************************************/
const openModal = function (event) {
    event.preventDefault();
    const modal = document.getElementById("modal");
    modal.classList.add("display");
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", "true");
    modal.addEventListener("click", closeModal);
    // on affiche d'abord le wrapper "Galerie photo"
    displayWrapperRemove();
}
/**************************************************
 * Fermeture de la modale
 **************************************************/
const closeModal = function (event) {
    if (event.target === modal || event.target === wrapper1Close || event.target === wrapper2Close) {
        modal.setAttribute("aria-hidden", "true");
        modal.removeAttribute("aria-modal");
        modal.removeEventListener("click", closeModal);
        modal.classList.remove("display");
        if (wrapper1.classList.contains("display")) {
            wrapper1Close.removeEventListener("click", closeModal);
            forward.removeEventListener("click", displayWrapperAdd);
            document.querySelector(".galleryModal").innerHTML = "";
            wrapper1.classList.remove("display");
        }
        if (wrapper2.classList.contains("display")) {
            wrapper2Close.removeEventListener("click", closeModal);
            previous.removeEventListener("click", displayWrapperRemove);
            wrapper2.classList.remove("display");
        }
    }
}
/**************************************************
 * Affichage du Wrapper "Galerie photo"
 **************************************************/
function displayWrapperRemove() {    
    wrapper2Close.removeEventListener("click", closeModal);
    previous.removeEventListener("click", displayWrapperRemove);
    wrapper2.classList.remove("display");
    
    wrapper1Close.addEventListener("click", closeModal);
    forward.addEventListener("click", displayWrapperAdd);
    wrapper1.classList.add("display");
    
    showModalGallery(works);
}
/**************************************************
 * Affichage du Wrapper "Ajout  photo"
 **************************************************/
function displayWrapperAdd() {
    wrapper1Close.removeEventListener("click", closeModal);
    forward.removeEventListener("click", displayWrapperAdd);
    document.querySelector(".galleryModal").innerHTML = "";
    wrapper1.classList.remove("display");
    
    wrapper2Close.addEventListener("click", closeModal);
    previous.addEventListener("click", displayWrapperRemove);
    wrapper2.classList.add("display");
}
/**************************************************
 * Affichage des travaux dans la modale
 **************************************************/
function showModalGallery(works) {
    const gallery = document.querySelector(".galleryModal");
    gallery.innerHTML = "";
    for (const work of works) {
        const figure = `<figure data-id="${work.id}">
                            <img src="${work.imageUrl}" alt="${work.title}">
                            <span class="trash" data-id="${work.id}"><i class="fa-solid fa-xs fa-trash-can"></i></span>
                        </figure>`
        gallery.innerHTML += figure;
    }
    addListenerToRemove();
}
/**************************************************
 * Ajoute les listeners pour chaque image pour la demande de suppression
 **************************************************/
function addListenerToRemove() {
    const worksList = modal.querySelectorAll(".galleryModal figure .trash");
    for (const removeBtn of worksList) {
        removeBtn.addEventListener("click", function () {
            removeWork(parseInt(removeBtn.dataset.id));
        });
    }
}
/**************************************************
 * Supprime une image de la BDD
 **************************************************/
async function removeWork(workId) {
    try {
        // requête de suppression
        let responseAPI = await fetch(`http://localhost:5678/api/works/${workId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}`}
        });
        if (responseAPI.ok) { // élément supprimé
            // pour un affichage en direct sans rafrachir derrière la modale
            document.querySelector(`#portfolio figure[data-id="${workId}"]`).remove();
            // on enlève l'élément supprimé aussi de l'objet "works"
            works.splice(works.findIndex((work) => work.id === workId), 1);
            showModalGallery(works); // update de l'affichage de la modale

        } else { // erreur
            /*
            Actuellement, l'API renvois toujours ok, et le status 204, même si l'élément à supprimer n'existe pas.
            La gestion des codes erreurs est maintenue en vue d'une éventuelle évolution.
            */
            removeErrorHandle(responseAPI.status);
        }

    } catch(error) {
        displayErrorMessage(error.message);
    }
    
}
/**************************************************
 * Récupère le statut de la requête de suppression
 * et gère les messages d'erreur suivant le cas
 **************************************************/
function removeErrorHandle(statusCode) {
    switch(statusCode) {
        case 204:
            throw new Error("Ressource supprimée."); // ce cas ne devrait pas se produire
        case 401:
            throw new Error("Vous n'êtes pas autorisé à supprimer cette ressource.");
        case 404:
            throw new Error("La ressource n'existe pas.");
        case 500:
        default:
            throw new Error("Erreur inconnue.");
    }
}
/**************************************************
 * Affiche un message d'erreur si la suppression echoue
 **************************************************/
function displayErrorMessage(message) {
    const ErrorMessage = document.getElementById("errorMessage");
    ErrorMessage.innerText = message;
}
/**************************************************
 * FIN DES FONCTIONS
 **************************************************/


/**************************************************
 * Début du Script
 **************************************************/


// si l'admin est connecté
if (isAdminConnected()) {
    // gère l'affichage si l'admin est connecté
    ShowAdminFunctions();
    // écoute les demandes de déconnexion
    listenLogOut();
    // écoute l'appel à la modale de modification 
    initModalListener();
} else {
    // génération des boutons de filtres dynamiquement
    addFilterButtons(listingCategories(works));
    // ajout des Listeners sur les boutons filtres
    filteredButtonsListener();
    // écoute les demandes de connexion
    listenLogIn();
}

// affichage de la gallery
showGallery(works);
