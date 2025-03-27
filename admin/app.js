// Asegúrate de que netlifyIdentity esté disponible antes de usarlo
netlifyIdentity.on('init', user => {
    if (user) {
      console.log("Usuario ya autenticado:", user);
    }
  });
  
  // Función para iniciar sesión con email y contraseña
  const loginUser = (event) => {
    event.preventDefault();  // Prevenir el envío del formulario
  
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    // Intentar loguearse con Netlify Identity
    netlifyIdentity.login({ email, password })
      .then(user => {
        console.log("Usuario logueado:", user);
        window.location.href = "/admin";  // Redirigir al panel de administración
      })
      .catch(error => {
        console.error("Error al iniciar sesión:", error);
        alert("Error al iniciar sesión. Por favor, revisa tus credenciales.");
      });
  }
  
  // Asociar la función loginUser al formulario
  document.getElementById("login-form").addEventListener("submit", loginUser);
  