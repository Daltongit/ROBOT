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

    // Inicializar el texto con la vista completa
    infoTitle.textContent = explorerData['r'].title;
    infoDesc.textContent = explorerData['r'].desc;

    const changeView = (key) => {
        const dataKey = key.toLowerCase();
        
        keys.forEach(k => k.classList.remove('active'));
        const targetBtn = document.querySelector(`.key[data-target="${dataKey}"]`);
        if(targetBtn) targetBtn.classList.add('active');

        if(explorerData[dataKey]) {
            infoTitle.textContent = explorerData[dataKey].title;
            infoDesc.innerHTML = explorerData[dataKey].desc;
        }

        setViewModel(dataKey);
        overlay.classList.add('hidden');
    };

    keys.forEach(key => {
        key.addEventListener('click', (e) => changeView(e.target.getAttribute('data-target')));
    });

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

    closeBtn.addEventListener('click', () => overlay.classList.add('hidden'));

    function showBudgetOverlay() {
        let tableHTML = `
            <h3>Componentes, Costos y Funciones</h3>
            <table>
                <thead>
                    <tr>
                        <th>Componente</th>
                        <th>Cant.</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
        `;
        budgetData.items.forEach(item => {
            tableHTML += `<tr><td>${item.item}</td><td>${item.qty}</td><td>${item.total}</td></tr>`;
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
