const internModel = require("../models/internModel")
const collegeModel = require("../models/collegeModel")


/***************************************VALIDATION FUNCTIONS**********************************************/
const isValid = function (value) {
  if (typeof value === 'undefined' || typeof value === 'null') return false
  if (typeof value === 'string' && value.trim().length === 0) return false
  return true
}


/*****************************************CREATE COLLEGE**************************************************/
const createIntern = async function (req, res) {
  try {
    const data = req.body
    const collegeName = data.collegeName

    //Check data in request body
    if (Object.keys(data) == 0) {
      return res.status(400).send({ status: false, message: "Please Proivde Intern Details" })
    }

    //Name is required
    const name = data.name.trim()
    if (!isValid(data.name)) {
      return res.status(400).send({ status: false, message: "Name is required" })
    }

    //Email is required
    if (!isValid(data.email)) {
      return res.status(400).send({ status: false, message: "Email is required" })
    }

    //To validate email
    const email = data.email.trim()
    if (!(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email))) {
      return res.status(400).send({ status: false, message: "Email is invalid" })
    }

    //Check duplicate email
    const isEmailAlreadyUsed = await internModel.findOne({ email });
    if (isEmailAlreadyUsed) {
      return res.status(400).send({ status: false, message: `${email} email is already used` })
    }

    //Mobile is required
    if (!isValid(data.mobile)) {
      return res.status(400).send({ status: false, message: "Mobile is required" })
    }

    //To validate Mobile
    const mobile = data.mobile.trim()
    if (!(/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/.test(mobile)))
      return res.status(400).send({ status: false, message: "Mobile is invalid" })

    //Check duplicate mobile
    const isMobileAlreadyUsed = await internModel.findOne({ mobile });
    if (isMobileAlreadyUsed) {
      return res.status(400).send({ status: false, message: `${mobile} mobile is already used` })
    }

    //College is required
    if (!isValid(data.collegeName)) {
      return res.status(400).send({ status: false, msg: "College is required" })
    }

    const collegeResponse = await collegeModel.findOne({ name: collegeName, isDeleted: false });
    if (!collegeResponse) {
      return res.status(400).send({ status: false, message: 'College does not exist with this name' })
    }
    data.collegeId = collegeResponse._id;
    //delete data.collegeName; 

    const internRes = await internModel.create(data);
    return res.status(201).send({ status: true, message: "Interns Created Successfully", data: internRes })
  } catch (err) {
    res.status(500).send({ status: false, message: err.message })
  }
}


//**************************************** EXPORTING INTERN ****************************************************/

module.exports.createIntern = createIntern