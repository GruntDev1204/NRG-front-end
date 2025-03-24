'use client'
import axios from "axios"
import { useMemo, useState } from "react"
import Cookies from "js-cookie"
import router from "next/router"
import Link from "next/link"
import { toast } from "react-toastify"
export default function Menu() {
    const token = Cookies.get('access_token')
    const [avatar, setAvatar] = useState<string>("https://firebasestorage.googleapis.com/v0/b/trung1204-bdc27.appspot.com/o/NRG%2Favatar%2F6596121.png?alt=media&token=806e87f5-4271-44a8-86b5-7a1efb5b281c")

    const checkAuth = () => {
        if (token && token !== "") {
            axios.post("http://127.0.0.1:8000/api/auth/check-auth",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then(res => {
                    if (res.data.status === 200 && (res.data.data.role === "Admin" || res.data.data.role === "CEO")) {
                        axios.get("http://127.0.0.1:8000/api/auth/profile", {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        })
                            .then(res => {
                                setAvatar(res.data.data.avatar)
                            })
                        toast.success("welcome to the administration page")
                    } else {
                        toast.warning("you not have permission! pls try login by admin account")
                        logout()
                    }
                })
                .catch(error => {
                    toast.error(error.response.data.error)
                })
        }
    }
    const logout = () => {
        const token = Cookies.get('access_token')

        axios.post("http://127.0.0.1:8000/api/auth/logout",
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then((res) => {
                Cookies.remove('access_token')
                toast.success("logout thành công")
                setTimeout(() => {
                    router.push('/login')
                }, 2000)
            })
    }
    useMemo(() => {
        checkAuth()
    }, [token])
    return (
        <div className="container mt-5">
            <div className="silder">
                <div className="silder-menu">
                    <div className="menu-ul">
                        <ul>
                            <li><Link href="/">Home</Link></li>
                            <li><Link href="/manager">Manager</Link></li>
                            <li><Link href="/invoice">Invoice</Link></li>
                            <li><Link href="/post">Notification</Link></li>
                            <li><Link href="/products">Product</Link></li>
                            <li><Link href="/categories">Category</Link></li>
                            <li>
                                <Link href="/profile">
                                    <img
                                        src={avatar}
                                        alt="ava-img"
                                        style={{ width: "45px", height: "45px", borderRadius: "50%", cursor: "pointer", objectFit: "cover", border: "1px solid #000" }}
                                        className="image-preview mr-1"
                                    />
                                </Link>
                                <a onClick={logout} className="btn btn-danger ml-2">
                                    Logout <i className="fas fa-sign-out-alt"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

    )
}