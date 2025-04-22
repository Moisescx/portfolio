// 1. Array de imágenes por defecto (tus imágenes manuales)
const imagenesPorDefecto = [
    { src: "img/galeria/brandon.jpg", titulo: "Brandon" },
    { src: "img/galeria/fondo_aboutme.jpg", titulo: "Fondo About" }
  ];
  
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

    // Lógica para manejar el desplazamiento del carrusel
    function initCarousel() {
        const cantidadVisible = 4; // Cantidad de imágenes visibles
        const scrollStep = document.querySelector(".caja")?.offsetWidth + 15 || 300; // Ancho de cada imagen más el gap
        const totalCajas = imagenes.length;
        let posicionActual = 0;

        prevButton.onclick = () => {
            posicionActual -= cantidadVisible;
            if (posicionActual < 0) {
                posicionActual = 0; // No permitir desplazamiento más allá del inicio
            }
            carrusel.style.transform = `translateX(-${posicionActual * scrollStep}px)`;
        };

        nextButton.onclick = () => {
            posicionActual += cantidadVisible;
            if (posicionActual > totalCajas - cantidadVisible) {
                posicionActual = totalCajas - cantidadVisible; // No permitir desplazamiento más allá del final
            }
            carrusel.style.transform = `translateX(-${posicionActual * scrollStep}px)`;
        };
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
  // 3. Función para subir imágenes
  async function subirImagen(file, title) {
    const nombreArchivo = `${Date.now()}-${file.name}`;
    const rutaImagen = `img/galeria/${nombreArchivo}`;
  
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('filename', nombreArchivo);
  
      const response = await fetch('/.netlify/functions/upload', {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) throw new Error('Error al subir');
  
      const nuevaImagen = {
        src: rutaImagen,
        titulo: title
      };
  
      await actualizarJSON(nuevaImagen);
      return true;
  
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  }
  
  // 4. Función para actualizar el JSON (añade nuevas imágenes)
  async function actualizarJSON(nuevaImagen) {
    try {
      const data = await obtenerImagenes(); // Obtiene el contenido actual de data.json
      if (!Array.isArray(data.imagenes)) {
        data.imagenes = []; // Asegura que sea un array
      }
      data.imagenes.push(nuevaImagen); // Añade la nueva imagen
  
      // Llama a la Netlify Function para guardar en GitHub
      await fetch('/.netlify/functions/update-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data) // Envía el objeto completo
      });
    } catch (error) {
      console.error("Error actualizando JSON:", error);
    }
  }
  
  // 5. Función para obtener imágenes desde data.json
  async function obtenerImagenes() {
    try {
      const response = await fetch('img/galeria/data.json');
      if (response.ok) {
        const data = await response.json();
        return data || { imagenes: [] }; // Asegura que siempre devuelva un objeto con `imagenes`
      }
    } catch (error) {
      console.error("Error obteniendo imágenes:", error);
    }
    return { imagenes: [] }; // Devuelve un objeto vacío por defecto
  }
  
  // 6. Función para actualizar el carrusel después de subir
  async function actualizarGaleria() {
    try {
      const response = await fetch('img/galeria/data.json');
      const data = await response.json();
      if (data && Array.isArray(data.imagenes)) {
        mostrarCarrusel(data.imagenes);
      } else {
        mostrarCarrusel(imagenesPorDefecto);
      }
    } catch (error) {
      console.error("Error actualizando galería:", error);
      mostrarCarrusel(imagenesPorDefecto);
    }
  }
  
  // 7. Cargar galería al inicio
  async function cargarGaleria() {
    try {
      const response = await fetch('img/galeria/data.json');
      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data.imagenes) && data.imagenes.length > 0) {
          return mostrarCarrusel(data.imagenes);
        }
      }
      mostrarCarrusel(imagenesPorDefecto);
    } catch (error) {
      console.error("Error cargando galería:", error);
      mostrarCarrusel(imagenesPorDefecto);
    }
  }
  
  // 8. Evento para el formulario de subida
  document.addEventListener('DOMContentLoaded', () => {
    cargarGaleria();
  
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