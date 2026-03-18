import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, controls;
let robotAssembly; // El robot armado completo
let isolatedDisplay; // Contenedor para mostrar una sola pieza
let environmentMap;

// Catálogo donde guardamos la geometría de las 16 piezas
const partsLibrary = {};

export function initThreeJS() {
    const container = document.getElementById('scene-container');
    if (!container) return;
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d1117);

    camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(8, 5, 8);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Luces
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 10, 10);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const fillLight = new THREE.PointLight(0x00bcd4, 0.5);
    fillLight.position.set(-5, -5, 5);
    scene.add(fillLight);

    // Contenedores
    robotAssembly = new THREE.Group();
    scene.add(robotAssembly);
    
    isolatedDisplay = new THREE.Group();
    scene.add(isolatedDisplay);

    new THREE.CubeTextureLoader()
        .setPath('https://threejs.org/examples/textures/cube/pisa/') 
        .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'], (texture) => {
            environmentMap = texture;
            environmentMap.mapping = THREE.CubeReflectionMapping;
            scene.environment = environmentMap;
            buildPartsLibrary(); // Crear las 16 piezas primero
            assembleRobot();     // Luego armar el robot
        }, undefined, () => {
            buildPartsLibrary();
            assembleRobot();
        });

    window.addEventListener('resize', () => {
        if (!container || !renderer) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// 1. CREAR LAS 16 PIEZAS INDIVIDUALES
function buildPartsLibrary() {
    // c1: ESP32-CAM
    const espGroup = new THREE.Group();
    const pcbEsp = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 1.8), new THREE.MeshStandardMaterial({color: 0x005500, roughness: 0.9}));
    const lensEsp = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.2, 16), new THREE.MeshPhysicalMaterial({color: 0x050505, metalness: 0.9, roughness: 0.1}));
    lensEsp.position.set(0, 0.15, 0.4); lensEsp.rotation.x = Math.PI/2;
    espGroup.add(pcbEsp, lensEsp);
    partsLibrary['c1'] = espGroup;

    // c2: FTDI
    const ftdiGroup = new THREE.Group();
    const ftdiPcb = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 1.2), new THREE.MeshStandardMaterial({color: 0xcc0000}));
    const ftdiChip = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.15, 0.4), new THREE.MeshStandardMaterial({color: 0x111111}));
    ftdiChip.position.y = 0.1;
    ftdiGroup.add(ftdiPcb, ftdiChip);
    partsLibrary['c2'] = ftdiGroup;

    // c3: MicroSD
    const sdGroup = new THREE.Group();
    const sdCard = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.05, 0.5), new THREE.MeshStandardMaterial({color: 0x111111}));
    sdGroup.add(sdCard);
    partsLibrary['c3'] = sdGroup;

    // c4: Esfera Acrílico
    const sphereMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 1, opacity: 1, roughness: 0.1, clearcoat: 1, transparent: true });
    partsLibrary['c4'] = new THREE.Mesh(new THREE.SphereGeometry(3.8, 64, 64), sphereMat);

    // c5: Motor Amarillo
    const motorGroup = new THREE.Group();
    const motorBody = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.6), new THREE.MeshStandardMaterial({color: 0xffcc00}));
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.2, 32), new THREE.MeshStandardMaterial({color: 0x222222}));
    wheel.rotation.z = Math.PI/2; wheel.position.x = 0.5;
    motorGroup.add(motorBody, wheel);
    partsLibrary['c5'] = motorGroup;

    // c6: Driver L298N
    const l298nGroup = new THREE.Group();
    const drvPcb = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.1, 1.5), new THREE.MeshStandardMaterial({color: 0xcc0000}));
    const heatsink = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.4), new THREE.MeshStandardMaterial({color: 0x888888, metalness: 0.8}));
    heatsink.position.set(0, 0.35, -0.3);
    l298nGroup.add(drvPcb, heatsink);
    partsLibrary['c6'] = l298nGroup;

    // c7: Sensor Ultrasónico
    const ultraGroup = new THREE.Group();
    const ultPcb = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.6, 0.1), new THREE.MeshStandardMaterial({color: 0x0000aa}));
    const eye = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.3, 16), new THREE.MeshStandardMaterial({color: 0xc0c0c0, metalness: 0.8}));
    eye.rotation.x = Math.PI/2; eye.position.set(-0.4, 0, 0.2);
    const eye2 = eye.clone(); eye2.position.set(0.4, 0, 0.2);
    ultraGroup.add(ultPcb, eye, eye2);
    partsLibrary['c7'] = ultraGroup;

    // c8: Sensor Sonido KY-037
    const micGroup = new THREE.Group();
    const micPcb = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 0.1), new THREE.MeshStandardMaterial({color: 0xaa0000}));
    const micCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.2), new THREE.MeshStandardMaterial({color: 0xdddddd, metalness: 0.9}));
    micCyl.rotation.z = Math.PI/2; micCyl.position.set(-0.5, 0, 0);
    micGroup.add(micPcb, micCyl);
    partsLibrary['c8'] = micGroup;

    // c9: LDR
    const ldrGroup = new THREE.Group();
    const ldrHead = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.05, 16), new THREE.MeshStandardMaterial({color: 0xffaa00}));
    ldrHead.rotation.x = Math.PI/2;
    ldrGroup.add(ldrHead);
    partsLibrary['c9'] = ldrGroup;

    // c10: LED
    const ledGroup = new THREE.Group();
    const ledHead = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), new THREE.MeshBasicMaterial({color: 0xffffff}));
    ledGroup.add(ledHead);
    partsLibrary['c10'] = ledGroup;

    // c11: Batería 18650
    const batGroup = new THREE.Group();
    const batCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.8, 32), new THREE.MeshStandardMaterial({color: 0x1e90ff, metalness: 0.6}));
    batGroup.add(batCyl);
    partsLibrary['c11'] = batGroup;

    // c12: Portapilas
    const holderGroup = new THREE.Group();
    const holderBox = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2, 0.5), new THREE.MeshStandardMaterial({color: 0x111111}));
    holderGroup.add(holderBox);
    partsLibrary['c12'] = holderGroup;

    // c13: Buck
    const buckGroup = new THREE.Group();
    const buckPcb = new THREE.Mesh(new THREE.BoxGeometry(1, 0.1, 0.6), new THREE.MeshStandardMaterial({color: 0x0055aa}));
    const inductor = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.3), new THREE.MeshStandardMaterial({color: 0x222222}));
    inductor.position.set(0.2, 0.15, 0);
    buckGroup.add(buckPcb, inductor);
    partsLibrary['c13'] = buckGroup;

    // c14: Cables Jumper
    const wireGroup = new THREE.Group();
    const wireMat = new THREE.MeshStandardMaterial({color: 0x00cc00});
    const wire = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.02, 8, 24, Math.PI), wireMat);
    wireGroup.add(wire);
    partsLibrary['c14'] = wireGroup;

    // c15: Protoboard Mini
    const protoGroup = new THREE.Group();
    const protoBox = new THREE.Mesh(new THREE.BoxGeometry(2, 0.3, 1.5), new THREE.MeshStandardMaterial({color: 0xeeeeee}));
    protoGroup.add(protoBox);
    partsLibrary['c15'] = protoGroup;

    // c16: Interruptor
    const switchGroup = new THREE.Group();
    const swBox = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.2), new THREE.MeshStandardMaterial({color: 0xcc0000}));
    const swToggle = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.2), new THREE.MeshStandardMaterial({color: 0xdddddd, metalness: 0.8}));
    swToggle.position.y = 0.2;
    switchGroup.add(swBox, swToggle);
    partsLibrary['c16'] = switchGroup;
}

