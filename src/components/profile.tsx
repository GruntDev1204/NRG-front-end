"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import Cookies from 'js-cookie'
import { useRouter } from "next/router"
import { uploadAva } from "@/help/function"

export default function Profile() {
    const token = Cookies.get('access_token')
    const [profile, setProfile] = useState<any>(null)
    const [isUpdated, setIsUpdated] = useState<boolean>(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [updateProfile, setUpdateProfile] = useState<any>({
        name: "",
        avatar: "",
    })
    const router = useRouter()

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
                alert("logout thành công")
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
            alert('Chưa chọn ảnh!')
            return
        }
        alert('Uploading avatar...')
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
                alert(res.data.message)
                loadProfile()
                setIsUpdated(false)
                setUpdateProfile({
                    name: "",
                    avatar: "",
                })
            })
            .catch((error) => {
                alert(error.response.data.message)
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
                        alert("vui lòng đăng nhập lại")
                        setTimeout(() => {
                            router.push('/login')
                        }, 2000)
                        return
                    } else {
                        setProfile(response.data.data)
                    }
                })
                .catch(error => {
                    alert("vui lòng đăng nhập lại")
                    setTimeout(() => {
                        router.push('/login')
                    }, 2000)
                    return
                })
        } else {
            alert("vui lòng đăng nhập lại")
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
                            <p>Name : {profile.name}</p>
                            <p>Email : {profile.email}</p>
                            <p>Role : {profile.role}</p>
                            <p>2FA : {profile.is_enabled_2fa ? "enable" : "disable"}</p>
                            <button onClick={() => {
                                logout()
                            }} className="btn btn-danger"> logout  </button>
                            <button className="btn btn-info ml-2" onClick={openUpdateForm}>Update your profile!</button>
                        </div>
                    </div>
                    {isUpdated && (
                        <div className="row">
                            <div className="col">
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
                                    <button type="button" style={{ marginTop: "10px" }} onClick={uploadAvatar}>Upload</button>
                                </div>
                                <div className="form-sub">
                                    {updateProfile.avatar && updateProfile.avatar !== "" && <img src={updateProfile.avatar} alt="avatar" className="avatar-review" />}
                                </div>
                                <div className="form-sub">
                                    <button type="button" style={{ marginTop: "10px" }} className="btn btn-info" onClick={updatedProfile}>Save</button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            ) : "Đang tải thông tin..."}
        </div>

    )
}