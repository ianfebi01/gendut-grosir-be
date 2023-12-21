const cloudinary = require('cloudinary')
const fs = require('fs')
const imageUpload = require('../middlewares/imageUpload')
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})

exports.uploadImages = async (req, res) => {
  try {
    const { path } = req.body
    let files = Object.values(req.files).flat()
    let images = []
    for (const file of files) {
      const url = await uploadToCloudinary(file, path)
      images.push(url)
      removeTmp(file.tempFilePath)
    }
    res.json(images)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
exports.deleteImage = async (req, res) => {
  try {
    const { publicId } = req.body
    const delImg = await cloudinary.v2.uploader.destroy(publicId, {
      resource_type: 'image',
    })
    //   .then((result) => console.log(result));
    res.json(delImg)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const uploadToCloudinary = async (file, path) => {
  const res = await cloudinary.v2.uploader.upload(
    file.tempFilePath,
    { folder: path, tags: 'basic_sample' },
    function (err, image) {
      // console.log(image);
      // console.log("** File Upload");
      if (err) {
        console.warn(err)
        // return res.status(400).json({ message: "Upload image failed." });
      }
      // console.log(
      //   "* public_id for the uploaded image is generated by Cloudinary's service."
      // );
      // console.log("* " + image.public_id);
      // console.log("* " + image.url);
      // waitForAllUploads(file.tempFilePath, err, image);
    }
  )
  removeTmp(file.tempFilePath)

  return res
  // return new Promise((resolve) => {
  //   cloudinary.v2.uploader.upload(
  //     file.tempFilePath,
  //     {
  //       folder: path,
  //     },
  //     (err, res) => {
  //       if (err) {
  //         removeTmp(file.tempFilePath);
  //         return res.status(400).send({ message: "Upload image failed." });
  //       }
  //       resolve({
  //         url: res.secure_url,
  //         //   res,
  //       });
  //     }
  //   );
  // });
}

exports.uploadSingleImage = async (req, res) => {
  let files = []
  await validateImage(req, res)

  if (req.files) {
    files = Object.values(req?.files).flat()
  }

  let imageUrl = ''

  if (files?.length === 1) {
    const imageData = await uploadToCloudinary(files[0], 'gendut-grosir')
    imageUrl = imageData?.secure_url
  }

  if (imageUrl !== '') {
    return imageUrl
  } else return false
}

const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err
  })
}

exports.uploadToCloudinary = uploadToCloudinary

const validateImage = async (req, res) => {
  try {
    if (!req.files || Object.values(req.files).flat().length === 0) {
      return res.status(400).json({ message: 'No files selected.' })
    }
    let files = Object.values(req.files).flat()
    files.forEach((file) => {
      if (
        file.mimetype !== 'image/jpeg' &&
        file.mimetype !== 'image/png' &&
        file.mimetype !== 'image/gif' &&
        file.mimetype !== 'image/webp'
      ) {
        removeTmp(file.tempFilePath)
        return res.status(400).json({ message: 'Unsupported format.' })
      }
      if (file.size > 1024 * 1024 * 10) {
        removeTmp(file.tempFilePath)
        return res.status(400).json({ message: 'File size is too large.' })
      }
    })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
