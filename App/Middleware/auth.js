var Response = require('../Middleware/response');

let authController = {};

authController.apiAuth = function (req, res, next) {
      let api_key = req.body.api_key;
      if (!api_key || api_key != API_KEY) {
          return Response.sendDriverErrorResponse(req, res, ['Invalid Request']);
      }
      next();
};
authController.authTokken = function (req, res, next) {
    let api_key = req.query.api_key;
    if (!api_key || api_key != API_KEY) {
        return Response.sendDriverErrorResponse(req, res, ['Invalid Request']);
    }
    next();
};

module.exports = authController;