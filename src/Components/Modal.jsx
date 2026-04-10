export default function Modal({children, className, ref, show = true}) {
    const classStyle = className ?? "";
    return (
        <div className={"modal window " + classStyle} ref={ref} style={{visibility: show ? "visible" : "hidden"}}>
            {children}
        </div>
    )
}