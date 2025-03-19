import { storage } from "@/firebase/firebase"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
const urlStorageAvatar: string = `NRG/avatar`
export const uploadAva = async (file: File): Promise<string> => {
  try {
    const storageRef = ref(storage, `${urlStorageAvatar}/${file.name}`)
    console.log("Storage reference created:", storageRef)

    const uploadResult = await uploadBytes(storageRef, file)
    console.log("Upload result:", uploadResult)

    const downloadURL = await getDownloadURL(storageRef)
    console.log("Download URL:", downloadURL)

    alert("tải ảnh lên thành công! ")

    return downloadURL
  } catch (error) {
    alert("Lỗi khi tải ảnh lên Firebase!")
    console.error(error)
    return ""
  }
}

export function formatVND(amount: any) {
  var formatter = parseFloat(amount)
  return formatter.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  })
}
