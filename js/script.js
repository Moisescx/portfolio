

// 2. Función para mostrar el carrusel (tu código original optimizado)
function mostrarCarrusel(imagenes) {
    const galeria = document.getElementById("galeria");
    if (!galeria) return; // Seguridad si no existe el elemento
    
    galeria.innerHTML = ''; // Limpiar contenedor
  
    const carruselContainer = document.createElement("div");
    carruselContainer.className = "carrusel-container";
  
    const carrusel = document.createElement("div");
    carrusel.className = "carrusel";
  
    // Generar las imágenes
    imagenes.forEach(img => {
      if (!img.src) return; // Saltar si no hay ruta
      
      const div = document.createElement("div");
      div.className = "caja";
      div.innerHTML = `
      <div class="imagen-container">
          <img src="${img.src}" alt="${img.titulo || 'Imagen'}">
          ${img.titulo ? `<div class="titulo">${img.titulo}</div>` : ''}
      </div>
      `;
      carrusel.appendChild(div);
    });
  
    // Botones de navegación
    const prevButton = document.createElement("button");
    prevButton.className = "carrusel-btn prev";
    prevButton.innerHTML = "❮";
    prevButton.ariaLabel = "Imagen anterior";
  
    const nextButton = document.createElement("button");
    nextButton.className = "carrusel-btn next";
    nextButton.innerHTML = "❯";
    nextButton.ariaLabel = "Imagen siguiente";
  
    // Ensamblar el carrusel
    carruselContainer.append(prevButton, carrusel, nextButton);
    galeria.appendChild(carruselContainer);
  
    // Inicializar eventos
    function initCarousel() {
      const scrollStep = document.querySelector(".caja")?.offsetWidth + 15 || 300;
      
      prevButton.onclick = () => carrusel.scrollBy({ 
        left: -scrollStep, 
        behavior: "smooth" 
      });
      
      nextButton.onclick = () => carrusel.scrollBy({ 
        left: scrollStep, 
        behavior: "smooth" 
      });
    }
  
    // Esperar a que cargue la primera imagen
    const primeraImagen = carrusel.querySelector("img");
    if (primeraImagen?.complete) {
      initCarousel();
    } else if (primeraImagen) {
      primeraImagen.onload = initCarousel;
    } else {
      initCarousel(); // Fallback si no hay imágenes
    }
  }
  
  // 3. Cargar imágenes (versión adaptada a tu estructura)
  async function cargarGaleria() {
    try {
      // Intenta cargar el JSON generado por el CMS
      const response = await fetch('img/galeria/data.json');
      
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          return mostrarCarrusel(data);
        }
      }
      
      // Fallback 1: Usar imágenes manuales si el JSON falla
      mostrarCarrusel(imagenesPorDefecto);
      
    } catch (error) {
      console.error("Error cargando galería:", error);
      // Fallback 2: Mínimo de imágenes si todo falla
      mostrarCarrusel([
        { src: "img/galeria/brandon.jpg", titulo: "Ejemplo" }
      ]);
    }
  }
  
  // Iniciar
  document.addEventListener('DOMContentLoaded', cargarGaleria);