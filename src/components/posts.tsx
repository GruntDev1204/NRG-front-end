import axios from "axios"
import Cookies from "js-cookie"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function Post() {
    const token = Cookies.get('access_token')
    const [posts, setPosts] = useState<any>([])
    const router = useRouter()

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

    useEffect(() => {
        getAllPost()
    }, [])

    return (
        <div className="row mt-5">
            <div className="col">
                <div className="alert alert-white mt-3">
                    <h3 className="text-center"> <strong>Tất cả bài viết <i className="fa-solid fa-newspaper"></i></strong> </h3>
                    <ul>
                        <li> <button className="btn btn-warning" onClick={() => router.back()}> <i className="fa-solid fa-arrow-left"></i> Back the previous page </button></li>
                        {posts.map((post: any) => (
                            <li key={post.id}>
                                <div className="alert alert-primary mt-3">
                                    <div className="row">
                                        <div className="col">
                                            <h5 className="mb-3"><i className="fa-solid fa-clock"></i> {post.author_name} - {post.created_at}</h5>
                                            <p><img src={post.image_url} alt="post-avatar" className='avatar-review' style={{ borderRadius: '10px', border: '3px solid green', height: '500px', width: '500px', objectFit: 'cover' }} /></p>
                                            <p> <strong> {post.title}</strong></p>
                                            <p>- {post.content}</p>
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