export function errorHandler(error, _request, response, _next) {
  console.error(error);
  response.status(error.status ?? 500).json({ error: error.status ? error.message : 'Unexpected server error.' });
}
