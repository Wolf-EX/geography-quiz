import Modal from "./Modal";

export default function Warning({ref, onClick}) {
    return (
        <Modal className="warning-menu" ref={ref}>
            <h5>Are you sure you want to delete all save data?</h5>
            <div className="warning-button-container">
                <button onClick={() => onClick(true)}>Yes</button>
                <button onClick={() => onClick(false)}>No</button>
            </div>
        </Modal>
    )
}