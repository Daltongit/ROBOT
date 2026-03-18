import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, controls;
let robotGroup;
let environmentMap;

// PUNTOS DE VISTA PREDEFINIDOS FOTORREALISTAS
const views = {
    'r': { pos: new THREE.Vector3(8, 6, 8), target: new THREE.Vector3(0, 0, 0) }, // Vista Completa Fotorrealista (Frontal-Cuarto)
    '1': { pos: new THREE.Vector3(0, 4, 3), target: new THREE.Vector3(0, 1.2, 0) }, // Módulo ESP32-CAM/Camera (Top of track)
    '2': { pos: new THREE.Vector3(5, 0, 4), target: new THREE.Vector3(2, 0, 0) },   // Motors y ruedas (Side view)
    '3': { pos: new THREE.Vector3(0, -4, 5), target: new THREE.Vector3(0, -1.8, 0) }, // Batteries y Holder (Bottom view)
    '4': { pos: new THREE.Vector3(0, 1.5, 4), target: new THREE.Vector3(0, 0, 0.5) }, // Ultrasonic (Blue transceivers)
    '5': { pos: new THREE.Vector3(-3, 0.5, -2), target: new THREE.Vector3(0, 0, 0) }, // Sound KY-037 (Capsule)
    '6': { pos: new THREE.Vector3(0, 0, -8), target: new THREE.Vector3(0, -0.3, 0) }, // Motor Driver (PCB/Chip)
    '7': { pos: new THREE.Vector3(3, 1.5, 2), target: new THREE.Vector3(0, 0, 0) },   // LDRs y LEDs
    '8': { pos: new THREE.Vector3(3, -1.5, 2), target: new THREE.Vector3(0, 0, -0.5) } // Buck/SD (Módulos detailed en pista central)
};

