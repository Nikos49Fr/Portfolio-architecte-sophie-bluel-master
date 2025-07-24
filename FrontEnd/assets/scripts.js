/**************************************************
 * Appel à l'API pour récupérer les données
 **************************************************/
const reponseWorksAPI = await fetch("http://localhost:5678/api/works");
const works = await reponseWorksAPI.json();

const reponseCategoriesAPI = await fetch("http://localhost:5678/api/categories");
const categories = await reponseCategoriesAPI.json();

// génération des boutons de filtres dynamiquement
addButtonsFilter(listingCategories(works));

// affichage de la gallery
updateGallery(works);

// ajout des Listeners sur les boutons filtres
filteredButtonsListener();

// vérifie si l'utilisateur est authentifié
isAdminConnected();



/*
 * FONCTIONS
 */

/**************************************************
 * Retourne un set avec toutes les catégories, y compris "Tous"
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
 * ajoute dynamiquement les bouton de filtres à la gallerie
 **************************************************/
function addButtonsFilter(categories) {
    const filters = document.querySelector(".filters");

    for (const category of categories) {
            const button = document.createElement("button");
            button.dataset.category = category;
            
            // class .active par défaut au bouton "Tous"
            category === "Tous" ? button.classList.add("active"): "";
            
            button.innerText = category;
            filters.appendChild(button);
    }
}

/**************************************************
 * affiche les travaux, filtrés ou non
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
 * EventListener sur les bouttons filtre
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
            buttons.forEach(button => button.classList.remove("active"))
            // remet la class "active" sur le bouton qui appelle l'eventListener
            button.classList.add("active");

            // met à jour la gallerie des travaux
            updateGallery(filteredWorks);
        });
    }
}


/**************************************************
 * Vérifie si l'utilisateur est connecté en vérifiant le localStorage
 * ajoute l'eventListener pour se connecter ou se déconnecter
 **************************************************/
function isAdminConnected() {
    const userId = window.localStorage.getItem("userId");
    const token = window.localStorage.getItem("token");
    const menuLogin = document.querySelector(".login");
    
    if (userId && token) {
        menuLogin.innerText = "Logout";
        const ancre = document.querySelector("#portfolio h2");
        const admin = document.createElement("span");
        admin.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> modifier`;
        ancre.appendChild(admin);
    } else {

    }


    menuLogin.addEventListener("click", () => {
        if (userId && token) {
            // l'user veut se déconnecter
            window.localStorage.setItem("userId", []);
            window.localStorage.setItem("token", []);
            window.location.reload();
        } else {
            // l'user veut se connecter
            window.location.assign("./pages/login.html");
        }
    });
}




