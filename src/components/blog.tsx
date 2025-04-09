import axios from "axios"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { toast } from "react-toastify"

export default function Blog() {
    const router = useRouter()
    const [blogs, setBlog] = useState<any>([])
    const [user, setUser] = useState<any>({})

    const getBlogs = () => {
        axios.get('http://127.0.0.1:8000/api/blogs', {
            headers: {
                Authorization: `Bearer ${Cookies.get('access_token')}`
            }
        })
            .then(res => {
                if (res.data.status === 200) {
                    setBlog(res.data.data)
                }
            })
            .catch(error => console.log(error))
    }

    const renderMedia = (url: string) => {
        if (!url) return null

        if (url.includes("firebasestorage.googleapis.com")) {
            const lower = url.toLowerCase()
            if (lower.includes("jpg") || lower.includes("jpeg") || lower.includes("png") || lower.includes("webp")) {
                return <img src={url} alt="media" style={{ maxWidth: "100%", borderRadius: "8px", border: "3px solid red", marginBottom: "20px" }} className="img-fluid" />
            } else if (lower.includes("mp4") || lower.includes("webm") || lower.includes("ogg")) {
                return (
                    <div style={{ aspectRatio: "16/9", width: "100%" }}>
                        <video
                            controls
                            style={{ width: "100%", height: "100%", borderRadius: "8px", border: "3px solid #000", marginBottom: "20px" }}
                            autoPlay
                            loop
                            muted
                            playsInline
                        >
                            <source src={url} type="video/mp4" />
                            Trình duyệt không hỗ trợ video.
                        </video>
                    </div>
                )
            } else {
                return <span>Không xác định được định dạng từ Firebase URL</span>
            }
        }

        const isImage = url.match(/\.(jpeg|jpg|png|gif|webp)$/i)
        const isVideo = url.match(/\.(mp4|webm|ogg)$/i)

        if (isImage) {
            return <img src={url} alt="media" style={{ maxWidth: "100%", borderRadius: "8px", border: "3px solid #000", marginBottom: "20px" }} className="img-fluid" />
        } else if (isVideo) {
            return (
                <div style={{ aspectRatio: "16/9", width: "100%" }}>
                    <video
                        controls
                        style={{ width: "100%", height: "100%", borderRadius: "8px", border: "3px solid #000", marginBottom: "20px" }}
                        autoPlay
                        loop
                        muted
                        playsInline
                    >
                        <source src={url} type="video/mp4" />
                        Trình duyệt không hỗ trợ video.
                    </video>
                </div>
            )
        } else {
            return null
        }
    }

    useEffect(() => {
        getBlogs()
        axios
            .post(
                "http://127.0.0.1:8000/api/auth/check-auth",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("access_token")}`
                    }
                }
            )
            .then((response) => {
                if (response.data.status === 200) {
                    axios.get('http://127.0.0.1:8000/api/auth/profile', {
                        headers: {
                            Authorization: `Bearer ${Cookies.get("access_token")}`
                        }
                    })
                        .then(res => {
                            setUser(res.data.data)
                            toast.info("hello there!")
                        })
                }
            })
            .catch(() => {
                setTimeout(() => {
                    toast.warning('Login session has expired , please log in again!')
                    router.push('/auth')
                }, 2000)
            })
    }, [])

    return (
        <div className="row mt-5">
            <div className="col">
                <div className="alert alert-white mt-3">
                    <h3 className="text-center"> <strong>Tất cả bài viết <i className="fa-solid fa-newspaper"></i></strong> </h3>
                    <ul>
                        <li> <button className="btn btn-warning" onClick={() => router.back()}> <i className="fa-solid fa-arrow-left"></i> Back the previous page </button></li>
                        {blogs.map((post: any) => (
                            <li key={post.id}>
                                <div className={`alert mt-3` + (user.id === post.user_id ? " alert-success" : " alert-dark")}>
                                    <div className="row">
                                        <div className="col" style={{ display: "flex" }}>
                                            <p><img src={post.avatar} alt="avatar" style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }} className="img-fluid" /> </p>
                                            <div style={{ display: "flex", flexDirection: "column", fontWeight: "bold" , marginLeft: "10px" , justifyContent: "center" , lineHeight: "20px"}}>
                                                <p> {post.user_name} </p>
                                                <p><i className="fas fa-clock"></i> {post.created_at}</p>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <p> {renderMedia(post.media)}</p>
                                            <p>{post.content}</p>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}