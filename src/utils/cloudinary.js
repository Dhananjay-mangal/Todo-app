import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (LocalFilePath) => {
    try {
        if(!LocalFilePath) return null

        const response = await cloudinary.uploader.upload(LocalFilePath,{
            resource_type:"auto",
            folder:"todo-app"
        })
        fs.unlinkSync(LocalFilePath) // remove the locally saved temporary file
        return response.secure_url
    } catch (error) {
        fs.unlinkSync(LocalFilePath) // remove the locally saved temporary file
        console.error("Error uploading to Cloudinary:", error)
        return null
    }
}

export default uploadOnCloudinary