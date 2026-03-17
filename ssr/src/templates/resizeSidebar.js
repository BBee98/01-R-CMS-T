const resizer = document.getElementById('resizer');
const sidebar = document.getElementById('sidebar');
let dragging = false, startX, startW;

resizer.addEventListener('mousedown', e => {
    dragging = true;
    startX = e.clientX;
    startW = sidebar.offsetWidth;
    resizer.classList.add('dragging');
    document.body.style.userSelect = 'none';
});

document.addEventListener('mousemove', e => {
    if (!dragging) return;
    const w = Math.min(Math.max(startW + e.clientX - startX, 120), 600);
    sidebar.style.width = w + 'px';
});

document.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    resizer.classList.remove('dragging');
    document.body.style.userSelect = '';
});
