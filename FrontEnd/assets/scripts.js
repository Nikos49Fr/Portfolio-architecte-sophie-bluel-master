/**************************************************
 * Appel à l'API pour récupérer les données
 **************************************************/
const reponseWorksAPI = await fetch("http://localhost:5678/api/works");
let works = await reponseWorksAPI.json();

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
function showAdminFunctions() {
    const menuLogin = document.querySelector(".login");
    menuLogin.innerText = "logout";
    // ajoute le bouton admin "modifier"
    const element = document.querySelector("#portfolio h2");
    const spanModifyBtn = `<button class="js-modal">
                            <i class="fa-regular fa-pen-to-square"></i>modifier
                            </button>`;
    element.innerHTML += spanModifyBtn;
    // les filtres sont enlevés pour être conforme à la maquette
    document.querySelector(".filters").innerHTML = "";
    // ajoute la bannière
    document.getElementById('admin-banniere').classList.add('js-display');
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
const modal = document.getElementById("modal");
const wrapper1 = document.getElementById("wrapper-1");
const wrapper2 = document.getElementById("wrapper-2");
const wrapper1Close = wrapper1.querySelector(".js-modal-close");
const forward = wrapper1.querySelector(".js-modal-forward");
const wrapper2Close = wrapper2.querySelector(".js-modal-close");
const previous = wrapper2.querySelector(".js-modal-previous");
const form = document.getElementById("edition");
const importImage = document.getElementById("photoToAdd");
const submit = document.getElementById("submitNewWork");
const gallery = document.querySelector(".gallery");
const galleryModal = modal.querySelector(".galleryModal");

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
    modal.classList.add("js-display");
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
        modal.classList.remove("js-display");
        if (wrapper1.classList.contains("js-display")) {
            wrapper1Close.removeEventListener("click", closeModal);
            forward.removeEventListener("click", displayWrapperAdd);
            document.querySelector(".galleryModal").innerHTML = "";
            wrapper1.classList.remove("js-display");
        }
        if (wrapper2.classList.contains("js-display")) {
            wrapper2Close.removeEventListener("click", closeModal);
            previous.removeEventListener("click", displayWrapperRemove);
            wrapper2.classList.remove("js-display");
            galleryModal.removeEventListener("click", callRemove);
            emptyForm();
            importImage.removeEventListener("change", checkImageFormat);
            form.removeEventListener("input", checkForm);
            submit.removeEventListener("click", sendNewWork);
        }
    }
}
/**************************************************
 * Affichage du Wrapper "Galerie photo"
 **************************************************/
function displayWrapperRemove() {    
    wrapper2Close.removeEventListener("click", closeModal);
    previous.removeEventListener("click", displayWrapperRemove);
    wrapper2.classList.remove("js-display");
    emptyForm();
    importImage.removeEventListener("change", checkImageFormat);
    form.removeEventListener("input", checkForm);
    submit.removeEventListener("click", sendNewWork);
    
    wrapper1Close.addEventListener("click", closeModal);
    forward.addEventListener("click", displayWrapperAdd);
    wrapper1.classList.add("js-display");
    
    showModalGallery(works);

    displayErrorMessage(wrapper1, "");
}
/**************************************************
 * Affichage du Wrapper "Ajout  photo"
 **************************************************/
function displayWrapperAdd() {
    wrapper1Close.removeEventListener("click", closeModal);
    forward.removeEventListener("click", displayWrapperAdd);
    document.querySelector(".galleryModal").innerHTML = "";
    wrapper1.classList.remove("js-display");
    galleryModal.removeEventListener("click", callRemove);
    emptyForm();
    importImage.removeEventListener("change", checkImageFormat);
    form.removeEventListener("input", checkForm);
    submit.removeEventListener("click", sendNewWork);
    
    wrapper2Close.addEventListener("click", closeModal);
    previous.addEventListener("click", displayWrapperRemove);
    wrapper2.classList.add("js-display");

    listenFormAddImg();

    displayErrorMessage(wrapper2, "");
}
/**************************************************
 * Affichage des travaux dans la modale
 * Ajoute le listener pour la suppression
 **************************************************/
