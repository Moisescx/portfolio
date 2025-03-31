// 1. Array de imágenes por defecto (tus imágenes manuales)
const imagenesPorDefecto = [
  { src: "img/galeria/brandon.jpg", titulo: "Brandon" },
  { src: "img/galeria/fondo_aboutme.jpg", titulo: "Fondo About" }
  // ... (agrega más si necesitas)
];

// 2. Función para mostrar el carrusel (TU CÓDIGO ORIGINAL - SIN CAMBIOS)
function mostrarCarrusel(imagenes) {
    const galeria = document.getElementById("galeria");
    if (!galeria) return;
    
    galeria.innerHTML = '';
  
    const carruselContainer = document.createElement("div");
    carruselContainer.className = "carrusel-container";
  
    const carrusel = document.createElement("div");
    carrusel.className = "carrusel";
  
    imagenes.forEach(img => {
      if (!img.src) return;
      
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
  
    const prevButton = document.createElement("button");
    prevButton.className = "carrusel-btn prev";
    prevButton.innerHTML = "❮";
    prevButton.ariaLabel = "Imagen anterior";
  
    const nextButton = document.createElement("button");
    nextButton.className = "carrusel-btn next";
    nextButton.innerHTML = "❯";
    nextButton.ariaLabel = "Imagen siguiente";
  
    carruselContainer.append(prevButton, carrusel, nextButton);
    galeria.appendChild(carruselContainer);
  
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
  
    const primeraImagen = carrusel.querySelector("img");
    if (primeraImagen?.complete) {
      initCarousel();
    } else if (primeraImagen) {
      primeraImagen.onload = initCarousel;
    } else {
      initCarousel();
    }
}

// 3. Función para SUBIR IMÁGENES (NUEVO)
async function subirImagen(file, title) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);

    try {
        const response = await fetch('/.netlify/functions/upload', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) throw new Error('Error al subir');
        return await response.json();
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

// 4. Función para ACTUALIZAR EL CARRUSEL después de subir
async function actualizarGaleria() {
    try {
        const response = await fetch('img/galeria/data.json');
        const data = await response.json();
        mostrarCarrusel(data || imagenesPorDefecto);
    } catch {
        mostrarCarrusel(imagenesPorDefecto);
    }
}

// 5. Cargar galería al inicio (TU CÓDIGO ORIGINAL - SIN CAMBIOS)
async function cargarGaleria() {
    try {
        const response = await fetch('img/galeria/data.json');
        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                return mostrarCarrusel(data);
            }
        }
        mostrarCarrusel(imagenesPorDefecto);
    } catch (error) {
        console.error("Error:", error);
        mostrarCarrusel([{ src: "img/galeria/brandon.jpg", titulo: "Ejemplo" }]);
    }
}

// 6. Evento para el formulario de subida (NUEVO)
document.addEventListener('DOMContentLoaded', () => {
    cargarGaleria();
    
    // Solo si está en la página de admin
    if (document.getElementById('uploadForm')) {
        document.getElementById('uploadForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const file = document.getElementById('imageInput').files[0];
            const title = document.getElementById('imageTitle').value;

            if (file && title) {
                const resultado = await subirImagen(file, title);
                if (resultado) {
                    alert('¡Imagen subida correctamente!');
                    await actualizarGaleria(); // Actualiza el carrusel
                    document.getElementById('uploadForm').reset();
                }
            }
        });
    }
});