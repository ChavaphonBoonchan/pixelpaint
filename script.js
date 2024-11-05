const canvas = document.getElementById('pixelCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;
let erasing = false;
let currentColor = '#000000';
let brushSize = 10;
let history = [];
let redoStack = [];

// ฟังก์ชันเลือกสีจากจานสี
function setColor() {
    currentColor = document.getElementById('colorPicker').value;
}

function setBrushSize() {
    brushSize = document.getElementById('brushSize').value;
}

function setCanvasSize() {
    const size = document.getElementById('canvasSize').value;
    if (size === '1:1') {
        canvas.width = 500;
        canvas.height = 500;
    } else if (size === '4:3') {
        canvas.width = 640;
        canvas.height = 480;
    } else if (size === '3:4') {
        canvas.width = 480;
        canvas.height = 640;
    }
    clearCanvas();
}

function setBrush() {
    drawing = true;
    erasing = false;
}

function setEraser() {
    drawing = false;
    erasing = true;
}

function saveHistory() {
    history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (history.length > 10) history.shift();
}

function undo() {
    if (history.length > 0) {
        redoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        ctx.putImageData(history.pop(), 0, 0);
    }
}

function redo() {
    if (redoStack.length > 0) {
        saveHistory();
        ctx.putImageData(redoStack.pop(), 0, 0);
    }
}

function startDrawing(event) {
    saveHistory();
    drawing = true;
    draw(event); // วาดทันทีเมื่อเริ่มสัมผัส
}

function stopDrawing() {
    drawing = false;
}

function draw(event) {
    if (!drawing) return;

    let rect = canvas.getBoundingClientRect();
    let x, y;

    if (event.type.includes('touch')) {
        x = Math.floor((event.touches[0].clientX - rect.left) / brushSize) * brushSize;
        y = Math.floor((event.touches[0].clientY - rect.top) / brushSize) * brushSize;
    } else {
        x = Math.floor((event.clientX - rect.left) / brushSize) * brushSize;
        y = Math.floor((event.clientY - rect.top) / brushSize) * brushSize;
    }

    ctx.fillStyle = erasing ? 'white' : currentColor;
    ctx.fillRect(x, y, brushSize, brushSize);
}

// Event Listener สำหรับคอมพิวเตอร์
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);

// Event Listener สำหรับหน้าจอสัมผัส
canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchmove', draw);

function saveImage() {
    const link = document.createElement('a');
    let fileName = prompt("Please enter your file name:");
    if (fileName == null || fileName === "") {
        alert("Save cancelled by user.");
    } else {
        link.download = fileName;
        link.href = canvas.toDataURL();
        link.click();
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    history = [];
    redoStack = [];
}

setCanvasSize();
