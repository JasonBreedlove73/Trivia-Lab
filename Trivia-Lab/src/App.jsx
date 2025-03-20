import {useState} from 'react'
import './App.css'
import GameSettings from './components/GameSettings.jsx'
import Game from './components/Game.jsx'
import GameResults from "./components/GameResults.jsx";

function App() {

    const [gamePrefs, setGamePrefs] = useState();
    const [gameResults, setGameResults] = useState();

    async function handlePrefsChosen(prefs) {
        setGamePrefs(prefs);
    }

    async function handleResults(results) {
        setGameResults(results);
    }

    async function handlePlayAgain() {
        setGamePrefs(null);
        setGameResults(null);
    }

    return (
        <>
            {!gamePrefs && !gameResults && (
                <GameSettings startGameCallback={handlePrefsChosen}/>
            )}
            {gamePrefs && !gameResults && (
                <Game gamePrefs={gamePrefs} gameResultsCallback={handleResults}/>
            )}
            {gameResults && (
                <GameResults playAgainCallback={handlePlayAgain} gameResults={gameResults}/>
            )}
        </>
    )
}

export default App