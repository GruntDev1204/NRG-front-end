import Cart from "@/components/cart";
import Footer from "@/components/footer";
import HeaderComponent from "@/components/header";
export default function Category() {
    return (
        <div className="container">
            <HeaderComponent />
            <Cart />
            <Footer/>
        </div>
    )
}