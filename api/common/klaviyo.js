const fetch = require("node-fetch");

const KLAVIYO_API_URL = "https://a.klaviyo.com/api/v2";
const KLAVIYO_LIST_PREFIX = "list";
const KLAVIYO_LIST_SUBSCRIBE_ENDPOINT = "subscribe";

const subscribeToEmailList = (listId, data) => {
    const url = `${KLAVIYO_API_URL}/${KLAVIYO_LIST_PREFIX}/${listId}/${KLAVIYO_LIST_SUBSCRIBE_ENDPOINT}?api_key=${process.env.KLAVIYO_PRIVATE_KEY}`

    return fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    });
}

module.exports = {
    subscribeToEmailList
}