document.addEventListener('DOMContentLoaded', () => {
    const langButtons = document.querySelectorAll('.lang-btn');
    const savedLang = localStorage.getItem('preferredLang') || 'es';
    
    // Cargar idioma guardado
    changeLanguage(savedLang);
    document.querySelector(`.lang-btn[data-lang="${savedLang}"]`).classList.add('active');
  
    // Eventos de botones
    langButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        changeLanguage(lang);
        localStorage.setItem('preferredLang', lang);
        langButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  
    function changeLanguage(lang) {
      // Elementos con data-i18n
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
          el.innerHTML = translations[lang][key];
        }
      });
  
      // Elementos especiales (enlaces)
      const specialElements = {
        'about.html': translations[lang].sobre_mi,
        'arte.html': translations[lang].arte_samples,
        'index.html': translations[lang].inicio
      };
  
      document.querySelectorAll('a').forEach(a => {
        Object.keys(specialElements).forEach(path => {
          if (a.getAttribute('href') === path) {
            a.textContent = specialElements[path];
          }
        });
      });
    }
  });