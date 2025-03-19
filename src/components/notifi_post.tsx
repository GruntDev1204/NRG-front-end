import { uploadImgSlide } from '@/help/function'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from "next/router"
import Cookies from 'js-cookie'

export default function NotifiPost() {
    const token = Cookies.get('access_token')
    const router = useRouter()
    const [newPost, setNewPost] = useState<any>({
        image_url: "",
        title: "New Post",
        content: "New Post",
        is_anonymous: false
    })
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
                alert(res.data.message)
            })
            .catch((err) => {
                alert(err.response.data.message)
            })
    }

    const uploadImg = async () => {
        if (!selectedFile) {
            alert('Chưa chọn ảnh!')
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
    //             alert(err.response.data.message)
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
    //             alert(res.data.message)
    //         })
    //         .catch((err) => {
    //             alert(err.response.data.message)
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
    //                 alert(res.data.message)
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
                    return alert('hello')
                } else if (res.data.status === 200 && res.data.data.role === "Admin") {
                    alert('only CEO can access this website')
                    router.push('/profile')
                    return
                }

                alert('not permission')
                router.push('/login')
            }).catch((err) => {
                alert("vui lòng đăng nhập")
            })
    }, [token])

    return (
        <div className="container">
            <div className="card">
                <div className="header">
                    <h1>Quản lý thông báo</h1>
                </div>
                <div className="formSection ">
                    <div className="row flex-column" >
                        <div className="col">
                            <input
                                type="text" className='form-control' placeholder='Tieu de'
                                value={newPost.title}
                                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                            />
                            {
                                newPost.title.length < 10 && <small style={{ color: "red" }}>Tieu de phai tối thiểu 10 ky tu</small>
                            }
                        </div>
                        <div className="col mt-2">
                            <textarea
                                className='form-control' placeholder='Nội dung'
                                value={newPost.content}
                                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                rows={5}
                                style={{ width: "100%", resize: "both" }}
                            />
                            {newPost.content.length < 100 && <small style={{ color: "red" }}>Nội dung phai tối thiểu 100 ky tu</small>}
                        </div>
                        <div className="col mt-2">
                            <div className="form-sub align-items-center">
                                <input type="file" onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                        setSelectedFile(file)
                                    }
                                }} className='form-control' style={{ height: "50px" }} />
                                <button type="button" className="btn btn-success mt-2" onClick={uploadImg}>
                                    Upload
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
                                <label >Chế độ ẩn danh?</label>
                                <input type="checkbox" className="ml-2" checked={newPost.is_anonymous} onChange={(e) => setNewPost({ ...newPost, is_anonymous: e.target.checked })} />
                            </div>
                        </div>
                        <div className="col">
                            <button onClick={() => createAPost()} className='btn btn-success'>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
                <div className="categoryList">
                    <h3>Danh sách bài viết</h3>
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
