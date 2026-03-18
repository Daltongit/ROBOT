import { initThreeJS, animateThreeJS, isolateComponent, driveState } from './modelView.js';
import { componentsList, budgetTotal, noveltyText } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    setupDashboardUI();
    animateThreeJS();
});

function setupDashboardUI() {
    const listContainer = document.getElementById('component-list');
    const descText = document.getElementById('info-desc');
    const floatingTitle = document.getElementById('floating-title');
    const overlay = document.getElementById('overlay');
    const overlayBody = document.getElementById('overlay-body');

    // 1. GENERAR LOS 16 BOTONES DINÁMICAMENTE
    componentsList.forEach((comp) => {
        const btn = document.createElement('div');
        btn.className = 'comp-item';
        btn.dataset.id = comp.id;
        btn.innerHTML = `<strong>${comp.name}</strong>`;
        
        btn.addEventListener('click', () => {
            document.querySelectorAll('.comp-item').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            descText.innerHTML = `<strong style="color:#00bcd4;">Función:</strong> ${comp.func}`;
            floatingTitle.textContent = comp.name;
            floatingTitle.classList.remove('hidden');

            isolateComponent(comp.id);
            overlay.classList.add('hidden');
        });
        listContainer.appendChild(btn);
    });

    // 2. BOTONES DE ACCIÓN
    document.getElementById('btn-reset').addEventListener('click', () => {
        document.querySelectorAll('.comp-item').forEach(b => b.classList.remove('active'));
        descText.textContent = "Haz clic en cualquier componente de la lista inferior para extraerlo de la esfera y examinarlo en detalle.";
        floatingTitle.classList.add('hidden');
        isolateComponent('reset');
        overlay.classList.add('hidden');
    });

    document.getElementById('btn-budget').addEventListener('click', () => {
        let tableHTML = `
            <h3 style="border:none; text-align:left; font-size:1.8rem; margin-top:0; color:#00bcd4;">Presupuesto Completo</h3>
            <table><thead><tr><th>Componente</th><th>Cant.</th><th>Total</th></tr></thead><tbody>
        `;
        componentsList.forEach(c => tableHTML += `<tr><td>${c.name}</td><td>${c.qty}</td><td>${c.total}</td></tr>`);
        tableHTML += `</tbody></table><div class="total-cost">Total Estimado: ${budgetTotal}</div>`;
        overlayBody.innerHTML = tableHTML;
        overlay.classList.remove('hidden');
    });

    document.getElementById('btn-novelty').addEventListener('click', () => {
        overlayBody.innerHTML = noveltyText;
        overlay.classList.remove('hidden');
    });

    document.getElementById('close-overlay').addEventListener('click', () => overlay.classList.add('hidden'));

    // 3. CONTROLES DE CONDUCCIÓN (TECLADO)
    document.addEventListener('keydown', (event) => {
        const key = event.key; // Original (Detecta mayúsculas/minúsculas y flechas)
        const lowerKey = key.toLowerCase(); // Para las teclas de menú (Escape, etc.)
        
        // Conducir: Flechas o W, A, S, D
        if (['ArrowUp', 'w', 'W'].includes(key)) driveState.forward = 1;     // Adelante
        if (['ArrowDown', 's', 'S'].includes(key)) driveState.forward = -1;  // Reversa
        if (['ArrowLeft', 'a', 'A'].includes(key)) driveState.turn = 1;      // Girar Izquierda
        if (['ArrowRight', 'd', 'D'].includes(key)) driveState.turn = -1;    // Girar Derecha

        // Cerrar menús
        if(lowerKey === 'escape') {
            overlay.classList.add('hidden');
        }
    });

    // Detener el robot al soltar la tecla
    document.addEventListener('keyup', (event) => {
        const key = event.key;
        if (['ArrowUp', 'w', 'W', 'ArrowDown', 's', 'S'].includes(key)) driveState.forward = 0;
        if (['ArrowLeft', 'a', 'A', 'ArrowRight', 'd', 'D'].includes(key)) driveState.turn = 0;
    });
}
