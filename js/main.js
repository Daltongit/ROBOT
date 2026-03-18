// js/main.js
import { initThreeJS, animateThreeJS, setViewModel } from './modelView.js';
import { componentsData, noveltyTextHTML } from './data.js';

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar el entorno 3D de Three.js
    initThreeJS();
    // 2. Iniciar el ciclo de animación (game loop)
    animateThreeJS();

    // 3. Inicializar las Interfaces de Usuario (Overlays)
    initOverlays();

    // 4. Inicializar el manejo del teclado para controles
    initKeyboardControls();
});

// --- Lógica de las Superposiciones (Overlays) ---
function initOverlays() {
    const componentListOverlay = document.getElementById('component-list-overlay');
    const noveltyOverlay = document.getElementById('novelty-overlay');

    // Manejar botones de cerrar
    document.getElementById('close-components').addEventListener('click', () => {
        componentListOverlay.classList.add('hidden');
    });
    document.getElementById('close-novelty').addEventListener('click', () => {
        noveltyOverlay.classList.add('hidden');
    });

    // Cerrar con ESC
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            componentListOverlay.classList.add('hidden');
            noveltyOverlay.classList.add('hidden');
        }
    });

    // Cargar los datos en los overlays desde js/data.js
    populateComponentTable();
    populateNoveltyText();
}

// --- Generar la tabla de componentes dinámicamente desde js/data.js ---
function populateComponentTable() {
    const tableContainer = document.getElementById('components-table-container');
    const totalCostValue = document.getElementById('total-cost-value');

    // Crear la estructura de la tabla HTML
    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Componente</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Total</th>
                    <th>Función (Extraído de Imagen 6)</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Llenar las filas con los datos transcritos
    componentsData.items.forEach(item => {
        tableHTML += `
            <tr>
                <td>${item.componente}</td>
                <td>${item.cantidad}</td>
                <td>${item.precio}</td>
                <td>${item.total}</td>
                <td>${item.funcion}</td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
    `;

    // Insertar la tabla en el contenedor del DOM
    tableContainer.innerHTML = tableHTML;
    // Actualizar el costo total
    totalCostValue.textContent = componentsData.total;
}

// --- Cargar el texto de novedad desde js/data.js ---
function populateNoveltyText() {
    const noveltyTextContainer = document.getElementById('novelty-text');
    noveltyTextContainer.innerHTML = noveltyTextHTML;
}

// --- Manejo del teclado para controles de vista e interfaz ---
function initKeyboardControls() {
    document.addEventListener('keydown', (event) => {
        const key = event.key.toLowerCase();

        // Ocultar overlays si se presiona cualquier tecla de control
        if (['1', '2', '3', '4', '5', '6', '7', '8', 'r', '9', 'f'].includes(key)) {
            document.querySelectorAll('.overlay').forEach(el => el.classList.add('hidden'));
        }

        switch (key) {
            case 'r': // Reiniciar Vista Completa
                setViewModel('full');
                break;
            case '1': // Motores
                setViewModel('motors');
                break;
            case '2': // ESP32-CAM
                setViewModel('esp32');
                break;
            case '3': // Baterías
                setViewModel('batteries');
                break;
            case '4': // Ultrasonico
                setViewModel('ultrasonic');
                break;
            case '5': // Sonido
                setViewModel('sound');
                break;
            case '6': // LDRs
                setViewModel('ldrs');
                break;
            case '7': // LEDs
                setViewModel('led');
                break;
            case '8': // Otros
                setViewModel('others');
                break;
            case '9': // Ver Presupuesto (Overlay)
                document.getElementById('component-list-overlay').classList.remove('hidden');
                break;
            case 'f': // Ver Novedad (Overlay)
                document.getElementById('novelty-overlay').classList.remove('hidden');
                break;
        }
    });
}
