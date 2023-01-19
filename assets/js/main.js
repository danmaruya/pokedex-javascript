const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
var pokemonStatus = [];
const modal = document.querySelector('.modal .content');
const limit = 10;
let offset = 0;
const maxRecords = 151;

function loadPokemonItems(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        pokemonStatus.push(pokemons);
        const newHtml = pokemons.map((pokemon) => `
            <li class="pokemon ${pokemon.type} modalBtn" id="${pokemon.number}">
                <span class="number" id="${pokemon.number}">#${pokemon.number}</span>
                <span class="name" id="${pokemon.number}">${pokemon.name}</span>

                <div class="detail" id="${pokemon.number}">
                    <ol class="types" id="${pokemon.number}">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>

                    <img src="${pokemon.photo}" id="${pokemon.number}" alt="${pokemon.name}">

                </div>
            </li>
        `).join('');

        pokemonList.innerHTML += newHtml;
        chamarModal();
    })
}

loadPokemonItems(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit

    const qtdRecordNexPage = offset + limit

    if (qtdRecordNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItems(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItems(offset, limit)
    }    
    chamarModal();
})

const switchModal = (pokeNumber) => {    
    if (pokeNumber || pokeNumber === 0)  {    
        let iteracao = Number.parseInt(pokeNumber/10);
    for (let i = 0; i < pokemonStatus[iteracao].length; i++) {
        if (pokeNumber +1 === pokemonStatus[iteracao][i].number) {
            pokeNumber = i;
            break;
        }        
    }

    let pokemonModal = `
        <div class="pokedex">
            <span class="number">#${pokemonStatus[iteracao][pokeNumber].number}</span>
            <span class="name">${pokemonStatus[iteracao][pokeNumber].name}</span>
            <img src=${pokemonStatus[iteracao][pokeNumber].photoPokedex} align="right">
            <br>
            <br>       
        `
        
        for (let j = 0; j < pokemonStatus[iteracao][pokeNumber].stats.length; j++) {
            const element = pokemonStatus[iteracao][pokeNumber].stats[j];
            pokemonModal += `
            <span class="status">${element}</span>
            <span class="status">${pokemonStatus[iteracao][pokeNumber].baseStats[j].base_stat} <progress id="file" max="255" value=${pokemonStatus[iteracao][pokeNumber].baseStats[j].base_stat}></progress></span>
            <br>
            
            `
            
        }
        pokemonModal += `</div>`
        
        modal.innerHTML = pokemonModal;
    }
    
    const modalPai = document.querySelector('.modal');
    const actualStyle = modalPai.style.display;
    if(actualStyle == 'block') {
        modalPai.style.display = 'none'
    }
    else {
        modalPai.style.display = 'block'
    }
}

function chamarModal() {
    const btn = document.querySelectorAll('.modalBtn')    
    
    btn.forEach(element => {
        element.addEventListener('click', (e) => {            
            switchModal(e.target.id - 1);
        })
    });

    window.onclick = function(event) {
      const modal = document.querySelector('.modal')
    if (event.target == modal) {
      switchModal()
    }
  }    
}
