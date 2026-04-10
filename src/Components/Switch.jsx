export default function Switch({checked, defaultChecked, onChange}) {

    return (
        <label className="switch">
            <input
                type="checkbox"
                role="switch"
                checked={checked}
                defaultChecked={defaultChecked}
                onChange={onChange}
            />
            <span className="slider" />
        </label>
    )
}