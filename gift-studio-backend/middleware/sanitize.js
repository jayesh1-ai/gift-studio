// Stops NoSQL injection: removes any key that starts with "$" or contains "."
// from the request body (for example {"price": {"$gt": 0}} becomes {"price": {}}).
function strip(value) {
  if (!value || typeof value !== "object") return;

  for (const key of Object.keys(value)) {
    if (key.startsWith("$") || key.includes(".")) {
      delete value[key];
    } else {
      strip(value[key]);
    }
  }
}

function sanitizeBody(req, res, next) {
  strip(req.body);
  next();
}

module.exports = sanitizeBody;
