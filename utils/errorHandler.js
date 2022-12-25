const errorHandler = (err, req, res, next) => {
  return res.status(400).json(err.message);
};

module.exports = errorHandler;
