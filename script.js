const imagenes = [
    { src: "img/imagen1.jpg", titulo: "I'm part of the FLCL Reanimated Collab!!" },
    { src: "img/imagen2.jpg", titulo: "Imagen 2" },
];

const galeria = document.getElementById("galeria");

imagenes.forEach(img => {
    const div = document.createElement("div");
    div.classList.add("contenedor");

    div.innerHTML = `
        <div class="caja">
            <div class="frente">
                <img src="${img.src}" alt="${img.titulo}">
            </div>
            <div class="atras">${img.titulo}</div>
        </div>
    `;

    galeria.appendChild(div);
});
