import { useState } from "react";
import "./styles/cards.css";

export default function Cards() {
  const [pokemonData, setPokemonData] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [hasWon, setHasWon] = useState(false);
  const pokemonNames = [
    "ditto",
    "pikachu",
    "bulbasaur",
    "charmander",
    "squirtle",
    "jigglypuff",
    "meowth",
    "psyduck",
    "machop",
    "mankey",
    "abra",
    "ponyta",
    "magikarp",
    "eevee",
    "snorlax",
  ];

  const fetchPokeData = async () => {
    try {
      const requests = pokemonNames.map((name) =>
        fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then((response) =>
          response.json()
        )
      );
      const results = await Promise.all(requests);
      const initializedData = results.map((pokemon) => ({
        ...pokemon,
        clicked: false,
      }));
      setPokemonData(initializedData);
      setIsGameOver(false);
    } catch (error) {
      console.error("Error fetching pokemonData:", error);
    }
  };

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  const handleCardClick = (index) => {
    if (isGameOver) return; // Prevent clicks if game is over

    setPokemonData((prevData) => {
      const clickedPokemon = prevData[index];

      if (clickedPokemon.clicked) {
        setIsGameOver(true); // Set game over if the card was previously clicked
        return prevData;
      }
      const newScore = score + 1;
      setScore(newScore);

      if (newScore === 15) {
        setHasWon(true);
      }
      // Update clicked status and shuffle
      const updatedData = prevData.map((pokemon, i) =>
        i === index ? { ...pokemon, clicked: true } : pokemon
      );

      // Shuffle the updated data and return it
      return shuffleArray(updatedData);
    });
  };

  return (
    <>
      <div className="header">
        <h1>Welcome to PokeGuesser</h1>
        <button onClick={fetchPokeData} className="fetchPoke">
          Fetch
        </button>
        {isGameOver && (
          <p className="gameOver">
            Game Over! You clicked a card twice. Your score was {score}
          </p>
        )}
        {hasWon && <p className="hasWon">Congrats! You won!</p>}
      </div>

      <div className="cardsContainer">
        {pokemonData.map((data, index) => (
          <div
            className="pokeCard"
            key={index}
            onClick={() => handleCardClick(index)}
          >
            {data.sprites?.front_default && (
              <img src={data.sprites.front_default} alt={data.name} />
            )}
            <h3 className="pokeName">{data.name}</h3>
          </div>
        ))}
      </div>
    </>
  );
}
