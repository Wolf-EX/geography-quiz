import Modal from "./Modal";
import QuizFormItem from "./QuizFormItem";

export default function QuizForm({modalRef, inputRef, show, countryData, handleSubmit, handleNext, isCorrect, answerData, setAnswerData, options}) {
    // console.log("isCorrect", isCorrect)
    // inputRef.current && inputRef.current.focus();
    return (
        <Modal ref={modalRef} className={"quiz-form-container"} show={show}>
            <header className="quiz-header">
                <button onClick={() => handleNext(-1)}>{"<"}</button>
                <h2>{countryData.continent ? countryData.continent : "Set Continent"}</h2>
                <button onClick={() => handleNext(1)}>{">"}</button>
            </header>
            <form className="quiz-answer-container">
                {/* <p>Country: {countryData.country}</p> */}
                <QuizFormItem
                    text="Country"
                    answer={countryData.displayName || countryData.country}
                    answerData={answerData[0]}
                    inputRef={inputRef[0]}
                    onChange={e => setAnswerData([e.target.value, answerData[1]])}
                    handleSubmit={handleSubmit}
                    isCorrect={isCorrect}
                    showInput={options[0]}
                    showAnswer={options[2]}
                />
                <QuizFormItem
                    text="Capital"
                    answer={countryData.city}
                    answerData={answerData[1]}
                    inputRef={inputRef[1]}
                    onChange={e => setAnswerData([answerData[0], e.target.value])}
                    handleSubmit={handleSubmit}
                    isCorrect={isCorrect}
                    showInput={options[1]}
                    showAnswer={options[3]}
                />
                {
                    !isCorrect && (options[0] || options[1]) && <button onClick={handleSubmit}>Enter</button>
                }
            </form>
        </Modal>
    )
}