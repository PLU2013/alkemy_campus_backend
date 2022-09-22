async function query(
  dbFn,
  queryArg,
  msg = { code: 400, message: "bad request" },
  res,
  trueCode = 200
) {
  try {
    const query = await dbFn(...queryArg);
    return query.length != 0
      ? res.status(trueCode).json(query)
      : res.status(msg.code).json({ message: msg.message });
  } catch (err) {
    if (err.code == "ER_DUP_ENTRY") {
      console.log(
        `Error: duplicated email entry '${queryArg[2]}' at ${new Date()}`
      );
      return res.status(401).json({ message: "Duplicated email" });
    }
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
}

module.exports = {
  query,
};
