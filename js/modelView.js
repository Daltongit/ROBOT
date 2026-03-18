// js/modelView.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, controls;
let fullRobotGroup; // Contenedor para todo el modelo
let coreChassisGroup; // Chasis central (PCB)
let componentsGroups = {}; // Referencias a grupos individuales para mostrar/ocultar

// Definir vistas preestablecidas para los componentes
const views = {
    full: { position: new THREE.Vector3(8, 8, 8), target: new THREE.Vector3(0, 0, 0) },
    esp32: { position: new THREE.Vector3(2, 4, 3), target: new THREE.Vector3(0, 1.2, 0) }, // "cerebro"
    motors: { position: new THREE.Vector3(0, 0, 6), target: new THREE.Vector3(0, -0.2, 0) }, // "tracción"
    batteries: { position: new THREE.Vector3(-4, -4, 0), target: new THREE.Vector3(0, -1.8, 0) }, // "potencia"
    ultrasonic: { position: new THREE.Vector3(0, 2, 4), target: new THREE.Vector3(0, 0, 0) }, // "mapeo 2D"
    sound: { position: new THREE.Vector3(-3, 0.5, -2), target: new THREE.Vector3(0, 0, 0) }, // "seguridad"
    ldrs: { position: new THREE.Vector3(3, 1.5, 2), target: new THREE.Vector3(0, 0, 0) }, // "luz"
    led: { position: new THREE.Vector3(3, -1.5, 2), target: new THREE.Vector3(0, 0, 0) }, // "linterna"
    others: { position: new THREE.Vector3(0, 0, -8), target: new THREE.Vector3(0, 0, 0) } // Otros
};

export function initThreeJS() {
    const container = document.getElementById('scene-container');

    // --- 1. Escena y Niebla ---
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);
    scene.fog = new THREE.FogExp2(0x111111, 0.03); // Niebla para profundidad fotorrealista

    // --- 2. Cámara ---
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.copy(views.full.position);

    // --- 3. Renderer (Con Antialias para suavizado) ---
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true; // Habilitar sombras para realismo
    container.appendChild(renderer.domElement);

    // --- 4. Controls (Mouse Interactivo con suavizado) ---
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Efecto de suavizado
    controls.dampingFactor = 0.05;
    controls.minDistance = 3; // Límite de zoom cercano
    controls.maxDistance = 25; // Límite de zoom lejano
    controls.target.copy(views.full.target);
    controls.update();

    // --- 5. Luces fotorrealistas ---
    const ambientLight = new THREE.AmbientLight(0x404040, 0.8); // Luz ambiental suave
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true; // Esta luz proyecta sombras
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffcc00, 0.5); // Luz de acento cálida
    pointLight.position.set(-5, -5, 5);
    scene.add(pointLight);

    // Ayuda visual de rejilla (Súper útil para ubicarse)
    // const gridHelper = new THREE.GridHelper(20, 20);
    // scene.add(gridHelper);

    // --- 6. Modelo del Robot ---
    createBaseRobotModel();

    // Event Listener para redimensionar ventana
    window.addEventListener('resize', onWindowResize);
}

