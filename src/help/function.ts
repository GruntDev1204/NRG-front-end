import { storage } from "@/config/firebase"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import Cookies from "js-cookie"
import { toast } from "react-toastify"

const urlStorageProduct: string = `NRG/products`
const urlStorageAvatar: string = `NRG/avatar`
const urlStorageSlide: string = `NRG/posts`

export const uploadAva = async (file: File): Promise<string> => {
  try {
    const storageRef = ref(storage, `${urlStorageAvatar}/${file.name}`)
    console.log("Storage reference created:", storageRef)

    const uploadResult = await uploadBytes(storageRef, file)
    console.log("Upload result:", uploadResult)

    const downloadURL = await getDownloadURL(storageRef)
    console.log("Download URL:", downloadURL)

    toast.info("tải ảnh lên thành công! ")

    return downloadURL
  } catch (error) {
    toast.error("Lỗi khi tải ảnh lên Firebase!")
    console.error(error)
    return ""
  }
}

export const uploadImgForProduct = async (file: File): Promise<string> => {
  try {
    const storageRef = ref(storage, `${urlStorageProduct}/${file.name}`)
    console.log("Storage reference created:", storageRef)

    const uploadResult = await uploadBytes(storageRef, file)
    console.log("Upload result:", uploadResult)

    const downloadURL = await getDownloadURL(storageRef)
    console.log("Download URL:", downloadURL)

    toast.info("tải ảnh lên thành công! ")

    return downloadURL
  } catch (error) {
    toast.error("Lỗi khi tải ảnh lên Firebase!")
    console.error(error)
    return ""
  }
}

export const uploadImgPost = async (file: File): Promise<string> => {
  try {
    const storageRef = ref(storage, `${urlStorageSlide}/${file.name}`)
    console.log("Storage reference created:", storageRef)

    const uploadResult = await uploadBytes(storageRef, file)
    console.log("Upload result:", uploadResult)

    const downloadURL = await getDownloadURL(storageRef)
    console.log("Download URL:", downloadURL)

    toast.info("tải ảnh lên thành công! ")

    return downloadURL
  } catch (error) {
    toast.error("Lỗi khi tải ảnh lên Firebase!")
    console.error(error)
    return ""
  }
}

export const token: string = Cookies.get("access_token") || ""

export const slides = [
  {
    slide:
      "https://firebasestorage.googleapis.com/v0/b/trung1204-bdc27.appspot.com/o/NRG%2Fslide%2Fz6340634574177_5d75e080b418fee5c6b239c7e8ae62d3.jpg?alt=media&token=d4d8823e-91d5-47fa-9460-c3ad00acb916",
  },
  {
    slide:
      "https://firebasestorage.googleapis.com/v0/b/trung1204-bdc27.appspot.com/o/NRG%2Fslide%2F354234165_785677576349057_593856385186951762_n.jpg?alt=media&token=6d755256-1f73-4ecb-906d-d61d1624f881",
  },
  {
    slide:
      "https://firebasestorage.googleapis.com/v0/b/trung1204-bdc27.appspot.com/o/NRG%2Fslide%2F354249222_785677059682442_6338437484311209494_n.jpg?alt=media&token=92caf1cd-06af-4092-a3ef-3b3e4a8fd563",
  },
  {
    slide:
      "https://firebasestorage.googleapis.com/v0/b/trung1204-bdc27.appspot.com/o/NRG%2Fslide%2F354252788_785676569682491_4016583154055680194_n.jpg?alt=media&token=e258aae1-8150-4421-b34b-6acac862670a",
  },
  {
    slide:
      "https://firebasestorage.googleapis.com/v0/b/trung1204-bdc27.appspot.com/o/NRG%2Fslide%2F419605948_1062284261651014_6348865084336433662_n.jpg?alt=media&token=07419a91-a654-4f2c-951e-6842a1e25b69",
  },
  {
    slide:
      "https://firebasestorage.googleapis.com/v0/b/trung1204-bdc27.appspot.com/o/NRG%2Fslide%2Funnamed.jpg?alt=media&token=2db8b1cf-adac-4171-831d-4ba88f011d6b",
  },
  {
    slide:
      "https://firebasestorage.googleapis.com/v0/b/trung1204-bdc27.appspot.com/o/NRG%2Fslide%2Funnamed22.jpg?alt=media&token=fe1ed321-372a-4641-b28b-c51513392b1a",
  },
  {
    slide:
      "https://firebasestorage.googleapis.com/v0/b/trung1204-bdc27.appspot.com/o/NRG%2Fslide%2Fngoc.png?alt=media&token=52d70e60-28c6-4a55-91be-3a23a45c5caf",
  },
]

export const confirm = (text: string) => {
  if (window.confirm(text)) {
    return true
  }
  return false
}

export function formatVND(amount: any) {
  var formatter = parseFloat(amount)
  return formatter.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  })
}
