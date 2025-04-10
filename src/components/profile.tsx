import { useEffect, useState } from "react"
import Footer from "./footer"
import Header from "./header"
import axios from "axios"
import Cookies from "js-cookie"
import { useRouter } from "next/router"
import { toast } from "react-toastify"
import { uploadMedia } from "@/help/function"

export default function Profile() {
    const token: string = Cookies.get("access_token") || ""
    const [user, setUser] = useState<any>({})
    const router = useRouter()
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [dataPost, setDataPost] = useState<any>({
        content: '',
        media: ''
    })
    const [loadingPost, setLoadingPost] = useState<boolean>(false)
    const [blogs, setBlogs] = useState<any>([])

    const renderMedia = (url: string) => {
        if (!url) return null

        if (url.includes("firebasestorage.googleapis.com")) {
            const lower = url.toLowerCase()
            if (lower.includes("jpg") || lower.includes("jpeg") || lower.includes("png") || lower.includes("webp")) {
                return <img src={url} alt="media" style={{ maxWidth: "100%", borderRadius: "8px", height: "300px", width: "100%", objectFit: "cover" }} />
            } else if (lower.includes("mp4") || lower.includes("webm") || lower.includes("ogg")) {
                return (
                    <video controls width="100%" style={{ borderRadius: "8px" }}>
                        <source src={url} />
                        Trình duyệt không hỗ trợ video.
                    </video>
                )
            } else {
                return <span>Không xác định được định dạng từ Firebase URL</span>
            }
        }

        const isImage = url.match(/\.(jpeg|jpg|png|gif|webp)$/i)
        const isVideo = url.match(/\.(mp4|webm|ogg)$/i)

        if (isImage) {
            return <img src={url} alt="media" style={{ maxWidth: "100%", borderRadius: "8px", height: "300px", width: "100%", objectFit: "cover" }} />
        } else if (isVideo) {
            return (
                <video controls width="100%" style={{ borderRadius: "8px" }} autoPlay
                    loop
                    muted
                    playsInline >
                    <source src={url} />
                    Trình duyệt không hỗ trợ video.
                </video>
            )
        } else {
            return null
        }
    }

    const uploadPost = () => {
        axios
            .post(
                "http://127.0.0.1:8000/api/blogs",
                dataPost,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            .then((response) => {
                if (response.status === 201) {
                    toast.success("Bài đăng thành công!")
                }
            }).catch((error) => {
                toast.error(error.response.data.message)
            })
    }

    const loadPost = () => {
        axios
            .get(
                "http://127.0.0.1:8000/api/blogs?is_own=true",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            .then((response) => {
                if (response.data.status === 200) {
                    setBlogs(response.data.data)
                }
            }).catch((error) => {
                toast.error(error.response.data.message)
            })
    }

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
                    toast.warning("Đã đăng xuất!")
                }
            })
            .catch((error) => {

            })

    }

    const uploadMediaa = async () => {
        if (!selectedFile) {
            toast.warning('Chưa chọn file!')
            return
        }
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 2000)
        const uploadedAvatarUrl = await uploadMedia(selectedFile)
        if (uploadedAvatarUrl) {
            setDataPost((prev: any) => ({
                ...prev,
                media: uploadedAvatarUrl,
            }))
            setSelectedFile(null)
        }
    }

    const deletePost = (id: number) => {
        if (!window.confirm("do u want đĩ mẹ màu!")) return
        axios
            .delete(
                `http://127.0.0.1:8000/api/blogs/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            .then((response) => {
                if (response.status === 204) {
                    toast.success("Xóa bài đăng thanh cong!")
                    loadPost()
                }
            }).catch((error) => {
                toast.error(error.response.data.message)
            })
    }

    useEffect(() => {
        if (loadingPost) loadPost()
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
    }, [loadingPost])

    return (
        <div className="container">
            <Header />
            <div className="body-container ">
                <div className="body-container-content ">
                    <div className="row ">
                        <div className="col-md-4 mr-5">
                            <div className="profile-card">
                                <p>
                                    <button onClick={() => router.push("/setting")} className="mr-2"> Setting <i className="fa-solid fa-gear"></i></button>
                                    <span className="btn btn-danger ml-5" onClick={logOut}>
                                        Logout  <i className="fa-solid fa-right-from-bracket"></i>
                                    </span >
                                </p>
                                <div className="profile-userpic">
                                    <img src={user.avatar} className="img-responsive" alt="avatar" />
                                </div>
                                <div className="profile-usertitle">
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
                        {!loadingPost && <>
                            <div className="col-md-5 ml-5">
                                <div className="profile-card">
                                    <h3 className="text-center">Post a status</h3>
                                    <div className="row mt-2">
                                        <div className="col">
                                            <div className="form-group">
                                                <textarea className="form-control" placeholder="content" value={dataPost.content} onChange={(e) => setDataPost({ ...dataPost, content: e.target.value })} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col">
                                            <div className="form-group">
                                                <input type="file" onChange={(e: any) => setSelectedFile(e.target.files[0])} />
                                            </div>
                                        </div>
                                        <button className="btn btn-success" disabled={loading} onClick={uploadMediaa}>Upload media <i className="fa-solid fa-upload"></i></button>
                                    </div>
                                    <div className="row mt-2">
                                        <a className="btn btn-success" onClick={() => uploadPost()}><i className="fas fa-upload"></i> Post </a>
                                        <a className="btn btn-danger ml-2" onClick={() => setDataPost({ content: "", media: "" })}>Cancel</a>
                                        <a className="btn btn-info ml-2" onClick={() => setLoadingPost(true)}>See all your posts <i className="fa-solid fa-eye"></i></a>
                                        <a className="btn btn-primary ml-2" onClick={() => router.push("/blog")}>Visit the blog! <i className="fa-solid fa-eye"></i></a>
                                    </div>
                                </div>
                            </div>
                        </>}

                        {loadingPost && blogs.length > 0 && (
                            <>
                                <div className="col-md-5 ml-5" >
                                    <div className="profile-card" style={{ width: "100%", maxHeight: "600px", overflowY: "scroll" }}>
                                        <h3 className="text-center">All your post <a type="button" className="btn btn-success" onClick={() => setLoadingPost(false)}>Come back!</a></h3>
                                        {blogs.map((post: any) => (
                                            <div className="alert alert-dark mt-2" >
                                                <div className="row mt-2">
                                                    <div className="col">
                                                        <a type="btn" className="btn btn-danger" onClick={() => deletePost(post.id)} ><i className="fas fa-trash"></i></a>
                                                    </div>
                                                </div>
                                                <div className="row mt-2">
                                                    <div className="col">
                                                        <p>{post.content}</p>
                                                    </div>
                                                </div>
                                                <div className="row mt-2">
                                                    <div className="col">
                                                        {renderMedia(post.media)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                        {
                            loadingPost && blogs.length === 0 && (
                                <div className="col-md-5 ml-5">
                                    <div className="profile-card">
                                        <h3 className="text-center">All your post <a type="button" className="btn btn-success" onClick={() => setLoadingPost(false)}>Come back!</a></h3>
                                        <div className="row mt-2">
                                            <div className="col text-center">
                                                <p>no post... <a type="button" onClick={() => setLoadingPost(false)}>post a post!</a></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}