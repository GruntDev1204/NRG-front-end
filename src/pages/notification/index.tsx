import Footer from "@/components/footer"
import Header from "@/components/header"
import Post from "@/components/posts"

export default function index() {
    return (
        <div className="container">
            <Header />
            <Post />
            <Footer />
        </div>
    )
}