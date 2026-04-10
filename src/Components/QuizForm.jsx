import Modal from "./Modal";
import QuizFormItem from "./QuizFormItem";

export default function QuizForm({modalRef, inputRef, show, countryData, handleSubmit, handleNext, isCorrect, answerData, setAnswerData, options}) {
    // console.log("isCorrect", isCorrect)
    inputRef.current && inputRef.current.focus();
    return (
        <Modal ref={modalRef} className={"quiz-form-container"} show={show}>
            <div className="quiz-header">
                <button onClick={() => handleNext(-1)}>{"<"}</button>
                <h2>{countryData.continent ? countryData.continent : "Set Continent"}</h2>
                <button onClick={() => handleNext(1)}>{">"}</button>
            </div>
            <div className="quiz-answer-container">
                {/* <p>Country: {countryData.country}</p> */}
                <QuizFormItem
                    text="Country"
                    countryData={countryData.country}
                    answerData={answerData}
                    inputRef={inputRef[0]}
                    onChange={e => setAnswerData(e.target.value)}
                    handleSubmit={handleSubmit}
                    isCorrect={isCorrect}
                    showInput={options[0]}
                />
                <QuizFormItem
                    text="Capital"
                    countryData={countryData.city}
                    answerData={answerData}
                    inputRef={inputRef[1]}
                    onChange={e => setAnswerData(e.target.value)}
                    handleSubmit={handleSubmit}
                    isCorrect={isCorrect}
                    showInput={options[1]}
                />
            </div>
            {
                !isCorrect && <button onClick={handleSubmit}>Enter</button>
            }
        </Modal>
    )
}