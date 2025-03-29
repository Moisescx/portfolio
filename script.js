// 1. Array de imágenes POR DEFECTO (tu código actual)
const imagenesPorDefecto = [
  { src: "img/galeria/imagen1.jpg", titulo: "I'm part of the FLCL <br> Reanimated Collab!!" },
  { src: "img/galeria/imagen2.jpg", titulo: "Imagen 2" },
  { src: "img/galeria/imagen2.jpg", titulo: "Imagen 2" },
  // ... (otras imágenes de respaldo)
];

// 2. Función para mostrar el carrusel (tu código original + mejoras)
function mostrarCarrusel(imagenes) {
  const galeria = document.getElementById("galeria");
  galeria.innerHTML = ''; // Limpiar contenedor

  const carruselContainer = document.createElement("div");
  carruselContainer.classList.add("carrusel-container");

  const carrusel = document.createElement("div");
  carrusel.classList.add("carrusel");

  // Generar las imágenes (igual que tu código)
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

  // Botones y eventos (tu código original)
  const prevButton = document.createElement("button");
  prevButton.classList.add("carrusel-btn", "prev");
  prevButton.innerHTML = "❮";

  const nextButton = document.createElement("button");
  nextButton.classList.add("carrusel-btn", "next");
  nextButton.innerHTML = "❯";

  carruselContainer.appendChild(prevButton);
  carruselContainer.appendChild(carrusel);
  carruselContainer.appendChild(nextButton);
  galeria.appendChild(carruselContainer);

  // Inicializar carrusel
  function initCarousel() {
      const scrollStep = document.querySelector(".caja").offsetWidth + 15;
      prevButton.addEventListener("click", () => carrusel.scrollBy({ left: -scrollStep, behavior: "smooth" }));
      nextButton.addEventListener("click", () => carrusel.scrollBy({ left: scrollStep, behavior: "smooth" }));
  }

  const primeraImagen = carrusel.querySelector("img");
  if (primeraImagen.complete) initCarousel();
  else primeraImagen.addEventListener('load', initCarousel);
}

// 3. Cargar imágenes desde Netlify CMS O usar el array por defecto
async function cargarGaleria() {
  try {
      const response = await fetch('/data/galeria.json');
      if (!response.ok) throw new Error("No se encontró el JSON");
      
      const data = await response.json();
      if (data.imagenes && data.imagenes.length > 0) {
          // Usar imágenes del CMS
          mostrarCarrusel(data.imagenes);
      } else {
          // Usar imágenes por defecto si el JSON está vacío
          mostrarCarrusel(imagenesPorDefecto);
      }
  } catch (error) {
      console.error("Error cargando la galería:", error);
      // Mostrar array por defecto si hay error
      mostrarCarrusel(imagenesPorDefecto);
  }
}

// Iniciar al cargar la página
document.addEventListener('DOMContentLoaded', cargarGaleria);
