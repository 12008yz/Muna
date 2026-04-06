const { getPrivacyPolicyMeta, getPrivacyPolicyText } = require('../services/legal.service');

async function getPrivacy(req, res, next) {
  try {
    const meta = getPrivacyPolicyMeta();
    const text = getPrivacyPolicyText();
    res.status(200).json({
      success: true,
      data: {
        ...meta,
        text,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getPrivacy };