// 2. ENSAMBLAR EL ROBOT CON LAS 16 PIEZAS DE LA LIBRERÍA
function assembleRobot() {
    // Limpiar si ya existe
    while(robotAssembly.children.length > 0) {
        robotAssembly.remove(robotAssembly.children[0]);
    }

    // CORRECCIÓN: Placa Central Vertical Principal ahora es un DISCO CIRCULAR
    // Radio 3.6 para que encaje perfecto dentro de la esfera de radio 3.8
    const pcbGeo = new THREE.CylinderGeometry(3.6, 3.6, 0.1, 64);
    const pcbMat = new THREE.MeshStandardMaterial({ color: 0x003300, roughness: 0.8 });
    const pcbMain = new THREE.Mesh(pcbGeo, pcbMat);
    pcbMain.rotation.x = Math.PI / 2; // Lo rotamos para que quede vertical
    robotAssembly.add(pcbMain);

    // Esfera (c4)
    const esfera = partsLibrary['c4'].clone();
    robotAssembly.add(esfera);

    // Ubicaciones de los componentes en la placa circular
    const esp = partsLibrary['c1'].clone(); esp.position.set(1.5, 1.5, 0.15); robotAssembly.add(esp);
    const motorL = partsLibrary['c5'].clone(); motorL.position.set(-1.8, 0, 0); motorL.rotation.z = Math.PI/2; robotAssembly.add(motorL);
    const motorR = partsLibrary['c5'].clone(); motorR.position.set(1.8, 0, 0); motorR.rotation.z = -Math.PI/2; robotAssembly.add(motorR);
    const driver = partsLibrary['c6'].clone(); driver.position.set(1, -0.8, 0.15); robotAssembly.add(driver);
    const ultra = partsLibrary['c7'].clone(); ultra.position.set(-1.5, 1.8, 0.15); robotAssembly.add(ultra);
    const mic = partsLibrary['c8'].clone(); mic.position.set(-1, 0.8, 0.15); robotAssembly.add(mic);
    const ldr1 = partsLibrary['c9'].clone(); ldr1.position.set(2, 2.5, 0.15); robotAssembly.add(ldr1);
    const ldr2 = partsLibrary['c9'].clone(); ldr2.position.set(-2, 2.5, 0.15); robotAssembly.add(ldr2);
    const led = partsLibrary['c10'].clone(); led.position.set(0, 2.5, 0.15); robotAssembly.add(led);
    const batHolder = partsLibrary['c12'].clone(); batHolder.position.set(0, -2, 0.3); robotAssembly.add(batHolder);
    const bat1 = partsLibrary['c11'].clone(); bat1.position.set(-0.4, -2, 0.5); robotAssembly.add(bat1);
    const bat2 = partsLibrary['c11'].clone(); bat2.position.set(0.4, -2, 0.5); robotAssembly.add(bat2);
    const buck = partsLibrary['c13'].clone(); buck.position.set(-1, -1, 0.15); robotAssembly.add(buck);
    const proto = partsLibrary['c15'].clone(); proto.position.set(0, 0, -0.2); robotAssembly.add(proto); // Atrás
    const switchBtn = partsLibrary['c16'].clone(); switchBtn.position.set(0, 2.8, 0.15); robotAssembly.add(switchBtn);
    const ftdi = partsLibrary['c2'].clone(); ftdi.position.set(-1.5, -0.5, -0.2); robotAssembly.add(ftdi); // Atrás
    const sd = partsLibrary['c3'].clone(); sd.position.set(1.5, 0.5, -0.2); robotAssembly.add(sd); // Atrás
    const cables = partsLibrary['c14'].clone(); cables.position.set(0, 0, 0.15); robotAssembly.add(cables);
}

