const { getUsersData, createUser, getOneUserData, loginUser, getUsersAds,
       addUserActivity, getOneUserAds, getAuctionList, placeBid, getCategoryWiseAds, searchItems } = require("../controllers/user_controller");
const {protect} = require('../controllers/auth_controller');
const express = require("express");
const multer = require('multer');

const multerStorage = multer.diskStorage({
      destination: (req, file, cb) => {
            cb(null, 'public/images/');
      },
      filename: (req, file, cb) => {
            if(!req.body.image) req.body.image = [];
            const extension =  file.mimetype.split('/')[1];
            const nameWithoutExtension = file.originalname.split('.')[0];
            const fileName = `${req.body.activity}-${req.body.user_id}-${Date.now()}-${nameWithoutExtension}.${extension}`;
            req.body.image.push(fileName);
            cb(null, fileName);
      }
});

const upload = multer({storage: multerStorage});

const router = express.Router();

router.get("/userInfo", protect, getUsersData);
router.get("/userInfo/:Id", getOneUserData);
router.get("/adsList/:Id", getOneUserAds);
router.get("/userAdsList/:categoryName", getCategoryWiseAds);
router.get('/auctionList', getAuctionList);
router.post('/search', searchItems);
router.patch("/placeBid/:id", placeBid);

router.route("/userActivity")
      .get(getUsersAds)
      .post(protect, addUserActivity);
      // .post(protect, upload.array('images', 5), addUserActivity);

router.post("/signUp", createUser);
router.post("/login", loginUser);

module.exports = router;