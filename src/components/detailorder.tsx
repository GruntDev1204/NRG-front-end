import axios from "axios"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import Cookies from 'js-cookie'
import { formatVND } from "@/help/function"

export default function DetailOrder() {
    const token = Cookies.get('access_token')
    const router = useRouter()
    const { id_order } = router.query
    const [details, setDetails] = useState<any>([])

    const getDetailOrder = () => {
        axios.get('http://127.0.0.1:8000/api/detail-orders/?order_id=' + id_order, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                setDetails(res.data.data)
            }).catch((err) => {
                toast.error("có lỗi khi load chi tiết đơn")
                setTimeout(() => {
                    router.back()
                }, 500)
            })
    }
    useEffect(() => {
        getDetailOrder()

        if (!id_order || Number(id_order) <= 0) {
            setTimeout(() => {
                router.back()
            }, 500)
        }

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
        <div className="container mt-5">
            <div className="orderList mt-5">
                <h3>Chi tiết Đơn hàng ( {id_order} ) <a className="btn btn-warning ml-2" onClick={() => router.back()}>Comeback <i className="fa fa-arrow-left"></i></a></h3>
                <table className="table">
                    <thead >
                        <tr >
                            <th className='text-center' >#</th>
                            <th className='text-center'>Id sản phẩm </th>
                            <th className='text-center'> Tên sản phẩm </th>
                            <th className='text-center'>Image</th>
                            <th className='text-center'>Đơn giá</th>
                            <th className='text-center'>Số lượng</th>

                        </tr>
                    </thead>
                    <tbody>
                        {details.map((value: any, index: number) => (
                            <tr key={value.id}>
                                <td className='text-center align-middle' >{index + 1}</td>
                                <td className='text-center align-middle' >{value.product_id}</td>
                                <td className='text-center align-middle'>{value.product_name}</td>
                                <td className='text-center align-middle'><img src={value.image} alt="preview" className="image-preview" /></td>
                                <td className='text-center align-middle'>{formatVND(value.unit_price)}</td>
                                <td className='text-center align-middle'>{value.quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <h3 className="text-right mt-3">Total : {formatVND(details.reduce((sum: number, item: any) => sum + item.unit_price * item.quantity, 0))} </h3>
        </div>
    )
}