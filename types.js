
var types = ["Normal", "Fire", "Water", "Electric", "Grass", "Ice", "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy"];

var evolvePokemonData = [];







for (let typeNum in types){
		// initialize the primitive pokemons of all the types
	evolvePokemonData.push({
		type:types[typeNum],
		pokemons: []

	});
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





	console.log(evolvePokemonData);

	for (let typeNum in types) {
		var myImage = new Image(50, 19);
		myImage.src = "types/" + types[typeNum].toLowerCase() + ".gif";
		myImage.alt = types[typeNum];
		myImage.id = "thisImg";


		myImage.onclick = function () {

		//elem = document.getElementById("primitive pokemons");
		for (let typeNum in types) {
			const toRemove = document.getElementsByClassName(types[typeNum])
			while (toRemove.length > 0) {
				toRemove[0].parentNode.removeChild(toRemove[0])
			}
		}

			var thesePokemons = [];

			for (let t in evolvePokemonData) {


				if (evolvePokemonData[t].type === types[typeNum]) {
					thesePokemons = evolvePokemonData[t].pokemons;

					for (let poke in thesePokemons) {

						if (thesePokemons[poke].primitive == true) {
							var myImage = new Image(64, 64);
							myImage.src = "pokemon/" + thesePokemons[poke].id + ".png";
							myImage.id = "thisImg";
							myImage.className = types[typeNum];


							myImage.onclick = function () {
								const toRemove = document.getElementsByClassName('evolutionPokemon')
									while (toRemove.length > 0) {
										toRemove[0].parentNode.removeChild(toRemove[0])
									}




								var myImage = new Image(64, 64);
								myImage.src = "pokemon/" + thesePokemons[poke].id + ".png";
								myImage.id = thesePokemons[poke].id;
								myImage.className = 'evolutionPokemon'

								document.getElementById("evolution_chain").appendChild(myImage);




								isEvolve = traceEvolution(thesePokemons[poke].id);


								for (var evolveDirection in isEvolve[1]) {
									//console.log(isEvolve[1][evolveDirection]);
									isEvolve2 = traceEvolution(isEvolve[1][evolveDirection]);
								}



								


								function traceEvolution (id) {

									var thesePokemons2 = [];

									var continueTrace = false;
									var continueId = [];
									for (let t2 in evolvePokemonData) {
										thesePokemons2 = evolvePokemonData[t2].pokemons;

										
										for (let poke2 in thesePokemons2) {
											if (thesePokemons2[poke2].evolvesFrom === id) {
												continueId.push(thesePokemons2[poke2].id)

												var myImage = new Image(64, 64);
												myImage.src = "pokemon/" + thesePokemons2[poke2].id + ".png";
												myImage.id = thesePokemons2[poke2].id;
												myImage.className = 'evolutionPokemon'

												document.getElementById("evolution_chain").appendChild(myImage);



												continueTrace = true;

											}

										}


									}

									return [continueTrace, continueId];

								}







							}

							document.getElementById("primitive_pokemons").appendChild(myImage);
						}
					}
				}

			}

		}


		document.getElementById("types").appendChild(myImage);



	}


	//function showPrimitiveImage(type) {



	//}

	//showPrimitiveImage("Bug");









});







//showPrimitiveImage("Bug");









