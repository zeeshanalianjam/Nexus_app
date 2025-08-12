import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public")
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif']
    if(allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }else {
        cb(new Error("Invalid file type. Only PNG, JPG, JPEG, and GIF are allowed."), false);
    }
}

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});