import { initThreeJS, animateThreeJS, setViewModel } from './modelView.js';
import { budgetData, noveltyText, explorerData } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    setupDashboardUI();
    animateThreeJS();
});

function setupDashboardUI() {
    const keys = document.querySelectorAll('.key');
    const infoTitle = document.getElementById('info-title');
    const infoDesc = document.getElementById('info-desc');
    const overlay = document.getElementById('overlay');
    const overlayBody = document.getElementById('overlay-body');
    const closeBtn = document.getElementById('close-overlay');

    const changeView = (key) => {
        const dataKey = key.toLowerCase();
        
        // Actualizar UI
        keys.forEach(k => k.classList.remove('active'));
        const targetBtn = document.querySelector(`.key[data-target="${dataKey}"]`);
        if(targetBtn) targetBtn.classList.add('active');

        if(explorerData[dataKey]) {
            infoTitle.textContent = explorerData[dataKey].title;
            infoDesc.textContent = explorerData[dataKey].desc;
        }

        // Llamar a la función del modelo 3D
        setViewModel(dataKey);
        
        overlay.classList.add('hidden');
    };

    // Eventos Click
    keys.forEach(key => {
        key.addEventListener('click', (e) => changeView(e.target.getAttribute('data-target')));
    });

    // Eventos Teclado
    document.addEventListener('keydown', (event) => {
        const key = event.key.toLowerCase();
        if(['1','2','3','4','5','6','7','8','r'].includes(key)) {
            changeView(key);
        } else if(key === '9') {
            showBudgetOverlay();
        } else if(key === 'f') {
            showNoveltyOverlay();
        } else if(key === 'escape') {
            overlay.classList.add('hidden');
        }
    });

    // Cerrar Overlay
    closeBtn.addEventListener('click', () => overlay.classList.add('hidden'));

    function showBudgetOverlay() {
        let tableHTML = `
            <h3>Componentes y Presupuesto</h3>
            <table>
                <thead>
                    <tr>
                        <th>Componente</th>
                        <th>Cantidad</th>
                        <th>Precio Unit.</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
        `;
        budgetData.items.forEach(item => {
            tableHTML += `<tr><td>${item.item}</td><td>${item.qty}</td><td>${item.cost}</td><td>${item.total}</td></tr>`;
        });
        tableHTML += `</tbody></table><div class="total-cost">Total Estimado: ${budgetData.total}</div>`;
        overlayBody.innerHTML = tableHTML;
        overlay.classList.remove('hidden');
    }

    function showNoveltyOverlay() {
        overlayBody.innerHTML = noveltyText;
        overlay.classList.remove('hidden');
    }
}
