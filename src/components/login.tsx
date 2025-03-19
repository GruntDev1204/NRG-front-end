import axios from "axios"
import { useEffect, useState } from "react"
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

export default function Login() {
    const token = Cookies.get('access_token')
    interface dataLogin {
        email: string
        password: string
        role: string
    }
    const router = useRouter()
    const dfLogin: dataLogin = {
        email: "",
        password: "",
        role: "Admin"
    }
    const [login, setLogin] = useState<dataLogin>(dfLogin)
    const [is2fa, setIs2fa] = useState<boolean>(false)
    const [login2Fa, setLogin2Fa] = useState<any>({
        email: "",
        otp: 0,
        role: "Admin"
    })
    const pushRouter = () => {
        setTimeout(() => {
            router.push('/profile')
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
                    if (res.data.data.role === "CEO" || res.data.data.role === "Admin") {
                        pushRouter()
                        return alert('login success')
                    }
                    return alert('not permission')
                }
            }).catch((error) => {
                if (error.response.status === 403) {
                    alert(error.response.data.error)
                } else {
                    alert("login thất bại")
                }
            })
    }

    const login2FA = () => {
        axios.post("http://127.0.0.1:8000/api/auth/login-2fa", login2Fa)
            .then((res) => {
                const access_token: string = res.data.data.access_token
                Cookies.set('access_token', access_token, { expires: 1 })
                if (res.data.data.role === "CEO" || res.data.data.role === "Admin") {
                    pushRouter()
                    return alert('login success')
                }
                return alert('not permission')
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

    useEffect(() => {
        axios.post("http://127.0.0.1:8000/api/auth/check-auth",
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((res) => {
                if (res.data.status === 200 && (res.data.data.role === "CEO" || res.data.data.role === "Admin")) {
                    setTimeout(() => { pushRouter() }, 2000)
                    return
                }

                alert('not permission')
                Cookies.remove('access_token')
                router.push('/login')
            }).catch((err) => {
                alert("vui lòng đăng nhập")
            })
    }, [])

    return (
        <>
            <div className="login-container">
                <div className="login-image"> </div>
                <div className="login-form">
                    {!is2fa &&
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
                            }}>Sign in</button></>
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
                                    }} name="otp" />
                            </div>
                            <button type="submit" className="button-login" onClick={() => {
                                login2FA()
                            }}>Sign in</button>
                        </>
                    }
                </div>
            </div>
        </>
    )
}