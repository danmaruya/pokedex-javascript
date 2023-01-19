//cria-se o objeto pokeApi
const pokeApi = {}

//esta funcao cria um novo objeto (pokemon) e "converte" o nome dos dados a serem recebidos pela api (que no caso sao o numero, nome, tipos, stats e fotos dos pokemons) para a terminologia usada no programa
function convertPokeApiDetailtopokemon(pokeDetail) {
    const pokemon = new Pokemon()

    pokemon.number = pokeDetail.id

    pokemon.name = pokeDetail.name
    
    const statsName = pokeDetail.stats.map((statSlot) => statSlot.stat.name)
    pokemon.stats = statsName

    pokemon.baseStats = pokeDetail.stats.map((statSlot) => statSlot)
    
    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types
    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default
    pokemon.photoPokedex = pokeDetail.sprites.other.home.front_default

    return pokemon
}

//
pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
            .then((response) => response.json())
            .then(convertPokeApiDetailtopokemon)
}

//seta por onde a api deve comecar a trazer os dados e sua quantidade(neste caso, desde o primeiro pokemon (offset=0) e o limite para 5 dados)
//o caminho realizado aqui, transforma a resposta recebida pelo programa a transformar em um json e posteriormente, listando os demais dados requisitados
pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
        
    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}