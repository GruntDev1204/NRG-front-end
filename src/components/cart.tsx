import React, { useState, useEffect } from "react"
import { useRouter } from "next/router"
import axios from "axios"
import Cookies from "js-cookie"
import { formatVND } from "@/help/function"
import { toast } from "react-toastify"

interface Props {
  onBack: (product: any) => void
}
interface CartItem {
  id: number,
  image: string,
  price: string,
  product_id: number,
  product_name: string
  quantity: number
  user_id: number
}
export const Cart = () => {
  const token = Cookies.get('access_token') || ""
  const router = useRouter()

  function handleOrder() {
    axios.post(`http://127.0.0.1:8000/api/orders`, {
      cart_ids: cartItems.map((item) => item.id),
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.data.status === 201) {
          toast.success("Order success")
          router.push("/invoice")
        } else {
          toast.error("Order fail")
        }
      })
      .catch(error => console.log(error))
  }

  function updateCart(cart_id: number, product_id: number, quantity: number) {
    axios.put(`http://127.0.0.1:8000/api/carts/${cart_id}`, { product_id: product_id, quantity: quantity }
      , {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then(res => {
        if (res.data.status === 200) {
          toast.success(res.data.message)
        } else {
          toast.error("Cap nhap gio hang that bai")
        }
      })
      .catch(error => console.log(error))
  }
  function deleteCart(cart_id: number) {
    axios.delete(`http://127.0.0.1:8000/api/carts/${cart_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then(res => {
        if (res.data.status === 204) {
          getCart()
          toast.success("Delete cart success")
        } else {
          toast.error("Xoa gio hang that bai")
        }
      })
      .catch(error => console.log(error))
  }

  const [cartItems, setCartItems] = useState<CartItem[]>([
  ])

  function getCart() {
    axios.get(`http://127.0.0.1:8000/api/carts`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => {
        if (res.data.status === 200) {
          setCartItems(res.data.data)
        }
      })
      .catch((error) => {
        console.log(error)
      })

  }

  useEffect(() => {
    getCart()
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
          toast.info("hello")
        }
      })
      .catch(() => {
        setTimeout(() => {
          toast.warning('Login session has expired , please log in again!')
          router.push('/auth')
        }, 2000)
      })
  }, [])

  const updateQuantity = (id: number, delta: any, quantity: any, idProduct: any) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    )
    updateCart(id, idProduct, Math.max(1, quantity + delta))
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0)
  const vat = totalPrice * 0.01
  const shippingFee = 50000
  const finalTotal = totalPrice + vat + shippingFee

  return (
    <>
      <div className="cart-container">
        <h2 className="cart-header">Giỏ hàng <i className="cart-header-icon-nav fa-solid fa-bag-shopping"></i></h2>
        <table className="cart-table">
          <thead>
            <tr className="cart-table-header">
              <th className="cart-table-cell">Hình ảnh</th>
              <th className="cart-table-cell">Sản phẩm</th>
              <th className="cart-table-cell">Giá</th>
              <th className="cart-table-cell">Số lượng</th>
              <th className="cart-table-cell">Tổng</th>
              <th className="cart-table-cell">Xóa</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.length > 0 && cartItems.map((item) => (
              <tr key={item.id}>
                <td className="cart-table-cell">
                  <img src={item.image} alt={item.product_name} className="product-image-2" />
                </td>
                <td className="cart-table-cell">{item.product_name}</td>
                <td className="cart-table-cell">{formatVND(parseFloat(item.price))}</td>
                <td className="cart-table-cell quantity-cell">
                  <div className="quantity-cell-border">
                    <span onClick={() => { setTimeout(() => updateQuantity(item.id, -1, item.quantity, item.product_id), 500) }} className="quantity-btn btn-one ">-</span>
                    <span className="quantity">{item.quantity}</span>
                    <span onClick={() => { setTimeout(() => updateQuantity(item.id, +1, item.quantity, item.product_id), 500) }} className="quantity-btn btn-two">+</span>
                  </div>
                </td>
                <td className="cart-table-cell">{formatVND(parseFloat(item.price) * item.quantity) || "..."}</td>
                <td className="cart-table-cell">
                  <div onClick={() => deleteCart(item.id)}><i className="delete-btn fa-solid fa-trash"></i></div>
                </td>
              </tr>
            ))}
            {
              cartItems.length <= 0 &&
              <tr className="cart-warning">
                <td colSpan={6}>You have no items in your cart! 😢😢😢😢😢</td>
              </tr>
            }
          </tbody>
        </table>
        {
          cartItems.length > 0 &&
          <>
            <div className="cart-summary">
              <p>Tổng giá: {totalPrice.toLocaleString("vi-VN")}₫</p>
              <p>VAT (5%): {vat.toLocaleString("vi-VN")}₫</p>
              <p>Shipping: {shippingFee.toLocaleString("vi-VN")}₫</p>
              <p className="font-bold">Thành tiền: {finalTotal.toLocaleString("vi-VN")}₫</p>
            </div>
            <div className="footer-button">
              <button className="checkout-btn" onClick={handleOrder}>Thanh Toán</button>
            </div>
          </>
        }
      </div >
    </>
  )
}
export default Cart
