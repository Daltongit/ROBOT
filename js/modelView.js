import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, controls;
let robotGroup;
let environmentMap;

const views = {
    'r': { pos: new THREE.Vector3(8, 6, 8), target: new THREE.Vector3(0, 0, 0) },
    '1': { pos: new THREE.Vector3(0, 0, 6), target: new THREE.Vector3(0, 0, 0) },
    '2': { pos: new THREE.Vector3(0, 4, 3), target: new THREE.Vector3(0, 1.2, 0) },
    '3': { pos: new THREE.Vector3(-4, -4, 0), target: new THREE.Vector3(0, -1.8, 0) },
    '4': { pos: new THREE.Vector3(0, 1.5, 4), target: new THREE.Vector3(0, 0, 0.5) },
    '5': { pos: new THREE.Vector3(-3, 1, -2), target: new THREE.Vector3(0, 0, 0) },
    '6': { pos: new THREE.Vector3(3, 1.5, 2), target: new THREE.Vector3(0, 0, 0) },
    '7': { pos: new THREE.Vector3(3, -1.5, 2), target: new THREE.Vector3(0, 0, 0) },
    '8': { pos: new THREE.Vector3(0, -3, -5), target: new THREE.Vector3(0, -0.3, 0) }
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

    // Luces
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 10, 7.5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const accentLight = new THREE.PointLight(0xffcc00, 0.6);
    accentLight.position.set(-5, -5, 5);
    scene.add(accentLight);

    // Mapa de entorno
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

    // 1. Esfera Acrílico
    const sphereGeo = new THREE.SphereGeometry(3.5, 64, 64);
    const sphereMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff, transmission: 1, opacity: 1, metalness: 0, roughness: 0.05,
        ior: 1.5, thickness: 0.1, clearcoat: 1, clearcoatRoughness: 0,
        envMap: hasEnvMap ? environmentMap : null, envMapIntensity: 1
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.castShadow = true; sphere.receiveShadow = true;
    robotGroup.add(sphere);

    // 2. Chasis
    const chasisGeo = new THREE.CylinderGeometry(3.1, 3.1, 0.1, 32);
    const chasisMat = new THREE.MeshStandardMaterial({ color: 0x003300, roughness: 1, metalness: 0.1 });
    const chasisPCB = new THREE.Mesh(chasisGeo, chasisMat);
    chasisPCB.rotation.x = Math.PI / 2; chasisPCB.position.z = -0.2; chasisPCB.castShadow = true;
    robotGroup.add(chasisPCB);

    // 3. Motores
    const motorGeo = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
    const motorMat = new THREE.MeshStandardMaterial({ color: 0xcfb53b, metalness: 1, roughness: 0.3, envMapIntensity: 1 });
    const motorL = new THREE.Mesh(motorGeo, motorMat);
    motorL.position.set(-2, 0, 0); motorL.rotation.z = Math.PI / 2; motorL.castShadow = true;
    robotGroup.add(motorL);
    const motorR = motorL.clone(); motorR.position.set(2, 0, 0);
    robotGroup.add(motorR);

    // 4. ESP32-CAM
    const espPCBGeom = new THREE.BoxGeometry(1.2, 0.1, 1.8);
    const espPCBMat = new THREE.MeshStandardMaterial({ color: 0x005500, roughness: 0.9 });
    const espPCB = new THREE.Mesh(espPCBGeom, espPCBMat);
    espPCB.position.set(0, 1.2, 0.1); espPCB.castShadow = true;
    robotGroup.add(espPCB);
    const lensGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 32);
    const lensMat = new THREE.MeshPhysicalMaterial({ color: 0x050505, metalness: 0.9, roughness: 0.1, ior: 2 });
    const lens = new THREE.Mesh(lensGeom, lensMat);
    lens.position.set(0, 1.2, 0.35); lens.rotation.x = Math.PI / 2;
    robotGroup.add(lens);

    // 5. Baterías
    const batGeom = new THREE.CylinderGeometry(0.45, 0.45, 1.8, 32);
    const batMat = new THREE.MeshStandardMaterial({ color: 0x1e90ff, metalness: 0.8, roughness: 0.2, envMapIntensity: 0.8 });
    const bat1 = new THREE.Mesh(batGeom, batMat);
    bat1.position.set(0.6, -1.8, -0.3); bat1.rotation.z = Math.PI / 2; bat1.castShadow = true;
    robotGroup.add(bat1);
    const bat2 = bat1.clone(); bat2.position.set(-0.6, -1.8, -0.3);
    robotGroup.add(bat2);

    // 6. Ultrasonico
    const ultraGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.2, 32);
    const ultraMat = new THREE.MeshStandardMaterial({ color: 0xb0c4de, metalness: 0.9, roughness: 0.4 });
    const eyeL = new THREE.Mesh(ultraGeo, ultraMat);
    eyeL.position.set(-0.5, 0, 0.35); eyeL.rotation.x = Math.PI / 2;
    robotGroup.add(eyeL);
    const eyeR = eyeL.clone(); eyeR.position.set(0.5, 0, 0.35);
    robotGroup.add(eyeR);

    // 7. Componentes menores
    const soundGeo = new THREE.BoxGeometry(0.5, 0.5, 0.2);
    const soundMat = new THREE.MeshStandardMaterial({ color: 0x8b0000, roughness: 0.8 });
    const soundMod = new THREE.Mesh(soundGeo, soundMat);
    soundMod.position.set(-2, 0.8, 0); robotGroup.add(soundMod);

    const ldrGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const ldrMat = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.2 });
    const ldr = new THREE.Mesh(ldrGeo, ldrMat);
    ldr.position.set(2.2, 1.2, 0.1); robotGroup.add(ldr);

    const ledGeo = new THREE.BoxGeometry(0.15, 0.15, 0.3);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.position.set(2.2, -1.2, 0.1); robotGroup.add(led);
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
