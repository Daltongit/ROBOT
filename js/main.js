import { initThreeJS, animateThreeJS, isolateComponent } from './modelView.js';
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

    // 1. GENERAR LOS 16 BOTONES DINÁMICAMENTE DESDE LA DATA
    componentsList.forEach((comp) => {
        const btn = document.createElement('div');
        btn.className = 'comp-item';
        btn.dataset.id = comp.id;
        btn.innerHTML = `<strong>${comp.name}</strong>`;
        
        // Evento click
        btn.addEventListener('click', () => {
            // Estilo visual del botón
            document.querySelectorAll('.comp-item').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Actualizar panel y título flotante
            descText.innerHTML = `<strong style="color:#00bcd4;">Función:</strong> ${comp.func}`;
            floatingTitle.textContent = comp.name;
            floatingTitle.classList.remove('hidden');

            // Llamar a Three.js para ocultar el robot y mostrar la pieza
            isolateComponent(comp.id);
            overlay.classList.add('hidden');
        });

        listContainer.appendChild(btn);
    });

    // 2. BOTÓN DE VER ROBOT COMPLETO
    document.getElementById('btn-reset').addEventListener('click', () => {
        document.querySelectorAll('.comp-item').forEach(b => b.classList.remove('active'));
        descText.textContent = "Haz clic en cualquier componente de la lista inferior para extraerlo de la esfera y examinarlo en detalle.";
        floatingTitle.classList.add('hidden');
        isolateComponent('reset');
        overlay.classList.add('hidden');
    });

    // 3. BOTÓN DE PRESUPUESTO
    document.getElementById('btn-budget').addEventListener('click', () => {
        let tableHTML = `
            <h3 style="border:none; text-align:left; font-size:1.8rem; margin-top:0; color:#00bcd4;">Presupuesto de 16 Componentes</h3>
            <table>
                <thead>
                    <tr><th>Componente</th><th>Cant.</th><th>Total</th></tr>
                </thead>
                <tbody>
        `;
        componentsList.forEach(c => {
            tableHTML += `<tr><td>${c.name}</td><td>${c.qty}</td><td>${c.total}</td></tr>`;
        });
        tableHTML += `</tbody></table><div class="total-cost">Total Estimado: ${budgetTotal}</div>`;
        
        overlayBody.innerHTML = tableHTML;
        overlay.classList.remove('hidden');
    });

    // 4. BOTÓN DE NOVEDAD
    document.getElementById('btn-novelty').addEventListener('click', () => {
        overlayBody.innerHTML = noveltyText;
        overlay.classList.remove('hidden');
    });

    // CERRAR OVERLAYS
    document.getElementById('close-overlay').addEventListener('click', () => {
        overlay.classList.add('hidden');
    });
}
