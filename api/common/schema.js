const { isValidEmailAddress } = require("./validation");
const { KLAVIYO_LISTS } = require("./data");

const SubscribeToListSchema = [
    {
        key: "email",
        validator: val => {
            return isValidEmailAddress(val);
        },
        error: val => {
            if (!val) {
                return "missing"
            }

            return "Invalid email"
        }
    },
    {
        key: "id",
        validator: val => {
            return KLAVIYO_LISTS[val];
        },
        error: val => {
            if (!val) {
                return "missing"
            }

            return "Invalid list id"
        }
    }
];

const PostAnswerSchema = [
    {
        key: "id",
        validator: val => {
            return Number.isInteger(val);
        },
        error: val => {
            if (!val) {
                return "missing"
            }

            return "Invalid id"
        }
    },
    {
        key: "answeredYes",
        validator: val => {
            return val === true || val === false
        },
        error: val => {
            if (!val) {
                return "missing"
            }

            return "Invalid answeredYes"
        }
    },
]

module.exports = {
    SubscribeToListSchema,
    PostAnswerSchema
}