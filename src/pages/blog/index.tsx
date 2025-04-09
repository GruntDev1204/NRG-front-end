import Blog from "@/components/blog";
import Footer from "@/components/footer";
import Header from "@/components/header";

export default function index() {
    return (
        <div className="container">
            <Header />
            <Blog />
            <Footer />
        </div>
    )
}