
// all types of pokemon
var types = ["Normal", "Fire", "Water", "Electric", "Grass", "Ice", "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy"];

// add habitat information
const habitatName = d3.scaleOrdinal()
						.domain([1,2,3,4,5,6,7,8])
						.range(["Cave", "Forest", "Grassland", "Mountain", "Rare", "Rough-terrain", "Sea", "Urban", "Waters-edge"]);


var habitats = d3.select("svg#habitats")
				.attr("width", 1000)
				.attr("height", 90);

function greyHabitats() {
	for(let i=1; i <= 9; i++) {
		habitats.append("image")
				.attr("href", "habitat/"+i.toString()+".png")
				.attr("x", 84*(i-1))
				.attr("y", 0)
				.attr("height", 64)
				.attr("width", 64)
				.attr('id', i)
				.attr('class', 'habitat-inactive')
		habitats.append("text")
				.text(habitatName(i))
				.attr("x", 84*(i-1)+30)
				.attr("y", 80)
				.attr("fill", "white")
				.attr("font-size", 22);
	}
};

greyHabitats();

// correlation between pokemon type and habitats
var type_habitat = {
	"Normal": [1,2,3,4,6,8,9],
	"Fire": [3,4,5,8],
	"Water": [3,4,5,8],
	"Electric": [2,3,5,6,8],
	"Grass": [2,3,6],
	"Ice": [1,4,5,7,8],
	"Fighting": [4,8],
	"Poison": [1,3,8],
	"Ground": [1,4,6],
	"Flying": [],
	"Psychic": [1,2,3,4,5,8],
	"Bug": [2,3,4,9],
	"Rock": [1,2,4,7,9],
	"Ghost": [1,2,8],
	"Dragon": [2,5,6,9],
	"Dark": [1,2,3,4,6,8],
	"Steel": [1,4,6],
	"Fairy": [2,4,8]
}


// types of each pokemon
var evolvePokemonData = [];

for (let typeNum in types){
		// initialize the primitive pokemons of all the types
	evolvePokemonData.push({
		type:types[typeNum],
		pokemons: []

	});
}

// svg containing the evolution chain
var chain = d3.select("svg#evolution_chain");

const removeOldTypePokemon = () => {
	const toRemoveTypesPokemon = document.getElementsByClassName('type-pokemon')
	while (toRemoveTypesPokemon.length > 0) {
		toRemoveTypesPokemon[0].parentNode.removeChild(toRemoveTypesPokemon[0])
	}
}

const removeOldEvolutionPokemon = () => {
	console.log('removeOldEvolutionPokemon');
	const toRemoveEvolutionPokemon = document.getElementsByClassName('evolutionPokemon')
		
	while (toRemoveEvolutionPokemon.length > 0) {
		toRemoveEvolutionPokemon[0].parentNode.removeChild(toRemoveEvolutionPokemon[0])
	}
	const toRemoveEvolvedPokemonContainer = document.getElementById('center_evolution_visible')

	if (toRemoveEvolvedPokemonContainer !== null) {
			document.getElementById('center_evolution_visible').id = 'center_evolution'
	}
}

const setAllHabitatsInactive = () => {
	const activeHabitats = document.getElementsByClassName('habitat-active')
	if (activeHabitats.length > 0) {
		for (let x=0; x<activeHabitats.length; x++) {
			activeHabitats[x].setAttribute('class', 'habitat-inactive')
		}
	}
}

const setYourHabitatActive = (type) => {
	// hightlight corresponding habitats

	// then hightlight corresponding habitats of this type
	let habitat = type_habitat[type];
	for(let i in habitat) {
		let num = habitat[i];
		const allHabitatImgs = document.getElementsByClassName('habitat-inactive')
		for (let x=0; x<allHabitatImgs.length; x++) {
			const habitatImg = allHabitatImgs[x]
			if (num === Number(habitatImg.id)) {
				habitatImg.setAttribute('class', 'habitat-active')
			}
		}
	}
}

d3.csv("pokemon_species.csv", function(speciesData) {
	for (let poke in speciesData) {
		var isPrimitive = false;
		var thisType = speciesData[poke].Type

		if (speciesData[poke].evolves_from_species_id === '') {
			isPrimitive = true;
		}

		for (let t in evolvePokemonData) {
			if (evolvePokemonData[t].type === thisType) {
				evolvePokemonData[t].pokemons.push({
					pokemonName: speciesData[poke].identifier,
					id: speciesData[poke].id,
					primitive: isPrimitive,
					evolvesFrom: speciesData[poke].evolves_from_species_id
				})
			}
		}
	}

	for (let typeNum in types) {
		var typeImage = new Image(50, 19);
		typeImage.src = "types/" + types[typeNum].toLowerCase() + ".gif";
		typeImage.alt = types[typeNum];
		typeImage.className = "typesImg";


		typeImage.onclick = function () {
			removeOldTypePokemon()
			removeOldEvolutionPokemon()
			setAllHabitatsInactive()

			setYourHabitatActive(this.alt)

			var thesePokemons = [];

			for (let t in evolvePokemonData) {
				if (evolvePokemonData[t].type === types[typeNum]) {
					thesePokemons = evolvePokemonData[t].pokemons;

					for (let poke in thesePokemons) {
						if (thesePokemons[poke].primitive == true) {
							const pokemonOfTypeImg = new Image(64, 64);
							pokemonOfTypeImg.src = "pokemon/" + thesePokemons[poke].id + ".png";
							pokemonOfTypeImg.className = 'type-pokemon';
							pokemonOfTypeImg.classList.add('animated', 'rollIn')

							pokemonOfTypeImg.onclick = function () {
								removeOldEvolutionPokemon()

								var evolutionPokemonImg = new Image(80, 80);
								evolutionPokemonImg.src = "pokemon/" + thesePokemons[poke].id + ".png";
								evolutionPokemonImg.id = thesePokemons[poke].id;
								evolutionPokemonImg.className = 'evolutionPokemon'

								const evolutionContainer = document.getElementById('center_evolution')
								if (evolutionContainer !== null) {
									evolutionContainer.id = 'center_evolution_visible'
								}

								document.getElementById("evolution_chain").appendChild(evolutionPokemonImg);

								isEvolve = traceEvolution(thesePokemons[poke].id);


								for (var evolveDirection in isEvolve[1]) {
									//console.log(isEvolve[1][evolveDirection]);
									isEvolve2 = traceEvolution(isEvolve[1][evolveDirection]);
								}

								function traceEvolution (id) {
									var thesePokemons2 = [];

									var continueTrace = false;
									var continueId = [];

									// document.querySelector('svg#evolution_chain').innerHTML='';

									for (let t2 in evolvePokemonData) {
										thesePokemons2 = evolvePokemonData[t2].pokemons;

										// count how many pokemon have been found in this evolution chain
										// let count = 1;
										for (let poke2 in thesePokemons2) {
											if (thesePokemons2[poke2].evolvesFrom === id) {
												continueId.push(thesePokemons2[poke2].id)

												var myImage = new Image(80, 80);
												myImage.src = "pokemon/" + thesePokemons2[poke2].id + ".png";
												myImage.id = thesePokemons2[poke2].id;
												myImage.className = 'evolutionPokemon'

												document.getElementById("evolution_chain").appendChild(myImage)

												continueTrace = true;
											}
										}
									}
									return [continueTrace, continueId];

								}







							}

							document.getElementById("primitive_pokemons").appendChild(pokemonOfTypeImg);
						}
					}
				}

			}

		}


		document.getElementById("types").appendChild(typeImage);

		// console.log(myImage);
		


	}


});








//showPrimitiveImage("Bug");









