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
            category === "Tous" ? button.classList.add("active-btn"): "";
            
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
function updateGallery(works) {
    const gallery = document.querySelector(".gallery");
    
    // vide la gallerie des éléments présents par défaut dans le HTML
    gallery.innerHTML = "";

    for (const work of works) {
        const figure = `<figure>
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
            updateGallery(filteredWorks);
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
let modal = null;
const wrappers = document.querySelectorAll(".modal_wrapper");
let activeWrapper = wrappers[0];
activeWrapper.classList.add("activeWrapper");

/**************************************************
 * initialisation du EventListener pour la modale
 **************************************************/
function initAddEventListenerModal() {
    document.querySelector(".js-modal").addEventListener("click", openModal);
}
/**************************************************
 * Ouverture de la modale
 **************************************************/
const openModal = function (event) {
    event.preventDefault();
    modal = document.getElementById("modal");
    modal.style.display = "flex";
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", "true");
    showModalGallery();
    modal.addEventListener("click", closeModal);
    activeWrapper.querySelector(".js-modal-close").addEventListener("click", closeModal);
}
/**************************************************
 * Fermeture de la modale
 **************************************************/
const closeModal = function (event) {
    if (modal === null) return;
    const jsBtnClose = activeWrapper.querySelector(".js-modal-close");
    if (event.target === modal || event.target === jsBtnClose) {
        modal.setAttribute("aria-hidden", "true");
        modal.removeAttribute("aria-modal");
        modal.removeEventListener("click", closeModal);
        jsBtnClose.removeEventListener("click", closeModal);
        modal.style.display = "none";
        modal = null;
    }
}
/**************************************************
 * Sélection du wrapper à afficher
 **************************************************/
function switchWrapper(wrapper) {
    // TODO => revoir la logique
    if (wrapper === 0) { wrapper = 1; } else { wrapper = 0; }
    for (let wrapperInList of wrappers) wrapperInList.classList.remove("activeWrapper");
    wrappers[wrapper].classList.add("activeWrapper");
}
/**************************************************
 * Récupère le filtrage actif
 * et affichage les travaux dans la gallerie
 **************************************************/
function showModalGallery() {
    const filtersbuttons = document.querySelectorAll(".filters button");
    let category = "Tous"; // par défaut pour afficher tous les travaux
    for (const button of filtersbuttons) {
        if (button.classList.contains("active-btn")) category = button.dataset.category;
    }
    const filteredWorks = works.filter(function (work) {
        return category === "Tous" ? true : work.category.name === category;        
    });
    
    const gallery = document.querySelector(".galleryModal");
    gallery.innerHTML = "";
    for (const work of filteredWorks) {
        const figure = `<figure>
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
            removeWork(removeBtn.dataset.id);
        });
    }
}
/**************************************************
 * Supprime une image de la BDD
 **************************************************/
async function removeWork(workId) {
    console.log("Ok pour supprimer l'image " + workId);
    
    
    closeModal; // code à revoir pour aussi retirer les Listeners
}
/**************************************************
 * FIN DES FONCTIONS
 **************************************************/


/**************************************************
 * Début du Script
 **************************************************/

// génération des boutons de filtres dynamiquement
addFilterButtons(listingCategories(works));
// affichage de la gallery
updateGallery(works);
// ajout des Listeners sur les boutons filtres
filteredButtonsListener();

// si l'admin est connecté
if (isAdminConnected()) {
    // gère l'affichage si l'admin est connecté
    ShowAdminFunctions();
    // écoute les demandes de déconnexion
    listenLogOut();
    // écoute l'appel à la modale de modification 
    initAddEventListenerModal();
} else {
    // écoute les demandes de connexion
    listenLogIn();
}
