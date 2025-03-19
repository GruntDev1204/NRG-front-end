import { slides } from "@/help/function"
import { useState } from "react"

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }

  return (
    <div className="container mt-5">
      <div className="alert alert-primary" style={{ cursor: "pointer" }}>
        <h3 className="text-center"><b>Welcome to Admin Dashboard!</b></h3>
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
  )
}
