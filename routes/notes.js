const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const notesPath = path.join(__dirname, '../data.js');

function saveNotes(newNote){
    const notes = fs.readFileSync(notesPath, 'utf-8');
    const notesArray = JSON.parse(notes);
    notesArray.push(newNote);
    fs.writeFileSync(notesPath, JSON.stringify(notesArray, '', 2));
}

function readNotes(){
    const notes = fs.readFileSync(notesPath, 'utf-8');
    const notesArray = JSON.parse(notes);
    return notesArray;
}

router.post('/', (req, res) => {
    const id = Date.now();
    const title = req.body.title.trim();
    const noteBody = req.body.noteBody.trim();
    saveNotes({ id, title, noteBody });
    res.status(201).send('Note received');
});

router.get('/', (req, res) => {
    const notes = readNotes();
    res.status(200).json(notes);
})

router.delete('/:id', (req, res) => {
    const id = +req.params.id;
    const notes = readNotes();
    const updated = notes.filter(note => note.id !== id);
    fs.writeFileSync(notesPath, JSON.stringify(updated, '', 2))
    res.status(204).send('Note deleted');
})

module.exports = router;