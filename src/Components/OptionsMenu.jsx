import Modal from "./Modal";
import Switch from "./Switch";

export default function OptionsMenu({options, setOptions, setShowClearMenu}) {

    function handleChange(e, i) {
        const newOptions = [...options];
        newOptions[i] = e.target.checked;
        localStorage.setItem("options", JSON.stringify(newOptions));
        setOptions(newOptions);
    }
    return (
        <Modal className="settings-ui">
            <div className="icon rotate">
                &#9881;
            </div>
            <div className="window settings-dropdown">
                <header>OPTIONS</header>
                <div className="toggle-container">
                    <p>Quiz country</p>
                    <Switch checked={options[0]} onChange={(e) => handleChange(e, 0)}/>
                    {/* <p>Display country</p>
                    <Switch checked={options[2]} onChange={(e) => handleChange(e, 2)}/> */}
                    <p>Quiz capital</p>
                    <Switch checked={options[1]} onChange={(e) => handleChange(e, 1)}/>
                    <p>Display capital</p>
                    <Switch checked={options[2]} onChange={(e) => handleChange(e, 2)}/>
                    <p>Country animation</p>
                    <Switch checked={options[3]} onChange={(e) => handleChange(e, 3)}/>
                <button onClick={() => setShowClearMenu(true)}>Clear Data</button>
                </div>
            </div>
        </Modal>
    );
}