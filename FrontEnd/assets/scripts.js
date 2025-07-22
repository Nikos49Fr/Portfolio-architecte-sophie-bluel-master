
const reponseAPI = await fetch("http://localhost:5678/api/works");
const works = await reponseAPI.json();


updateGallery(works);

function updateGallery(works) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    for (let work of works) {
        let figure = `<figure>
				        <img src="${work.imageUrl}"
                         alt="${work.title}">
				        <figcaption>${work.title}</figcaption>
			        </figure>`
        gallery.innerHTML += figure;
    }
}
