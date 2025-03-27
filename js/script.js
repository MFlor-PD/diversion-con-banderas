//hacer la estructura del Fetch, para ver que trae, (fetch, Async/Await...) v
// Traer la info de banderas: imagen, nombre, capital, poblacion, lado de conducir. Usar un .map v
//Usar el DOM para que aparezcan en pantalla v
//Organizar los nombres con el mismo tiepo de letra, to uppercase. v
//Ordenarlos alfabeticamente - sort v
//agregar un evento click para que al seleccionar un pais, me aparezca un flotante en el centro y fijo hasta que se cierre voluntariamente.
//unas css para que al pasar el HOVER se agranden   => puro capricho mio.
// Extras : Puedes manipular el `HTML` si lo necesitaras. 
//          Si necesitas añadir clases a un elemento mediante JS, lo puedes hacer con `elemento.classList.add('clase que quieres añadir')` y para eliminar `elemento.classList.remove('clase que quieres añadir')`
const url = 'https://restcountries.com/v3/all';

const getCountries = async() => {
    try {
        const res = await fetch(url)
        if (!res.ok) {
            throw new Error ('Error', res.status)
        }
        const data = await res.json();
        //console.log(data);
        const countries = data.map(({ name, flags, capital, population, car}) => ({  
          name: name.common,
          flag: flags.png,
          capital: capital && capital[0],
          population: population,
          side: car.side,
        }))
        .sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()));
        //console.log(countries); 
        //return countries;
        template('countries-list', countries);    
    }
    catch(err) {
     console.error('Error', err);
    }
    
};

const template = (countriesList, countries) => {
    const container = document.getElementById("countries-list");
    container.innerHTML = '';
    countries.forEach(({ name, flag, capital, population, side }) => {
        let templateCountry = `
        <div>
        <h2 class="name">Name: ${name}</h2>
        <p class="capital">Capital: ${capital}
        <img src="${flag}" alt ="${name.common} flag"/>
        <p class="population">Population: ${population}</p>
        <p class="driving-side">Driving side: ${side}</p> 
        </div>
        `;
        container.innerHTML += templateCountry;
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
/* 
 "flags": [
      "https://flagcdn.com/gi.svg",
      "https://flagcdn.com/w320/gi.png"
    ]
    "population": 33691,
    "fifa": "GIB",
    "car": {
      "signs": [
        "GBZ"
      ],
      "side": "right"
    },
    [
  {
    "name": {
      "common": "Gibraltar",
      "official": "Gibraltar",
      "nativeName": {
        "eng": {
          "official": "Gibraltar",
          "common": "Gibraltar"
        }
      }
    },
     "capital": [
      "Gibraltar"
    ], 
    
    */

    