//DOM VARS
const main = document.getElementById('home');
const create = document.getElementById('create');
const view = document.getElementById('view');
const edit = document.getElementById('edit');

const createBtn = document.getElementById('createBtn');
const viewBtn = document.getElementById('viewBtn');
const viewNoteLoader = document.getElementById('viewNoteLoader');

const saveBtn = document.getElementById('saveBtn');
const editSaveBtn = document.getElementById('editSaveBtn');
const backBtn = document.getElementById('backBtn');
const viewBackBtn = document.getElementById('viewBackBtn');
const editCancelBtn = document.getElementById('editCancelBtn');

const editTitle = document.getElementById('editTitle');
const editTextSpace = document.getElementById('editTextSpace');

//------------------------------------------------------------------------------------------------------------------

//FUNCTIONS
function goHome() {
    main.classList.remove('hidden');
    create.classList.add('hidden');
    view.classList.add('hidden');
}

function animateIn(element) {
    requestAnimationFrame(() => {
        element.classList.remove('opacity-0', 'scale-50');
        element.classList.add('opacity-100', 'scale-100');
    })
}

function animateOut(element, callback) {
    element.classList.remove('opacity-100', 'scale-100');
    element.classList.add('opacity-0', 'scale-50');
    setTimeout(callback, 150);
}

const ul = document.getElementById('ul');
async function renderNotes() {
    viewNoteLoader.classList.remove('hidden');
    ul.classList.add('hidden');

    const response = await fetch('/api/notes');
    const notes = await response.json();
    ul.innerHTML = '';

    if (notes.length === 0) {
        const li = document.createElement('li');
        li.className = 'text-white font-mono text-3xl text-center py-[25%] col-span-12 w-full';
        li.textContent = 'No Notes To Show, Start Writing! ✏️';
        ul.appendChild(li);
    }

    notes.forEach(note => {
        const li = document.createElement('li');
        li.className = "transition ease-in-out duration-150 grid grid-cols-12 space-x-2 px-6 text-xl";

        const span1 = document.createElement('span');
        span1.dataset.id = note.id;
        const img1 = document.createElement('img');
        img1.src = './assets/edit.svg';
        img1.className = 'mx-auto'
        span1.appendChild(img1);
        span1.className = "edit-btn rounded-md py-2 col-span-1 text-center cursor-pointer hover:scale-150 transition"

        const span2 = document.createElement('span');
        span2.textContent = note.title;
        span2.className = "border-2 border-gray-700 rounded-md py-2 col-span-10 text-center hover:cursor-default"

        const span3 = document.createElement('span');
        span3.dataset.id = note.id;
        const img2 = document.createElement('img');
        img2.src = './assets/delete.svg';
        img2.className = 'mx-auto'
        span3.appendChild(img2);
        span3.className = "delete-btn rounded-md py-2 col-span-1 text-center cursor-pointer hover:scale-150 transition"

        li.append(span1, span2, span3);
        ul.appendChild(li);
    })

    setTimeout(() => {
        viewNoteLoader.classList.add('hidden');
        ul.classList.remove('hidden');
    }, 400);
}

async function fillNote(id){
    const response = await fetch('/api/notes');
    const notes = await response.json();

    notes.forEach((note) => {
        if(note.id == id){
            editTitle.value = note.title;
            editTextSpace.value = note.noteBody;
        }
    })
}

function createNote(animate = false) {
    main.classList.add('hidden');
    create.classList.remove('hidden');

    if (animate) {
        create.classList.remove('opacity-100', 'scale-100');
        create.classList.add('opacity-0', 'scale-50');
        animateIn(create);
    }
    else {
        create.classList.remove('opacity-0', 'scale-50');
        create.classList.add('opacity-100', 'scale-100');
    }
}

function viewNotes(animate = false) {
    main.classList.add('hidden');
    view.classList.remove('hidden');

    if (animate) {
        animateIn(view);
    }
    else {
        view.classList.remove('opacity-0', 'scale-50');
        view.classList.add('opacity-100', 'scale-100');
    }
    renderNotes();
}

