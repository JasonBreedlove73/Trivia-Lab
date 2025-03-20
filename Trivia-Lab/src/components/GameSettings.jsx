
import {useState, useEffect, useRef} from "react";
import styles from './GameSettings.module.css';
import Constants from "../Constants.js";
import Welcome from "./Welcome.jsx";

function GameSettings(props) {

  
    const [availableCategories, setAvailableCategories] = useState([{
        id: 0,
        name: "All Categories"
    }]);

    const [errors, setErrors] = useState({
        fetchError: false,
        firstNameError: false
    });

    const [gamePrefs, setGamePrefs] = useState({
        firstName: "",
        selectedCategoryID: "0",
        selectedDifficulty: "easy"
    });

    const shouldFetchCategories = useRef(true);

    async function fetchCategories() {
        if (shouldFetchCategories.current) {
            shouldFetchCategories.current = false;
            try {
                const availableCategoriesJSON = await (await
                    fetch(`https://opentdb.com/api_category.php`)).json();
                setAvailableCategories(Array.prototype.concat(availableCategories,
                    availableCategoriesJSON.trivia_categories));
                setErrors({...errors, fetchError: false});
           
            } catch (error) {
                console.error("An error occurred while fetching the category:",error);
                setErrors({...errors, fetchError: true});
            }
        }
    }

  
    function handleCategoryChange(event) {
        setGamePrefs({...gamePrefs, selectedCategoryID: event.target.value});
    }

    function handleDifficultyChange(event) {
        setGamePrefs({...gamePrefs, selectedDifficulty: event.target.value.toLowerCase()});
    }

   function handleFirstNameChange(event) {
    const trimmedValue = event.target.value.trim();
    setGamePrefs({ ...gamePrefs, firstName: trimmedValue });
    setErrors({ ...errors, firstNameError: trimmedValue === "" });
}


    function handleSubmit(event) {
        event.preventDefault();
        if (gamePrefs.firstName === "") {
            setErrors({...errors, firstNameError: true});
            return;
        }
       
        props.startGameCallback(gamePrefs);
    }

 
    useEffect(() => {
        fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (

        <>
            <Welcome />
            {errors.fetchError && (
                <button className={styles.buttonError} onClick={() => {
                    shouldFetchCategories.current = true;
                    fetchCategories();
                }}>Failed to load Categories.
                    Retry?</button>
            )}

            <form className={styles.settingsDiv} onSubmit={handleSubmit}>
                <div className={styles.nameSection}>
                    <label htmlFor="firstName" className={styles.label}>First Name</label>
                    <input className={styles.nameInput} type="text" id="firstName" name="firstName"
                           placeholder="Jason" onChange={handleFirstNameChange}/>

                    {errors.firstNameError && (
                        <p className={styles.errorLabel}>Name is required</p>
                    )}
                </div>

                <select className={styles.input} name="categories" id="categories"
                        onChange={handleCategoryChange}
                        defaultValue="0">
                    {availableCategories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>

                <select className={styles.input} name="difficulty" id="difficulty"
                        onChange={handleDifficultyChange}>
                    {Constants.availableDifficulties.map((difficulty, index) => (
                        <option key={index} value={difficulty}>{difficulty}</option>
                    ))}
                </select>
                <button type={"submit"}>Submit</button>
            </form>
        </>
    );
}

GameSettings.propTypes = {
    startGameCallback: Function
}

export default GameSettings;