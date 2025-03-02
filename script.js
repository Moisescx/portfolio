async function updateSidebar() {
    const apiKey = "abd86eb5f969a94b954aadaeb2a65bbac19973394c0aae25090fb49a8d0b06de"; // Reemplaza con tu API Key
    const apiUrl = "https://nekoweb.org/api/site/info";

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Authorization": apiKey
            }
        });

        if (!response.ok) throw new Error("Error en la API");

        const data = await response.json();

        // Actualizar elementos en la sidebar
        document.getElementById("updates").textContent = data.updates;
        document.getElementById("followers").textContent = data.followers;
        document.getElementById("views").textContent = data.views;
        document.getElementById("lastUpdate").textContent = new Date(data.updated_at).toLocaleString();
    } catch (error) {
        console.error("Error al obtener datos:", error);
    }
}

// Llamar a la función cada 10 segundos para actualizar la info en tiempo real
setInterval(updateSidebar, 10000);

// Llamar la función al cargar la página
updateSidebar();
