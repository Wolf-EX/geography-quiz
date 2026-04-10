import Modal from "./Modal";

export default function QuizForm({modalRef, inputRef, show, countryData, handleSubmit, handleNext, isCorrect, capitalAnswer, setCapitalAnswer}) {
    inputRef.current && inputRef.current.focus();
    return (
        <Modal ref={modalRef} className={"quiz-form-container"} show={show}>
            <div className="quiz-header">
                <button onClick={() => handleNext(-1)}>{"<"}</button>
                <h2>{countryData.continent ? countryData.continent : "Set Continent"}</h2>
                <button onClick={() => handleNext(1)}>{">"}</button>
            </div>
            <div className="quiz-answer-container">
                <p>Country: {countryData.country}</p>
                <div className="capital-container">
                    <p>Capital: </p>
                    {
                        isCorrect ?
                        <p>{countryData.city}</p> :
                        <form onSubmit={handleSubmit}>
                            <input
                                ref={inputRef}
                                name="capitalInput"
                                value={capitalAnswer}
                                onChange={e => setCapitalAnswer(e.target.value)}
                                placeholder="Enter Capital"
                                autoFocus
                            />
                        </form>
                    }
                </div>
            </div>
            {
                !isCorrect && <button onClick={handleSubmit}>Enter</button>
            }
        </Modal>
    )
}