import "@/styles/shop.css"
import "@/styles/detail.css"
import "@/styles/cart.css"
import "@/styles/color.css"
import "@/styles/reponsive.css"
import "@/styles/invoice.css"
import "@/styles/product.css"
import "@/styles/product.css";
import "@/styles/reponsive.css"
import '@/styles/shop.css'

import type { AppProps } from "next/app"
import { ReduxProvider } from "@/store/provider"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ReduxProvider>
      <Component {...pageProps} />
      <ToastContainer />
    </ReduxProvider>
  )
}
