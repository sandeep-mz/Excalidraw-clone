const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 800; // Set the width in pixels
canvas.height = 600; // Set the height in pixels

let isDrawing = false;
let lastX = 0;
let lastY = 0;

const shapes = [];
let currentShape = null;
let selectedShape = null;

const history = [];
let historyIndex = -1;

function drawShape(shape) {
    if (shape.type === 'rectangle') {
        ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === 'circle') {
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
        ctx.fill();
    } else if (shape.type === 'triangle') {
        ctx.beginPath();
        ctx.moveTo(shape.x, shape.y);
        ctx.lineTo(shape.x + shape.width, shape.y);
        ctx.lineTo(shape.x + shape.width / 2, shape.y - shape.height);
        ctx.fill();
    }
}

canvas.addEventListener('mousedown', (e) => {
    const x = e.offsetX;
    const y = e.offsetY;

    // Check if the click is inside any of the shapes
    selectedShape = null;
    for (let shape of shapes) {
        if (
            (shape.type === 'rectangle' &&
                x >= shape.x && x <= shape.x + shape.width &&
                y >= shape.y && y <= shape.y + shape.height) ||
            (shape.type === 'circle' &&
                Math.sqrt((x - shape.x) ** 2 + (y - shape.y) ** 2) <= shape.radius) ||
            (shape.type === 'triangle' &&
                x >= shape.x && x <= shape.x + shape.width &&
                y >= shape.y - shape.height && y <= shape.y)
        ) {
            selectedShape = shape;
            break;
        }
    }

    if (!selectedShape) {
        isDrawing = true;
        lastX = x;
        lastY = y;

        currentShape = {
            type: 'rectangle', // Default shape is a rectangle
            x: x,
            y: y,
            width: 0,
            height: 0,
            radius: 0,
        };
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;

    const x = e.offsetX;
    const y = e.offsetY;

    currentShape.width = x - currentShape.x;
    currentShape.height = y - currentShape.y;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let shape of shapes) {
        ctx.fillStyle = 'blue';
        drawShape(shape);
    }

    ctx.fillStyle = 'red';
    drawShape(currentShape);
});

canvas.addEventListener('mouseup', () => {
    if (!isDrawing) return;
    isDrawing = false;

    if (currentShape.width === 0 && currentShape.height === 0 && currentShape.radius === 0) {
        return; // Ignore empty shapes
    }

    // Add the current shape to the shapes array
    shapes.push({ ...currentShape });
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw all shapes
    for (let shape of shapes) {
        ctx.fillStyle = 'blue';
        drawShape(shape);
    }

    // Add the current action to the history
    history.splice(historyIndex + 1);
    history.push({
        type: 'draw',
        shape: { ...currentShape },
    });
    historyIndex++;

    currentShape = null;
});

function undo() {
    if (historyIndex >= 0) {
        // Remove the last action
        history.pop();
        historyIndex--;
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw all shapes except the undone one
        for (let i = 0; i <= historyIndex; i++) {
            const action = history[i];
            if (action.type === 'draw') {
                ctx.fillStyle = 'blue';
                drawShape(action.shape);
            }
        }
    }
}

function redo() {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        const action = history[historyIndex];
        if (action.type === 'draw') {
            // Draw the shape associated with the action
            ctx.fillStyle = 'blue';
            drawShape(action.shape);
        }
    }
}

// Event listeners for undo and redo buttons
const undoButton = document.getElementById('undo-button');
const redoButton = document.getElementById('redo-button');

undoButton.addEventListener('click', undo);
redoButton.addEventListener('click', redo);
