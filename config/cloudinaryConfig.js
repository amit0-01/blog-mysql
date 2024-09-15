// /config/cloudinaryConfig.js
const cloudinary = require('cloudinary').v2; // Make sure you use 'v2'


// Cloudinary configuration
cloudinary.config({
    cloud_name: 'dkvivdbiv',
    api_key: '571338176475161',
    api_secret: 'DhdJ5YLjTRmW5U0HjLJ0rw8aw1o',
});


const uploadOnCloudinary = async function(localFilePath){
    try {
       if(!localFilePath) return null;
   
       //upload file on cloudinary
       const response = await cloudinary.uploader.upload(localFilePath,{
           resource_type: "auto"
       })
       //fila has been uploaded succesfully
       console.log("file is uploaded on cloudianry", response.url);
       return response;
       
    } catch (error) {
       await fs.unlink(localFilePath)
       return null;
   
       
    }
   }

module.exports = uploadOnCloudinary;
