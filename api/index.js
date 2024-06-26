const { wrap } = require("./wrap");
const { SubscribeToListSchema, PostAnswerSchema } = require("./common/schema");
const { validateSchema } = require("./common/validation");
const { subscribeToEmailList } = require("./common/klaviyo");
const { KLAVIYO_LISTS, ERROR } = require("./common/data");
const { verifyRecaptcha, retrieveUserSourceIp } = require("./utilities");
const { getDbItem, TABLE, updateDbItem } = require("./common/db");


const subscribeToList = wrap(async (event, context) => {
  const data = JSON.parse(event.body);
  const { valid, keys } = validateSchema(data, SubscribeToListSchema);

  if (!valid) {
    return {
      statusCode: 400,
      body: {
        errors: keys
      }
    };
  }

  const { id, email, recaptcha } = data;

  const ipAddress = retrieveUserSourceIp(event);
  const verified = await verifyRecaptcha(
    recaptcha,
    ipAddress
  );

  if (!verified) {
    console.error("recaptcha", verified);
    return {
      statusCode: 401,
      body: {
        errors: [
          {
            key: "",
            message: "Recaptcha error"
          }
        ]
      }
    };
  }

  const individualResp = await subscribeToEmailList(KLAVIYO_LISTS[id], { profiles: [{ email, "origin": "favorite-girl-minigame" }] })
    .then((resp) => {
      if (resp.status != 200) {
        return Promise.reject(resp);
      } else {
        return resp;
      }
    })
    .then(async (resp) => await resp.json())
    .then((obj) => {
      return {
        statusCode: 200,
        body: obj.length > 0 ? obj[0] : {}
      }
    })
    .catch((err) => {
      console.error(err);
      if (err.status == 400) {
        const { detail } = err.json();
        console.error(detail);
        if (detail.includes("not a valid email")) {
          return {
            statusCode: 400,
            body: {
              errors: [
                {
                  key: "email",
                  message: ERROR.INVALID_EMAIL
                }
              ]
            }
          }
        } else {
          return null;
        }
      } else {
        return null;
      }
    });

  if (!individualResp) {
    return {
      statusCode: 500,
      body: {
        errors: [
          {
            key: "",
            message: "Server error"
          }
        ]
      }
    }
  } else {
    return individualResp;
  }
});

const postAnswer = wrap(async (event, context) => {
  const data = JSON.parse(event.body);
  const { valid, keys } = validateSchema(data, PostAnswerSchema);

  if (!valid) {
    return {
      statusCode: 400,
      body: {
        errors: keys
      }
    };
  }

  const { id, answeredYes, recaptcha } = data;

  const ipAddress = retrieveUserSourceIp(event);
  const verified = await verifyRecaptcha(
    recaptcha,
    ipAddress
  );

  if (!verified) {
    console.error("recaptcha", verified);
    return {
      statusCode: 401,
      body: {
        errors: [
          {
            key: "",
            message: "Recaptcha error"
          }
        ]
      }
    };
  }

  const currentQuestionData = await getDbItem({ id }, TABLE.MAIN)
    .catch((err) => {
      console.error(err);
      return null;
    })

  if (!currentQuestionData) {
    return {
      statusCode: 500,
      body: {
        errors: [
          {
            key: "",
            message: "Unable to fetch question"
          }
        ]
      }
    }
  }

  const finalData = {
    yes: currentQuestionData.yes,
    no: currentQuestionData.no
  };

  var updatedQuestionData = {
    ...finalData
  };

  if (answeredYes) {
    updatedQuestionData.yes = updatedQuestionData.yes + 1;
  } else {
    updatedQuestionData.no = updatedQuestionData.no + 1;
  }

  const resp = await updateDbItem({ id }, updatedQuestionData, TABLE.MAIN);

  return {
    statusCode: 200,
    body: finalData
  }
});

module.exports = {
  subscribeToList,
  postAnswer
}