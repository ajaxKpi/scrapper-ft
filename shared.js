const nodemailer = require('nodemailer');
const config = require('./config');

// CSS Selectors
const SELECTORS = {
  DATE: '.performanceevents_item_info_date',
  EVENT_ITEM: '.performanceevents_item',
  BUTTON: '.button.hvr-shutter-out-horizontal',
  SVG_STATUS: '#svgStatus',
  TOOLTIP_BUTTON: '.tooltip-button'
};

/**
 * Sends email notification
 * @param {string} msg - Message to send
 */
async function sendEmailNotification(msg) {
  const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.secure,
    auth: config.email.auth,
  });

  const mailOptions = {
    from: config.email.from,
    to: config.email.to,
    subject: config.email.subject,
    text: msg,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error.message);
  }
}

module.exports = {
  SELECTORS,
  sendEmailNotification
}; 