
const reponseAPI = await fetch("http://localhost:5678/api/works");
const works = await reponseAPI.json();


updateGallery(works);

function updateGallery(works) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    for (let work of works) {
        let figure = `<figure>
				        <img src="${urlImgTranslate(work.imageUrl)}"
                         alt="${work.title}">
				        <figcaption>${work.title}</figcaption>
			        </figure>`
        gallery.innerHTML += figure;
    }
}

function urlImgTranslate(urlAPI) {
    const regex = new RegExp("(/images/\\D+)");
    let usableURL = regex.exec(urlAPI);
    return "assets" + usableURL[0] + ".png";
}