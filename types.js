
var types = ["Normal", "Fire", "Water", "Electric", "Grass", "Ice", "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy"];

var evolvePokemonData = [];

for (let typeNum in types) {
	var myImage = new Image(50, 19);
	myImage.src = "types/" + types[typeNum].toLowerCase() + ".gif";
	myImage.alt = types[typeNum];
	myImage.id = "thisImg";
	//myImage.onclick = showPrimitiveImage(types[typeNum]);
	document.body.appendChild(myImage);
}



for (let typeNum in types){
		// initialize the primitive pokemons of all the types
	evolvePokemonData.push({
		type:types[typeNum],
		pokemons: []

	});
}


Promise.all([
	d3.csv("pokemon_species.csv")
]
).then(speciesData => {

		for (let poke in speciesData) {
		var isPrimitive = false;
		var thisType = speciesData[poke].Type



			if (speciesData[poke].evolves_from_species_id === '') {
				isPrimitive = true;
			}

			for (let t in evolvePokemonData) {
				if (evolvePokemonData[t].type === thisType) {
					evolvePokemonData[t].pokemons.push({
						id: speciesData[poke].id,
						primitive: isPrimitive,
						evolvesFrom: speciesData[poke].evolves_from_species_id
					})
				}
			}
		}

});




console.log(evolvePokemonData[0].pokemons);




	showPrimitiveImage("Bug");

	function showPrimitiveImage(type) {

		var thesePokemons = [];


		for (let t in evolvePokemonData) {

				//console.log(evolvePokemonData[t].pokemons);


			if (evolvePokemonData[t].type === type) {
				thesePokemons = evolvePokemonData[t].pokemons;

				for (let poke in evolvePokemonData[t].pokemons) {
					//console.log(evolvePokemonData[t].pokemons[0]);
				}
			}

		}

		for (let poke in thesePokemons) {



			if (thesePokemons[poke].primitive == true) {

			}

		}

	}







