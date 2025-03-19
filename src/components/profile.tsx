import { useEffect, useState } from "react"
import Footer from "./footer"
import Header from "./header"
import axios from "axios"
import Cookies from "js-cookie"
import { useRouter } from "next/router"

export default function Profile() {
    const token: string = Cookies.get("access_token") || ""
    const [user, setUser] = useState<any>({})
    const router = useRouter()
    const logOut = () => {
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất không?")
        if (!isConfirmed) {
            return
        }
        axios
            .post(
                "http://127.0.0.1:8000/api/auth/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            .then((response) => {
                console.log(response.status)

                if (response.status === 204) {
                    Cookies.remove("access_token")
                    router.push("/auth")
                    alert("Đăng xuất thành công")
                }
            })
            .catch((error) => {

            })

    }

    useEffect(() => {
        axios
            .post(
                "http://127.0.0.1:8000/api/auth/check-auth",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            .then((response) => {
                if (response.data.status === 200) {
                    axios.get('http://127.0.0.1:8000/api/auth/profile', {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                        .then(res => {
                            setUser(res.data.data)
                        })
                }
            })
            .catch(() => {
                setTimeout(() => {
                    alert('Login session has expired , please log in again!')
                    router.push('/auth')
                }, 2000)
            })
    }, [])
    return (
        <div className="container">
            <Header />
            <div className="body-container ">
                <div className="body-container-content ">
                    <div className="row ">
                        <div className="col-md-3">
                            <div className="profile-card">
                                <p> <button onClick={() => router.push("/setting")}> Setting <i className="fa-solid fa-gear"></i> </button>  </p>
                                <div className="profile-userpic">
                                    <img src={user.avatar} className="img-responsive" alt="avatar" />
                                </div>
                                <div className="profile-usertitle">
                                    <p className="btn-logout" onClick={logOut}>
                                        Logout  <i className="fa-solid fa-right-from-bracket"></i>
                                    </p>
                                    <div className="profile-usertitle-name">
                                        <i className="fa-solid fa-envelope"></i> Email :  {user.email}
                                    </div>
                                    <p>
                                        <i className="fa-solid fa-id-card"></i> ID Customer: {user.hash_code}
                                    </p>
                                    <p>
                                        <i className="fa-solid fa-user"></i>  Name : {user.name}
                                    </p>
                                    <p>
                                        <i className="fa-solid fa-business-time"></i> Join time : {user.created_at}
                                    </p>
                                    <p>
                                        <i className="fa-solid fa-check"></i> Email verified status : <strong>{user.status ? "Verified ✅" : "Not Verified ❌"}</strong>
                                        {user.status ? "" : "– Please verify your email to access all features and make purchases."}
                                    </p>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}