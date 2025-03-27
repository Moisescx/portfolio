// ---- Código modificado (solo la parte del carrusel) ----
const imagenes = [
    { src: "img/imagen1.jpg", titulo: "I'm part of the FLCL <br> Reanimated Collab!!" },
    { src: "img/imagen2.jpg", titulo: "Imagen 2" },
    { src: "img/imagen3.jpg", titulo: "Imagen 3" },
    { src: "img/imagen3.jpg", titulo: "Imagen 3" },
    { src: "img/imagen3.jpg", titulo: "Imagen 3" },
    { src: "img/imagen3.jpg", titulo: "Imagen 3" },
    { src: "img/imagen3.jpg", titulo: "Imagen 3" },
    { src: "img/imagen3.jpg", titulo: "Imagen 3" },

];

const galeria = document.getElementById("galeria");

// Crear estructura del carrusel
const carruselContainer = document.createElement("div");
carruselContainer.classList.add("carrusel-container");

const carrusel = document.createElement("div");
carrusel.classList.add("carrusel");

imagenes.forEach(img => {
    const div = document.createElement("div");
    div.classList.add("caja");

    div.innerHTML = `
    <div class="imagen-container">
        <img src="${img.src}" alt="${img.titulo}">
        <div class="titulo">${img.titulo}</div>
    </div>
    `;

    carrusel.appendChild(div);
});

// Botones del carrusel
const prevButton = document.createElement("button");
prevButton.classList.add("carrusel-btn", "prev");
prevButton.innerHTML = "❮";

const nextButton = document.createElement("button");
nextButton.classList.add("carrusel-btn", "next");
nextButton.innerHTML = "❯";

// Insertar en el DOM
carruselContainer.appendChild(prevButton);
carruselContainer.appendChild(carrusel);
carruselContainer.appendChild(nextButton);
galeria.appendChild(carruselContainer);

// Inicializar carrusel (reemplaza el setTimeout)
function initCarousel() {
  const scrollStep = document.querySelector(".caja").offsetWidth + 15; // + gap
  
  prevButton.addEventListener("click", () => {
    carrusel.scrollBy({ left: -scrollStep, behavior: "smooth" });
  });

  nextButton.addEventListener("click", () => {
    carrusel.scrollBy({ left: scrollStep, behavior: "smooth" });
  });
}

// Esperar a que cargue la primera imagen
document.querySelector(".caja img").addEventListener("load", initCarousel);
