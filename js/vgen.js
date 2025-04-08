const productos = {
  illustrations: [
    {
      nombre: "Character Design",
      url: "https://vgen.co/DoffitoK/service/character-design-/1329ae0e-9d06-4c6f-9df6-fb1e278490c6",
      imagen: "https://storage.googleapis.com/vgen-production-storage/uploads/a61c91d6-b7d3-4504-ac98-a9932b83a424/services/7c3a5aec-11a6-46ac-95fc-d192d7237e81.webp",
      descripcion: '<span class="line-break">A Image of your character - Full body - </span><span class="line-break">The Color pallete</span><span class="line-break">Some references of details (Clothes, Teeths, etc)</span>',
      categoria: "illustrations",
    },
    {
      nombre: "Full-Body Character Illustration",
      url: "https://vgen.co/DoffitoK/service/full-body-character-illustration-/a479d3a2-130d-45b7-ad81-5559fa36d30f",
      imagen: "https://storage.googleapis.com/vgen-production-storage/uploads/a61c91d6-b7d3-4504-ac98-a9932b83a424/services/c5b4edde-3308-4d39-b476-bfa6a309c213.webp",
      descripcion: "A full body illustration of your character of choice.  (OC or Other)",
      categoria: "illustrations",
    },
    {
      nombre: "",
      url: "https://vgen.co/DoffitoK/service/half-body-character-illustration/eda43666-f7c1-42c2-b36a-48533ae45e99",
      categoria: "illustrations",
    },
    {
      nombre: "",
      url: "https://vgen.co/DoffitoK/service/icon-/a295eafb-e426-4696-8a39-4b83d0de92ed",
      categoria: "illustrations",
    },
    {
      nombre: "",
      url: "https://vgen.co/DoffitoK/service/tall-chibi-/58fb880f-b6c5-41fc-b233-1cc40d24304e",
      categoria: "illustrations",
    },
  ],
  illustrations_surprise: [
    {
      nombre: "",
      url: "https://vgen.co/DoffitoK/service/full-body-illustration-surprise-me-/5aa92c9c-c3da-4d87-a6a8-e8ad411cc94f",
      categoria: "illustrations_surprise",
    },
    {
      nombre: "",
      url: "https://vgen.co/DoffitoK/service/half-body-illustration-surprise-me-/824bbc9e-3063-4cd2-9e05-367782302429",
      categoria: "illustrations_surprise",
    },
    {
      nombre: "",
      url: "https://vgen.co/DoffitoK/service/icon-surprise-me-/41ff937a-931e-4b49-beb8-deddc121148f",
      categoria: "illustrations_surprise",
    },
    {
      nombre: "",
      url: "https://vgen.co/DoffitoK/service/tall-chibi-surprise-me-/0331f37d-3fa9-45ee-a5ca-9983f1f62292",
      categoria: "illustrations_surprise",
    },
  ],
  streams: [
    {
      nombre: "",
      url: "https://vgen.co/DoffitoK/service/pngtuber-half-body-head/57002ecd-7fa5-4b1e-855b-a4354e9b3de6",
      categoria: "streams",
    },
    {
      nombre: "",
      url: "https://vgen.co/DoffitoK/service/pngtuber-full-body-/d755efa0-3faf-48b8-8514-d1782d45f7a9",
      categoria: "streams",
    },
    {
      nombre: "",
      url: "https://vgen.co/DoffitoK/service/custom-emotes-for-streams/6d8bfda0-fe78-4cce-849e-5d6a77681170",
      categoria: "streams",
    },
  ],
  Character: [
    {
      nombre: "",
      url: "https://vgen.co/DoffitoK/service/ych-plushies-surprise-me-/7347cdfc-d695-473d-a760-2174d710ba32",
      categoria: "Character",
    },
  ],
};

const cacheOGData = {};

async function fetchOGData(url, retries = 0) {
  if (cacheOGData[url]) return cacheOGData[url];

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error("HTTP error " + response.status);
    
    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, "text/html");

    let ogTitle = doc.querySelector('meta[property="og:title"]')?.content || "VGEN Profile";
    let ogDescription = doc.querySelector('meta[property="og:description"]')?.content || "Ver en VGEN";
    let ogImage = doc.querySelector('meta[property="og:image"]')?.content;

    // Verificamos si la imagen es genérica
    const esGenerica = !ogImage || ogImage.includes("vgen.co/_next/static") || ogImage.includes("default");

    // Si es genérica, intentamos buscar una imagen real
    if (esGenerica) {
      const imagenReal = doc.querySelector("img[src*='storage.googleapis.com']");
      if (imagenReal && imagenReal.src) {
        ogImage = imagenReal.src;
      } else {
        // Imagen de respaldo si no encontramos ninguna útil
        ogImage = "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";
      }
    }

    const ogData = {
      title: ogTitle,
      image: ogImage,
      description: ogDescription,
    };

    cacheOGData[url] = ogData;
    return ogData;

  } catch (error) {
    console.warn("Error al obtener OG data:", error);
    if (retries < 2) {
      return fetchOGData(url, retries + 1);
    }
    return {
      title: "Ver en VGEN",
      image: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
      description: "Click para visitar",
    };
  }
}

async function crearTarjetaVGEN(producto) {
  const tarjeta = document.createElement("div");
  tarjeta.className = `producto-card ${producto.categoria}`;

  tarjeta.innerHTML = `
    <a href="${producto.url}" target="_blank" class="vgen-preview">
      <img src="${producto.imagen}" 
           alt="${producto.nombre}" 
           class="vgen-image"
           onerror="this.src='https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'">
      <div class="vgen-info">
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
      </div>
    </a>
  `;

  return tarjeta;
}


async function mostrarCategoria(categoria) {
  const container = document.getElementById('productos-container');
  if (!container) {
    console.error("Contenedor 'productos-container' no encontrado.");
    return;
  }

  container.innerHTML = '';

  if (productos[categoria]) {
    for (const producto of productos[categoria]) {
      const tarjeta = await crearTarjetaVGEN(producto);
      container.appendChild(tarjeta);
    }
  } else {
    container.innerHTML = '<p>No hay productos en esta categoría.</p>';
  }
}

document.addEventListener("DOMContentLoaded", () => {
  mostrarCategoria("illustrations");

  setTimeout(() => {
    Object.values(productos).flat().slice(0, 6).forEach(item => {
      const img = new Image();
      img.src = item.url;
    });
  }, 2000);
});
