var Response = require('./response');

let authController = {};

authController.apiAuth = function (req, res, next) {
      let api_key = req.query.api_key;
      if (!api_key || api_key != API_KEY) {
          return Response.sendErrorResponse(req, res, ['Invalid Request']);
      }
      next();
};

module.exports = authController;