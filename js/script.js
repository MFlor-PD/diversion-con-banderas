//hacer la estructura del Fetch, para ver que trae, (fetch, Async/Await...) v
// Traer la info de banderas: imagen, nombre, capital, poblacion, lado de conducir. Usar un .map v
//Usar el DOM para que aparezcan en pantalla v
//Organizar los nombres con el mismo tiepo de letra, to uppercase. v
//Ordenarlos alfabeticamente - sort v
//no pude llegar a esta parte
//agregar un evento click para que al seleccionar un pais, me aparezca un flotante en el centro y fijo hasta que se cierre voluntariamente.

//unas css para que al pasar el HOVER se agranden   => puro capricho mio.v
// Extras : Puedes manipular el `HTML` si lo necesitaras. 
//          Si necesitas añadir clases a un elemento mediante JS, lo puedes hacer con `elemento.classList.add('clase que quieres añadir')` y para eliminar `elemento.classList.remove('clase que quieres añadir')`

/*
MIS PASOS:
1-TRAJE DATOS DE API
2- FILTRE CON MAP PARA QUE APAREZCAN SOLO LOS DATOS QUE NECESITO
3- LOS PASE A MAYUSCULAS
4- LOS ORGANICE ALFABETICAMENTE CON SORT
5- LOS RENDERICE, 1ro arme la funcion template y luego lo aniadi a la funcion, desetructure los datos para facilitar legibilidad.
6- ACOMODE LAS IMGS PORQUE SALIAN UNDEFINDED PNG O SVG
7- LE DI FORMA CON CSS
*/

// Variables globales
let allCountries = [];
let filteredCountries = [];

const url = 'https://restcountries.com/v3.1/all?fields=name,flags,capital,population,car,region,subregion,currencies,languages';

const getCountries = async () => {
  try {
    // Mostrar loading
    showLoading();
    
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error('Error: ' + res.status);
    }
    const data = await res.json();

    allCountries = data
      .map(({ name, flags, capital, population, car, region, subregion, currencies, languages }) => ({
        name: name.common,
        officialName: name.official,
        flag: flags.png || flags.svg,
        capital: capital ? capital[0] : 'N/A',
        population: population,
        side: car?.side || 'N/A',
        region: region,
        subregion: subregion,
        currencies: currencies ? Object.keys(currencies).join(', ') : 'N/A',
        languages: languages ? Object.values(languages).join(', ') : 'N/A'
      }))
      .sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()));

    filteredCountries = [...allCountries];
    
    // Actualizar estadísticas
    updateStats();
    
    // Renderizar países
    renderCountries(filteredCountries);
    
    // Configurar eventos
    setupEventListeners();
    
  } catch (err) {
    console.error('Error:', err);
    showError('Error al cargar los países. Por favor, intenta de nuevo.');
  }
};

// Mostrar loading
const showLoading = () => {
  const container = document.getElementById("countries-list");
  container.innerHTML = '<div class="loading"></div>';
};

// Mostrar error
const showError = (message) => {
  const container = document.getElementById("countries-list");
  container.innerHTML = `
    <div style="text-align: center; padding: 3rem; color: white; grid-column: 1 / -1;">
      <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
      <p>${message}</p>
      <button onclick="location.reload()" style="
        background: #667eea;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 25px;
        cursor: pointer;
        margin-top: 1rem;
        font-weight: 500;
      ">Reintentar</button>
    </div>
  `;
};

// Actualizar estadísticas
const updateStats = () => {
  const totalCountries = allCountries.length;
  const totalPopulation = allCountries.reduce((sum, country) => sum + country.population, 0);
  
  document.getElementById('total-countries').textContent = totalCountries.toLocaleString();
  document.getElementById('total-population').textContent = totalPopulation.toLocaleString();
};

// Renderizar países
const renderCountries = (countries) => {
  const container = document.getElementById("countries-list");
  
  if (countries.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem; color: white; grid-column: 1 / -1;">
        <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem;"></i>
        <p>No se encontraron países que coincidan con tu búsqueda.</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = '';
  
  countries.forEach((country) => {
    const countryElement = createCountryElement(country);
    container.appendChild(countryElement);
  });
};

// Crear elemento de país
const createCountryElement = (country) => {
  const div = document.createElement('div');
  div.className = 'countries';
  div.innerHTML = `
    <div><img src="${country.flag}" alt="${country.name} flag" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRkZGRkZGIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2N0VlYSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZsYWc8L3RleHQ+Cjwvc3ZnPgo='"/></div>
    <div><h2 class="name">${country.name}</h2></div>
    <div class="country-details">
      <p><strong>Capital:</strong> ${country.capital}</p>
      <p><strong>Población:</strong> ${country.population.toLocaleString()}</p>
      <p><strong>Conducción:</strong> ${country.side}</p>
      <p><strong>Región:</strong> ${country.region}</p>
    </div>
  `;
  
  // Agregar evento click para mostrar modal
  div.addEventListener('click', () => showCountryModal(country));
  
  return div;
};

// Configurar event listeners
const setupEventListeners = () => {
  // Búsqueda
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
  }
  
  // Filtros
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', handleFilter);
  });
  
  // Modal
  const closeBtn = document.getElementById('close');
  const floatContainer = document.getElementById('float-container');
  
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }
  
  if (floatContainer) {
    floatContainer.addEventListener('click', (e) => {
      if (e.target === floatContainer) {
        closeModal();
      }
    });
  }
  
  // Cerrar modal con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
};

