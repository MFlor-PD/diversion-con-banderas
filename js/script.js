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


const url = 'https://restcountries.com/v3.1/all?fields=name,flags,capital,population,car';

const getCountries = async () => {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error('Error: ' + res.status);
    }
    const data = await res.json();

    const countries = data
      .map(({ name, flags, capital, population, car }) => ({
        name: name.common.toUpperCase(),
        flag: flags.png || flags.svg,
        capital: capital ? capital[0] : 'N/A',
        population: population.toLocaleString(),
        side: car?.side || 'N/A',
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    template('countries-list', countries);
  } catch (err) {
    console.error('Error:', err);
  }
};

const template = (containerId, countries) => {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  countries.forEach(({ name, flag, capital, population, side }) => {
    container.innerHTML += `
      <div class="countries">
        <div><img src="${flag}" alt="${name} flag" /></div>
        <div><h2 class="name">${name}</h2></div>
        <div class="country-details">
          <p class="capital">Capital: ${capital}</p>
          <p class="population">Population: ${population}</p>
          <p class="driving-side">Driving side: ${side}</p>
        </div>
      </div>
    `;
  });
};

getCountries();





/* FETCH VERSION CORTA
fetch(url)
  .then(res => res.json())
  .then(data => {
    // Haz algo con los datos aquí
    console.log(data);
  })
  .catch(err => console.error('Error:', err));
*/

    