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

    // Inicializar el texto con la vista completa R
    infoTitle.textContent = explorerData['r'].title;
    infoDesc.textContent = explorerData['r'].desc;

    // Función unificada para cambiar de vista (isolar componentes)
    const changeView = (key) => {
        const dataKey = key.toLowerCase();
        
        // Actualizar Teclado Numérico
        keys.forEach(k => k.classList.remove('active'));
        const targetBtn = document.querySelector(`.key[data-target="${dataKey}"]`);
        if(targetBtn) targetBtn.classList.add('active');

        // Actualizar Textos del Explorador (js/data.js)
        if(explorerData[dataKey]) {
            infoTitle.textContent = explorerData[dataKey].title;
            infoDesc.innerHTML = explorerData[dataKey].desc; // Use innerHTML to allow "¿Por qué lo necesitamos?" formatting
        }

        // Mover Cámara (Movimiento directo profesional)
        setViewModel(dataKey);
        
        // Ocultar overlays si se presiona una tecla de vista
        overlay.classList.add('hidden');
    };

    // CLICKS EN TECLADO DEL DASHBOARD
    keys.forEach(key => {
        key.addEventListener('click', (e) => changeView(e.target.getAttribute('data-target')));
    });

    // TECLADO FÍSICO CONTROLS
    document.addEventListener('keydown', (event) => {
        const key = event.key.toLowerCase();
        
        // Cambios de Vista [1-8, R]
        if(['1','2','3','4','5','6','7','8','r'].includes(key)) {
            changeView(key);
        }
        // Overlays [9, F, Escape]
        else if(key === '9') {
            showBudgetOverlay();
        } else if(key === 'f') {
            showNoveltyOverlay();
        } else if(key === 'escape') {
            overlay.classList.add('hidden');
        }
    });

    // Lógica de Overlays profesionales
    closeBtn.addEventListener('click', () => overlay.classList.add('hidden'));

    function showBudgetOverlay() {
        // Generar tabla fotorrealista (datos completas de Excel image_11.png en js/data.js)
        let tableHTML = `
            <h3>Lista de Componentes y Presupuesto Fotorrealista Detailed</h3>
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
            tableHTML += `
                <tr>
                    <td>${item.item}</td>
                    <td>${item.qty}</td>
                    <td>${item.cost}</td>
                    <td>${item.total}</td>
                </tr>
            `;
        });
        tableHTML += `
                </tbody>
            </table>
            <div class="total-cost">Total Estimado Fotorrealista Detailed: ${budgetData.total}</div>
        `;
        overlayBody.innerHTML = tableHTML;
        overlay.classList.remove('hidden');
    }

    function showNoveltyOverlay() {
        // Cargar texto de novedad fotorrealista detailed (js/data.js)
        overlayBody.innerHTML = noveltyText;
        overlay.classList.remove('hidden');
    }
}
