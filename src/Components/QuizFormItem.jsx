export default function QuizFormItem({text, answer, answerData, ref, onChange, handleSubmit, showInput, showAnswer, isCorrect, isWrongAnswer}) {
    return (
        <div className="capital-container">
            {
                (showInput && !isCorrect) || showAnswer ?
                <p>{text}:</p> :
                null
            }
            {
                !showInput || isCorrect ?
                showAnswer ?
                <p>{answer}</p> :
                null :
                <div onSubmit={handleSubmit}>
                    <input
                        className={isWrongAnswer ? "wrong" : ""}
                        ref={ref}
                        name="capitalInput"
                        value={answerData}
                        onChange={onChange}
                        placeholder="Enter Capital"
                        autoFocus
                    />
                </div>
            }
        </div>
    );
}