require('dotenv').config();

module.exports = {
  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO.split(','),
    subject: process.env.EMAIL_SUBJECT
  },
  urls: {
    largeSceneUrl: 'https://ft.org.ua/performances/buna',
    smallSceneUrl: 'https://ft.org.ua/performances/buna'
  },
  checkInterval: 2 * 60 * 1000, // 2 minutes in milliseconds
  minAvailableTickets: 2
}; 