function showModalGallery(works) {
    galleryModal.innerHTML = "";
    for (const work of works) {
        const figure = `<figure data-id="${work.id}">
                            <img src="${work.imageUrl}" alt="${work.title}">
                            <span class="trash" data-id="${work.id}"><i class="fa-solid fa-xs fa-trash-can"></i></span>
                        </figure>`
        galleryModal.innerHTML += figure;
    }
    galleryModal.addEventListener("click", callRemove);
}
/**************************************************
 * Listener déclenche la suppression (event par délégation)
 **************************************************/
function callRemove(event) {
    const trash = event.target.closest(".trash");
    if (trash) {
        if (window.confirm("Voulez-vous vraiment supprimer cette image ?")) {
            removeWork(parseInt(trash.dataset.id));
        }
    }
}
/**************************************************
 * Supprime une image de la BDD
 **************************************************/
async function removeWork(workId) {
    try {
        
        displayErrorMessage(wrapper1, "");
        // requête de suppression
        let responseAPI = await fetch(`http://localhost:5678/api/works/${workId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}`}
        });
        if (responseAPI.ok) { // élément supprimé
            // pour un affichage en direct sans rafrachir derrière la modale
            document.querySelector(`#portfolio figure[data-id="${workId}"]`).remove();
            // update de l'affichage de la modale
            document.querySelector(`.galleryModal figure[data-id="${workId}"]`).remove();
            // on enlève l'élément supprimé aussi de l'objet "works"
            works.splice(works.findIndex((work) => work.id === workId), 1);
            
        } else { // erreur
            /*
            Actuellement, l'API renvois toujours ok, et le status 204, même si l'élément à supprimer n'existe pas.
            La gestion des codes erreurs est maintenue en vue d'une éventuelle évolution.
            */
            removeErrorHandle(responseAPI.status);
        }

    } catch(error) {
        displayErrorMessage(wrapper1, error.message);
    }
    
}
/**************************************************
 * Ecouteur d'évènement sur le formulaire d'ajout d'image
 **************************************************/
function listenFormAddImg() {
    try {
        displayErrorMessage(wrapper2, "");
        initCategoriesList();
        importImage.addEventListener("change", checkImageFormat);
        form.addEventListener("input", checkForm);
        submit.addEventListener("click", sendNewWork);
    } catch(error) {
        displayErrorMessage(wrapper2, error.message);
    }
}
/**************************************************
 * Liste les catégorie dans le formulaire d'ajout
 **************************************************/
function initCategoriesList() {
    const categoriesSelect = document.getElementById("categoriesSelect");
    categoriesSelect.innerHTML = `<option value=""></option>`;
    for (const categorie of categories) {
        const option = document.createElement("option");
        option.value = categorie.id;
        option.text = categorie.name;
        categoriesSelect.appendChild(option);
    }
}
/**************************************************
 * Réinitialise la preview si changement d'image non conforme
 **************************************************/
function emptyImagePreview() {
    importImage.value = null;
    const preview = document.querySelector(".modal-form_add-image");
    const previewForm = `<i class="fa-regular fa-image fa-2xl"></i>
					<div id="importFile" class="btn js-modal-importFile">+ Ajouter photo</div>
					<span>jpg, png : 4mo max</span>`;
    preview.innerHTML = previewForm;
    document.getElementById("submitNewWork").classList.add("inactive");
}
/**************************************************
 * Vide le formulaire
 **************************************************/
function emptyForm() {
    emptyImagePreview();
    document.getElementById("titlePhoto").value = "";
    document.getElementById("categoriesSelect").value = "";
    document.getElementById("submitNewWork").classList.add("inactive");
}
/**************************************************
 * Vérifie le format d'image
 * - si OK, affiche la preview
 * - sinon, efface le fichier de la variable
 **************************************************/
function checkImageFormat() {
    try {
        displayErrorMessage(wrapper2, "");
        const newImage = importImage.files;
        if (newImage[0].size > 4000000) {
            emptyImagePreview();
            throw new Error("Image non valide. La taille doit être de 4Mo maximum."); 
        }
        const validFileTypes = ["image/jpeg", "image/jpg", "image/png"];
        if (!validFileTypes.includes(newImage[0].type)) {
            emptyImagePreview();
            throw new Error("Fichier non valide. Format attendu .JPG ou .PNG");
        }
        const preview = document.querySelector(".modal-form_add-image");
        preview.innerHTML = "";
        const imagePreview = document.createElement("img");
        imagePreview.src = window.URL.createObjectURL(newImage[0]);
        imagePreview.alt = "Preview nouvelle image à importer";
        imagePreview.classList.add("imagePreview");
        preview.append(imagePreview);
    } catch(error) {
        displayErrorMessage(wrapper2, error.message);
    }
}
/**************************************************
 * Vérifie si tous les champs du formulaire sont remplis
 **************************************************/
