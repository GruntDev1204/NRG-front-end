import { formatVND } from "@/help/function"
import axios from "axios"
import Cookies from "js-cookie"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
export default function Invoice() {
  const [bill, setBill] = useState<any>([])
  const [user, setUser] = useState<any>({})
  const router = useRouter()
  // function getOderById(id: any) {
  //   axios.get(`http://127.0.0.1:8000/api/orders/${id}`, {
  //     headers: {
  //       Authorization: `Bearer ${Cookies.get('access_token')}`
  //     }
  //   })
  //     .then(res => {
  //       console.log(res.data)
  //     })
  // }
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
          alert("Lấy danh sách thất bại")
        }
      })
      .catch(error => console.log(error))
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
            <tr key={item.id}>
              <td className="cart-table-cell">{formatVND(parseFloat(item.total_price))}</td>
              <td className="cart-table-cell">{item.created_at}</td>
              <td className="cart-table-cell">{item.is_paid ? "Paid" : "Unpaid"}</td>
              <td className="cart-table-cell">{item.is_canceled ? "✅" : "❌"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}