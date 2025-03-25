import axios from 'axios'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { confirm, formatVND } from '@/help/function'
import Link from 'next/link'

export default function Invoice() {
  const token = Cookies.get('access_token')
  const router = useRouter()
  const [orders, getOrders] = useState<any>([])

  const getAllOrders = () => {
    axios
      .get(`http://127.0.0.1:8000/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        getOrders(res.data.data)
      })
      .catch(() => {
        router.push("/")
      })
  }

  const updateOrder = (id: number) => {
    axios
      .put(`http://127.0.0.1:8000/api/orders/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        toast.success(res.data.message)
        getAllOrders()
      })
      .catch((err) => {
        toast.error(err.response.data.message)
      })
  }

  const deleteOrders = (id: number) => {
    if (confirm('Are you sure you want to delete this order?'))
      axios
        .delete(`http://127.0.0.1:8000/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((res) => {
          toast.success("deleted order!")
          getAllOrders()
        })
        .catch((err) => {
          toast.error(err.response.data.message)
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
        if (res.data.status === 200 && (res.data.data.role === "CEO" || res.data.data.role === "Admin")) {
          getAllOrders()
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
    <div className="container">
      <div className="orderList mt-5">
        <h3>Danh sách Đơn hàng</h3>
        <table className="table">
          <thead >
            <tr >
              <th className='text-center' >#</th>
              <th className='text-center'> Email Khách hàng</th>
              <th className='text-center'>Mã đơn hàng</th>
              <th className='text-center'>Tổng tiền</th>
              <th className='text-center'>Đã Hủy?</th>
              <th className='text-center'>Trạng thái</th>
              <th className='text-center'>Action?</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: any, index: number) => (
              <tr key={order.id}>
                <td className='text-center align-middle' >{index + 1}</td>
                <td className='text-center align-middle'>{order.email}</td>
                <td className='text-center align-middle'>{order.order_code}</td>
                <td className='text-center align-middle'>{formatVND(order.total_price)}</td>
                <td className='text-center align-middle'>
                  {order.is_canceled ? (
                    <span className="text-green-500">[✓] Đã hủy</span>
                  ) : (
                    <span className="text-red-500">[✗] Chưa hủy</span>
                  )}
                </td>
                <td className='text-center align-middle' >{order.is_paid ?
                  <button className='btn btn-success' onClick={() => updateOrder(order.id)}>paid <i className="fa-solid fa-check"></i></button>
                  : <button className='btn btn-warning' onClick={() => updateOrder(order.id)}>unpaid <i className="fa-solid fa-xmark"></i></button>}
                </td>
                <td className='text-center align-middle'>
                  <button className='btn btn-danger' onClick={() => deleteOrders(order.id)}> <i className="fa-solid fa-trash"></i></button>
                  <Link href={`/detail-orders/${order.id}`}>
                    <button className="btn btn-info ml-2">
                      <i className="fa-solid fa-eye"></i>
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
