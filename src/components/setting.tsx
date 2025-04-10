import { useEffect, useState } from "react"
import Footer from "./footer"
import Header from "./header"
import axios from "axios"
import Cookies from "js-cookie"
import { useRouter } from "next/router"
import { uploadAva } from "@/help/function"
import { toast } from "react-toastify"
export default function Setting() {
    const token: string = Cookies.get("access_token") || ""
    const [user, setUser] = useState<any>({})
    const router = useRouter()
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const uploadAvatar = async () => {
        if (!selectedFile) {
            toast.warning('Chưa chọn ảnh!')
            return
        }
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 2000)
        const uploadedAvatarUrl = await uploadAva(selectedFile)
        if (uploadedAvatarUrl) {
            setUser((prev: any) => ({
                ...prev,
                avatar: uploadedAvatarUrl,
            }))
            setSelectedFile(null)
        }
    }

    const editProfile = () => {
        axios.put('http://127.0.0.1:8000/api/users/profile', {
            name: user.name,
            avatar: user.avatar,
        }, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                if (res.data.status === 200) {
                    toast.success(res.data.message)
                    setIsEdit(false)
                } else if (res.data.status === 401) {
                    router.push('/auth')
                }
            }).catch(error => {
            })
    }
    const [requestChangePass, setRequestChangePass] = useState<any>(
        {
            email: '',
            password: '',
            new_password: ''
        }
    )

    const changePassword = () => {
        axios.put('http://127.0.0.1:8000/api/auth/change-password', requestChangePass,
            {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => {
                if (res.data.status === 201) {
                    toast.success(res.data.message)
                    setTimeout(() => {
                        toast.info("please login again")
                        logout()
                    }, 2000)
                } else if (res.data.status === 401) {
                    toast.error(res.data.message)
                    router.push('/auth')
                }
            }).catch(error => {
                toast.error(error.response.data.message)
            })
    }

    const activeEmail = () => {
        setLoading(true)
        axios.post('http://127.0.0.1:8000/api/users/active/send-mail', {},
            {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => {
                if (res.data.status === 202) {
                    toast.success(res.data.message)
                    setLoading(false)
                    setTimeout(() => {
                        toast.info("please login again")
                        logout()
                    }, 2000)
                } else if (res.data.status === 401) {
                    toast.error(res.data.message)
                    router.push('/auth')
                }
            }).catch(error => {
            })
    }

    const logout = () => {
        axios.post('http://127.0.0.1:8000/api/auth/logout', {},
            {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => {
                if (res.data.status === 204) {
                    toast.success(res.data.message)
                } else if (res.data.status === 401) {
                    toast.error(res.data.message)
                }
            })
        Cookies.remove("access_token")
        router.push('/auth')
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
                    toast.warning('Login session has expired , please log in again!')
                    logout()
                }, 2000)
            })
    }, [])

    return (
        <div className="container">
            <Header />
            <div className="body-container ">
                <div className="body-container-content ">
                    <div className="row ">
                        <div className="col-md-5 mr-5">
                            <div className="profile-card">
                                {isEdit ?
                                    <p> <button onClick={editProfile}><i className="fa-solid fa-check"></i> </button>  </p> :
                                    <p>
                                        <div className="row">
                                            <div className="col-md-5 ml-3">
                                                <button className="mll" onClick={() => setIsEdit(true)}><i className="fa-solid fa-pen-to-square"></i> </button>
                                            </div>
                                            <div className="col-md-5">
                                                <button className="mll" onClick={() => router.push("/profile")}><i className="fa-solid fa-user"></i> </button>
                                            </div>
                                        </div>
                                    </p>
                                }
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
                                    {isEdit ? (
                                        <input
                                            type="text"
                                            value={user.name}
                                            onChange={(e) => setUser({ ...user, name: e.target.value })}
                                        />
                                    ) : (
                                        <p onClick={() => setIsEdit(true)}>
                                            <i className="fa-solid fa-user"></i> Name: {user.name}
                                        </p>
                                    )}
                                    {isEdit && (
                                        <p className="mt-3">
                                            <label htmlFor="fileUpload" className="btn btn-outline-primary">
                                                Chọn avatar <i className="fa-solid fa-folder-open"></i>
                                            </label>
                                            <input
                                                type="file"
                                                id="fileUpload"
                                                className="d-none"
                                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                            />
                                            {loading ? (
                                                <button className="btn btn-secondary" disabled>
                                                    <i className="fa-solid fa-spinner"></i>
                                                </button>
                                            ) : (
                                                <a type="button" className="btn btn-success ml-2 mb-2 " onClick={uploadAvatar}>
                                                    <i className="fa-solid fa-upload"></i>
                                                </a>
                                            )}
                                        </p>
                                    )}

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
                        <div className="col-md-4 ml-5">
                            <div className="profile-card">
                                <h3 className="title-card"><i className="fa-solid fa-user-lock"></i> Security setting </h3>
                                <div className="profile-usertitle">
                                    <p><i className="fa-solid fa-lock"></i> Change your password :
                                        <input
                                            type="email" placeholder="type your email first"
                                            value={requestChangePass.email}
                                            autoComplete="new-password"
                                            onChange={(e) => setRequestChangePass({ ...requestChangePass, email: e.target.value })}
                                        />
                                        <input
                                            type="password"
                                            placeholder="type your old password"
                                            value={requestChangePass.password}
                                            autoComplete="new-password"
                                            onChange={(e) => setRequestChangePass({ ...requestChangePass, password: e.target.value })}
                                        />
                                        <input
                                            type="password"
                                            value={requestChangePass.new_password}
                                            placeholder="type your new password"
                                            autoComplete="new-password"
                                            onChange={(e) => setRequestChangePass({ ...requestChangePass, new_password: e.target.value })}
                                        />
                                        <button onClick={changePassword}><i className="fa-solid fa-key"></i></button>
                                    </p>
                                </div>

                                <div className="profile-usertitle">
                                    {user.status === 0 &&
                                        <p>
                                            <i className="fa-solid fa-check"></i> Authenticate your email :
                                            {"  "} {loading ? <button ><i className="fa-solid fa-spinner"></i> please wait...</button> : <button onClick={activeEmail}><i className="fa-solid fa-envelope"></i></button>}
                                        </p>
                                    }
                                    {
                                        user.status === 1 &&
                                        <p>
                                            <i className="fa-solid fa-check"></i> Email verified status : Verified  at {user.email_verified_at} ✅
                                        </p>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}