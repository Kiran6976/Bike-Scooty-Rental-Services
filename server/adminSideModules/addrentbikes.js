const express = require('express');
const router = express.Router();
const adminAuthentication = require("../middelware/adminAuthentication");

const Rentbike = require('../models/rentbikeSchema');

const multer = require("multer");

const upload = multer({ dest: 'uploads/' });



module.exports = router.post('/addrentbikes', upload.single("myrentfile"),  async(req, res, next)=>{
    
    try {
            const data = new Rentbike({
                brand : req.body.brand,
                model : req.body.model,
                year : req.body.year,
                color : req.body.color,
                seats : req.body.seats,
                price : req.body.price,
                rent : req.body.rent,
                fileName : req.file.originalname,
                filePath : `/uploads/${req.file.filename}`,
                fileType : req.file.mimetype,
                fileSize : req.file.size, 
            });
            await data.save();
            res.status(201).json({success: true, message: "Bike added successfully"});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
   
} )

module.exports = router;