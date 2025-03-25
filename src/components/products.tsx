'use client'
import axios from "axios"
import { useEffect, useState } from "react"
import { formatVND, uploadImgForProduct } from "@/help/function"
import Cookies from 'js-cookie'
import { useRouter } from "next/router"
import { toast } from "react-toastify"

export default function Product() {
    const token = Cookies.get('access_token')
    const router = useRouter()
    const [openView, setOpen] = useState<boolean>(false)
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [selectCategory, setSelectCategory] = useState<Number>(0)
    const [dataProduct, setDataProduct] = useState<any>([])
    const [dataCategory, setDataCategory] = useState<any>([])
    const [total, setTotal] = useState<any>({
        total_item: 0,
        total_page: 0,
        page_size: 5,
        page_index: 1
    })
    const dfData = {
        id: 0,
        image: "",
        name: "",
        price: 0,
        quantity: 0,
        description: "",
        origin: "",
        discount: 0,
        status: false,
        category_id: 0,
    }
    const [dataInsert, setInsert] = useState(dfData)
    const [editData, setEditdata] = useState(dfData)
    const [nameSearch, setNameSearch] = useState<string>("")
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    function getAllProduct({ sortOrder, sort_col, pageIndex }: { sortOrder?: string, sort_col?: string, pageIndex?: number }) {
        try {
            axios
                .get("http://127.0.0.1:8000/api/products", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        page: pageIndex || total.page_index,
                        page_size: total.page_size,
                        sort_order: sortOrder,
                        id_category: Number(selectCategory),
                        sort_col: sort_col,
                        name: nameSearch,
                    }
                })
                .then((res) => {
                    if (res.data.status === 200) {
                        setTotal({
                            ...total,
                            page_index: pageIndex || total.page_index,
                            total_page: res.data.data.total_pages,
                            total_item: res.data.data.total_items
                        })
                        setDataProduct(res.data.data.items)
                    } else {
                        toast.error("Lấy danh sách sản phẩm thất bại, vui lòng thử lại!")
                    }
                })
                .catch((error) => {
                    console.log("Lỗi khi gọi API:", error)
                })
        } catch (e) {
            console.log(e)
        }
    }

    function getAllCategory() {
        axios.get("http://127.0.0.1:8000/api/categories")
            .then((res) => {
                if (res.data.status === 200) {
                    setDataCategory(res.data.data)
                }
            })
    }

    const onNextPage = () => {
        if (total.page_index < total.total_page) {
            const newPageIndex = total.page_index + 1
            setTotal({ ...total, page_index: newPageIndex })
            setTimeout(() => {
                getAllProduct({ pageIndex: newPageIndex })
            }, 500)
        }
    }

    const onPrevPage = () => {
        if (total.page_index > 1) {
            const newPageIndex = total.page_index - 1
            setTotal({ ...total, page_index: newPageIndex })
            setTimeout(() => {
                getAllProduct({ pageIndex: newPageIndex })
            }, 500)
        }
    }

    const uploadImg = async () => {
        if (!selectedFile) {
            toast.warning('Chưa chọn ảnh!')
            return
        }
        toast.info('Uploading avatar...')
        const uploadedAvatarUrl = await uploadImgForProduct(selectedFile)
        if (uploadedAvatarUrl) {
            setInsert((prev) => ({
                ...prev,
                image: uploadedAvatarUrl,
            }))
            setSelectedFile(null)
        }
    }

    async function handleUpdateAvatar() {
        if (!selectedFile) {
            toast.warning('Chưa chọn ảnh!')
            return
        }
        toast.info('Uploading avatar...')
        const uploadedAvatarUrl = await uploadImgForProduct(selectedFile)
        if (uploadedAvatarUrl) {
            setEditdata((prev) => ({
                ...prev,
                image: uploadedAvatarUrl,
            }))
            setSelectedFile(null)
        }
    }

    const cancelProcess = () => {
        setIsEdit(false)
        setEditdata(dfData)
    }

    const createProduct = () => {
        axios.post("http://127.0.0.1:8000/api/products", dataInsert
            , {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then((res) => {
                toast.success(res.data.message)
                getAllProduct({})
                setInsert(dfData)
            }).catch((error) => {
                toast.error(error.response.data.message)
                Object.values(error.response.data.errors).forEach((err) => {
                    if (Array.isArray(err)) {
                        err.forEach((msg) => toast.error(msg))
                    }
                })
            })
    }

    const deleteProduct = (id: number) => {
        if (window.confirm("Do you want to delete this product?")) {
            axios.delete(`http://127.0.0.1:8000/api/products/${id}`
                , {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
                .then((res) => {
                    toast.success(res.data.message)
                    getAllProduct({})
                }).catch((error) => {
                    alert(error.response.data.error)
                })
        }
    }

    const handleEditData = (id: number) => {
        axios.get(`http://127.0.0.1:8000/api/products/${id}`)
            .then((res) => {
                setEditdata(res.data.data)
                setIsEdit(true)
            })

    }
    const updateProduct = () => {
        axios.put(`http://127.0.0.1:8000/api/products/${editData.id}`, editData
            , {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then((res) => {
                toast.success(res.data.message)
                getAllProduct({})
                setIsEdit(false)
                setEditdata(dfData)
            }).catch((error) => {
                alert(error.response.data.error)
            })
    }

    const changeStatus = (id: number) => {
        axios.put(`http://127.0.0.1:8000/api/products/change-status/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

            .then((res) => {
                toast.success(res.data.message)
                getAllProduct({})
            }).catch((error) => {
                alert(error.response.data.error)
            })
    }

    useEffect(() => {
        getAllProduct({})
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
                    return toast.info('hello')
                }

                toast.warning('not permission')
                Cookies.remove('access_token')
                router.push('/login')
            }).catch((err) => {
                toast.warning("vui lòng đăng nhập")
            })
    }, [])

    return (
        <>
            <div className="container">
                <div className="content">
                    <div className="alert alert-info mb-3">
                        <h3 className="text-center">Product Management</h3>
                        <div className="btn btn-success" onClick={() => setOpen((prev) => !prev)}>
                            + Add
                        </div>
                    </div>

                    {isEdit && editData && (
                        <div className="content-form-1">
                            <h2>Edit Product</h2>
                            <div className="form-sub">
                                <label>Image Product</label>
                                <input type="file" onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                        setSelectedFile(file)
                                    }
                                }} />
                                <button type="button" style={{ marginTop: "10px" }} onClick={handleUpdateAvatar}>Upload</button>
                            </div>
                            {editData && editData.image &&
                                <div className="form-sub mb-3">
                                    <img src={editData.image} alt="avatar" className="avatar-review" />
                                </div>
                            }
                            <div className="form-sub">
                                <label >Name Product</label>
                                <input type="text" placeholder="Enter name" onChange={(e) => setEditdata({ ...editData, name: e.target.value })} value={editData.name} />
                            </div>
                            <div className="form-sub">
                                <label >Price</label>
                                <input type="text" placeholder="Enter price" onChange={(e) => setEditdata({ ...editData, price: Number(e.target.value) })} value={editData.price} />
                            </div>
                            <div className="form-sub">
                                <label >Quantity</label>
                                <input type="text" placeholder="Enter quantity" onChange={(e) => setEditdata({ ...editData, quantity: Number(e.target.value) })} value={editData.quantity} />
                            </div>
                            <div className="form-sub">
                                <label >Origin</label>
                                <input type="text" placeholder="Enter quantity" onChange={(e) => setEditdata({ ...editData, origin: e.target.value })} value={editData.origin} />
                            </div>
                            <div className="form-sub">
                                <label >Discount</label>
                                <input type="text" placeholder="Discount" onChange={(e) => setEditdata({ ...editData, discount: Number(e.target.value) / 100 })} value={editData.discount * 100} />
                            </div>
                            <div className="form-sub">
                                <p >Description</p>
                                <textarea
                                    onChange={(e) => setEditdata({ ...editData, description: e.target.value })}
                                    value={editData.description}
                                    rows={5}
                                    style={{ width: "100%", resize: "both" }}
                                />
                            </div>
                            <div className="form-1">
                                <label >Category</label>
                                <select defaultValue={0} onChange={(e) => setEditdata({ ...editData, category_id: Number(e.target.value) })} value={editData.category_id} className="form-select">
                                    <option value={0}>Choose category</option>
                                    {
                                        dataCategory.map((item: any) => (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="form-1">
                                <label >Hiểm thị? </label>
                                <input type="checkbox" className="ml-2" name="interests" value="sports" onChange={(e) => setEditdata({ ...editData, status: e.target.checked })} checked={editData.status} />
                            </div>
                            <div className="update">
                                <button type="button" className="btn btn-success" onClick={() => updateProduct()}>Save <i className="fa-regular fa-floppy-disk"></i></button>
                                <button type="button" className="btn btn-danger ml-2" onClick={cancelProcess}><i className="fa-solid fa-xmark"></i></button>
                            </div>

                        </div>
                    )}

                    {openView && (<div className="content-form">
                        <div className="form-sub">
                            <label >Name Product</label>
                            <input type="text" placeholder="Enter name" onChange={(e) => setInsert({ ...dataInsert, name: e.target.value })} value={dataInsert.name} />
                        </div>

                        <div className="form-sub">
                            <label >Price</label>
                            <input type="number" placeholder="Enter price" onChange={(e) => setInsert({ ...dataInsert, price: Number(e.target.value) })} value={dataInsert.price} />
                        </div>
                        <div className="form-sub">
                            <label >Quantity</label>
                            <input type="text" placeholder="Enter quantity" onChange={(e) => setInsert({ ...dataInsert, quantity: Number(e.target.value) })} value={dataInsert.quantity} />
                        </div>
                        <div className="form-sub">
                            <label >Origin</label>
                            <input type="text" placeholder="Enter quantity" onChange={(e) => setInsert({ ...dataInsert, origin: e.target.value })} value={dataInsert.origin} />
                        </div>
                        <div className="form-sub">
                            <label >Discount</label>
                            <input
                                type="number"
                                placeholder="Enter discount"
                                onChange={(e) =>
                                    setInsert({ ...dataInsert, discount: Number(e.target.value) / 100 })
                                }
                                value={dataInsert.discount * 100}
                            />

                        </div>
                        <div className="form-sub">
                            <p >Description</p>
                            <textarea
                                onChange={(e) => setInsert({ ...dataInsert, description: e.target.value })}
                                value={dataInsert.description}
                                rows={5}
                                style={{ width: "100%", resize: "both" }}
                            />

                        </div>
                        <div className="form-1">
                            <label >Category</label>
                            <select onChange={(e) => setInsert({ ...dataInsert, category_id: Number(e.target.value) })} value={dataInsert.category_id} className="form-select">
                                <option value={0} selected disabled>Choose category</option>
                                {dataCategory && dataCategory.map((item: any) => (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-sub">
                            <label>Image Product</label>
                            <input type="file" onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                    setSelectedFile(file)
                                }
                            }} />
                            <button type="button" style={{ marginTop: "10px" }} onClick={uploadImg}>Upload</button>
                        </div>
                        {dataInsert && dataInsert.image &&
                            <div className="form-sub">
                                <img src={dataInsert.image} alt="avatar" className="avatar-review" />
                            </div>
                        }
                        <div className="form-1">
                            <label >Hiển thị?</label>
                            <input type="checkbox" className="ml-2" checked={dataInsert.status} onChange={(e) => setInsert({ ...dataInsert, status: e.target.checked })} />
                        </div>
                        <button type="button" className="btn btn-success" onClick={createProduct}>Add <i className="fa-regular fa-floppy-disk"></i></button>
                        <button type="button" className="btn btn-danger ml-2" onClick={() => setOpen(false)}><i className="fa-solid fa-xmark"></i></button>
                    </div>)}
                </div>

                <div className="search-list">
                    <div className="search-name">
                        <input type="text" placeholder="Tìm kiếm danh sách theo tên" onChange={(e) => setNameSearch(e.target.value)} value={nameSearch} />
                        <select onChange={(e) => setSelectCategory(Number(e.target.value))} value={Number(selectCategory)} className="form-select">
                            <option value={0} disabled selected>Chọn danh mục</option>
                            {dataCategory && dataCategory.map((item: any) => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            ))}
                        </select>
                        <button className="search-quantity" onClick={() => getAllProduct({})}>
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </button>
                    </div>
                    <div className="pagination">
                        <button onClick={onPrevPage}><i className="pagination-one fa-solid fa-angle-left"></i></button>
                        <span>{total.page_index + '/' + total.total_page}</span>
                        <button onClick={onNextPage}><i className="pagination-one fa-solid fa-angle-right"></i></button>
                    </div>
                    <h3>Tổng : {total.total_item}</h3>
                </div>

                <div className="content-table">
                    <table cellPadding="0" cellSpacing="0">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Origin</th>
                                <th>Discount</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataProduct.length > 0 && dataProduct?.map((item: any) => (
                                <tr key={item.id}>
                                    <td><img src={item.image} alt="image" className="image-preview" /></td>
                                    <td>{item.name}</td>
                                    <td>{formatVND(item.price)}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.origin}</td>
                                    <td>{item.discount * 100}%</td>
                                    <td style={{ maxWidth: '300px' }}>
                                        <span className="d-inline-block text-truncate" style={{ maxWidth: '300px' }}>
                                            {item.description}
                                        </span>
                                    </td>
                                    <td>
                                        {item.status ?
                                            <button className="btn btn-info" onClick={() => changeStatus(item.id)}> <i className="fa fa-eye mr-2"></i>Public</button> :
                                            <button className="btn btn-warning" onClick={() => changeStatus(item.id)}> <i className="fa fa-eye-slash mr-2"></i>Private</button>
                                        }
                                    </td>
                                    <td>
                                        <button type="button" className="btn btn-info" onClick={() => handleEditData(item.id)} >
                                            <i className="fa-solid fa-pen-to-square"></i>
                                        </button>
                                        <button type="button" className="btn btn-danger ml-2" onClick={() => deleteProduct(item.id)}>
                                            <i className="fa-solid fa-delete-left"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {!dataProduct || dataProduct.length === 0 && (
                                <tr>
                                    <td colSpan={9}>No product...</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div >
        </>
    )
}