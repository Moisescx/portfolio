document.addEventListener("DOMContentLoaded", function () {
    const imagenes = [
        { src: "img/imagen1.jpg", titulo: "Imagen 1" },
        { src: "img/imagen2.jpg", titulo: "Imagen 2" },
    ];

    const galeria = document.getElementById("galeria");

    imagenes.forEach(img => {
        const div = document.createElement("div");
        div.classList.add("caja");

        div.innerHTML = `
            <div class="imagen-container">
                <img src="${img.src}" alt="${img.titulo}">
                <div class="titulo">${img.titulo}</div>
            </div>
        `;

        galeria.appendChild(div);
    });
});
