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
            url: "https://vgen.co/DoffitoK/service/full-body-illustration-surprise-me-/5aa92c9c-c3da-4d87-a6a8-e8ad411cc94f",
            categoria: "illustrations_surprise"
        },
        {
            nombre: "Illustration Surprise me! 🐦‍⬛",
            url: "https://vgen.co/DoffitoK/service/half-body-illustration-surprise-me-/824bbc9e-3063-4cd2-9e05-367782302429",
            categoria: "illustrations_surprise"
        },
        {
            nombre: "Illustration Surprise me! 🐦‍⬛",
            url: "https://vgen.co/DoffitoK/service/icon-surprise-me-/41ff937a-931e-4b49-beb8-deddc121148f",
            categoria: "illustrations_surprise"
        },
        {
            nombre: "Illustration Surprise me! 🐦‍⬛",
            url: "https://vgen.co/DoffitoK/service/tall-chibi-surprise-me-/0331f37d-3fa9-45ee-a5ca-9983f1f62292",
            categoria: "illustrations_surprise"
        }
    ],
    streams: [
        {
            nombre: "Streams! 🫕",
            url: "https://vgen.co/DoffitoK/service/pngtuber-half-body-head/57002ecd-7fa5-4b1e-855b-a4354e9b3de6",
            categoria: "streams"
        },
        {
            nombre: "Streams! 🫕",
            url: "https://vgen.co/DoffitoK/service/pngtuber-full-body-/d755efa0-3faf-48b8-8514-d1782d45f7a9",
            categoria: "streams"
        },
        {
            nombre: "Streams! 🫕",
            url: "https://vgen.co/DoffitoK/service/custom-emotes-for-streams/6d8bfda0-fe78-4cce-849e-5d6a77681170",
            categoria: "streams"
        }
    ],
    Character: [
        {
            nombre: "Your Character here! 🍵",
            url: "https://vgen.co/DoffitoK/service/ych-plushies-surprise-me-/7347cdfc-d695-473d-a760-2174d710ba32",
            categoria: "Character"
        }
    ]
};

// Función para extraer OG tags de una URL (usando proxy para evitar CORS)
const cacheOGData = {}; // Caché para evitar solicitudes repetidas

async function fetchOGData(url) {
    if (cacheOGData[url]) {
        return cacheOGData[url]; // Devuelve los datos en caché si existen
    }

    try {
        const proxyUrl = `/.netlify/functions/proxy?url=${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);
        const data = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');

        const ogData = {
            title: doc.querySelector('meta[property="og:title"]')?.content || "VGEN Profile",
            image: doc.querySelector('meta[property="og:image"]')?.content || "fallback-image.jpg",
            description: doc.querySelector('meta[property="og:description"]')?.content || "Ver en VGEN"
        };

        cacheOGData[url] = ogData; // Guarda los datos en caché
        return ogData;
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
    tarjeta.className = 'producto-card';
    tarjeta.innerHTML = `
        <a href="${producto.url}" target="_blank" class="vgen-preview">
            <img src="${ogData.image}" alt="${ogData.title}" class="vgen-image">
            <div class="vgen-info">
                <h3>${ogData.title}</h3>
                <p>${ogData.description}</p>
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
        const tarjetas = await Promise.all(
            productos[categoria].map(producto => crearTarjetaVGEN(producto))
        );

        tarjetas.forEach(tarjeta => {
            container.appendChild(tarjeta);
        });
    } else {
        container.innerHTML = '<p>No hay productos en esta categoría.</p>';
    }
}

// Inicializar (mostrar primera categoría por defecto)
document.addEventListener('DOMContentLoaded', () => {
    mostrarCategoria('illustrations');
});