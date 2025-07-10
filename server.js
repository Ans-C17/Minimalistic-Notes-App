const express = require('express');
const path = require('path');
const app = express();
app.use(express.json()); //makes express talented to understand the json requests sent to it

app.use(express.static(path.join(__dirname, 'public'))); //serves all static files from the public directory

const notesRouter = require('./routes/notes');
app.use('/api/notes', notesRouter);

app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.listen(3000, console.log("listening"));