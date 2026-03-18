import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, controls;
let robotGroup;
let environmentMap;

const views = {
    'r': { pos: new THREE.Vector3(0, 0, 9), target: new THREE.Vector3(0, 0, 0) }, // Vista frontal (Plano Coronal)
    '1': { pos: new THREE.Vector3(2, 3, 4), target: new THREE.Vector3(1.5, 1.5, 0.5) }, // Cámara/ESP32
    '2': { pos: new THREE.Vector3(5, 0, 4), target: new THREE.Vector3(2, 0, 0) }, // Motores
    '3': { pos: new THREE.Vector3(0, -4, 5), target: new THREE.Vector3(0, -2, 0) }, // Baterías
    '4': { pos: new THREE.Vector3(-2, 3, 4), target: new THREE.Vector3(-1.5, 1.5, 0.5) }, // Ultrasónico
    '5': { pos: new THREE.Vector3(-2, 0, 4), target: new THREE.Vector3(-1, 0, 0.5) }, // Micrófono
    '6': { pos: new THREE.Vector3(2, -1, 4), target: new THREE.Vector3(1, -0.5, 0.5) }, // Driver L298N
    '7': { pos: new THREE.Vector3(3, 2, 4), target: new THREE.Vector3(2.5, 1.5, 0.5) }, // Leds/LDR
    '8': { pos: new THREE.Vector3(0, 1, 4), target: new THREE.Vector3(0, 0, -0.5) } // Reductor/MicroSD
};

export function initThreeJS() {
    const container = document.getElementById('scene-container');
    if (!container) return;
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d1117);
    scene.fog = new THREE.FogExp2(0x0d1117, 0.02);

    const aspect = container.clientWidth / container.clientHeight;
    camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
    camera.position.copy(views['r'].pos);

    renderer = new THREE.WebGLRenderer({ antialias: true });
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

    // Iluminación
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 10, 10);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const accentLight = new THREE.PointLight(0x00bcd4, 0.8);
    accentLight.position.set(-5, -5, 5);
    scene.add(accentLight);

    // Entorno de reflejos
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

    // 0. ESFERA DE ACRÍLICO
    const sphereGeo = new THREE.SphereGeometry(3.8, 64, 64);
    const sphereMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff, transmission: 1, opacity: 1, metalness: 0, roughness: 0.1,
        ior: 1.5, thickness: 0.1, clearcoat: 1, clearcoatRoughness: 0, transparent: true,
        envMap: hasEnvMap ? environmentMap : null, envMapIntensity: 1
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    robotGroup.add(sphere);

    // 1. PLACA CENTRAL (VERTICAL - PLANO CORONAL)
    const pcbGeo = new THREE.BoxGeometry(6, 6, 0.1);
    const pcbMat = new THREE.MeshStandardMaterial({ color: 0x003300, roughness: 0.8, metalness: 0.2 });
    const pcb = new THREE.Mesh(pcbGeo, pcbMat);
    robotGroup.add(pcb);

    // 2. MOTORES (Conectados transversalmente)
    const motorGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32);
    const motorMat = new THREE.MeshStandardMaterial({ color: 0xcfb53b, metalness: 0.9, roughness: 0.3 });
    const motorR = new THREE.Mesh(motorGeo, motorMat);
    motorR.position.set(1.5, 0, 0); motorR.rotation.z = Math.PI / 2;
    robotGroup.add(motorR);
    const motorL = motorR.clone(); 
    motorL.position.set(-1.5, 0, 0);
    robotGroup.add(motorL);

    // 3. BATERÍAS (En ángulo en la parte inferior)
    const batGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.8, 32);
    const batMat = new THREE.MeshStandardMaterial({ color: 0x1e90ff, metalness: 0.8, roughness: 0.2 });
    const batR = new THREE.Mesh(batGeo, batMat);
    batR.position.set(1.2, -2.2, 0.2); batR.rotation.z = Math.PI / 4;
    robotGroup.add(batR);
    const batL = new THREE.Mesh(batGeo, batMat);
    batL.position.set(-1.2, -2.2, 0.2); batL.rotation.z = -Math.PI / 4;
    robotGroup.add(batL);

    // 4. ESP32-CAM Y CONJUNTO DE LED (Arriba a la derecha)
    const espGeo = new THREE.BoxGeometry(1.2, 1.8, 0.2);
    const espMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });
    const esp = new THREE.Mesh(espGeo, espMat);
    esp.position.set(1.5, 1.5, 0.15);
    robotGroup.add(esp);
    // Lente de la cámara
    const lensGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.2, 32);
    const lensMat = new THREE.MeshPhysicalMaterial({ color: 0x050505, metalness: 0.9, roughness: 0.1 });
    const lens = new THREE.Mesh(lensGeo, lensMat);
    lens.position.set(1.5, 1.8, 0.3); lens.rotation.x = Math.PI / 2;
    robotGroup.add(lens);

    // 5. SENSORES DE MAPEO / ULTRASÓNICO (Arriba a la izquierda)
    const ultraBaseGeo = new THREE.BoxGeometry(1.5, 0.8, 0.2);
    const ultraBaseMat = new THREE.MeshStandardMaterial({ color: 0x0000aa });
    const ultraBase = new THREE.Mesh(ultraBaseGeo, ultraBaseMat);
    ultraBase.position.set(-1.5, 1.8, 0.15);
    robotGroup.add(ultraBase);
    // Ojos ultrasónicos
    const eyeGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.2, 32);
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.8 });
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(-1.1, 1.8, 0.3); eyeR.rotation.x = Math.PI / 2;
    robotGroup.add(eyeR);
    const eyeL = eyeR.clone(); eyeL.position.set(-1.9, 1.8, 0.3);
    robotGroup.add(eyeL);

    // 6. MICRÓFONO KY-037 (Centro izquierda)
    const micGeo = new THREE.BoxGeometry(0.8, 0.4, 0.2);
    const micMat = new THREE.MeshStandardMaterial({ color: 0xaa0000 });
    const mic = new THREE.Mesh(micGeo, micMat);
    mic.position.set(-1, 0.8, 0.15);
    robotGroup.add(mic);
    const micCylinder = new THREE.CylinderGeometry(0.15, 0.15, 0.2);
    const micCylMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.9 });
    const micPart = new THREE.Mesh(micCylinder, micCylMat);
    micPart.position.set(-1.2, 0.8, 0.3); micPart.rotation.x = Math.PI / 2;
    robotGroup.add(micPart);

    // 7. MÓDULO REDUCTOR BUCK Y DRIVER (Centro e inferior derecha)
    const driverGeo = new THREE.BoxGeometry(1.2, 1.2, 0.2);
    const driverMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const driver = new THREE.Mesh(driverGeo, driverMat);
    driver.position.set(1, -0.5, 0.15);
    robotGroup.add(driver);

    const buckGeo = new THREE.BoxGeometry(0.8, 0.5, 0.2);
    const buckMat = new THREE.MeshStandardMaterial({ color: 0x0055aa });
    const buck = new THREE.Mesh(buckGeo, buckMat);
    buck.position.set(0, 0, 0.15);
    robotGroup.add(buck);

    // 8. CABLEADO SIMULADO (Chip central)
    const chipGeo = new THREE.BoxGeometry(0.6, 0.6, 0.1);
    const chipMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const chip = new THREE.Mesh(chipGeo, chipMat);
    chip.position.set(0, -1, 0.1);
    robotGroup.add(chip);
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
