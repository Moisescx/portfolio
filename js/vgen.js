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
            nombre: "",
            url: "https://vgen.co/DoffitoK/service/full-body-illustration-surprise-me-/5aa92c9c-c3da-4d87-a6a8-e8ad411cc94f",
            categoria: "illustrations_surprise"
        },
        {
            nombre: "",
            url: "https://vgen.co/DoffitoK/service/half-body-illustration-surprise-me-/824bbc9e-3063-4cd2-9e05-367782302429",
            categoria: "illustrations_surprise"
        },
        {
            nombre: "",
            url: "https://vgen.co/DoffitoK/service/icon-surprise-me-/41ff937a-931e-4b49-beb8-deddc121148f",
            categoria: "illustrations_surprise"
        },
        {
            nombre: "",
            url: "https://vgen.co/DoffitoK/service/tall-chibi-surprise-me-/0331f37d-3fa9-45ee-a5ca-9983f1f62292",
            categoria: "illustrations_surprise"
        }
    ],
    streams: [
        {
            nombre: "",
            url: "https://vgen.co/DoffitoK/service/pngtuber-half-body-head/57002ecd-7fa5-4b1e-855b-a4354e9b3de6",
            categoria: "streams"
        },
        {
            nombre: "",
            url: "https://vgen.co/DoffitoK/service/pngtuber-full-body-/d755efa0-3faf-48b8-8514-d1782d45f7a9",
            categoria: "streams"
        },
        {
            nombre: "",
            url: "https://vgen.co/DoffitoK/service/custom-emotes-for-streams/6d8bfda0-fe78-4cce-849e-5d6a77681170",
            categoria: "streams"
        }
    ],
    Character: [
        {
            nombre: "",
            url: "https://vgen.co/DoffitoK/service/ych-plushies-surprise-me-/7347cdfc-d695-473d-a760-2174d710ba32",
            categoria: "Character"
        }
    ]
};

const cacheOGData = {};

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
    

// Mostrar productos por categoría
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