// js/main.js
import { initThreeJS, animateThreeJS, setViewModel } from './modelView.js';
import { componentsData, noveltyTextHTML } from './data.js';

// Esperar a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar el entorno 3D
    initThreeJS();
    animateThreeJS();

    // 2. Inicializar las Interfaces de Usuario (Overlays)
    initOverlays();

    // 3. Inicializar el manejo del teclado
    initKeyboardControls();
});

// --- Lógica de las Superposiciones (Overlays) ---
function initOverlays() {
    const componentListOverlay = document.getElementById('component-list-overlay');
    const noveltyOverlay = document.getElementById('novelty-overlay');

    // Botones de cerrar
    document.getElementById('close-components').addEventListener('click', () => {
        componentListOverlay.classList.add('hidden');
    });
    document.getElementById('close-novelty').addEventListener('click', () => {
        noveltyOverlay.classList.add('hidden');
    });

    // Cargar los datos en los overlays
    populateComponentTable();
    populateNoveltyText();
}

// --- Generar la tabla de componentes dinámicamente ---
function populateComponentTable() {
    const tableContainer = document.getElementById('components-table-container');
    const totalCostValue = document.getElementById('total-cost-value');

    // Crear la tabla HTML
    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Componente</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Total</th>
                    <th>Función</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Llenar filas
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

    // Insertar en el DOM
    tableContainer.innerHTML = tableHTML;
    totalCostValue.textContent = componentsData.total;
}

// --- Cargar el texto de novedad ---
function populateNoveltyText() {
    const noveltyTextContainer = document.getElementById('novelty-text');
    noveltyTextContainer.innerHTML = noveltyTextHTML;
}

// --- Manejo del teclado (Atajos) ---
function initKeyboardControls() {
    document.addEventListener('keydown', (event) => {
        const key = event.key.toLowerCase();

        // Ocultar overlays si se presiona cualquier tecla de control
        if (['1', '2', '3', '4', '5', '6', '7', '8', 'r', '9', 'f'].includes(key)) {
            document.querySelectorAll('.overlay').forEach(el => el.classList.add('hidden'));
        }

        switch (key) {
            case 'r': // Reiniciar Vista
                setViewModel('full');
                break;
            case '1': // Motores
                setViewModel('part1');
                break;
            case '2': // Cámara
                setViewModel('part2');
                break;
            case '3': // Baterías
                setViewModel('part3');
                break;
            case '4': // Ultrasonico
                setViewModel('part4');
                break;
            case '5': // Sonido
                setViewModel('part5');
                break;
            case '6': // LDRs
                setViewModel('part6');
                break;
            case '7': // LEDs
                setViewModel('part7');
                break;
            case '8': // Reductor
                setViewModel('part8');
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