document.querySelectorAll('.polaroid').forEach((photo) => {
    photo.setAttribute('style', `transform: rotate(${Math.random() * 5 * 2 - 5}deg); top: ${Math.random() * 5 * 2 - 5}px; left: ${Math.random() * 5 * 2 - 5}px;`);
});

const drawingRotation = 8;
const drawingPosition = 5;

document.querySelectorAll('.drawing').forEach((photo) => {
    photo.setAttribute('style', `transform: rotate(${Math.random() * drawingRotation * 2 - drawingRotation}deg); top: ${Math.random() * drawingPosition * 2 - drawingPosition}px; left: ${Math.random() * drawingPosition * 2 - drawingPosition}px;`);
});