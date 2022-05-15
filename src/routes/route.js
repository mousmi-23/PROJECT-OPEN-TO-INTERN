const express = require('express');
const router = express.Router();

/********************************Require controller modules*********************************************/ 

const collegeController=require('../controllers/collegeController')
const internController=require('../controllers/internController')

//**************************************COLLEGE API's***************************************************/

router.post('/createCollege', collegeController.createCollege)
router.get('/getCollege', collegeController.getCollege)

//**************************************INTERN API******************************************************/

router.post('/createIntern', internController.createIntern)


module.exports=router;