const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Основний роут для перевірки статусу
app.get('/', (req, res) => {
  res.send('Scraper is running');
});

// Запуск скрапера
require('./event-ft');

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 