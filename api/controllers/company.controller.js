const db = require("../models");
const Companies = db.companies;
const Contacts = db.contacts;
const Op = db.Sequelize.Op;

// Create company
exports.create = (req, res) => {
  const company = {
    company_name: req.body.company_name,
    company_address: req.body.company_address,
    contactId: parseInt(req.params.contactId),
  };



  Companies.create(company)
    .then((data) => {
      res.send(data);
    })

    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred",
      });
    });
};

// Get all of companies
exports.findAll = (req, res) => {
  Companies.findAll({
    where: {
      contactId: parseInt(req.params.contactId),
    },
  })

    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred",
      });
    });

};

// Get one company by id
exports.findOne = (req, res) => {
  const id = req.params.company_id;

  Contacts.findByPk(id)
    .then((data) => {
      res.send(data);
    })

    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Company data with id=" + id,
      });
    });

};



// Update one company by id
exports.update = (req, res) => {
  const id = req.params.companyId;

  Companies.update(req.body, {
    where: { company_id: id, contactId: req.params.contactId },
  })

    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Company data was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Company data`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Company with id=" + id,
      });
    });
};


// Delete one company
exports.delete = (req, res) => {
  const companyId = parseInt(req.params.companyId);
  const contactId = parseInt(req.params.contactId);


  Companies.destroy({
    where: {
      company_id: companyId,
      contactId: contactId, // Ensure the company belongs to the specific contact
    },
  })

    .then((num) => {
      if (num === 1) {
        res.send({
          message: "Company was deleted successfully!",
        });
      } else {
        res.status(404).send({
          message: `Cannot delete company id=${companyId} and contact id=${contactId}. Company not found.`,
        });
      }
    })

    .catch((err) => {
      res.status(500).send({
        message: "Could not delete company with id=" + companyId,
        error: err.message,
      });
    });
};

