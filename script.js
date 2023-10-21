// Get the canvas element and its 2D drawing context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1550; // Set the width in pixels
canvas.height = 740; // Set the height in pixels

// Set the drawing properties (e.g., line color, width)
ctx.strokeStyle = 'black';
ctx.lineWidth = 2;

// Variables to track mouse position
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Event listeners for mouse interactions
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top];
});

canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => (isDrawing = false));
canvas.addEventListener('mouseout', () => (isDrawing = false));

// Function to draw on the canvas
function draw(e) {
    if (!isDrawing) return;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    const x = e.clientX - canvas.getBoundingClientRect().left;
    const y = e.clientY - canvas.getBoundingClientRect().top;
    ctx.lineTo(x, y);
    ctx.stroke();
    [lastX, lastY] = [x, y];
}