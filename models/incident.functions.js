const ACTIVE = "ACTIVE";
const DELETED = "DELETED";
const RESOLVED = "RESOLVED";
const CANCELLED = "CANCELLED";

const INVALID_STATUS_ERROR = "Your entered an invalid status. It must be one of the valid states. ";

const INCIDENT_STATUSES = {
  ACTIVE,
  DELETED,
  RESOLVED,
  CANCELLED
};

function verifyStatus(status) {
    // Returns the status after verifying it's one of the liable states
    if (status == ACTIVE || status == DELETED || status == RESOLVED || status == CANCELLED) {
        return status
    } else {
        throw INVALID_STATUS_ERROR
    }
}

module.exports = {
    verifyStatus: verifyStatus,
    INCIDENT_STATUSES
};