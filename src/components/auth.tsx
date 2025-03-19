import axios from "axios"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Cookies from 'js-cookie'

export default function Auth() {
    const [selectAuth, setSelectAuth] = useState<boolean>(false)
    interface dataLogin {
        email: string
        password: string
        role: string
    }
    const router = useRouter()
    const dfLogin: dataLogin = {
        email: "",
        password: "",
        role: "Customer"
    }
    const [register, setRegisterAuth] = useState<any>({
        name: "",
        email: "",
        password: ""
    })

    const [login, setLogin] = useState<dataLogin>(dfLogin)
    const [is2fa, setIs2fa] = useState<boolean>(false)
    const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false)
    const [email, setEmail] = useState<string>("")
    const [login2Fa, setLogin2Fa] = useState<any>({
        email: "",
        otp: 0,
        role: "Customer"
    })
    const pushRouter = () => {
        setTimeout(() => {
            router.push('/')
        }, 2000)
    }

    const handleLogin = () => {
        axios.post("http://127.0.0.1:8000/api/auth/login", login)
            .then((res) => {
                if (res.data.status === 202) {
                    setIs2fa(true)
                    setLogin2Fa({ ...login2Fa, email: login.email })
                    return
                }

                if (res.data.data !== null) {
                    const access_token: string = res.data.data.access_token
                    Cookies.set('access_token', access_token, { expires: 1 })
                    pushRouter()
                    return alert('login success')
                }
            }).catch((error) => {
                if (error.response.status === 403) {
                    alert(error.response.data.error)
                } else {
                    alert("login thất bại")
                }
            })
    }

    const handleRegister = () => {
        axios.post("http://127.0.0.1:8000/api/users/register", register)
            .then((res) => {
                if (res.data.status === 201) {
                    alert("đăng kí thành công , hãy đăng nhập và mua hàng")
                    setSelectAuth(false)
                } else {
                    alert("Sign up error, please try again!")
                }
            })
            .catch((error) => {
                console.error("Error in sign up", error)
            })
    }

    const login2FA = () => {
        axios.post("http://127.0.0.1:8000/api/auth/login-2fa", login2Fa)
            .then((res) => {
                const access_token: string = res.data.data.access_token
                Cookies.set('access_token', access_token, { expires: 1 })
                pushRouter()
                return alert('login success')
            }).catch((error) => {
                alert(error.response.data.error)
            })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setLogin({
            ...login,
            [name]: value
        })
    }

    const reqForgotPassword = () => {
        axios.post("http://127.0.0.1:8000/api/auth/request-forgot-password", { email: email })
            .then((res) => {
                alert(res.data.message)
            }).catch((error) => {
                alert(error.response.data.error)
            })
    }

    useEffect(() => {
        const token = Cookies.get('access_token')
        axios.post("http://127.0.0.1:8000/api/auth/check-auth",
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((res) => {
                if (res.data.status === 200) {
                    setTimeout(() => { router.push('/') }, 2000)
                }
            }).catch((err) => {

            })
    }, [])
    return (
        <>
            <div className="login-container">
                <div className="login-image"></div>
                <div className="login-form">
                    {!selectAuth && <>
                        {!is2fa && !isForgotPassword &&
                            <>
                                <h2>Login</h2>
                                <div className="form-name">
                                    <label>Email</label>
                                    <input type="email" placeholder="Enter email" value={login.email}
                                        onChange={handleChange} name="email" />
                                </div>
                                <div className="form-name">
                                    <label>Password</label>
                                    <input type="password" placeholder="Enter passwword" value={login.password}
                                        onChange={handleChange} name="password" />
                                </div>
                                <button type="submit" className="button-login" onClick={() => {
                                    handleLogin()
                                }}>Sign in</button>
                                <small>Forgot your password? <a style={{ cursor: "pointer", color: "blue" }} onClick={() => { setIsForgotPassword(true) }}>Reset your password?</a></small>
                                {!selectAuth && <p>Don't have an account? <button onClick={() => { setSelectAuth(true) }} style={({ color: 'blue', cursor: 'pointer' })}>Signup</button></p>}
                            </>
                        }
                        {is2fa &&
                            <>
                                <div className="form-name">
                                    <label>Type your otp we sent to your email!</label>
                                    <input type="number" placeholder="Enter OTP" value={login2Fa.otp}
                                        onChange={(e) => {
                                            setLogin2Fa({
                                                ...login2Fa,
                                                otp: e.target.value
                                            })
                                        }} />
                                </div>
                                <button type="submit" className="button-login" onClick={() => {
                                    login2FA()
                                }}>Submit</button>
                            </>
                        }
                        {
                            isForgotPassword &&
                            <>
                                <div className="form-name">
                                    <label>Type your email!</label>
                                    <input type="email" placeholder="Enter your email" value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value)
                                        }} />
                                </div>
                                <button type="submit" className="button-login" onClick={() => {
                                    reqForgotPassword()
                                }}>Submit</button>
                            </>
                        }
                    </>}
                    {selectAuth && <>
                        <h2>Sign Up</h2>
                        <div className="form-name">
                            <label>Name</label>
                            <input type="text" placeholder="Enter your name" value={register.name}
                                onChange={(e) => setRegisterAuth({ ...register, name: e.target.value })} />
                        </div>
                        <div className="form-name">
                            <label>Email</label>
                            <input type="email" placeholder="Enter email" value={register.email}
                                onChange={(e) => setRegisterAuth({ ...register, email: e.target.value })} />
                        </div>
                        <div className="form-name">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="Enter password"
                                value={register.password}
                                onChange={(e) => setRegisterAuth({ ...register, password: e.target.value })}
                            />

                        </div>
                        <button type="submit" className="button-login" onClick={() => {
                            handleRegister()
                        }}>Sign up</button>
                        {selectAuth && <p>Have an account? <button onClick={() => { setSelectAuth(false) }} style={({ color: 'blue', cursor: 'pointer' })}>Login</button></p>}
                    </>}
                    {isForgotPassword && email.length > 0 && <p>Access your email <a href={`mailto:${email}`} style={({ color: 'blue', cursor: 'pointer' })}>Login</a></p>}

                </div>
            </div >
        </>
    )
}