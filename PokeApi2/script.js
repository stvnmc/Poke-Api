const pokeCard = document.getElementById('data-poke-card');
const pokeName = document.getElementById('data-poke-name');
const pokeImg = document.getElementById('data-poke-img');
const pokeImgContainer = document.getElementById('data-poke-img-container');
const pokeId = document.getElementById('data-poke-id');
const pokeHeight = document.getElementById('data-poke-height');
const pokeWeight = document.getElementById('data-poke-weight');
const pokeTypes = document.getElementById('data-poke-types');
const pokeStats = document.getElementById('data-poke-stats');
const pokeMoves = document.getElementById('data-poke-moves');
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
        .catch(err => renderNotFound())
}

const renderPokemonData = data => {
    const sprite = data.sprites.front_default;
    const { stats, types, moves } = data;

    pokeName.textContent = data.name;
    pokeCard.style.minWidth = '42vw'
    pokeCard.style.minHeight = '62vh'
    pokeCard.style.display = 'grid'
    pokeImg.setAttribute('src', sprite);
    pokeId.textContent = `Nº ${data.id}`;
    pokeHeight.textContent = `H ${data.height / 10}m`;
    pokeWeight.textContent = `W ${data.weight / 10}kg`;
    setCardColor(types);
    renderPokemonTypes(types)
    renderPokemonStats(stats)
    renderPokemonMoves(moves)
}

const setCardColor = types => {
    const colorOne = typeColors[types[0].type.name];
    const colorTwo = types[1] ? typeColors[types[1].type.name] : typeColors.default;
    pokeImgContainer.style.background = `radial-gradient(${colorTwo} 33%, ${colorOne} 33%)`;
    pokeImgContainer.style.backgroundSize = ' 5px 5px';
}

const renderPokemonTypes = types => {
    pokeTypes.innerHTML = '';
    types.forEach(type => {
        const typeTextElement = document.createElement("div");
        typeTextElement.style.color = typeColors[type.type.name];
        typeTextElement.textContent = type.type.name;
        pokeTypes.appendChild(typeTextElement);
    });
}

const renderPokemonStats = stats => {
    pokeStats.innerHTML = '';
    stats.forEach(stat => {
        const statElement = document.createElement("div");
        const statElementName = document.createElement("h3");
        const statElementAmount = document.createElement("h3");
        statElementName.textContent = stat.stat.name;
        statElementAmount.textContent = stat.base_stat;
        statElement.appendChild(statElementName);
        statElement.appendChild(statElementAmount);
        pokeStats.appendChild(statElement);
    });
}

const renderPokemonMoves = moves => {
    moves.length = 4
    pokeMoves.innerHTML = '';
    moves.forEach(move => {

        //We create elements of the movements
        const moveElementName = document.createElement("h2")
        moveElementName.textContent = move.move.name;

        //We get the types of attacks
        const resp = fetch(move.move.url).then(response => response.json())
        Promise.all([resp]).then(values => {
            values.forEach(types => {
                const colorOne = typeColors[types.type.name];
                const colorTwo = typeColors.default;
                moveElementName.style.background = `radial-gradient(${colorTwo} 33%, ${colorOne} 33%)`;
                moveElementName.style.backgroundSize = ' 5px 5px';
            })
        });
        pokeMoves.appendChild(moveElementName);
    })

}

const renderNotFound = () => {
    pokeName.textContent = 'No encontrado'
    pokeImg.setAttribute('src', 'img/poke-shadow.png')
    pokeImg.style.background = '#fff'
    pokeCard.style.minWidth = '25vh'
    pokeCard.style.minHeight = '20vh'
    pokeCard.style.display = 'block'
    pokeTypes.innerHTML = ''
    pokeStats.innerHTML = ''
    pokeId.textContent = ''
    pokeHeight.textContent = ''
    pokeWeight.textContent = ''
    pokeMoves.textContent = ''
}

const indexNum = (index) => {
    const generation = allGenerations[index]
    NumGene(generation)
}

const NumGene = (Gene) => {
    const urlPokemon = `https://pokeapi.co/api/v2/pokemon?${Gene}`
    GetPokemons(urlPokemon)
}

const GetPokemons = async (url) => {
    const response = await fetch(url);
    const results = await response.json();
    DataPokemons(results.results)
}

const DataPokemons = async (data) => {

    // With this I create the 8 generations and we add the event to render the different pokemons of the exact season
    const generationsTable = document.getElementById('poke-generations')
    generationsTable.innerHTML = '';
    var numbG = 0;
    for (let i = 0; i < 8; i++) {
        numbG += 1;
        generationsHTML = `
        <li class="generations">Gene${numbG}</li>
        `
        generationsTable.innerHTML += generationsHTML;
    }
    setTimeout(() => {
        const selectG = document.querySelectorAll('.generations')
        selectG.forEach((session, index) => {
            session.addEventListener("click", () => {
                pokeTable.innerHTML = '';
                indexNum(index + 1)
            })
        })
        table.style.height = '60vh'
        pokeTable.style.display = '';
    }, 3000);
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
            getID(poke.id)
        })
    })
    const getID = (e) => {
        searchPokemonData(e)
    }
}

indexNum(1)

