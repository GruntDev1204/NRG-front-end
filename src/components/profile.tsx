"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import Cookies from 'js-cookie'
import { useRouter } from "next/router"
import { uploadAva } from "@/help/function"
import { toast } from "react-toastify"

export default function Profile() {
    const token = Cookies.get('access_token')
    const [profile, setProfile] = useState<any>(null)
    const [isUpdated, setIsUpdated] = useState<boolean>(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [setting, isSetting] = useState<boolean>(false)
    const [updateProfile, setUpdateProfile] = useState<any>({
        name: "",
        avatar: "",
    })
    const [dataChangePassword, setDataCPW] = useState<any>({
        password: "",
        new_password: "",
        email: ""
    })
    const router = useRouter()

    const changePassword = () => {
        axios.put('http://127.0.0.1:8000/api/auth/change-password', dataChangePassword, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                if (res.data.status === 201) {
                    toast.success(res.data.message)
                    toast.success("please relogin your account!")
                    setTimeout(() => {
                        logout()
                    }, 1000)
                } else {
                    toast.info(res.data.message)
                }
            })
            .catch((err) => {
                toast.error(err.response.data.message)
            })
    }

    const logout = () => {
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
                toast.info("logout thành công")
                setTimeout(() => {
                    router.push('/login')
                }, 2000)
            })
    }

    const openUpdateForm = () => {
        setIsUpdated(true)
        setUpdateProfile({
            name: profile.name,
            avatar: profile.avatar
        })
    }

    const uploadAvatar = async () => {
        if (!selectedFile) {
            toast.warning('Chưa chọn ảnh!')
            return
        }
        toast.info('Uploading avatar...')
        const uploadedAvatarUrl = await uploadAva(selectedFile)
        if (uploadedAvatarUrl) {
            setUpdateProfile((prev: any) => ({
                ...prev,
                avatar: uploadedAvatarUrl,
            }))
            setSelectedFile(null)
        }
    }

    const updatedProfile = () => {
        axios.put("http://127.0.0.1:8000/api/users/profile", updateProfile,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then((res) => {
                toast.success(res.data.message)
                loadProfile()
                setIsUpdated(false)
                setUpdateProfile({
                    name: "",
                    avatar: "",
                })
            })
            .catch((error) => {
                toast.error(error.response.data.message)
            })
    }

    const loadProfile = () => {
        if (token) {
            axios.get("http://127.0.0.1:8000/api/auth/profile", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    if (response.data.status === 401) {
                        toast.warning("vui lòng đăng nhập lại")
                        setTimeout(() => {
                            router.push('/login')
                        }, 2000)
                        return
                    } else {
                        setProfile(response.data.data)
                    }
                })
                .catch(error => {
                    toast.error("vui lòng đăng nhập lại")
                    setTimeout(() => {
                        router.push('/login')
                    }, 2000)
                    return
                })
        } else {
            toast.warning("vui lòng đăng nhập lại")
            setTimeout(() => {
                router.push('/login')
            }, 2000)
            return
        }
    }

    useEffect(() => {
        setTimeout(() => {
            loadProfile()
        }, 500)
    }, [])

    return (
        <div className="container">
            {profile ? (
                <div className="alert alert-info ">

                    <div className="row text-center">
                        <div className="col">
                            <img src={profile.avatar} alt="avatar" className="avatar" />
                        </div>
                    </div>
                    <div className="row mt-5">
                        <div className="col">
                            <div className="alert alert-dark">
                                <p>Name : {profile.name}</p>
                                <p>Email : {profile.email}</p>
                                <p>Role : {profile.role}</p>
                                <p>2FA : {profile.is_enabled_2fa ? "enabled" : "disabled"}</p>
                                <p>Active email? : {profile.status ? "active" : "not active"}</p>

                                {!isUpdated && <button className="btn btn-info" onClick={openUpdateForm}>Update your profile <i className="fas fa-user-edit"></i></button>}
                                {isUpdated && <button className="btn btn-warning" onClick={() => setIsUpdated(false)}>Close <i className="fas fa-window-close"></i></button>}
                                <button className="btn btn-primary ml-2" onClick={() => isSetting(!setting)}>setting <i className="fas fa-cog"></i></button>
                                <button onClick={() => {
                                    logout()
                                }} className="btn btn-danger ml-2"> Logout  <i className="fas fa-sign-out-alt"></i> </button>
                            </div>
                        </div>
                    </div>
                    {isUpdated && (
                        <div className="row mt-5">
                            <div className="col">
                                <h3 className="text-center"> Update your profile  </h3>
                                <div className="form-sub">
                                    <label>Name</label>
                                    <input type="text" value={updateProfile.name} onChange={(e) => {
                                        setUpdateProfile({
                                            ...updateProfile,
                                            name: e.target.value
                                        })
                                    }} />
                                </div>
                                <div className="form-sub">
                                    <label>Avatar</label>
                                    <input type="file" onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) {
                                            setSelectedFile(file)
                                        }
                                    }} />
                                    <button type="button" style={{ marginTop: "10px" }} onClick={uploadAvatar}>Upload <i className="fas fa-upload"></i></button>
                                </div>
                                <div className="form-sub">
                                    {updateProfile.avatar && updateProfile.avatar !== "" && <img src={updateProfile.avatar} alt="avatar" className="avatar-review" />}
                                </div>
                                <div className="form-sub">
                                    <button type="button" style={{ marginTop: "10px" }} className="btn btn-info" onClick={updatedProfile}>Save Edit <i className="fas fa-save"></i></button>
                                </div>
                            </div>
                        </div>
                    )}
                    {setting && <>
                        <div className="row mt-5">
                            <div className="col">
                                <h3 className="text-center"> Setting your account </h3>
                                <div className="form-sub">
                                    <h3>Change your password <i className="fas fa-lock"></i></h3>
                                    <label>Email</label>
                                    <input type="text" value={dataChangePassword.email} onChange={(e) => {
                                        setDataCPW({
                                            ...dataChangePassword,
                                            email: e.target.value
                                        })
                                    }} placeholder="type your email first" />
                                    <label className="mt-2">Old Password</label>
                                    <input type="password" value={dataChangePassword.password} onChange={(e) => {
                                        setDataCPW({
                                            ...dataChangePassword,
                                            password: e.target.value
                                        })
                                    }} placeholder="type your old password" />
                                    <label className="mt-2">New password</label>
                                    <input type="password" value={dataChangePassword.new_password} onChange={(e) => {
                                        setDataCPW({
                                            ...dataChangePassword,
                                            new_password: e.target.value
                                        })
                                    }} placeholder="type your new password" />
                                </div>
                                <div className="form-sub">
                                    <button type="button" style={{ marginTop: "10px" }} className="btn btn-info" onClick={() => changePassword()}>Save Change <i className="fas fa-cog"></i></button>
                                </div>
                            </div>
                        </div>
                    </>}

                </div>
            ) : "Đang tải thông tin..."}
        </div>

    )
}