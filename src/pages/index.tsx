import Menu from "@/components/menu"
import { slides } from "@/help/function"
import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import Cookies from "js-cookie"
import { useRouter } from "next/router"

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [showMenu, isShowMenu] = useState<boolean>(false)
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }

  const router = useRouter()

  useEffect(() => {
    const token = Cookies.get('access_token')

    axios.post("http://127.0.0.1:8000/api/auth/check-auth",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        if (res.data.status === 200 && (res.data.data.role === "Admin" || res.data.data.role === "CEO")) {
          toast.success("welcome to the administration page")
          isShowMenu(true)
        } else {
          toast.warning("you not have permission! pls try login by admin account")
          Cookies.remove("access_token")
        }
      })
      .catch(error => {
        toast.error(error.response.data.error)
      })
  }, [])

  return (
    <>
      {showMenu && <Menu />}
      <div className="container mt-5">
        <div className="alert alert-primary" style={{ cursor: "pointer" }}>
          <h3 className="text-center"><b>Welcome to Admin Dashboard! {!showMenu && <a className="btn btn-primary ml-3" onClick={() => router.push("/login")}>Login</a >}</b></h3>
        </div>
        <div className="card">
          <div className="carousel slide">
            <div className="carousel-inner">
              {slides.map((item, index) => (
                <div
                  key={index}
                  className={`carousel-item ${index === currentIndex ? "active" : ""}`}
                  onClick={nextSlide}
                  style={{ cursor: "pointer" }}
                >
                  <img src={item.slide} className="img-fluid slide w-100" alt={`Slide ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
