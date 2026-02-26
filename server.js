require('dotenv').config();
const app = require('./server/app');
const db = require('./server/config/db');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Access the app at http://localhost:${PORT}`);
});

module.exports = app;
