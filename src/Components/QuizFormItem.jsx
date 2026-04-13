export default function QuizFormItem({text, answer, answerData, inputRef, onChange, handleSubmit, isCorrect, showInput, showAnswer}) {
    return (
        <div className="capital-container">
            {
                (showInput && !isCorrect) || showAnswer ?
                <p>{text}: </p> :
                null
            }
            {
                !showInput || isCorrect ?
                showAnswer ?
                <p>{answer}</p> :
                null :
                <div onSubmit={handleSubmit}>
                    <input
                        ref={inputRef}
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