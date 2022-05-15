const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel")


/************************************** VALIDATION FUNCTIONS *********************************************/
const isValid = function (value) {
  if (typeof value === 'undefined' || typeof value === 'null') return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};


/****************************************** CREATE COLLEGE ***********************************************/
const createCollege = async function (req, res) {
  try {
    let data = req.body;
    const fullName = data.fullName;

    if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: false, message: "Please provide College Details" });
    }

    //Abbrebeation is required
    if (!isValid(data.name)) {
      return res.status(400).send({ status: false, message: "College Name is required" });
    }

    //Abbrevation must be a single word
    const collegeT = data.name.split(" ");
    const length = collegeT.length;
    if (length > 1) {
      return res.status(400).send({ status: false, message: "Abbreviated college name should be in a single word", });
    }

    //College full name is required
    if (!isValid(fullName)) {
      return res.status(400).send({ status: false, message: "College FullName is required" });
    }

    //Logolink is required
    if (!isValid(data.logoLink)) {
      return res.status(400).send({ status: false, message: "Logolink is required" });
    }

    //To check College already exist with this abbrebeaiation or not
    const isNameAlreadyUsed = await collegeModel.findOne({ name: name });
    if (isNameAlreadyUsed) {
      return res.status(400).send({ status: false, message: `${name} college already exist with this abbrebeaiation name` });
    }

    //To check College already exist or not 
    const isFullreadyUsed = await collegeModel.findOne({ fullName });
    if (isFullreadyUsed) {
      return res.status(400).send({ status: false, message: `${fullName} college already exist with this name` });
    }

    //To validate logoLink
    const logoLink = data.logoLink.trim()
    if (!(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/.test(logoLink))) {
      return res.status(400).send({ status: false, message: " logoLink is invalid" })
    }

    let saveData = await collegeModel.create(data);
    return res.status(201).send({ status: true, message: "College created successfully", data: saveData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};


/*************************************** COLLEGE WITH INTERN'S **********************************************/
const getCollege = async function (req, res) {
  try {
    if (!isValid(req.query.collegeName)) {
      return res.status(400).send({ status: false, message: "Please Provide college name" })
    }

    let collegeDetail = await collegeModel.findOne({ name: req.query.collegeName, isDeleted: false })
    if (!collegeDetail) {
      return res.status(400).send({ status: false, message: "No college found" })
    }

    let { _id, name, fullName, logoLink } = collegeDetail //initialise

    let allInterns = await internModel.find({ collegeId: _id, isDeleted: false }).select({ name: 1, email: 1, mobile: 1 })
    if (allInterns.length === 0) return res.status(400).send({ status: false, msg: "no intern applied for this college" })

    let College = { name: name, fullName: fullName, logoLink: logoLink, intrest: allInterns }
    return res.status(200).send({ status: true, message: "College Data with their Interns", data: College })
  }
  catch (err) {
    return res.status(500).send({ status: false, message: err.message })
  }
}


/*************************************** EXPORTING COLLEGE **********************************************/

module.exports.createCollege = createCollege;
module.exports.getCollege = getCollege