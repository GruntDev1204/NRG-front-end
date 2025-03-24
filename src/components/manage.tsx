import axios from "axios"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { useRouter } from "next/router"
import { confirm } from "@/help/function"
import { toast } from "react-toastify"

export default function Management() {
    const router = useRouter()
    const [users, setUsers] = useState<any>([])
    const [role, setROLE] = useState<string>("Customer")
    const [status, setSTATUS] = useState<string>("Active")
    const token = Cookies.get("access_token")

    const getUsers = () => {
        axios
            .get(`http://127.0.0.1:8000/api/users`, {
                headers: { Authorization: `Bearer ${Cookies.get("access_token")}` },
            })
            .then((res) => {
                setUsers(res.data.data)
            })
            .catch(() => {
                router.push("/admin")
            })
    }

    const changeRole = (id: number) => {
        if (!role) {
            alert("Please select a role.")
            return
        }
        if (confirm("do you want to change role for this user?")) {
            axios
                .put(
                    `http://127.0.0.1:8000/api/users/manager/${id}/role`,
                    { role: role },
                    {
                        headers: {
                            Authorization: `Bearer ${Cookies.get("access_token")}`,
                        },
                    }
                )
                .then(() => {
                    toast.success("Change role success")
                    getUsers()
                })
                .catch((error) => {
                    toast.error(error.response.data.error)
                })
        }


    }

    const changeStatus = (id: number) => {
        if (!status) {
            toast.warning("Please select a status.")
            return
        }


        if (confirm("Are you sure you want to change status for this user?"))
            axios
                .put(
                    `http://127.0.0.1:8000/api/users/manager/${id}/status`,
                    { status: status },
                    {
                        headers: {
                            Authorization: `Bearer ${Cookies.get("access_token")}`,
                        },
                    }
                )
                .then(() => {
                    toast.success("Change status success")
                    getUsers()
                })
                .catch((error) => {
                    toast.error(error.response.data.error)
                })
    }

    useEffect(() => {
        axios.post("http://127.0.0.1:8000/api/auth/check-auth",
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((res) => {
                if (res.data.status === 200 && res.data.data.role === "CEO") {
                    getUsers()
                } else if (res.data.status === 200 && res.data.data.role === "Admin") {
                    setTimeout(() => { router.push('/profile') }, 2000)
                    toast.warning('only CEO access this page')
                    router.push('/profile')
                }
            }).catch((err) => {
                toast.error("vui lòng đăng nhập")
                router.push('/login')
            })
    }, [])

    return (
        <div className="container">
            <h1 className="text-center mb-5">Management Users</h1>
            <table id="userTable">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Avatar</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user: any, index: number) => (
                        <tr key={index}>
                            <td>{user.email}</td>
                            <td>
                                <img src={user.avatar} alt="avatar" className="image-preview" />
                            </td>
                            <td>{user.name}</td>
                            <td>
                                <select
                                    onChange={(e) => setROLE(e.target.value)}
                                >
                                    <option value={user.role} disabled>
                                        {user.role}
                                    </option>
                                    <option value="Admin">Admin</option>
                                    <option value="Customer">Customer</option>
                                </select>
                                <button
                                    className="edit-btn"
                                    onClick={() => changeRole(user.id)}
                                >
                                    Save
                                </button>
                            </td>
                            <td>
                                <select
                                    onChange={(e) => setSTATUS(e.target.value)}
                                >
                                    <option value={user.status} disabled>
                                        {user.status === 0 ? 'No active' : (user.status === 1 ? 'Active' : 'Blocked')}
                                    </option>
                                    <option value={"Active"}>Active</option>
                                    <option value={"Inactive"}>No active</option>
                                    <option value={"Blocked"}>Blocked</option>
                                </select>
                                <button
                                    className="btn btn-primary ml-2 mr-2"
                                    onClick={() => changeStatus(user.id)}
                                >
                                    Save
                                </button>
                                {user.status === 0 && (
                                    <button className="btn btn-warning" disabled>No active <i className="fa-solid fa-xmark"></i></button>
                                )}
                                {user.status === 1 && (
                                    <button className="btn btn-info" disabled>Active <i className="fa-solid fa-check"></i></button>
                                )}
                                {user.status === 2 && (
                                    <button className="btn btn-danger" disabled>Blocked</button>
                                )}
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && (
                        <tr>
                            <td colSpan={5}>No users found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div >
    )
}
