const jwt = require('jsonwebtoken');
const constants = require('./../../appconstants.js');

module.exports.verifyJwtToken = (req, res, next) => {
  let token;
  if ('authorization' in req.headers)
    token = req.headers['authorization'].split(' ')[1];

  if (!token)
    return res.status(403).json({ success: false, auth: false, message: 'No token provided.' });
  else {
    jwt.verify(token, constants.config.JWT_SECRET,
      (err, decoded) => {
        if (err)
          return res.status(500).json({ success: false, auth: false, message: 'Token authentication failed.' });
        else {
          req._id = decoded._id;
          next();
        }
      }
    )
  }
}