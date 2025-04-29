const  express= require("express");
const { signup, login }= require("../controllers/authController")
const { signupValidator } = require("../utils/validators");
const { validationResult } = require("express-validator");
const catchAsync = require("../utils/catchAsync")
const router= express.Router();


router.post(
    "/signup",
    signupValidator,
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      next(); // this works now because 'next' is declared
    },
    catchAsync(signup)
  );
  


  router.post("/login",catchAsync( login));

module.exports= router;