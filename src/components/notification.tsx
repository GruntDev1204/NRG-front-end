import axios from "axios"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"

export default function Notifi() {
    const [notifi, setNotifi] = useState<any[]>([])
    const [countLast24h, setCountLast24h] = useState(0)

    useEffect(() => {
        axios
            .get('http://127.0.0.1:8000/api/posts', {
                headers: {
                    Authorization: `Bearer ${Cookies.get('access_token')}`
                }
            })
            .then((res) => {
                const allNotifi = res.data.data
                const now = new Date()

                const last24hNotifi = allNotifi.filter((item: any) => {
                    const createdAt = new Date(item.created_at)
                    return (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60) <= 24
                })

                setCountLast24h(last24hNotifi.length)
                setNotifi(last24hNotifi.slice(0, 3))
            }).catch((err) => {})
    }, [])

    return (
        <>
            <li className="header-cover-li-a header-cover-li-a-notify">
                <i className="fa-solid fa-bell"></i>
                {countLast24h > 0 && <span className="notification-badge"> {countLast24h}</span>}
                Thông báo
                <div className="header-notification">
                    <header className="header-notification-header">
                        <h3>Thông báo mới</h3>
                    </header>
                    <ul className="header-notify-list">
                        {notifi.length > 0 ? (
                            notifi.map((item, index) => (
                                <li key={index} className="header-notify-item" style={{ marginTop: '10px' }}>
                                    <a className="header-notify-link">
                                        <img src={item.image_url} alt="notifi" className="header-notify-img" />
                                        <div className="header-notify-info">
                                            <span className="header-notify-name">{item.title}</span>
                                            <span className="header-notify-descriotion">{item.content}</span>
                                        </div>
                                    </a>
                                </li>
                            ))
                        ) : (
                            <li className="header-notify-item">Không có thông báo mới</li>
                        )}
                    </ul>
                </div>
            </li>
            <li className="header-cover-li-a">
                <i className="header-navbar-icon fa-regular fa-circle-question"></i>
                Trợ giúp
            </li>
        </>
    )

}