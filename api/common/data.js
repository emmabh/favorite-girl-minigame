const KLAVIYO_LISTS = {
    general: 'R2Jn4y'
}

const ERROR = {
    INVALID_REQUEST: "subscriptions/invalid-request",
    AUTH: "auth/verification-failed",
    ADD_FAILED: "subscriptions/add-to-list-failed",
    INTERNAL: "subscriptions/invalid-status",
    INTERNAL_LIST: `subscriptions/remove-from-list-failed`,
    INVALID_ACTION: `subscriptions/invalid-action`,
    INVALID_EMAIL: `frontend/invalid-email`,
    DEFAULT: `frontend/default`,
};

module.exports = {
    KLAVIYO_LISTS,
    ERROR
}