async function deleteNotes(id, li) {
    const response = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
    if (response.ok) {
        animateOut(li, () => { li.remove() })
    }
}

function editNote(animate = false, id){
    fillNote(id);

    main.classList.add('hidden');
    create.classList.add('hidden');
    view.classList.add('hidden');
    edit.classList.remove('hidden');

    if (animate) {
        edit.classList.remove('opacity-100', 'scale-100');
        edit.classList.add('opacity-0', 'scale-50');
        animateIn(edit);
    }
    else {
        edit.classList.remove('opacity-0', 'scale-50');
        edit.classList.add('opacity-100', 'scale-100');
    }

}

//route handler function
function handleRoute(path) {
    if (path === '/create') createNote(false);
    else if (path === '/view') viewNotes(false);
    else if (path === '/edit') editNote(false, id);
    else goHome();
}

//------------------------------------------------------------------------------------------------------------------

//EVENT LISTENERS
createBtn.addEventListener("click", () => {
    history.pushState({ page: 'create' }, '', '/create');
    createNote(true);
})

saveBtn.addEventListener('click', async () => {
    const title = document.getElementById('title').value.trim();
    const noteBody = document.getElementById('textSpace').value.trim();

    if (!title || !noteBody) {
        alert("Can't save an empty note");
        return;
    }

    try {
        const response = await fetch('/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, noteBody })
        })

        if (response.ok) {
            animateOut(create, () => {
                history.back();
                document.querySelector('#create input').value = '';
                document.querySelector('#create textarea').value = '';
                alert("Note saved successfully");
            })
        } else {
            const errorMsg = await response.text();
            alert("Error while saving note");
            console.log(`Error: ${errorMsg}`);
        }
    } catch (error) {
        console.error("error:", error);
        alert('Error! Not able to save!');
    }

})

backBtn.addEventListener("click", () => animateOut(create, () => {
    history.back();
    document.querySelector('#create input').value = '';
    document.querySelector('#create textarea').value = '';
}));

viewBtn.addEventListener("click", () => {
    history.pushState({ page: 'view' }, '', '/view');
    viewNotes(true);
});

viewBackBtn.addEventListener("click", () => animateOut(view, () => {
    history.back();
}))

ul.addEventListener("click", (e) => {
    const deleteBtn = e.target.closest('.delete-btn');
    const editBtn = e.target.closest('.edit-btn');
    const li = e.target.closest('li');
    if (deleteBtn) deleteNotes(deleteBtn.dataset.id, li);
    if (editBtn) {
        history.pushState({ page: 'edit' }, '', `/edit/${editBtn.dataset.id}`);
        editNote(true, editBtn.dataset.id);
    }
})

editSaveBtn.addEventListener("click", async () => {
    try {
        const pathPart = window.location.pathname.split('/');
        const urlID = +pathPart[pathPart.length - 1];

        const response = await fetch(`/api/notes/${urlID}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: editTitle.value, noteBody: editTextSpace.value })
        })

        if (response.ok) {
            animateOut(edit, () => {
                history.back();
                alert("Note updated successfully");
            })
        } else {
            const errorMsg = await response.text();
            alert("Error while saving note");
            console.log(`Error: ${errorMsg}`);
        }
    } catch (error) {
        console.error("error:", error);
        alert('Error! Not able to save!');
    }
})

editCancelBtn.addEventListener("click", () => animateOut(edit, () => {
    history.back();
}))

//------------------------------------------------------------------------------------------------------------------

//controlling browser buttons as we add to history stack using pushstate
window.addEventListener('popstate', () => handleRoute(window.location.pathname));

//page load for manual traversal or reload
//why? app js is loaded from top down everytime when these scenarios happen
//so browser should navigate to that place before user can see the dom
handleRoute(window.location.pathname);

//show the DOM only after setting up DOM (JS reads from top to bottom, 
//sets everything above this, and then onnly unhides body)
document.body.classList.remove("hidden");