function checkForm() {
    displayErrorMessage(wrapper2, "");
    const validImage = importImage.files;
    const validTitle = document.getElementById("titlePhoto");
    const validCategory = document.getElementById("categoriesSelect");
    if (validImage.length > 0 && validTitle.value !== "" && validCategory.value !== "") {
        document.getElementById("submitNewWork").classList.remove("inactive");
        return true;
    } else {
        document.getElementById("submitNewWork").classList.add("inactive");
        return false;
    }
}
/**************************************************
 * Envoi de la nouvelle image à l'API
 **************************************************/
async function sendNewWork(e) {
    e.preventDefault();
    try {
        displayErrorMessage(wrapper2, "");
        if (checkForm()) {
            const formData = new FormData();
            const title = document.getElementById("titlePhoto").value;
            const category = parseInt(document.getElementById("categoriesSelect").value);
            formData.append("image", importImage.files[0]);
            formData.append("title", title);
            formData.append("category", category);
            // requête d'ajout
            let responseAPI = await fetch(`http://localhost:5678/api/works`, {
                method: "POST",
                body: formData,
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}`}
            });

            if (responseAPI.ok) { // élément ajouté
                const newWork = await responseAPI.json();
                
                // pour un affichage en direct sans rafrachir derrière la modale
                const figure = `<figure data-id="${newWork.id}">
                                    <img src="${newWork.imageUrl}" alt="${newWork.title}">
                                    <figcaption>${newWork.title}</figcaption>
                                </figure>`;
                gallery.innerHTML += figure;
                
                // update de la galerie dans la modale
                const figureModal = `<figure data-id="${newWork.id}">
                                        <img src="${newWork.imageUrl}" alt="${newWork.title}">
                                        <span class="trash" data-id="${newWork.id}"><i class="fa-solid fa-xs fa-trash-can"></i></span>
                                    </figure>`;
                galleryModal.innerHTML += figureModal;
                // on ajoute l'élément aussi dans l'objet "works"
                const newWorkToAdd = {
                    "id": parseInt(newWork.id),
                    "title": newWork.title,
                    "imageUrl": newWork.imageUrl,
                    "categoryId": parseInt(newWork.categoryId),
                    "userId": parseInt(newWork.userId),
                    "category": {
                        "id": parseInt(newWork.categoryId),
                        "name": categories.find(category => category.id === parseInt(newWork.categoryId))?.name
                    }
                };
                works.push(newWorkToAdd);
                // On vide le formulaire aussi
                emptyForm();

            } else { // erreur
                addErrorHandle(responseAPI.status);
            }
        } else {
            throw new Error("Vous devez renseigner tous les champs.");
        }
    } catch(error) {
        displayErrorMessage(wrapper2, error.message);
    }
}
/**************************************************
 * Récupère le statut de la requête de suppression
 * et gère les messages d'erreur suivant le cas
 **************************************************/
function removeErrorHandle(statusCode) {
    switch(statusCode) {
        case 401:
            throw new Error("Vous n'êtes pas autorisé à supprimer cette ressource.");
        case 404:
            throw new Error("La ressource n'existe pas.");
        case 500:
            throw new Error("Erreur inconnue.");
    }
}
/**************************************************
 * Récupère le statut de la requête d'ajout
 * et gère les messages d'erreur suivant le cas
 **************************************************/
function addErrorHandle(statusCode) {
    switch(statusCode) {
        case 400:
            throw new Error("Erreur dans la requête.");
        case 401:
            throw new Error("Non autorisé.");
        case 500:
            throw new Error("Erreur inconnue.");
    }
}
/**************************************************
 * Affiche un message d'erreur si la suppression echoue
 **************************************************/
function displayErrorMessage(wrapper, message) {
    let spanErrorMessage = wrapper.querySelector(".errorMessage");
    if (!spanErrorMessage) {
        spanErrorMessage = document.createElement("span");
        spanErrorMessage.classList.add("errorMessage");
        wrapper.appendChild(spanErrorMessage);
    }
    spanErrorMessage.innerText = message;
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
    showAdminFunctions();
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

