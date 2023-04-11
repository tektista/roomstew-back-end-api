/* Description: any errors that occur are passed through here and returned to the client */
const errorHandler = (err, req, res, next) => {
  return res.status(400).json(err.message);
};

module.exports = errorHandler;
