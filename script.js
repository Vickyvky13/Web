const express = require('express');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(express.static(path.join(__dirname, 'assets')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'price.html')); // Serve your HTML file
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
});