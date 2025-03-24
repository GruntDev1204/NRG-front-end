import { uploadImgSlide } from '@/help/function'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from "next/router"
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'

export default function NotifiPost() {
    const token = Cookies.get('access_token')
    const router = useRouter()
    const [newPost, setNewPost] = useState<any>({
        image_url: "",
        title: "New Post",
        content: "New Post",
        is_anonymous: false
    })
    const [writing, setWriting] = useState<boolean>(false)
    const [posts, setPosts] = useState<any>([])
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const getAllPost = () => {
        axios.get(
            "http://127.0.0.1:8000/api/posts", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        )
            .then((res) => {
                if (res.data.status === 200) {
                    setPosts(res.data.data)
                }
            })
    }

    const createAPost = () => {
        axios.post("http://127.0.0.1:8000/api/posts",
            newPost,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then((res) => {
                getAllPost()
                setNewPost(
                    {
                        image_url: "",
                        title: "New Post",
                        content: "New Post",
                        is_anonymous: false
                    }
                )
                toast.success(res.data.message)
            })
            .catch((err) => {
                toast.error(err.response.data.message)
            })
    }

    const uploadImg = async () => {
        if (!selectedFile) {
            toast.warning('Chưa chọn ảnh!')
            return
        }
        const uploadedAvatarUrl = await uploadImgSlide(selectedFile)
        if (uploadedAvatarUrl) {
            setNewPost(() => ({
                ...newPost,
                image_url: uploadedAvatarUrl,
            }))
            setSelectedFile(null)
        }
    }

    // const editCategory = (id: number) => {
    //     setEditingCategory(true)
    //     axios.get(`http://127.0.0.1:8000/api/categories/${id}`)
    //         .then((res) => {
    //             setEditCategoryName(res.data.data.name)
    //             setEditId(res.data.data.id)
    //         })
    //         .catch((err) => {
    //            toast.error(err.response.data.message)
    //         })
    // }

    // const saveEdit = () => {
    //     axios.put(`http://127.0.0.1:8000/api/categories/${editId}`,
    //         {
    //             "name": editCategoryName
    //         },
    //         {
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             }
    //         }
    //     )
    //         .then((res) => {
    //             getAllCategory()
    //             setEditingCategory(false)
    //             setEditCategoryName("")
    //             setEditId(0)
    //             toast.success(res.data.message)
    //         })
    //         .catch((err) => {
    //            toast.error(err.response.data.message)
    //         })
    // }

    // const deleteCategory = (id: number) => {
    //     if (window.confirm('Are you sure you want to delete this category?')) {
    //         axios
    //             .delete(`http://127.0.0.1:8000/api/categories/${id}`, {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             })
    //             .then((res) => {
    //                 getAllCategory()
    //                 toast.success(res.data.message)
    //             })
    //             .catch((err) => {
    //                 alert(err.response?.data?.message || "Có lỗi xảy ra")
    //             })
    //     }
    // }

    useEffect(() => {
        getAllPost()
        axios.post("http://127.0.0.1:8000/api/auth/check-auth",
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((res) => {
                if (res.data.status === 200 && res.data.data.role === "CEO") {
                    return toast.info('hello')
                } else if (res.data.status === 200 && res.data.data.role === "Admin") {
                    toast.warning('only CEO can access this website')
                    router.push('/profile')
                    return
                }

                toast.warning('not permission')
                router.push('/login')
            }).catch((err) => {
                toast.warning("vui lòng đăng nhập")
            })
    }, [token])

    return (
        <div className="container">
            <div className="card">
                <div className="header">
                    <h1>Quản lý thông báo </h1>
                    <button className='btn btn-info' onClick={() => setWriting(!writing)}>Write a post <i className='fas fa-pencil'></i></button>
                </div>
                {
                    writing &&
                    <div className="formSection alert alert-info p-3">
                        <div className="row flex-column" >
                            <div className="col">
                                {
                                    newPost.title.length < 10 && <small style={{ color: "red" }}>Tiêu đề tối thiểu 10 ky tu</small>
                                }
                                <input
                                    type="text" className='form-control' placeholder='Tieu de'
                                    value={newPost.title}
                                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                                />
                            </div>
                            <div className="col mt-2">
                                {newPost.content.length < 100 && <small style={{ color: "red" }}>Nội dung tối thiểu 100 ky tu</small>}
                                <textarea
                                    className='form-control' placeholder='Nội dung'
                                    value={newPost.content}
                                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                    rows={5}
                                    style={{ width: "100%", resize: "both" }}
                                />
                            </div>
                            <div className="col mt-2">
                                <div className="form-sub align-items-center">
                                    {
                                        newPost.image_url.length < 1 && <small style={{ color: "red" }}>Up ảnh để minh họa cho bài viết</small>
                                    }
                                    <input type="file" onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) {
                                            setSelectedFile(file)
                                        }
                                    }} className='form-control' style={{ height: "50px" }} />
                                    <button type="button" className="btn btn-info mt-2" onClick={uploadImg}>
                                        Upload <i className='fas fa-upload'></i>
                                    </button>
                                </div>
                                {newPost && newPost.image_url &&
                                    <div className="form-sub mt-2">
                                        <img src={newPost.image_url} alt="avatar" className="avatar-review" />
                                    </div>
                                }
                            </div>
                            <div className="col">
                                <div className="form-1">
                                    <label style={{ cursor: "pointer", fontSize: "20px" }}><i className="fa-solid fa-user-secret"></i> Chế độ ẩn danh? </label>
                                    <input style={{ width: "20px", height: "20px", cursor: "pointer" }} type="checkbox" className="ml-2 mt-1" checked={newPost.is_anonymous} onChange={(e) => setNewPost({ ...newPost, is_anonymous: e.target.checked })} />
                                </div>
                            </div>
                            <div className="col">
                                <button onClick={() => createAPost()} className='btn btn-success'>
                                    Save <i className='fas fa-save'></i>
                                </button>
                                <button onClick={() => setWriting(false)} className='btn btn-danger ml-2'>
                                    Cancel <i className='fas fa-xmark'></i>
                                </button>
                            </div>
                        </div>
                    </div>
                }

                <div className="categoryList">
                    <ul>
                        {posts.map((post: any) => (
                            <li key={post.id}>
                                <div className="alert alert-info">
                                    <div className="row">
                                        <div className="col-md-5">
                                            <p><i className="fa-solid fa-clock"></i> {post.author_name} - {post.created_at}</p>
                                            <p><img src={post.image_url} alt="post-avatar" className='avatar-review' /></p>
                                            <p> <strong> {post.title}</strong></p>
                                            <p>- {post.content}</p>
                                        </div>
                                        <div className="col-md-6">

                                            {/* <button onClick={() => deleteCategory(category.id)} className='btn btn-danger'><i className="fa-solid fa-trash"></i></button>
                                            <button onClick={() => editCategory(category.id)} className='btn btn-info'><i className="fa-solid fa-pen"></i></button> */}
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
