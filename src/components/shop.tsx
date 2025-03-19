"use client"
import axios from "axios"
import { useRouter } from "next/router"
import ProdDetail from "./Productdetails"
import ProdList from "./ProductList"
import { useEffect, useState } from "react"
import Footer from "@/components/footer";
import Cookies from "js-cookie"
import Banner from "@/components/banner"
import { Sorting } from "@/components/sorting"

import { useDispatch, useSelector } from "react-redux"
import { setCount, setDataProduct, setLoading, setTotal, Total } from "@/store/slices/productsSlice"
import LoadingScreen from "./Loading"
import Header from "./header"

export default function Shop() {
    const [selectedProd, setSelectedProd] = useState(null)
    const [selectCategory, setSelectCategory] = useState<number | null>(null)

    const [lstCategory, setLstCategory] = useState<any>([])
    const dispatch = useDispatch()
    const { total, isLoading, dataProduct, search }: { total: Total, isLoading: boolean, dataProduct: any, search: string } = useSelector((state: any) => ({
        total: state.product.totalProduct,
        isLoading: state.product.isLoading,
        dataProduct: state.product.dataProduct,
        search: state.product.search
    }))

    function getAllProduct({ id_category, sortOder, sort_col, pageIndex }: { id_category?: number, sortOder?: string, sort_col?: string, pageIndex?: number }) {
        try {
            dispatch(setDataProduct([]))
            dispatch(setLoading(true))
            axios
                .get("http://127.0.0.1:8000/api/products", { params: { page: pageIndex || total.pageIndex, page_size: total.pageSize, id_category: id_category, sort_order: sortOder, sort_col, name: search } })
                .then((res) => {
                    if (res.data.status === 200) {
                        dispatch(setTotal({ ...total, pageIndex: pageIndex || total.pageIndex, totalPage: res.data.data.total_pages, totalProduct: res.data.data.total_items }))
                        dispatch(setDataProduct(res.data.data.items))
                    }
                    dispatch(setLoading(false))
                })
                .catch((error) => {
                    alert("Sign up error, please try again!")
                })
        } catch (e) {
            console.log(e)
        } finally {
            dispatch(setLoading(false))
        }

    }
    function getAllCategory() {
        axios
            .get("http://127.0.0.1:8000/api/categories")
            .then((res) => {
                if (res.data.status === 200) {
                    setLstCategory(res.data.data)
                } else {
                    alert("Sign up error, please try again!")
                }
            })
            .catch((error) => {
                console.error("Error in sign up", error)
            })
    }

    useEffect(() => {
        setTimeout(() => {
            getAllProduct({})
        }, 1000)

        getAllCategory()
    }, [])

    const router = useRouter()

    function getCart() {
        const token = Cookies.get('access_token') || ""
        axios.get(`http://127.0.0.1:8000/api/carts`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then((res) => {
                if (res.data.status === 200) {
                    dispatch(setCount(res.data.data.length))
                }
            })
            .catch((error) => {
                console.log(error)
            })

    }

    useEffect(() => {
        const token = Cookies.get("access_token") || ""

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

                }
            })
            .catch((error) => {
                alert("please login to use application services and application features")
            })

    }, [router])

    return (
        <>
            <div className="container">
                <Header />
                <div className="body-container">
                    <div className="body-container-content">
                        <div className="banner-image " style={{ marginTop: "20px", marginBottom: "20px", height: "300px" }}>
                            <Banner />
                        </div>
                        {selectedProd === null && <div className="Sorting">
                            <Sorting
                                onNew={() => getAllProduct({ sortOder: "desc", sort_col: "created_at" })}
                                onSortPrice={(value) => getAllProduct({ sortOder: value.target.value, sort_col: "price" })}
                                onTrending={() => getAllProduct({ sortOder: "desc", sort_col: "discount" })}

                                page={`${total.pageIndex}/${total.totalPage}`}
                                onNextPage={() => {
                                    if (total.pageIndex < total.totalPage) {
                                        dispatch(setLoading(true))
                                        const newPageIndex = total.pageIndex + 1
                                        dispatch(setTotal({ ...total, pageIndex: newPageIndex }))
                                        setTimeout(() => {
                                            getAllProduct({ id_category: selectCategory ?? undefined, pageIndex: newPageIndex })
                                        }, 1500)
                                    }
                                }}
                                onPrevPage={() => {
                                    if (total.pageIndex > 1) {
                                        dispatch(setLoading(true))
                                        const newPageIndex = total.pageIndex - 1
                                        dispatch(setTotal({ ...total, pageIndex: newPageIndex }))
                                        setTimeout(() => {
                                            getAllProduct({ id_category: selectCategory ?? undefined, pageIndex: newPageIndex })
                                        }, 1500)
                                    }
                                }}

                            />
                        </div>}

                        {selectedProd === null &&
                            <div className="menu-ul-2">
                                <select
                                    className="menu-li"
                                    onChange={(e) => {
                                        getAllProduct({ id_category: Number(e.target.value) })
                                        setSelectCategory(Number(e.target.value))
                                    }}
                                    value={selectCategory ?? ""}
                                >
                                    <option value={""} className="menu" >Choose category</option>
                                    {lstCategory.map((item: any) => (
                                        <option key={item.id} value={item.id} className={selectCategory === item.id ? "select" : "menu"} >
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        }
                        {selectedProd === null ? (
                            dataProduct.length > 0 && (
                                <ProdList
                                    onSelectProduct={(e) => {
                                        setSelectedProd(e)
                                    }}
                                    listProduct={dataProduct}

                                    category={lstCategory}
                                />
                            )
                        ) : (
                            <ProdDetail idProduct={selectedProd["id"]} onBack={() => setSelectedProd(null)} />
                        )}
                    </div>
                </div>
                <Footer />
            </div >
            {isLoading && <LoadingScreen />
            }
        </>
    )
}
