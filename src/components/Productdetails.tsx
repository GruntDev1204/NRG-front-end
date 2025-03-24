"use client"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import { useDispatch } from "react-redux"
import { setCount } from "@/store/slices/productsSlice"
import { formatVND } from "@/help/function"
import { toast } from "react-toastify"

interface Props {
  onBack: (product: any) => void
  idProduct: number
}
interface Productdetails {
  id: number,
  name: string,
  status: number,
  price: number,
  image: string,
  created_at: string,
  updated_at: string,
  category_id: number,
  quantity: number,
  origin: string,
  discount: number,
  description: string,
}

export const ProdDetail: React.FC<Props> = ({ onBack, idProduct }) => {
  const dispatch = useDispatch()
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
  const [token, setToken] = useState<string>("")
  const [quantity, setQuantity] = useState(1)
  function plusQuantity() {
    setQuantity(quantity + 1)
  }
  function minusQuantity() {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }
  const router = useRouter()
  const { id } = router.query
  const [product, setProduct] = useState<Productdetails>({
    id: 0,
    name: "",
    status: 0,
    price: 0,
    image: "",
    created_at: "",
    updated_at: "",
    category_id: 0,
    quantity: 0,
    origin: "",
    discount: 0,
    description: ""
  })
  function addCart(type: string) {
    axios.post(`http://127.0.0.1:8000/api/carts`, { product_id: idProduct, quantity: quantity }
      , {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then(res => {
        console.log(res.data)
        if (res.data.status === 200) {
          switch (type) {
            case "buy":
              buyNow(res.data.data.id)
              break
            case "cart":
              getCart()
              toast.success("Thêm giỏ hàng thành công")
              router.push('/cart')
              break
            default:
              break
          }
        } else {
          toast.error("Thêm vào giỏ hàng thất bại")
        }
      })
      .catch(error => console.log(error))

  }

  function buyNow(cartId: number) {
    const isBuyNow = window.confirm('bạn có thực sự muốn mua ngay sản phẩm này')
    if (!isBuyNow) {
      return
    }

    axios.post(`http://127.0.0.1:8000/api/orders`, {
      cart_ids: [cartId]
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

  useEffect(() => {
    const token = Cookies.get('access_token') || ""
    if (token) {
      setToken(token)
    }
    axios.get(`http://127.0.0.1:8000/api/products/${idProduct}`)
      .then((res) => {
        if (res.data.status === 200) {
          setProduct(res.data.data)
        } else {
          toast.error("Sign up error, please try again!")
        }
      })
      .catch((error) => {
        toast.error("Sign up error, please try again!")
      })
  }, [id])

  return (

    <>
      <div className="product-container">
        <i className="icon-back fa-solid fa-arrow-left" onClick={onBack}></i>
        <div className="product-cover">
          <div className="product-gallery">
            <img src={product?.image} alt="image" className="product-image" style={{ width: '100%', height: '50%', objectFit: 'cover' }} />
          </div>
          <div className="product-details">
            <h2>{product?.name}</h2>
            <p>
              <strong>Xuất xứ:</strong> {product?.origin}
            </p>
            <p>
              <strong>Giá:</strong>{" "}
              <span className="discount-price">{formatVND(product?.price - (product?.price * product?.discount))}</span>{" "}
              <del className="original-price">{formatVND(product?.price)}</del> ({product?.discount * 100}%)
            </p>
            <div className="quantity-cell-border" style={{ width: 80, textAlign: "center" }}>
              <span onClick={() => minusQuantity()} className="quantity-btn btn-one ">-</span>
              <span className="quantity">{quantity}</span>
              <span onClick={() => plusQuantity()} className="quantity-btn btn-two">+</span>
            </div>
            <div className="button-detail">
              <button className="buy-now" onClick={() => addCart("buy")}>Mua Ngay</button>
              <button className="add-to-cart" onClick={() => addCart("cart")}><i className="fa-solid fa-cart-shopping"></i> Thêm Vào Giỏ</button>
            </div>
            <div className="product-info">
              <h3>Thông Tin : </h3>
              <p>
                {product?.description}
              </p>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default ProdDetail