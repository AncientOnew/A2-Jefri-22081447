module.exports = app => {
    const companies = require("../controllers/company.controller.js");
    var router = require("express").Router();  
    router.post("/companies/:contactId/", companies.create);
    router.get("/companies/:contactId/", companies.findAll);
    router.get("/companies/:companyId/contacts/:contactId", companies.findOne);
    router.put("/companies/:companyId/contacts/:contactId", companies.update);
    router.delete("/companies/:companyId/contacts/:contactId", companies.delete);
    app.use('/api', router);
};