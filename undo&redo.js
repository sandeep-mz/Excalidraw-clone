const undoStack = [];
const redoStack = [];

// Function to save the current canvas state to the undo stack
function saveCanvasState() {
    undoStack.push(canvas.toDataURL());
    redoStack.length = 0; // Clear the redo stack
}

// Implement undo functionality
const undoButton = document.getElementById('undo');
undoButton.addEventListener('click', () => {
    if (undoStack.length > 1) {

        // Move the current state to the redo stack
        redoStack.push(undoStack.pop()); 
        const snapshot = new Image();
        snapshot.src = undoStack[undoStack.length - 1];
        snapshot.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(snapshot, 0, 0);
        };
    }
});

// Implement redo functionality
const redoButton = document.getElementById('redo');
redoButton.addEventListener('click', () => {
    if (redoStack.length > 0) {
        const snapshot = new Image();
        snapshot.src = redoStack.pop();
        snapshot.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(snapshot, 0, 0);
            // Move the current state back to the undo stack
            undoStack.push(snapshot.src); 
        };
    }
});

// Add a function to clear the undo and redo stacks
function clearUndoRedoStacks() {
    undoStack.length = 0;
    redoStack.length = 0;
}

// Call saveCanvasState when drawing is done
canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    saveCanvasState();
});