// Manejar búsqueda
const handleSearch = (e) => {
  const searchTerm = e.target.value.toLowerCase().trim();
  
  if (searchTerm === '') {
    filteredCountries = [...allCountries];
  } else {
    filteredCountries = allCountries.filter(country => 
      country.name.toLowerCase().includes(searchTerm) ||
      (country.capital && country.capital.toLowerCase().includes(searchTerm)) ||
      country.region.toLowerCase().includes(searchTerm)
    );
  }
  
  renderCountries(filteredCountries);
};

// Manejar filtros
const handleFilter = (e) => {
  const filter = e.target.dataset.filter;
  
  // Actualizar botones activos
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  e.target.classList.add('active');
  
  // Aplicar filtro
  if (filter === 'all') {
    filteredCountries = [...allCountries];
  } else {
    filteredCountries = allCountries.filter(country => country.side === filter);
  }
  
  renderCountries(filteredCountries);
};

// Mostrar modal del país
const showCountryModal = (country) => {
  const floatContainer = document.getElementById('float-container');
  const floatTitle = document.getElementById('float-title');
  const floatContent = document.getElementById('float-content');
  
  if (floatTitle) floatTitle.textContent = country.name;
  
  if (floatContent) {
    floatContent.innerHTML = `
      <div style="text-align: center; margin-bottom: 2rem;">
        <img src="${country.flag}" alt="${country.name} flag" style="width: 200px; height: 120px; object-fit: cover; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
      </div>
      
      <div style="display: grid; gap: 1rem;">
        <div class="detail-item">
          <i class="fas fa-crown" style="color: #667eea;"></i>
          <div>
            <strong>Nombre Oficial:</strong>
            <p>${country.officialName}</p>
          </div>
        </div>
        
        <div class="detail-item">
          <i class="fas fa-building" style="color: #667eea;"></i>
          <div>
            <strong>Capital:</strong>
            <p>${country.capital}</p>
          </div>
        </div>
        
        <div class="detail-item">
          <i class="fas fa-users" style="color: #667eea;"></i>
          <div>
            <strong>Población:</strong>
            <p>${country.population.toLocaleString()} habitantes</p>
          </div>
        </div>
        
        <div class="detail-item">
          <i class="fas fa-car" style="color: #667eea;"></i>
          <div>
            <strong>Lado de Conducción:</strong>
            <p>${country.side}</p>
          </div>
        </div>
        
        <div class="detail-item">
          <i class="fas fa-globe" style="color: #667eea;"></i>
          <div>
            <strong>Región:</strong>
            <p>${country.region}</p>
          </div>
        </div>
        
        ${country.subregion ? `
        <div class="detail-item">
          <i class="fas fa-map-marker-alt" style="color: #667eea;"></i>
          <div>
            <strong>Subregión:</strong>
            <p>${country.subregion}</p>
          </div>
        </div>
        ` : ''}
        
        <div class="detail-item">
          <i class="fas fa-money-bill" style="color: #667eea;"></i>
          <div>
            <strong>Monedas:</strong>
            <p>${country.currencies}</p>
          </div>
        </div>
        
        <div class="detail-item">
          <i class="fas fa-language" style="color: #667eea;"></i>
          <div>
            <strong>Idiomas:</strong>
            <p>${country.languages}</p>
          </div>
        </div>
      </div>
    `;
  }
  
  if (floatContainer) {
    floatContainer.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
};

// Cerrar modal
const closeModal = () => {
  const floatContainer = document.getElementById('float-container');
  if (floatContainer) {
    floatContainer.classList.remove('show');
    document.body.style.overflow = 'auto';
  }
};

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
  getCountries();
});

// Agregar estilos adicionales para el modal
const additionalStyles = `
<style>
.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 10px;
  border-left: 4px solid #667eea;
}

.detail-item i {
  font-size: 1.2rem;
  margin-top: 0.2rem;
}

.detail-item div {
  flex: 1;
}

.detail-item strong {
  color: #4a5568;
  font-weight: 600;
  display: block;
  margin-bottom: 0.5rem;
}

.detail-item p {
  color: #718096;
  margin: 0;
  line-height: 1.4;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);

    