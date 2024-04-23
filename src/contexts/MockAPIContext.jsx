import React, { createContext, useState, useEffect } from "react";

export const MockAPIContext = createContext();

export const MockAPIProvider = ({ children }) => {
  const recordGameResult = async (gameName, result) => {
    // Logic to record the game result and send it to the backend
    try {
      const response = await fetch("https://a.picoapps.xyz/view-race/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameName, result }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log(`Game ${gameName} result recorded: ${result}`);
    } catch (error) {
      console.error("Error recording game result:", error);
    }
    console.log(`Game ${gameName} result: ${result}`);
    // This could be extended to update the state or make an API call to record the result
  };

  const [games, setGames] = useState([]); // Initialize games state with an empty array
  const [playedGames, setPlayedGames] = useState([]);
  const [gameOutcome, setGameOutcome] = useState({});

  const [favoriteGames, setFavoriteGames] = useState([]); // State to track the user's favorite games

  const fetchGames = async () => {
    // Removed the manual setting of games to an empty array to avoid unnecessary re-renders
    try {
      const response = await fetch("https://a.picoapps.xyz/view-race/games");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setGames(data.games); // Assuming the data contains an array of games under the key 'games'
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    // Fetch games from the API when the component mounts
    fetchGames();
  }, []); // Empty dependency array to only fetch on mount

  const markGameAsPlayed = (gameName) => {
    // Simulate updating the database by adding the game to the played games list
    if (!playedGames.includes(gameName)) {
      setPlayedGames([...playedGames, gameName]);
    }
  };

  const resetGameOutcome = () => {
    setGameOutcome(null);
  };

  useEffect(() => {
    // Simulate database change effect if needed
  }, [games, playedGames, gameOutcome]);

  const playGame = (gameName) => {
    // Simulate a game play outcome
    const outcome = Math.random() < 0.5 ? "won" : "lost";
    setGameOutcome({ gameName, outcome });

    // Mark the game as played
    markGameAsPlayed(gameName);
  };

  // Updated functions to manage the state of favorite games
  const toggleGameFavorite = (gameName) => {
    setFavoriteGames((prevFavorites) => (prevFavorites.includes(gameName) ? prevFavorites.filter((name) => name !== gameName) : [...prevFavorites, gameName]));
  };

  // Removed addGameToFavorites and removeGameFromFavorites as they were replaced by toggleGameFavorite
  return <MockAPIContext.Provider value={{ games, fetchGames, playedGames, markGameAsPlayed, playGame, gameOutcome, resetGameOutcome, favoriteGames, toggleGameFavorite }}>{children}</MockAPIContext.Provider>;
};
