import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from "next/router"
import Cookies from 'js-cookie'


export default function Category() {
  const router = useRouter()
  const [newCategory, setNewCategory] = useState<string>()
  const [categories, setCategories] = useState<any>([])
  const [editingCategory, setEditingCategory] = useState<boolean>(false)
  const [editCategoryName, setEditCategoryName] = useState<string>("")
  const [editId, setEditId] = useState<number>(0)
  const token = Cookies.get('access_token')

  const getAllCategory = () => {
    axios.get(
      "http://127.0.0.1:8000/api/categories",
    )
      .then((res) => {
        if (res.data.status === 200) {
          setCategories(res.data.data)
        }
      })
  }

  const addCategory = () => {
    axios.post("http://127.0.0.1:8000/api/categories",
      {
        "name": newCategory
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => {
        getAllCategory()
        setNewCategory("")
        alert(res.data.message)
      })
      .catch((err) => {
        alert(err.response.data.message)
      })
  }

  const editCategory = (id: number) => {
    setEditingCategory(true)
    axios.get(`http://127.0.0.1:8000/api/categories/${id}`)
      .then((res) => {
        setEditCategoryName(res.data.data.name)
        setEditId(res.data.data.id)
      })
      .catch((err) => {
        alert(err.response.data.message)
      })
  }

  const saveEdit = () => {
    axios.put(`http://127.0.0.1:8000/api/categories/${editId}`,
      {
        "name": editCategoryName
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => {
        getAllCategory()
        setEditingCategory(false)
        setEditCategoryName("")
        setEditId(0)
        alert(res.data.message)
      })
      .catch((err) => {
        alert(err.response.data.message)
      })
  }

  const deleteCategory = (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      axios
        .delete(`http://127.0.0.1:8000/api/categories/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          getAllCategory()
          alert(res.data.message)
        })
        .catch((err) => {
          alert(err.response?.data?.message || "Có lỗi xảy ra")
        })
    }
  }

  useEffect(() => {
    getAllCategory()
    axios.post("http://127.0.0.1:8000/api/auth/check-auth",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        if (res.data.status === 200 && (res.data.data.role === "CEO" || res.data.data.role === "Admin")) {
          return alert('hello')
        }

        alert('not permission')
        Cookies.remove('access_token')
        router.push('/login')
      }).catch((err) => {
        alert("vui lòng đăng nhập")
      })
  }, [token])

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h1>Quản lý Danh mục Sản phẩm</h1>
          <div className="formSection mt-5">
            <h3 className="mb-3">{editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</h3>
            <div className="row">
              <div className="col-md-10">
                <input
                  type="text" className='form-control'
                  value={editingCategory ? editCategoryName : newCategory}
                  onChange={(e) => editingCategory ? setEditCategoryName(e.target.value) : setNewCategory(e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <button onClick={editingCategory ? saveEdit : addCategory} className='btn btn-success'>
                  {editingCategory ? 'Save' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="categoryList">
          <h3>Danh sách danh mục sản phẩm</h3>
          <ul>
            {categories.map((category: any) => (
              <li key={category.id}>
                <div className="alert alert-info">
                  <div className="row">
                    <div className="col-md-10">
                      <p>{category.name}</p>
                    </div>
                    <div className="col-md-2">
                      <button onClick={() => deleteCategory(category.id)} className='btn btn-danger'><i className="fa-solid fa-trash"></i></button>
                      <button onClick={() => editCategory(category.id)} className='btn btn-info'><i className="fa-solid fa-pen"></i></button>
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
