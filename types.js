
// all types of pokemon
var types = ["Normal", "Fire", "Water", "Electric", "Grass", "Ice", "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy"];

// add habitat information
const habitatName = d3.scaleOrdinal()
						.domain([1,2,3,4,5,6,7,8])
						.range(["Cave", "Forest", "Grassland", "Mountain", "Rare", "Rough-terrain", "Sea", "Urban", "Waters-edge"]);


var habitats = d3.select("svg#habitats")
				.attr("width", 1000)
				.attr("height", 110);

function greyHabitats() {
	for(let i=1; i <= 9; i++) {
		habitats.append("image")
				.attr("href", "habitat/"+i.toString()+".png")
				.attr("x", 100*(i-1))
				.attr("y", 0)
				.attr("height", 90)
				.attr("width", 90)
				.attr('id', i)
				.attr('class', 'habitat-inactive')
		habitats.append("text")
				.text(habitatName(i))
				.attr("x", 100*(i-1)+44)
				.attr("y", 110)
				.attr("fill", "white")
				.style("font-size", 15);
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

const removeOldTypeSelected = () => {
	const toRemoveTypesPokemon = document.getElementsByClassName('typesImg active')

	if (toRemoveTypesPokemon.length > 0)
		toRemoveTypesPokemon[0].className = 'typesImg'
}

const removeOldTypePokemon = () => {
	const toRemoveTypesPokemon = document.getElementsByClassName('type-pokemon')
	while (toRemoveTypesPokemon.length > 0) {
		toRemoveTypesPokemon[0].parentNode.removeChild(toRemoveTypesPokemon[0])
	}
}

const removeOldEvolutionPokemon = () => {
	//console.log('removeOldEvolutionPokemon');
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
	while (activeHabitats.length > 0) {
		activeHabitats[0].setAttribute('class', 'habitat-inactive')
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

d3.csv("./data/pokemon_species.csv", function(speciesData) {
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
					evolvesFrom: speciesData[poke].evolves_from_species_id,
					evolutionTrigger: speciesData[poke].evolution_trigger,
				})
			}
		}
	}

	for (let typeNum in types) {
		var typeImage = new Image(70, 81.2);
		typeImage.src = "types/" + types[typeNum].toLowerCase() + ".gif";
		typeImage.alt = types[typeNum];
		typeImage.id = types[typeNum];
		typeImage.className = "typesImg";

		typeImage.onclick = function () {
			removeOldTypeSelected()
			removeOldTypePokemon()
			removeOldEvolutionPokemon()
			setAllHabitatsInactive()
			const typeElem = document.getElementById(types[typeNum]);
			typeElem.classList.toggle('active')

			setYourHabitatActive(this.alt)

			var thesePokemons = [];

			for (let t in evolvePokemonData) {
				if (evolvePokemonData[t].type === types[typeNum]) {
					thesePokemons = evolvePokemonData[t].pokemons;

					for (let poke of thesePokemons) {
						if (poke.primitive == true) {
							const name = poke.pokemonName
							const pokemonOfTypeImg = new Image(64, 64);
							pokemonOfTypeImg.src = "pokemon/" + poke.id + ".png";
							pokemonOfTypeImg.className = 'type-pokemon';
							pokemonOfTypeImg.classList.add('animated', 'rollIn')

							pokemonOfTypeImg.onclick = function () {

								document.getElementById("click_reminder").innerHTML = '';

								removeOldEvolutionPokemon()

								isEvolve = traceEvolution(poke.id, name, 1);

								for (var evolveDirection in isEvolve[1]) {
									isEvolve2 = traceEvolution(isEvolve[1][evolveDirection], isEvolve[2][evolveDirection], 2);
									
									for (var evolveDirection2 in isEvolve2[1]) {
										traceEvolution(isEvolve2[1][evolveDirection2], isEvolve2[2][evolveDirection2], 3);

									}
								}

								function traceEvolution (id, pokemonName, level) {
									const evolutionTrigger = speciesData[id - 1]['evolution_trigger']

									var myImage = new Image(80, 80);
									myImage.src = "pokemon/" + id + ".png";
									myImage.id = id;
									myImage.className = 'evolutionPokemon'

									myImage.onclick = function () {
										//console.log(pokemonName);
										radarAdd(pokemonName);
									}

									const evolutionContainer = document.getElementById('center_evolution')
									if (evolutionContainer !== null) {
										evolutionContainer.id = 'center_evolution_visible'
									}

									const content = pokemonName + '<br/>' + evolutionTrigger
									document.getElementById("evolution_chain").appendChild(myImage);
									tippy('.evolutionPokemon', {
										content
									})

									// document.getElementById("evolution_chain").appendChild(myImage);
									document.getElementById("level_"+level.toString()).appendChild(myImage);


									// check whether it can evolve to next one
									var thesePokemons2 = [];
									var continueTrace = false;
									var continueId = [];
									var continueName = [];
									for (let t2 in evolvePokemonData) {
										thesePokemons2 = evolvePokemonData[t2].pokemons;

										//console.log(thesePokemons2);

										for (let poke2 in thesePokemons2) {
											if (thesePokemons2[poke2].evolvesFrom === id) {
												continueTrace = true;
												continueId.push(thesePokemons2[poke2].id)
												continueName.push(thesePokemons2[poke2].pokemonName);
											}
										}
									}

									//console.log(continueId);
									return [continueTrace, continueId, continueName];
								}

								var div = document.getElementById('click_reminder');
								div.innerHTML += '(Click for Stats Below)';
							}
							
							document.getElementById("primitive_pokemons").appendChild(pokemonOfTypeImg);
							tippy('.type-pokemon', {
								content: name
							})
						}
					}
				}
			}
		}

		if(typeNum < 9) {
			document.getElementById("types_row1").appendChild(typeImage);
		}else {
			document.getElementById("types_row2").appendChild(typeImage);
		}
		// document.getElementById("types").appendChild(typeImage);
	}
});
