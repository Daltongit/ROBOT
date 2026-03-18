// js/modelView.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, controls;
let robotModel; // Contenedor para todo el modelo
let internalParts; // Contenedor para las partes individuales

// Definir vistas preestablecidas para los componentes
const views = {
    full: { position: new THREE.Vector3(5, 5, 5), target: new THREE.Vector3(0, 0, 0) },
    part1: { position: new THREE.Vector3(0, 0, 4), target: new THREE.Vector3(0, 0, 0) }, // Motores (Vista frontal)
    part2: { position: new THREE.Vector3(3, 3, 0), target: new THREE.Vector3(0, 1.2, 0) }, // Cámara (Vista superior inclinada)
    part3: { position: new THREE.Vector3(0, -3, 0), target: new THREE.Vector3(0, -1.2, 0) }, // Baterías (Vista inferior)
    part4: { position: new THREE.Vector3(-3, 1, 0), target: new THREE.Vector3(-1, 0, 0) }, // Sensor Ultrasonico
    part5: { position: new THREE.Vector3(0, 2, 2), target: new THREE.Vector3(0, 0.5, 0) }, // Sensor de Sonido
    part6: { position: new THREE.Vector3(1, 1, 3), target: new THREE.Vector3(1, 0, 0) }, // LDRs
    part7: { position: new THREE.Vector3(-1, -1, 3), target: new THREE.Vector3(-1, 0, 0) }, // LEDs
    part8: { position: new THREE.Vector3(0, 0, -4), target: new THREE.Vector3(0, 0, 0) }, // Reductor Voltaje (Vista trasera)
};

export function initThreeJS() {
    const container = document.getElementById('scene-container');

    // --- 1. Escena ---
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);

    // --- 2. Cámara ---
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.copy(views.full.position);

    // --- 3. Renderer ---
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // --- 4. Controls (Mouse Interactivo) ---
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Efecto de suavizado
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 2; // Límite de zoom cercano
    controls.maxDistance = 15; // Límite de zoom lejano
    controls.target.copy(views.full.target);
    controls.update();

    // --- 5. Luces ---
    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.6); // Luz suave general
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(-5, -10, -7.5);
    scene.add(pointLight);

    // --- 6. Modelo del Robot ---
    createBaseRobotModel();

    // --- Event Listener para redimensionar ventana ---
    window.addEventListener('resize', onWindowResize);
}

// --- Creación del modelo base funcional ---
// Ustedes reemplazarán esto con el archivo GLB real
function createBaseRobotModel() {
    robotModel = new THREE.Group();
    scene.add(robotModel);

    // 6.1. La Esfera Externa (Acrílico)
    const sphereGeometry = new THREE.SphereGeometry(2.5, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        transparent: true,
        opacity: 0.15, // Muy transparente
        wireframe: false, // Wireframe para que se note la forma, o falso para realismo
        metalness: 0.1,
        roughness: 0.1
    });
    const outerSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    robotModel.add(outerSphere);

    // 6.2. Chasis Interno (Un disco base)
    internalParts = new THREE.Group();
    robotModel.add(internalParts);

    const chassisGeometry = new THREE.CylinderGeometry(2, 2, 0.1, 32);
    const chassisMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const chassis = new THREE.Mesh(chassisGeometry, chassisMaterial);
    chassis.rotation.x = Math.PI / 2; // Acostarlo
    internalParts.add(chassis);

    // -- Crear partes individuales (Cubos/Cilindros de marcador) --
    // Estos marcadores son para que la interacción de teclado funcione.
    // En el modelo real, estas partes ya estarán en el GLB.

    // 1. Motores (Cilindros amarillos a los lados)
    const motorGeom = new THREE.CylinderGeometry(0.3, 0.3, 1, 16);
    const motorMat = new THREE.MeshStandardMaterial({ color: 0xffcc00 });
    const motorL = new THREE.Mesh(motorGeom, motorMat);
    motorL.position.set(-1.5, 0, 0);
    motorL.rotation.z = Math.PI / 2;
    internalParts.add(motorL);

    const motorR = new THREE.Mesh(motorGeom, motorMat);
    motorR.position.set(1.5, 0, 0);
    motorR.rotation.z = Math.PI / 2;
    internalParts.add(motorR);

    // 2. ESP32-CAM (Cubo pequeño arriba)
    const espGeom = new THREE.BoxGeometry(0.8, 0.2, 1.2);
    const espMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const esp32 = new THREE.Mesh(espGeom, espMat);
    esp32.position.set(0, 1.2, 0);
    internalParts.add(esp32);

    // Lente de la cámara
    const lensGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16);
    const lensMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const lens = new THREE.Mesh(lensGeom, lensMat);
    lens.position.set(0, 1.2, 0.6);
    lens.rotation.x = Math.PI / 2;
    internalParts.add(lens);

    // 3. Baterías (Cilindros abajo)
    const batGeom = new THREE.CylinderGeometry(0.25, 0.25, 1.5, 16);
    const batMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const bat1 = new THREE.Mesh(batGeom, batMat);
    bat1.position.set(0.5, -1.2, 0);
    bat1.rotation.z = Math.PI / 2;
    internalParts.add(bat1);

    const bat2 = new THREE.Mesh(batGeom, batMat);
    bat2.position.set(-0.5, -1.2, 0);
    bat2.rotation.z = Math.PI / 2;
    internalParts.add(bat2);

    // --- Agregar más marcadores si quieren (Ultrasonico, sonido, etc.) ---
    // Dejo estos 3 principales como ejemplo funcional.
}

// --- Animación (Game Loop) ---
export function animateThreeJS() {
    requestAnimationFrame(animateThreeJS);

    // Actualizar controles (suavizado)
    if (controls) controls.update();

    // Rotación suave del modelo completo (animación inicial)
    if (robotModel) {
        // robotModel.rotation.y += 0.001; // Descomentar para auto-rotación
    }

    // Renderizar la escena
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

// --- Manejar redimensionado de ventana ---
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// --- Cambiar de vista ---
export function setViewModel(viewKey) {
    if (!views[viewKey]) return;

    const targetView = views[viewKey];

    // Transición suave de la cámara usando Tween.js (opcional, pero mejora mucho)
    // Para simplificar, lo haremos de golpe. Si quieren suavizado, investiguen Tween.js o gsap.
    camera.position.lerp(targetView.position, 1); // Lerp a 1 es instantáneo
    controls.target.lerp(targetView.target, 1);
    controls.update();

    // --- Resaltar componentes (Opcional) ---
    // Aquí podrían cambiar el material de la parte objetivo para que brille,
    // o hacer la esfera transparente aún más invisible.
    if (viewKey === 'full') {
        // Restaurar estado
    } else {
        // Aislar componente
    }
}