import axios from "axios"
import { useEffect, useState } from "react"

export default function Footer() {
    const [cate, setCate] = useState<any>([])

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/categories')
            .then((res) => {
                setCate(res.data.data.slice(0, 3))
            })
            .catch((error) => {
                console.log(error)
            })

    }, [])

    return (
        <div className="footer">
            <div className="gird">
                <div className="gird-row">
                    <div className="gird-column-2-4">
                        <h3 className="footer-heading">Chăm sóc khách hàng</h3>
                        <ul className="footer-list">
                            <li className="footer-list-item">
                                <a href="" className="footer-list-item-link">
                                    Trung tâm trợ giúp
                                </a>
                            </li>
                            <li className="footer-list-item">
                                <a href="https://hotrungto@gmail.com" className="footer-list-item-link" target="_blank">
                                    Shop NRGrunt Mall
                                </a>
                            </li>
                            <li className="footer-list-item">
                                <a href="" className="footer-list-item-link">
                                    Hướng dẫn mua hàng
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="gird-column-2-4">
                        <h3 className="footer-heading">Giới thiệu</h3>
                        <ul className="footer-list">
                            <li className="footer-list-item">
                                <a href="" className="footer-list-item-link">
                                    Giới thiệu
                                </a>
                            </li>
                            <li className="footer-list-item">
                                <a href="" className="footer-list-item-link">
                                    Tuyển dụng
                                </a>
                            </li>
                            <li className="footer-list-item">
                                <a href="" className="footer-list-item-link">
                                    Điều khoản
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="gird-column-2-4">
                        <h3 className="footer-heading">Danh mục</h3>
                        <ul className="footer-list">
                            {
                                cate.map((item: any) => {
                                    return (
                                        <li className="footer-list-item">
                                            <a href={`/categories/${item.id}`} className="footer-list-item-link">
                                                {item.name}
                                            </a>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                    <div className="gird-column-2-4">
                        <h3 className="footer-heading">Theo dõi</h3>
                        <ul className="footer-list">
                            <li className="footer-list-item">
                                <a href="https://www.facebook.com/TinaFose" className="footer-list-item-link" target="_blank">
                                    <i className="fa-brands fa-facebook"></i>
                                    Facebook
                                </a>
                            </li>
                            <li className="footer-list-item">
                                <a href="https://www.instagram.com/grunt_12.4" className="footer-list-item-link" target="_blank">
                                    <i className="fa-brands fa-instagram"></i>
                                    Instagram
                                </a>
                            </li>
                            <li className="footer-list-item">
                                <a href="https://www.tiktok.com/@hotrung1204" className="footer-list-item-link" target="_blank">
                                    <i className="fa-brands fa-linkedin"></i>Linkedin
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="gird-column-2-4">
                        <h3 className="footer-heading">Vào cửa hàng trên ứng dụng</h3>
                        <div className="footer-download">
                            <img src="https://down-vn.img.susercontent.com/file/a5e589e8e118e937dc660f224b9a1472" alt="download qr" className="footer-download-qr" />
                            <div className="footer-download-app">
                                <img src="https://st.download.com.vn/data/image/2022/08/02/Google-Play-Store-anh-lon.jpg" alt="" className="footer-download-app-img" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/2560px-Download_on_the_App_Store_Badge.svg.png" alt="qr-dowload" className="footer-download-app-img" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="gird-row-below" style={{ textAlign: 'center' }}>
                <p className="footer-text mt-2">©2025 - Bản quyền thuộc về Trần Hoài Ngọc</p>
            </div>
        </div>
    )
}