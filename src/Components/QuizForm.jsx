import Modal from "./Modal";
import QuizFormItem from "./QuizFormItem";

export default function QuizForm({refs, show, countryData, handleSubmit, handleNext, answerData, setAnswerData, isCorrect, isWrongAnswer, options}) {
    const [modalRef, countryInputRef, cityInputRef] = refs;
    return (
        <Modal ref={modalRef} className={"quiz-form-container"} show={true}>
            <header className="quiz-header">
                <button onClick={() => handleNext(-1)}>{"<"}</button>
                {countryData.continent ? countryData.continent : "Set Continent"}
                <button onClick={() => handleNext(1)}>{">"}</button>
            </header>
            <form>
                {/* <p>Country: {countryData.country}</p> */}
                <QuizFormItem
                    text="Country"
                    answer={countryData.displayName || countryData.country}
                    answerData={answerData[0]}
                    ref={countryInputRef}
                    onChange={e => setAnswerData([e.target.value, answerData[1]])}
                    handleSubmit={handleSubmit}
                    showInput={options[0]}
                    showAnswer={true}
                    isCorrect={isCorrect}
                    isWrongAnswer={isWrongAnswer}
                />
                <QuizFormItem
                    text="Capital"
                    answer={countryData.city}
                    answerData={answerData[1]}
                    ref={cityInputRef}
                    onChange={e => setAnswerData([answerData[0], e.target.value])}
                    handleSubmit={handleSubmit}
                    showInput={options[1]}
                    showAnswer={options[2]}
                    isCorrect={isCorrect}
                    isWrongAnswer={isWrongAnswer}
                />
                {
                    !isCorrect && (options[0] || options[1]) && <button className="submit-button" onClick={handleSubmit}>Enter</button>
                }
            </form>
        </Modal>
    )
}