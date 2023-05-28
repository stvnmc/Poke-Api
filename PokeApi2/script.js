const pokeCard = document.getElementById('data-poke-card');
const pokeTable = document.getElementById('table-poke');
const table = document.getElementById('table');

const typeColors = {
    electric: '#FFEA70',
    normal: '#B09398',
    fire: '#FF675C',
    water: '#0596C7',
    ice: '#AFEAFD',
    rock: '#999799',
    flying: '#7AE7C7',
    grass: '#4A9681',
    psychic: '#FFC6D9',
    ghost: '#561D25',
    bug: '#A2FAA3',
    poison: '#795663',
    ground: '#D2B074',
    dragon: '#DA627D',
    steel: '#1D8A99',
    fighting: '#2F2F2F',
    fairy: '#e39ca0',
    dark: '#171010',
    default: '#2A1A1F',
};

const allGenerations = {
    1: 'offset=0&limit=151',
    2: 'offset=151&limit=100',
    3: 'offset=386&limit=108',
    4: 'offset=494&limit=155',
    5: 'offset=649&limit=72',
    6: 'offset=721&limit=88',
    7: 'offset=809&limit=96',
    8: 'offset=905&limit=105',
};

const searchPokemon = event => {
    event.preventDefault();
    const { value } = event.target.pokemon;
    searchPokemonData(value)
}

const searchPokemonData = value => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${value.toLowerCase()}`)
        .then(data => data.json())
        .then(response => renderPokemonData(response))
        .catch(err => coverAndNotFound())
}

const coverAndNotFound = () => {
    pokeCard.innerHTML = '';
    pokeCard.style.minWidth = '25vw'
    pokeCard.style.minHeight = '10vh'
    const cardImg = document.createElement("img")
    cardImg.setAttribute('src', './img/poke-shadow.png');
    cardImg.style.width = '25vw'
    pokeCard.appendChild(cardImg)
}

coverAndNotFound()

const renderPokemonData = data => {

    pokeCard.style.minWidth = '80%'
    pokeCard.style.minHeight = '62vh'
    pokeCard.style.display = 'grid'

    const colorOne = typeColors[data.types[0].type.name];
    const colorTwo = data.types[1] ? typeColors[data.types[1].type.name] : typeColors.default;

    pokeCard.innerHTML = '';
    pokeCardHtml = `
    <h2 id="data-poke-name" class="name">${data.name ? data.name : 'Pokedex'}</h2>
    <div id="data-poke-img-container" class="img-container" style="background:radial-gradient(${colorOne} 33%, ${colorTwo
            ? colorTwo : typeColors.default} 33%) 0% 0% / 5px 5px;">
        <img id="data-poke-img" class="poke-img" src=" ${data.sprites.front_default ? data.sprites.front_default : './img/poke-shadow.png'} " />
    </div>
    <div id="data-poke-stats" class="poke-stats"></div >
    <div class="poke-data-basic">
        <div id="data-poke-id">Nº ${data.id}</div>
        <div id="data-poke-height">H ${data.height / 10}m</div>
        <div id="data-poke-weight">W ${data.weight / 10}kg</div>
    </div>
    <div id="data-poke-types" class="poke-types">
            ${data.types.length === 2 ?
            `
            <div style="color:${colorOne}">${data.types[0].type.name}</div>
            <div style="color:${colorTwo}">${data.types[1].type.name}</div>`
            :
            `<div style="color:${colorOne}">${data.types[0].type.name} </div>
            `}
    </div>
    <div id="data-poke-moves" class="poke-moves"></div>
    `
    pokeCard.innerHTML += pokeCardHtml;

    const pokeStats = document.getElementById('data-poke-stats');
    data.stats.forEach(stat => {
        const statElement = document.createElement("div");
        const statElementName = document.createElement("h3");
        const statElementAmount = document.createElement("h3");
        statElementName.textContent = stat.stat.name;
        statElementAmount.textContent = stat.base_stat;
        statElement.appendChild(statElementName);
        statElement.appendChild(statElementAmount);
        pokeStats.appendChild(statElement);
    });

    data.moves.length = 4
    const pokeMoves = document.getElementById('data-poke-moves');
    data.moves.forEach(move => {

        //We create elements of the movements
        const moveElementName = document.createElement("h2")
        moveElementName.textContent = move.move.name;
        moveElementName.textContent = move.move.name;

        //We get the types of attacks
        const resp = fetch(move.move.url).then(response => response.json())
        Promise.all([resp]).then(values => {
            values.forEach((e) => {
                moveElementName.style.background = `${typeColors[e.type.name]} `;
                moveElementName.style.backgroundSize = ' 5px 5px';
            })
        });
        pokeMoves.appendChild(moveElementName);
    })
}

const indexNum = async (index) => {
    const generation = allGenerations[index]
    const urlPokemon = `https://pokeapi.co/api/v2/pokemon?${generation}`
    const response = await fetch(urlPokemon);
    const results = await response.json();
    DataPokemons(results.results)
};

const DataPokemons = async (data) => {

    // With this I create the 8 generations and we add the event to render the different pokemons of the exact season
    const generationsTable = document.getElementById('poke-generations')
    const generation = document.querySelectorAll('.generations')
    if (generation.length === 0) {
        for (let i = 0; i < 8; i++) {
            generationsHTML = `
            <li class="generations ${i === 0 ? 'activo' : ''}">Gene${i + 1}</li>
            `
            generationsTable.innerHTML += generationsHTML;
        }
    };

    const selectG = document.querySelectorAll('.generations')
    selectG.forEach((session, index) => {
        if (session.classList.contains('ge')) {
        } else {
            session.classList.add('ge')
            session.addEventListener("click", () => {
                pokeTable.innerHTML = '';
                document.querySelector('.session .activo').classList.remove('activo')
                session.classList.toggle('activo')
                indexNum(index + 1)
            })
        }
    });
    setTimeout(() => {
        table.style.height = '60vh'
        pokeTable.style.display = '';
    }, 1500);
    pokeTable.style.display = 'none';
    table.style.height = '0vh';

    //the pokemon list is rendered and a click event is added to add it to the poke card
    for (let index of data) {
        const resp = await fetch(index.url);
        const resul = await resp.json();
        tem2lateHtml = `
        <div class="poke" id="${resul.id}"
        style="background:radial-gradient(${typeColors[resul.types[0].type.name]} 33%, ${resul.types[1]
                ? typeColors[resul.types[1].type.name] : typeColors.default} 33%) 0% 0% / 5px 5px;">
        <h2 style="color:#fff;">${resul.name}</h2>
        <h2 style="color:#fff;">${resul.id}</h2>
        <img src=${resul.sprites.front_default} />
        </div>
        `;
        pokeTable.innerHTML += tem2lateHtml;
    };

    const poke = document.querySelectorAll('.poke');
    poke.forEach(poke => {
        poke.addEventListener("click", () => {
            searchPokemonData(poke.id)
        })
    });
};

indexNum(1)