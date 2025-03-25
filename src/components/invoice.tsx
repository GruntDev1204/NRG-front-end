import { formatVND } from "@/help/function"
import axios from "axios"
import Cookies from "js-cookie"
import { headers } from "next/headers"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
export default function Invoice() {
  const [bill, setBill] = useState<any>([])
  const [user, setUser] = useState<any>({})
  const router = useRouter()

  function getAllOrder() {
    axios.get(`http://127.0.0.1:8000/api/orders`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('access_token')}`
      }
    })
      .then(res => {
        console.log(res.data)
        if (res.data.status === 200 || res.data.status === 201) {
          setBill(res.data.data)
        } else {
          toast.error("Lấy danh sách thất bại")
        }
      })
      .catch(error => console.log(error))
  }

  function updateOrders(id: number) {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      axios.put(`http://127.0.0.1:8000/api/orders/${id}`, {
      }, {
        headers: {
          Authorization: `Bearer ${Cookies.get('access_token')}`
        }
      })
        .then(res => {
          if (res.data.status === 200) {
            toast.success(res.data.message)
            getAllOrder()
          } else {
            toast.error(res.data.message)
          }
        })
        .catch(error => console.log(error))
    }
  }

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/auth/profile`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('access_token')}`
      }
    }).then(res => {
      if (res.data.status === 200) {
        setUser(res.data.data)
      }
    }).catch(() => router.push('/auth'))

    getAllOrder()
  }, [])

  return (
    <div className="invoice">
      <h2> <i className="fa-solid fa-credit-card"></i> HÓA ĐƠN THANH TOÁN -  Customer : {user.name}</h2>
      <table>
        <thead>
          <tr>
            <th>Total</th>
            <th>Order at</th>
            <th>Is Paid?</th>
            <th>Is Canceled?</th>
          </tr>
        </thead>
        <tbody>
          {bill.map((item: any) => (
            <tr key={item.id}
              style={{ opacity: item.is_paid ? 0.5 : 1, pointerEvents: item.is_paid ? "none" : "auto" }}>
              <td className="cart-table-cell">{formatVND(parseFloat(item.total_price))}</td>
              <td className="cart-table-cell">{item.created_at}</td>
              <td className="cart-table-cell" style={{ color: item.is_paid ? "green" : "red"  , fontSize: "20px"}}>{item.is_paid ? "Paid" : "Unpaid"}</td>
              <td className="cart-table-cell" style={{ cursor: "pointer" }} title="Hủy đơn hàng?">
                {item.is_canceled ?
                  <i className="fa-solid fa-check" style={{ color: 'green', fontSize: "20px" }}
                    onClick={() => updateOrders(item.id)}></i>
                  :
                  <i className="fa-solid fa-xmark" style={{ color: 'red', fontSize: "20px" }}
                    onClick={() => updateOrders(item.id)}></i>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 className="text-right">
        <strong>
          Total: {formatVND(
            bill
              .filter((item: any) => !item.is_paid)
              .reduce((sum: number, item: any) => sum + Number(item.total_price), 0)
          )}
        </strong>
      </h3>
    </div>
  )
}