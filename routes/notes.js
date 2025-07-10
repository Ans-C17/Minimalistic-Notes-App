const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const notesPath = path.join(__dirname, '../data.json');

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

router.patch('/:id', (req, res) => {
    const id = +req.params.id;
    const {title, noteBody} = req.body;
    const notes = readNotes();
    const index = notes.findIndex(note => note.id === id);
    if (index == -1) return res.status(404).send("Note not found");
    notes[index].title = title;
    notes[index].noteBody = noteBody;
    fs.writeFileSync(notesPath, JSON.stringify(notes, '', 2));
    res.status(200).send("Note updated");
})

router.delete('/:id', (req, res) => {
    const id = +req.params.id;
    const notes = readNotes();
    const updated = notes.filter(note => note.id !== id);
    fs.writeFileSync(notesPath, JSON.stringify(updated, '', 2))
    res.status(204).send('Note deleted');
})

module.exports = router;