export function initThreeJS() {
    const container = document.getElementById('scene-container');
    if (!container) return;
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d1117);
    scene.fog = new THREE.FogExp2(0x0d1117, 0.03);

    const aspect = container.clientWidth / container.clientHeight;
    camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
    camera.position.copy(views['r'].pos);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.copy(views['r'].target);

    // SISTEMA DE ILUMINACIÓN FOTORREALISTA
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const keyLight = new THREE.PointLight(0xffffff, 1.2);
    keyLight.position.set(5, 10, 7.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(-5, -5, -5);
    scene.add(fillLight);

    const pointHighlight = new THREE.PointLight(0x00bcd4, 0.8);
    pointHighlight.position.set(0, 0, 5);
    scene.add(pointHighlight);

    // Entorno de reflejos fotorrealistas (Obligatorio Live Server)
    new THREE.CubeTextureLoader()
        .setPath('https://threejs.org/examples/textures/cube/pisa/') 
        .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'], (texture) => {
            environmentMap = texture;
            environmentMap.mapping = THREE.CubeReflectionMapping;
            scene.environment = environmentMap;
            buildRobot(true);
        }, undefined, () => buildRobot(false));

    window.addEventListener('resize', () => {
        if (!container || !renderer) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

function buildRobot(hasEnvMap) {
    if(scene.getObjectByName('robotModel')) {
        scene.remove(scene.getObjectByName('robotModel'));
    }

    robotGroup = new THREE.Group();
    robotGroup.name = 'robotModel';
    scene.add(robotGroup);

    // Esfera Acrílico (MeshPhysicalMaterial, polished fotorrealista, fixed geometry)
    const sphereGeo = new THREE.SphereGeometry(3.5, 64, 64);
    const sphereMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 1, // Vidrio puro
        opacity: 1,
        metalness: 0,
        roughness: 0.05, // Muy lisa
        ior: 1.5, // Índice de refracción del acrílico
        thickness: 0.1, // Espesor fotorrealista
        clearcoat: 1, // Capa brillante tipo image_2.png
        clearcoatRoughness: 0,
        envMap: hasEnvMap ? environmentMap : null, // Reflejos
        envMapIntensity: 1
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.castShadow = true; sphere.receiveShadow = true;
    robotGroup.add(sphere);

    // Chasis central (PCB verde mate fixed fotorrealista, nested inside sphere)
    const chasisGeo = new THREE.CylinderGeometry(3, 3, 0.1, 32);
    const chasisMat = new THREE.MeshStandardMaterial({ color: 0x003300, roughness: 1, metalness: 0.1 });
    const chasisPCB = new THREE.Mesh(chasisGeo, chasisMat);
    chasisPCB.rotation.x = Math.PI / 2; chasisPCB.position.z = -0.2; chasisPCB.castShadow = true;
    robotGroup.add(chasisPCB);

    // --- Componentes Individuales con materiales fotorrealistas ---

    // 1. Motores Dorados Metálicos Detailed fotorrealistas
    const motorGeo = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
    const motorMat = new THREE.MeshStandardMaterial({ color: 0xcfb53b, metalness: 1, roughness: 0.3, envMapIntensity: 1 });
    const motorL = new THREE.Mesh(motorGeo, motorMat);
    motorL.name = 'motorL'; motorL.position.set(-2, 0, 0); motorL.rotation.z = Math.PI / 2; motorL.castShadow = true;
    robotGroup.add(motorL);
    const motorR = motorL.clone(); motorR.name = 'motorR'; motorR.position.set(2, 0, 0);
    robotGroup.add(motorR);

    // Ruedas metal fotorrealistas detailed
    const wheelGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.9, roughness: 0.2 });
    const wheelL = new THREE.Mesh(wheelGeo, wheelMat);
    wheelL.position.set(-2.2, 0, 0); wheelL.rotation.z = Math.PI / 2;
    robotGroup.add(wheelL);
    const wheelR = wheelL.clone(); wheelR.position.set(2.2, 0, 0);
    robotGroup.add(wheelR);

    // 2. ESP32-CAM y Lente Detailed fotorrealistas (Top of track groove)
    const espPCBGeom = new THREE.BoxGeometry(1.2, 0.1, 1.8);
    const espPCBMat = new THREE.MeshStandardMaterial({ color: 0x005500, roughness: 0.9 });
    const espPCB = new THREE.Mesh(espPCBGeom, espPCBMat);
    espPCB.name = 'espPCB'; espPCB.position.set(0, 1.2, 0.1); espPCB.castShadow = true;
    robotGroup.add(espPCB);
    const lensGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 32);
    const lensMat = new THREE.MeshPhysicalMaterial({ color: 0x050505, metalness: 0.9, roughness: 0.1, ior: 2 });
    const lens = new THREE.Mesh(lensGeom, lensMat);
    lens.name = 'espLens'; lens.position.set(0, 1.2, 0.35); lens.rotation.x = Math.PI / 2;
    robotGroup.add(lens);

    // 3. Baterías Metálicas Azules Detailed fotorrealistas
    const batGeom = new THREE.CylinderGeometry(0.45, 0.45, 1.8, 32);
    const batMat = new THREE.MeshStandardMaterial({ color: 0x1e90ff, metalness: 0.8, roughness: 0.2, envMapIntensity: 0.8 });
    const bat1 = new THREE.Mesh(batGeom, batMat);
    bat1.name = 'bat1'; bat1.position.set(0.6, -1.8, -0.3); bat1.rotation.z = Math.PI / 2; bat1.castShadow = true;
    robotGroup.add(bat1);
    const bat2 = bat1.clone(); bat2.name = 'bat2'; bat2.position.set(-0.6, -1.8, -0.3);
    robotGroup.add(bat2);

    // 4. Ultrasonico HC-SR04 simulation Detailed fotorrealistas
    const ultraEyeGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.2, 32);
    const ultraEyeMat = new THREE.MeshStandardMaterial({ color: 0xb0c4de, metalness: 0.9, roughness: 0.4 });
    const eyeL = new THREE.Mesh(ultraEyeGeo, ultraEyeMat);
    eyeL.name = 'ultraEyeL'; eyeL.position.set(-0.5, 0, 0.35); eyeL.rotation.x = Math.PI / 2;
    robotGroup.add(eyeL);
    const eyeR = eyeL.clone(); eyeR.name = 'ultraEyeR'; eyeR.position.set(0.5, 0, 0.35);
    robotGroup.add(eyeR);

    // 5. Sensor KY-037 Sonido Detailed fotorrealistas
    const soundGeo = new THREE.BoxGeometry(0.5, 0.5, 0.2);
    const soundMat = new THREE.MeshStandardMaterial({ color: 0x8b0000, roughness: 0.8 });
    const soundMod = new THREE.Mesh(soundGeo, soundMat);
    soundMod.name = 'soundSensor'; soundMod.position.set(-2, 0.8, 0); robotGroup.add(soundMod);

    // Fotorrealista micrófono cápsula detailed
    const micGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16);
    const micMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.2 });
    const microphone = new THREE.Mesh(micGeo, micMat);
    microphone.position.set(-2, 0.8, 0.15); microphone.rotation.x = Math.PI / 2;
    robotGroup.add(microphone);

    // 6. LEDs / LDRs / Linterna Detailed fotorrealistas
    const ldrGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const ldrMat = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.2 });
    const ldr = new THREE.Mesh(ldrGeo, ldrMat);
    ldr.name = 'ldrSensor'; ldr.position.set(2.2, 1.2, 0.1); robotGroup.add(ldr);

    const ledLampGeo = new THREE.BoxGeometry(0.15, 0.15, 0.3);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0xffffff }); // No le afectan luces, brilla
    const ledLamp = new THREE.Mesh(ledLampGeo, ledMat);
    ledLamp.name = 'ledLamp'; ledLamp.position.set(2.2, -1.2, 0.1);
    robotGroup.add(ledLamp);

    // 7. Módulo Buck / MicroSD (Módulos detailed en pista central groove, matching image_13.png groove detail)
    const microSDPCBGeo = new THREE.BoxGeometry(0.6, 0.1, 0.6);
    const microSDPCBMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.9 });
    const microSDPCB = new THREE.Mesh(microSDPCBGeo, microSDPCBMat);
    microSDPCB.name = 'microSDModule'; microSDPCB.position.set(0, -1, -0.4); // Deep on track groove
    robotGroup.add(microSDPCB);

    const sdCardGeo = new THREE.BoxGeometry(0.3, 0.05, 0.4);
    const sdCardMat = new THREE.MeshStandardMaterial({ color: 0xcc0000 });
    const sdCard = new THREE.Mesh(sdCardGeo, sdCardMat);
    sdCard.position.set(0, -1.05, -0.4);
    robotGroup.add(sdCard);

    const buckPCBGeo = new THREE.BoxGeometry(1, 0.1, 0.6);
    const buckPCBMat = new THREE.MeshStandardMaterial({ color: 0x0055aa, roughness: 0.8, metalness: 0.1 });
    const buckPCB = new THREE.Mesh(buckPCBGeo, buckPCBMat);
    buckPCB.name = 'buckPCB'; buckPCB.position.set(0, 0, -0.4); // Deep on track groove
    robotGroup.add(buckPCB);

    // 8. Chasis PCB Detailed driver L298N detailed
    const driverPCBGeo = new THREE.BoxGeometry(1.5, 0.1, 1.5);
    const driverPCBMat = new THREE.MeshStandardMaterial({ color: 0x002200, roughness: 1, metalness: 0.1 });
    const driverPCB = new THREE.Mesh(driverPCBGeo, driverPCBMat);
    driverPCB.name = 'driverPCB'; driverPCB.position.set(0, -0.3, -0.2); // Core chassis part
    robotGroup.add(driverPCB);
    // Chip detallado
    const driverChipGeo = new THREE.BoxGeometry(0.5, 0.5, 0.15);
    const driverChipMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.3, metalness: 1 });
    const driverChip = new THREE.Mesh(driverChipGeo, driverChipMat);
    driverChip.position.set(0, -0.3, -0.1);
    robotGroup.add(driverChip);
}

export function animateThreeJS() {
    requestAnimationFrame(animateThreeJS);
    controls.update();
    renderer.render(scene, camera);
}

export function setViewModel(dataKey) {
    if(views[dataKey]) {
        camera.position.copy(views[dataKey].pos);
        controls.target.copy(views[dataKey].target);
        controls.update();
    }
}