// --- Creación del modelo base fotorrealista puro por código ---
// Reemplazando el archivo GLB con representaciones geométricas detalladas
function createBaseRobotModel() {
    fullRobotGroup = new THREE.Group();
    scene.add(fullRobotGroup);

    // --- 6.1. La Esfera Externa (Acrílico Transparente) ---
    const sphereGeometry = new THREE.SphereGeometry(3.5, 64, 64);
    const sphereMaterial = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        transparent: true,
        opacity: 0.1, // Súper transparente
        metalness: 0.2,
        roughness: 0.05,
        clearcoat: 1.0, // Efecto fotorrealista de recubrimiento brillante
        clearcoatRoughness: 0.0
    });
    const outerSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    outerSphere.receiveShadow = true;
    fullRobotGroup.add(outerSphere);

    // --- 6.2. Chasis Interno (Un disco base tipo PCB) ---
    coreChassisGroup = new THREE.Group();
    fullRobotGroup.add(coreChassisGroup);

    const chassisGeometry = new THREE.CylinderGeometry(3.1, 3.1, 0.1, 32);
    const chassisMaterial = new THREE.MeshStandardMaterial({
        color: 0x004d00, // Verde mate tipo PCB
        metalness: 0.1,
        roughness: 0.8
    });
    const chassisPCB = new THREE.Mesh(chassisGeometry, chassisMaterial);
    chassisPCB.rotation.x = Math.PI / 2; // Acostarlo
    chassisPCB.position.z = -0.2;
    chassisPCB.castShadow = true;
    coreChassisGroup.add(chassisPCB);

    // --- Crear partes individuales (Grupos) y guardarlas para interacción ---

    // 1. ESP32-CAM (Verde con lente)
    componentsGroups['esp32'] = new THREE.Group();
    coreChassisGroup.add(componentsGroups['esp32']);

    const espPCBGeom = new THREE.BoxGeometry(1.2, 0.1, 1.8);
    const espPCBMat = new THREE.MeshStandardMaterial({ color: 0x006600, roughness: 0.9 });
    const espPCB = new THREE.Mesh(espPCBGeom, espPCBMat);
    espPCB.position.set(0, 1.2, 0.1);
    espPCB.castShadow = true;
    componentsGroups['esp32'].add(espPCB);

    const lensGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 16);
    const lensMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2, metalness: 0.9 });
    const lens = new THREE.Mesh(lensGeom, lensMat);
    lens.position.set(0, 1.2, 0.3);
    lens.rotation.x = Math.PI / 2;
    componentsGroups['esp32'].add(lens);

    // 2. Motores (Cilindros amarillos metálicos)
    componentsGroups['motors'] = new THREE.Group();
    coreChassisGroup.add(componentsGroups['motors']);

    const motorGeom = new THREE.CylinderGeometry(0.5, 0.5, 2, 16);
    const motorMat = new THREE.MeshStandardMaterial({ color: 0xffcc00, metalness: 0.7, roughness: 0.4 });
    const motorL = new THREE.Mesh(motorGeom, motorMat);
    motorL.position.set(-2, 0, 0);
    motorL.rotation.z = Math.PI / 2;
    motorL.castShadow = true;
    componentsGroups['motors'].add(motorL);

    const motorR = new THREE.Mesh(motorGeom, motorMat);
    motorR.position.set(2, 0, 0);
    motorR.rotation.z = Math.PI / 2;
    motorR.castShadow = true;
    componentsGroups['motors'].add(motorR);

    // 3. Baterías (Azules metálicas)
    componentsGroups['batteries'] = new THREE.Group();
    coreChassisGroup.add(componentsGroups['batteries']);

    const batGeom = new THREE.CylinderGeometry(0.4, 0.4, 1.8, 16);
    const batMat = new THREE.MeshStandardMaterial({ color: 0x0000bb, metalness: 0.9, roughness: 0.1 });
    const bat1 = new THREE.Mesh(batGeom, batMat);
    bat1.position.set(0.5, -1.8, -0.3);
    bat1.rotation.z = Math.PI / 2;
    bat1.castShadow = true;
    componentsGroups['batteries'].add(bat1);

    const bat2 = new THREE.Mesh(batGeom, batMat);
    bat2.position.set(-0.5, -1.8, -0.3);
    bat2.rotation.z = Math.PI / 2;
    bat2.castShadow = true;
    componentsGroups['batteries'].add(bat2);

    // 4. Ultrasonico (Aluminio mate)
    componentsGroups['ultrasonic'] = new THREE.Group();
    coreChassisGroup.add(componentsGroups['ultrasonic']);

    const ultraGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.3, 16);
    const ultraMat = new THREE.MeshStandardMaterial({ color: 0xbbbbbb, metalness: 0.6, roughness: 0.3 });
    const ultraEyeL = new THREE.Mesh(ultraGeom, ultraMat);
    ultraEyeL.position.set(-0.4, 0, 0.3);
    ultraEyeL.rotation.x = Math.PI / 2;
    componentsGroups['ultrasonic'].add(ultraEyeL);

    const ultraEyeR = new THREE.Mesh(ultraGeom, ultraMat);
    ultraEyeR.position.set(0.4, 0, 0.3);
    ultraEyeR.rotation.x = Math.PI / 2;
    componentsGroups['ultrasonic'].add(ultraEyeR);

    // 5. Sonido (Cubo rojo pequeño)
    componentsGroups['sound'] = new THREE.Group();
    coreChassisGroup.add(componentsGroups['sound']);
    const soundGeom = new THREE.BoxGeometry(0.6, 0.6, 0.2);
    const soundMat = new THREE.MeshStandardMaterial({ color: 0xcc0000 });
    const soundModule = new THREE.Mesh(soundGeom, soundMat);
    soundModule.position.set(-2, 0.8, -0.1);
    componentsGroups['sound'].add(soundModule);

    // 6. LDRs (Esferas amarillas)
    componentsGroups['ldrs'] = new THREE.Group();
    coreChassisGroup.add(componentsGroups['ldrs']);
    const ldrGeom = new THREE.SphereGeometry(0.1, 8, 8);
    const ldrMat = new THREE.MeshStandardMaterial({ color: 0xffcc33, roughness: 0.1 });
    const ldr1 = new THREE.Mesh(ldrGeom, ldrMat);
    ldr1.position.set(2.2, 1.2, 0.1);
    componentsGroups['ldrs'].add(ldr1);

    const ldr2 = new THREE.Mesh(ldrGeom, ldrMat);
    ldr2.position.set(2.6, 0.8, 0.1);
    componentsGroups['ldrs'].add(ldr2);

    // 7. LED Linterna
    componentsGroups['led'] = new THREE.Group();
    coreChassisGroup.add(componentsGroups['led']);
    const ledGeom = new THREE.BoxGeometry(0.1, 0.1, 0.3);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0xffffff }); // No le afectan luces, brilla
    const linterna = new THREE.Mesh(ledGeom, ledMat);
    linterna.position.set(2.2, -1.2, 0.1);
    componentsGroups['led'].add(linterna);

    // 8. Otros (Resto de chatarra fotorrealista)
    componentsGroups['others'] = new THREE.Group();
    coreChassisGroup.add(componentsGroups['others']);
    const protoboardGeom = new THREE.BoxGeometry(2.5, 1.5, 0.1);
    const protoboardMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    const miniProtoboard = new THREE.Mesh(protoboardGeom, protoboardMat);
    miniProtoboard.position.set(0, -0.3, -0.3);
    componentsGroups['others'].add(miniProtoboard);

}

// --- Animación (Game Loop) ---
export function animateThreeJS() {
    requestAnimationFrame(animateThreeJS);

    // Actualizar controles (suavizado)
    if (controls) controls.update();

    // Rotación suave del modelo completo (opcional)
    if (fullRobotGroup) {
        // fullRobotGroup.rotation.y += 0.001; // Descomentar para auto-rotación
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

// --- Lógica de interacción para mostrar componentes individuales ---
export function setViewModel(viewKey) {
    if (!views[viewKey]) return;

    const targetView = views[viewKey];

    // Transición suave de la cámara (sin Tween.js, usando lerp simple por ahora)
    // Para simplificar, lo haremos de golpe. Si quieren suavizado, investiguen Tween.js.
    camera.position.lerp(targetView.position, 1);
    controls.target.lerp(targetView.target, 1);
    controls.update();

    // Lógica para mostrar/ocultar componentes
    if (viewKey === 'full') {
        // En vista completa, mostrar todo
        for (let key in componentsGroups) {
            componentsGroups[key].visible = true;
        }
    } else {
        // En vista individual, ocultar todos y mostrar solo el objetivo
        for (let key in componentsGroups) {
            componentsGroups[key].visible = (key === viewKey);
        }
    }
}
