async function query(
  dbFn,
  queryArg,
  msg = { code: 400, message: "bad request" },
  res,
  trueCode = 200
) {
  try {
    return await dbFn(...queryArg);
  } catch (err) {
    if (err.code == "ER_DUP_ENTRY") {
      console.log(
        `Error: duplicated email entry '${queryArg[2]}' at ${new Date()}`
      );
      return { code: 406, error: "Duplicated email" };
    }
    console.log(err);
    return { code: 500, error: "Server Error" };
  }
}

function sendResponse(res, queryRes, msg, trueCode = 200) {
  if (!queryRes.hasOwnProperty("error")) {
    return queryRes.length != 0
      ? res.status(trueCode).json(queryRes)
      : res.status(msg.code).send({ message: msg.message });
  }

  return res.status(queryRes.code).send({ message: queryRes.error });
}

module.exports = {
  query,
  sendResponse,
};
