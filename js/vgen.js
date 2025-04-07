// Datos de ejemplo (reemplaza con tus enlaces reales de VGEN)
const productos = {
    illustrations: [
      {
        nombre: "",
        url: "https://vgen.co/DoffitoK/service/character-design-/1329ae0e-9d06-4c6f-9df6-fb1e278490c6",
        categoria: "illustrations"
      },
      {
        nombre: "",
        url: "https://vgen.co/DoffitoK/service/full-body-character-illustration-/a479d3a2-130d-45b7-ad81-5559fa36d30f",
        categoria: "illustrations"
      },
      {
        nombre: "",
        url: "https://vgen.co/DoffitoK/service/half-body-character-illustration/eda43666-f7c1-42c2-b36a-48533ae45e99",
        categoria: "illustrations"
      },
      {
        nombre: "",
        url: "https://vgen.co/DoffitoK/service/icon-/a295eafb-e426-4696-8a39-4b83d0de92ed",
        categoria: "illustrations"
      },
      {
        nombre: "",
        url: "https://vgen.co/DoffitoK/service/tall-chibi-/58fb880f-b6c5-41fc-b233-1cc40d24304e",
        categoria: "illustrations"
      }
    ],
    illustrations_surprise: [
      {
        nombre: "Illustration Surprise me! 🐦‍⬛",
        url: "https://vgen.co/otro-enlace",
        categoria: "illustrations_surprise"
      }
    ],
    streams: [
        {
          nombre: "Streams! 🫕",
          url: "https://vgen.co/otro-enlace",
          categoria: "illustrations_surprise"
        }
      ],
      Character: [
        {
          nombre: "Your Character here! 🍵",
          url: "https://vgen.co/otro-enlace",
          categoria: "illustrations_surprise"
        }
      ],
    // ... más categorías
  };
  
  // Función para extraer OG tags de una URL (usando proxy para evitar CORS)
  async function fetchOGData(url) {
    try {
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      const data = await response.json();
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(data.contents, 'text/html');
      
      return {
        title: doc.querySelector('meta[property="og:title"]')?.content || "VGEN Profile",
        image: doc.querySelector('meta[property="og:image"]')?.content || "fallback-image.jpg",
        description: doc.querySelector('meta[property="og:description"]')?.content || "Ver en VGEN"
      };
    } catch (error) {
      console.error("Error fetching OG data:", error);
      return {
        title: "Ver en VGEN",
        image: "fallback-image.jpg",
        description: "Click para visitar"
      };
    }
  }
  
  // Crear tarjeta con vista previa
  async function crearTarjetaVGEN(producto) {
    const ogData = await fetchOGData(producto.url);
    
    const tarjeta = document.createElement('div');
    tarjeta.className = `producto-card ${producto.categoria}`;
    tarjeta.style.display = 'none'; // Ocultar inicialmente
    
    tarjeta.innerHTML = `
      <a href="${producto.url}" target="_blank" class="vgen-preview">
        <img src="${ogData.image}" alt="${ogData.title}" class="vgen-image">
        <div class="vgen-info">
          <h3>${ogData.title}</h3>
          <p>${ogData.description}</p>
          <span class="vgen-price">${producto.nombre}</span>
        </div>
      </a>
    `;
    
    return tarjeta;
  }
  
  // Mostrar productos por categoría (como ya tienes)
  async function mostrarCategoria(categoria) {
    const container = document.getElementById('productos-container');
    container.innerHTML = '';
    
    if (productos[categoria]) {
      for (const producto of productos[categoria]) {
        const tarjeta = await crearTarjetaVGEN(producto);
        container.appendChild(tarjeta);
        tarjeta.style.display = 'block'; // Mostrar solo los de la categoría
      }
    }
  }
  
  // Inicializar (mostrar primera categoría por defecto)
  document.addEventListener('DOMContentLoaded', () => {
    mostrarCategoria('illustrations');
  });