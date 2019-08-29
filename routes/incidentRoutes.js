/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
const express = require("express");
const Incident = require("../models/incident");
const IncidentFunctions = require("../models/incident.functions");
const isLoggedIn = require("../middlewares/isLoggedIn");

const router = express.Router();

// Read Route - to get all incident//
router.get("/", isLoggedIn, (req, res) => {
  Incident.find({}, (err, allIncidents) => {
    if (err) {
      res.status(500).json(err);
    } else {
      const filteredIncidents = allIncidents.filter((i) => i.status !== "DELETED");
      res.status(200).json(filteredIncidents);
    }
  });
});

// Create Route - to add new incident//
router.post("/", isLoggedIn, (req, res) => {
  // create a new incident object with given data//
  const incident = new Incident();
  incident.title = req.body.title;
  incident.description = req.body.description;
  // TODO: Refactor string to enum
  incident.status = "ACTIVE";
  incident.createdOn = Date.now();
  incident.modifiedOn = Date.now();
  incident.creator = req.body.creator;

  // saving the data into DB.
  incident.save((err, addedIncident) => {
    if (err) {
      res.status(500).json({ msg: err });
    } else {
      res.status(200).json({ msg: "Added new incident", addedIncident });
    }
  });
});

// Read route (:id) - to get incident details by ID//
router.get("/:id", isLoggedIn, (req, res) => {
  Incident.findOne({ _id: req.params.id }, (error, foundIncident) => {
    if (error) {
      res.status(500).json(error);
    } else {
      res.status(200).json(foundIncident);
    }
  });
});

// Edit route - to edit given incident//
router.put("/:id", (req, res) => {
  Incident.findById(req.params.id, (err, foundIncident) => {
    if (err) {
      res.status(500).json(err);
    } else {
      // to save modified data//
      // eslint-disable-next-line no-param-reassign
      foundIncident.title = req.body.title;
      foundIncident.description = req.body.description;
      foundIncident.status = IncidentFunctions.verifyStatus(req.body.status);
      foundIncident.modifiedOn = Date.now();
      foundIncident.save((error, updatedIncident) => {
        if (error) {
          res.status(500).json(error);
        } else {
          res.status(200).json({ msg: "Updated info successfully", updatedIncident });
        }
      });
    }
  });
});

// Delete route - to delete incident// (just incase)//
router.delete("/:id", (req, res) => {
  Incident.findById(req.params.id, (error, incident) => {
    if (error) {
      res.status(500).json(error);
    } else {
      // to save modified data//
      // eslint-disable-next-line no-param-reassign
      incident.status = "DELETED";
      incident.save((error, updatedIncident) => {
        if (error) {
          res.status(500).json(error);
        } else {
          res.status(200).json({ msg: "Deleted successfully", updatedIncident });
        }
      });
    }
  });
});

module.exports = router;
