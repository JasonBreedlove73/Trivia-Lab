
import {useState, useEffect, useRef} from "react";
import PropTypes from 'prop-types';

function Game(props) {
    const [questionInfo, setQuestionInfo] = useState({
        question: "",
        answers: [],
        correctAnswer: ""
    });

    const shouldFetchQuestion = useRef(true);

    const [fetchError, setFetchError] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState("");


    async function loadQuestion() {
        if (shouldFetchQuestion.current) {
            shouldFetchQuestion.current = false;
            const requestUrl = `https://opentdb.com/api.php?amount=1&category=${props.gamePrefs.selectedCategoryID}&difficulty=${props.gamePrefs.selectedDifficulty}&type=multiple`;
            try {
                const response = await ((await fetch(requestUrl)).json());
                let rawAnswers = [response.results[0]["correct_answer"], ...response.results[0]["incorrect_answers"]];

               
                let answers = rawAnswers.map(answer => ({answer, sort: Math.random()}))
                    .sort((a, b) => a.sort - b.sort)
                    .map(({answer}) => answer);

                setQuestionInfo({
                    question: response.results[0]["question"],
                    answers: answers,
                    correctAnswer: response.results[0]["correct_answer"]
                });
                setFetchError(false);
      
            } catch (error) {
                console.error("An error occurred while fetching the question:",error);
                setFetchError(true);
            }
        }
    }

    function handleAnswerChange(event) {
        setSelectedAnswer(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        let results = {
            name: props.gamePrefs.firstName,
            question: questionInfo.question,
            correctAnswer: questionInfo.correctAnswer
        }

        if (selectedAnswer === questionInfo.correctAnswer) {
            props.gameResultsCallback({...results,
                isCorrect: true
            });
        } else {
            props.gameResultsCallback({...results,
                isCorrect: false,
            });
        }
    }

    useEffect(() => {
        loadQuestion();
   
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div style={{display: "flex", flexDirection:"column", alignItems: "center"}}>
            {
                fetchError && (
                    <button onClick={() => {
                        shouldFetchQuestion.current = true;
                        loadQuestion();
                    }}>Failed to load question. Retry?</button>
                )
            }
            <div><h1>Question:</h1><p dangerouslySetInnerHTML={{__html: questionInfo.question}}></p></div>
            <form style={{display: "flex", flexDirection: "column"}}>
                {questionInfo.answers.map((answer, index) => (
                <span style={{alignItems: "center", textAlign: "left"}} key={index}>
                     
                <input type="radio"
                name="answerRadio"
                id={`answerRadio-${index}`}
                value={answer}
                onChange={handleAnswerChange}
                />
                
                <label htmlFor={`answerRadio-${index}`}
                style={{ marginLeft: "10px" }}
                dangerouslySetInnerHTML={{ __html: answer }}
                /> 
                </span>))}
                <button style={{marginTop: "2em"}} type={"submit"} onClick={handleSubmit}>Submit</button>
            </form>
        </div>
    );
}

Game.propTypes = {
    gamePrefs: PropTypes.shape({
        selectedDifficulty: PropTypes.string,
        selectedCategoryID: PropTypes.number,
        firstName: PropTypes.string
    }),
    gameResultsCallback: Function
}

export default Game;