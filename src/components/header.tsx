import { useRouter } from "next/router"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"
import axios from "axios"
import { useDispatch } from "react-redux"
import { setSearch } from "@/store/slices/productsSlice"
import Notifi from "./notification"
import { toast } from "react-toastify"
export default function Header() {
    const token: string = Cookies.get("access_token") || ""
    const router = useRouter()
    const dispatch = useDispatch()
    const [isLogged, setIsLogged] = useState<boolean>(false)
    const [user, setUser] = useState<any>({
        name: "",
    })
    const [carts, setcarts] = useState<number>(0)

    const handleLogout = () => {
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất không?")
        if (!isConfirmed) {
            return
        }
        try {
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
                        toast.warning("Đã đăng xuất")
                    }
                })
        } catch (e) {
            console.log(e)
        }
    }

    function getCountCarts() {
        axios.get("http://127.0.0.1:8000/api/carts", {
            headers
                : { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                console.log(res.data.data.length)
                setcarts(res.data.data.length)
            })
    }

    useEffect(() => {
        if (token && token !== "") {
            getCountCarts()
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
                        setIsLogged(true)
                        axios.get('http://127.0.0.1:8000/api/auth/profile', {
                            headers: { Authorization: `Bearer ${token}` }
                        })
                            .then(res => {
                                setUser(res.data.data)
                            })
                    }
                })
                .catch(() => {

                })
        }
    }, [])

    return (
        <>
            <div className="header-cover">
                <div className="header-tab">
                    <div className="sub">
                        <div className="header-cover-left">
                            <ul className="header-cover-ul">
                                <li className="header-cover-li" onClick={() => router.push("/")}> NRGrunt shop </li>
                                <li className="header-cover-li">
                                    <span className="header-cover-span">Kết nối</span>
                                </li>
                                <li className="header-cover-li">
                                    <a href="https://www.facebook.com/TinaFose" target="_blank" style={{ color: "#fff" }}><i className="fa-brands fa-facebook"></i></a>
                                </li>
                            </ul>
                        </div>
                        <div className="header-cover-right">
                            <ul className="header-cover-ul-one">
                                <Notifi />
                                {isLogged ? (
                                    <>
                                        <li
                                            className="header-cover-li-a header-cover-li-strong"
                                            style={{ marginRight: 8, cursor: "pointer" }}
                                            onClick={() => router.push("/profile")}
                                        >
                                            Hello {user ? (user.name.length > 5 ? user.name.slice(0, 5) + "..." : user.name) : ""}
                                        </li>
                                        <i
                                            className="fa-solid fa-right-from-bracket"
                                            onClick={handleLogout}
                                            style={{ color: "#fff", cursor: "pointer" }}
                                        ></i>
                                    </>

                                ) : (
                                    <>
                                        <li
                                            className="header-cover-li-a header-cover-li-strong"
                                            onClick={() => router.push("/auth")}
                                        >
                                            Login or Sign Up
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div className="header-with-search ">
                        <label htmlFor="mobile-search-checkbox" className="header-mobile-search">
                            <i className="header-mobile-search-icon fa-solid fa-magnifying-glass"></i>
                        </label>
                        <div className="header-logo" onClick={() => router.push("/")}>
                            <img src="../image/logo.png" alt="logo" className="header-logo-img img-fluid " style={{ height: "200px", cursor: "pointer", marginBottom: "20px" }} />
                        </div>
                        <input type="checkbox" hidden id="mobile-search-checkbox" className="header-search-checkbox " />
                        <div className="header-search">
                            <div className="header-search-input-wrap">
                                <input type="text" className="header-search-input" placeholder="Nhập để tìm kiếm sản phẩm" onChange={(e) => {
                                    dispatch(setSearch(e.target.value))
                                }} />
                                <div className="header-search-history">
                                    <h3 className="header-search-history-heading">Lịch sử tìm kiếm</h3>
                                    <ul className="header-search-history-list">
                                        <li className="header-search-history-item">
                                            <a href="">Sữa rửa mặt</a>
                                        </li>
                                        <li className="header-search-history-item">
                                            <a href="">Kem dưỡng</a>
                                        </li>
                                        <li className="header-search-history-item">
                                            <a href="">Son môi</a>
                                        </li>
                                        <li className="header-search-history-item">
                                            <a href="">Dầu dưỡng tóc</a>
                                        </li>
                                        <li className="header-search-history-item">
                                            <a href="">Serum</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <button className="header-search-btn">
                                <i className="header-search-btn-icon fa-solid fa-magnifying-glass"></i>
                            </button>
                        </div>
                        <div className="header-cart">
                            <i className="header-cart-icon fa-solid fa-cart-shopping header-cart-wrap" onClick={() => router.push("/cart")} />
                            {carts > 0 && <span className="header-cart-quantity">{carts}</span>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
