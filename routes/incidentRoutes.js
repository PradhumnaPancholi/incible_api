const express = require('express')
const Incident = require('../models/incident')
const IncidentFunctions = require("../models/incident.functions")
const isLoggedIn = require('../middlewares/isLoggedIn')
const router = express.Router()

const INCIDENT_STATUS_MAPPER = {
    All: undefined,
    Open: "ACTIVE",
    Closed: "CLOSED",
    Resolved: "RESOLVED",
    Cancelled: "CANCELLED",
    New: "NEW"
};

//Read Route - to get all incident//
router.get('/', isLoggedIn, (req, res) => {
    Incident.find({}, (err, allIncidents) => {
        if(err){
            res.status(500).json(err)
        }else{
            let status = req.query.status;
            status = INCIDENT_STATUS_MAPPER[status]
            const filteredIncidents = allIncidents
                .filter(i => i.status !== "DELETED")
                .filter(i => {
                    if (status) {
                        return i.status == status
                    } else {
                        return true;
                    }
                })
            res.status(200).json(filteredIncidents)
        }
    })
})

//Create Route - to add new incident//
router.post('/', isLoggedIn, (req, res) => {
    //create a new incident object with given data//
    let incident = new Incident()
        incident.title = req.body.title,
        incident.description = req.body.description,
            // TODO: Refactor string to enum
            incident.status = "NEW",
        incident.createdOn = Date.now(),
        incident.modifiedOn = Date.now(),
        incident.creator = req.body.creator
    
        //saving the data into DB.
        incident.save((err, addedIncident) => {
            if(err){
                res.status(500).json({msg: err})
            }else{
                res.status(200).json({msg: "Added new incident", addedIncident})
            }
        })
})

//POST: for adding narratives//
router.post('/narrative', isLoggedIn, (req, res) => {
    Incident.findOne({_id: req.body.id}, (err, incident) => {
        if(err){
            res.status(500).json(err)
        } else {
            if (!checkIfModificationAllowed(incident)) {
                res.status(400).json({msg: "The incident has been deleted or closed. So further modifications are forbidden."})
            } else {
                let narrative = incident.narrative;
                const {userID} = req.userData;
                narrative = [...narrative,{note: req.body.note, timestamp: new Date(), user: userID}]
                incident.narrative = narrative;
                incident.save((err, updatedIncident) => {
                    if(err){
                        res.status(500).json(err)
                    }else{
                        res.status(200).json({msg: "Updated info successfully", updatedIncident})
                    }
                })}
            }
    })
})

//Read route (:id) - to get incident details by ID//
router.get('/:id', isLoggedIn, (req, res) => {
    Incident.findOne({_id: req.params.id}, (err, foundIncident) => {
        if(err){
            res.status(500).json(err)
        }else{
            res.status(200).json(foundIncident)
        }
    })
})

//Edit route - to edit given incident//
router.put('/:id', isLoggedIn, (req, res) => {
    Incident.findById(req.params.id, (err, incident) => {
        if(err){
            res.status(500).json(err)
        }else{
            responseOutErrorForNotAllowedModifications(res,incident);
            //to save modified data//
            incident.title = req.body.title,
            incident.description = req.body.description,
            incident.status = IncidentFunctions.verifyStatus(req.body.status),
            incident.modifiedOn = Date.now()
            incident.save((err, updatedIncident) => {
                if(err){
                    res.status(500).json(err)
                }else{
                    res.status(200).json({msg: "Updated info successfully", updatedIncident})
                }
            })
        }
    })
})

//Delete route - to delete incident// (just incase, however it's much better to "close" and incident instead of delete//
router.delete('/:id', isLoggedIn, (req, res) => {
    Incident.findById(req.params.id, (err, incident) => {
        if(err){
            res.status(500).json(err)
        }else{
            responseOutErrorForNotAllowedModifications(res,incident);
            //to save modified data//
            incident.status = "DELETED",
            incident.save((err, updatedIncident) => {
                if(err){
                    res.status(500).json(err)
                }else{
                    res.status(200).json({msg: "Deleted successfully", updatedIncident})
                }
            })
        }
    })
})

//for checking if modififcations are allowed//
function checkIfModificationAllowed(incident) {
    return incident.status !== "CLOSED" || incident.status !== "DELETED" || incident.status !== "RESOLVED";
}

function responseOutErrorForNotAllowedModifications(res,incident) {
    if (!checkIfModificationAllowed(incident)) {
        res.status(400).json({msg: "The incident has been deleted or closed. So further modifications are forbidden."})
    }
}

module.exports = router