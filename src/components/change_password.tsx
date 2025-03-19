export default function Change() {
    return (
        <>
            <div className="sub-cover">
                <div className="cover-menu-one">
                    <ul className="m-ul">
                        <li>1</li>
                        <li>2</li>
                        <li>3</li>
                    </ul>
                </div>
                <button type="submit">Authenticate</button>
                <div className="nav">
                    <label>Enter code</label>
                    <input type="text" placeholder="Enter code" />
                </div>
                <button type="submit" className="sa">Save</button>
            </div>
        </>
    )
}