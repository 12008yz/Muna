const { ValidationError, UniqueConstraintError } = require('sequelize');

/**
 * @param {Error & { statusCode?: number }} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err instanceof ValidationError || err instanceof UniqueConstraintError) {
    const msg =
      err.errors && err.errors.length
        ? err.errors.map((e) => e.message).join('; ')
        : err.message || 'Validation error';
    // eslint-disable-next-line no-console
    console.error('[error] sequelize validation', { path: req.path, msg });
    return res.status(400).json({ success: false, error: msg });
  }

  const statusCode = err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 500;
  const message =
    typeof err?.message === 'string' && err.message ? err.message : 'Internal Server Error';

  // eslint-disable-next-line no-console
  console.error('[error]', { path: req.path, method: req.method, statusCode, message, stack: err.stack });

  res.status(statusCode).json({
    success: false,
    error: message,
  });
}

module.exports = { errorHandler };
