export default function QuizFormItem({text, countryData, answerData, inputRef, onChange, handleSubmit, isCorrect, showInput}) {
    return (
        <div className="capital-container">
            <p>{text}: </p>
            {
                !showInput || isCorrect ?
                <p>{countryData}</p> :
                <form onSubmit={handleSubmit}>
                    <input
                        ref={inputRef}
                        name="capitalInput"
                        value={answerData}
                        onChange={onChange}
                        placeholder="Enter Capital"
                        autoFocus
                    />
                </form>
            }
        </div>
    );
}