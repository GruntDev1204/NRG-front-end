import axios from "axios";
import { useState } from "react";

export default function Forgot() {
    const [email, sEtEmail] = useState("")
    const requestForgotPassword = () => {
        axios.post("http://127.0.0.1:8000/api/auth/request-forgot-password", { email: email })
            .then((res) => {
                alert(res.data.message)
            })
            .catch((error) => {
                alert(error.response.data.error)
            })
    }
    return (
        <>
            <div className="forgot-cover-1">
                <h2>Forgot password</h2>
                <div className="forgot-cover">
                    <label>Send email</label>
                    <input type="text" onChange={(e) => sEtEmail(e.target.value)} value={email} placeholder="Email" />
                    <button type="submit" onClick={() => {
                        requestForgotPassword()
                    }} className="btn11">Send email</button>
                </div>
            </div>
        </>
    )
}