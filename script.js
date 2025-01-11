//Initialisierung der Listen:
// To-Do- und Papierkorblisten aus localStorage laden. Wenn keine vorhanden sind, leere Arrays erstellen.
let todoList = JSON.parse(localStorage.getItem('todoList')) || [];
let trashList = JSON.parse(localStorage.getItem('trashList')) || [];

//DOM-Elemente:
// Referenzen zu den DOM-Elementen der To-Do-Liste, Papierkorb-Liste, Eingabefeld und dem Hinzufügen-Button
const todoListElement = document.getElementById('todoList');
const trashListElement = document.getElementById('trashList');
const newTodoInput = document.getElementById('newTodo');
const addBtn = document.getElementById('addBtn');

//To-Do hinzufügen:
// Event-Listener für den Hinzufügen-Button
addBtn.addEventListener('click', () => {
    const newTodo = newTodoInput.value.trim(); // Entfernt Leerzeichen am Anfang und Ende der Eingabe
    if (newTodo) { // Nur hinzufügen, wenn das Eingabefeld nicht leer ist
        todoList.push(newTodo); // Neue Aufgabe zur Liste hinzufügen
        newTodoInput.value = ''; // Eingabefeld zurücksetzen
        saveLists(); // Änderungen in localStorage speichern
        renderLists(); // Liste neu anzeigen
    }
});

//To-Do löschen:
// Aufgabe aus der To-Do-Liste entfernen und in den Papierkorb verschieben
function deleteTodo(index) {
    const deletedTodo = todoList.splice(index, 1)[0]; // Entferne die Aufgabe aus der To-Do-Liste
    trashList.push(deletedTodo); // Verschiebe die gelöschte Aufgabe in die Papierkorbliste
    saveLists(); // Änderungen in localStorage speichern
    renderLists(); // Liste neu anzeigen
}

//To-Do wiederherstellen:
// Aufgabe aus dem Papierkorb wiederherstellen und zurück in die To-Do-Liste verschieben
function restoreTodo(index) {
    const restoredTodo = trashList.splice(index, 1)[0]; // Entferne die Aufgabe aus dem Papierkorb
    todoList.push(restoredTodo); // Füge sie der To-Do-Liste hinzu
    saveLists(); // Änderungen in localStorage speichern
    renderLists(); // Listen neu anzeigen
}

//Speichern der Listen:
// Speichert die aktuellen Zustände von To-Do- und Papierkorbliste in localStorage
function saveLists() {
    localStorage.setItem('todoList', JSON.stringify(todoList));
    localStorage.setItem('trashList', JSON.stringify(trashList));
}

//Listen rendern:
// Rendern der To-Do- und Papierkorblisten im DOM
function renderLists() {
    // To-Do-Liste rendern
    todoListElement.innerHTML = ''; // Liste leeren
    todoList.forEach((todo, index) => {
        const li = document.createElement('li');

        // Text der Aufgabe in ein span-Element einfügen
        const span = document.createElement('span');
        span.textContent = todo;

        // Löschen-Button erstellen
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Löschen';
        deleteBtn.onclick = () => deleteTodo(index);

        // Bearbeiten-Button erstellen
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Bearbeiten';
        editBtn.onclick = () => editTodo(index);

        // Elemente in das Listenelement einfügen
        li.appendChild(span); // Text
        li.appendChild(editBtn); // Bearbeiten-Button
        li.appendChild(deleteBtn); // Löschen-Button
        todoListElement.appendChild(li);
    });

    // Papierkorb rendern
    trashListElement.innerHTML = ''; // Liste leeren
    trashList.forEach((todo, index) => {
        const li = document.createElement('li');

        // Text der Aufgabe in ein span-Element einfügen
        const span = document.createElement('span');
        span.textContent = todo;

        // Wiederherstellen-Button erstellen
        const restoreBtn = document.createElement('button');
        restoreBtn.textContent = 'Wiederherstellen';
        restoreBtn.onclick = () => restoreTodo(index);

        // Elemente in das Listenelement einfügen
        li.appendChild(span); // Text
        li.appendChild(restoreBtn); // Wiederherstellen-Button
        trashListElement.appendChild(li);
    });
}

//To-Do bearbeiten:
// Ermöglicht das Bearbeiten einer bestehenden Aufgabe
function editTodo(index) {
    const li = todoListElement.children[index]; // Hole das entsprechende Listenelement
    const currentText = todoList[index]; // Hole den aktuellen Text der Aufgabe

    // Erstelle ein Eingabefeld mit dem aktuellen Text
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;

    // Erstelle einen Speichern-Button
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Speichern';

    // Entferne den alten Inhalt des Listenelements und füge die Bearbeitungselemente hinzu
    li.innerHTML = '';
    li.appendChild(input);
    li.appendChild(saveBtn);

    // Speichern der Änderungen
    saveBtn.onclick = () => {
        const updatedText = input.value.trim(); // Aktualisierter Text ohne Leerzeichen
        if (updatedText) {
            todoList[index] = updatedText; // Aufgabe in der Liste aktualisieren
            saveLists(); // Änderungen in localStorage speichern
            renderLists(); // Listen neu rendern
        }
    };
}

//Initiales Rendern:
// Beim Laden der Seite die gespeicherten Listen anzeigen
renderLists();
