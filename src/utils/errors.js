function errorHandler(err, _req, res, _next) {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ error: { code: "INVALID_JSON", message: "Request body contains invalid JSON" } });
  }
  console.error(err);
  return res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Unexpected server error" } });
}

function sendError(res, status, code, message) {
  return res.status(status).json({ error: { code, message } });
}

module.exports = { errorHandler, sendError };
