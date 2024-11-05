const canvas = document.getElementById('pixelCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;
let erasing = false;
let currentColor = '#000000'; // สีเริ่มต้นคือสีดำ
let brushSize = 10; // ขนาดเริ่มต้นของแปรง
let history = [];
let redoStack = [];

// ฟังก์ชันเลือกสีจากจานสี
function setColor() {
    currentColor = document.getElementById('colorPicker').value;
}

// ฟังก์ชันกำหนดขนาดแปรง
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
    if (history.length > 10) history.shift(); // จำกัดประวัติ
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

canvas.addEventListener('mousedown', () => {
    saveHistory();
    drawing = true;
});

canvas.addEventListener('mouseup', () => {
    drawing = false;
});

canvas.addEventListener('mousemove', draw);

function draw(e) {
    if (!drawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / brushSize) * brushSize;
    const y = Math.floor((e.clientY - rect.top) / brushSize) * brushSize;

    ctx.fillStyle = erasing ? 'white' : currentColor;
    ctx.fillRect(x, y, brushSize, brushSize); // วาดสี่เหลี่ยมแบบพิกเซล
}


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

setCanvasSize(); // ตั้งค่าเริ่มต้น