// 3. FUNCIÓN PARA MOSTRAR UNA PIEZA AISLADA FUERA DE LA ESFERA
export function isolateComponent(id) {
    while(isolatedDisplay.children.length > 0){ 
        isolatedDisplay.remove(isolatedDisplay.children[0]); 
    }

    if (id === 'reset') {
        robotAssembly.visible = true;
        camera.position.set(8, 5, 8);
        controls.target.set(0, 0, 0);
    } else {
        // Ocultar el ensamble completo
        robotAssembly.visible = false;
        
        // Cargar pieza solicitada
        if (partsLibrary[id]) {
            const piece = partsLibrary[id].clone();
            piece.position.set(0,0,0);
            piece.rotation.set(0,0,0);
            isolatedDisplay.add(piece);

            // Zoom a la pieza individual
            camera.position.set(0, 1.5, 4);
            controls.target.set(0, 0, 0);
        }
    }
    controls.update();
}

export function animateThreeJS() {
    requestAnimationFrame(animateThreeJS);
    controls.update();
    
    // Animación de rotación solo para la pieza aislada
    if(!robotAssembly.visible && isolatedDisplay.children.length > 0) {
        isolatedDisplay.rotation.y += 0.01;
    } else {
        isolatedDisplay.rotation.y = 0; 
    }

    renderer.render(scene, camera);
}
