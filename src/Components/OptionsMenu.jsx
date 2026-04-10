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
            <div className="animation icon">
                &#9881;
            </div>
            <div className="window settings-dropdown">
                <div className="toggle-container">
                    <p>Name country</p>
                    {/* <input type="checkbox" /> */}
                    <Switch checked={options[0]} onChange={(e) => handleChange(e, 0)}/>
                    <p>Name capital</p>
                    {/* <input type="checkbox" /> */}
                    <Switch checked={options[1]} onChange={(e) => handleChange(e, 1)}/>
                </div>
                <button onClick={() => setShowClearMenu(true)}>Clear Data</button>
            </div>
        </Modal>
    );
}