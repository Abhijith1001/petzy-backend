const router = require("express").Router();
const AddPet = require("../../models/addpet");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
        const fileExtension = file.originalname.split('.').pop().toLowerCase();
        if (allowedExtensions.includes(`.${fileExtension}`)) {
          cb(null, true); 
        } else {
          cb(new Error('Invalid file type. Only .jpg, .jpeg, .png, .webp files are allowed.'));
        }
      },
});

router.post("/addpet/:shelterId", upload.single('file'), async (req, res) => {
    try {
        console.log(req.file);
       
        const shelterId = req.params.shelterId;
        console.log("shelterId_add:", shelterId);
        
        const existingPet = await AddPet.findOne({ petname: req.body.petname });

        if (existingPet) {
           
            return res.status(400).json({ message: "Pet with the same name already exists." });
        }

        const newPet = await AddPet.create({
            petname: req.body.petname,
            price:req.body.price,
            category: req.body.category,
            description: req.body.description,
            image: req.file.filename,
            shelterID: shelterId 
        });

        res.status(201).json(newPet);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding pet to the database." });
    }
});


  

module.exports = router;



