export const budgetData = {
    total: "$64.00",
    items: [
        { item: "Módulo ESP32-CAM (Cerebro)", qty: 1, cost: "$10.00", total: "$10.00" },
        { item: "Motor DC Amarillo con rueda", qty: 2, cost: "$2.50", total: "$5.00" },
        { item: "Driver de Motores (L298N Mini)", qty: 1, cost: "$3.50", total: "$3.50" },
        { item: "Batería Litio 18650 (3.7V)", qty: 2, cost: "$5.00", total: "$10.00" },
        { item: "Portapilas para 2x 18650", qty: 1, cost: "$2.00", total: "$2.00" },
        { item: "Sensor Ultrasonico (HC-SR04)", qty: 1, cost: "$2.00", total: "$2.00" },
        { item: "Sensor de sonido (KY-037)", qty: 1, cost: "$2.00", total: "$2.00" },
        { item: "Módulo programador FTDI", qty: 1, cost: "$4.00", total: "$4.00" },
        { item: "Tarjeta MicroSD (8GB o 16GB)", qty: 1, cost: "$6.00", total: "$6.00" },
        { item: "Esfera de acrílico transparente", qty: 1, cost: "$10.00", total: "$10.00" },
        { item: "Módulo reductor Buck (5V)", qty: 1, cost: "$2.50", total: "$2.50" },
        { item: "Cables Jumper", qty: 1, cost: "$3.00", total: "$3.00" },
        { item: "Protoboard Mini", qty: 1, cost: "$2.00", total: "$2.00" },
        { item: "Interruptor Switch On/Off", qty: 1, cost: "$0.50", total: "$0.50" },
        { item: "LDRs/LEDs/Resistencias", qty: 2, cost: "$0.50", total: "$1.00" }
    ]
};

export const noveltyText = `
    <h3>¿Por qué es novedosa esta idea?</h3>
    <p>La novedad del proyecto radica en la integración inteligente de múltiples funcionalidades avanzadas en una plataforma robótica de ultra-bajo costo.</p>
    <ul>
        <li><strong>Factor de Forma Único:</strong> Utilizar una esfera transparente proporciona movilidad omnidireccional y protección total para los componentes internos, ideal para entornos domésticos.</li>
        <li><strong>Convergencia de Modos:</strong> Combina en un solo dispositivo un sistema de seguridad (monitoreo de video y sonido), un asistente interactivo (respuesta a luz/sonido) y una herramienta de modelado 2D. Normalmente, estas funciones requieren robots mucho más caros.</li>
        <li><strong>Democratización de la Tecnología:</strong> Al utilizar componentes estándar y accesibles (como el ESP32-CAM) y materiales reciclados/de bajo costo, el proyecto demuestra que es posible crear robótica compleja con un presupuesto de tan solo $64.00, abriendo la puerta a que más entusiastas y estudiantes desarrollen estas tecnologías.</li>
    </ul>
`;

export const explorerData = {
    'r': { title: 'Vista General del Robot', desc: 'Una esfera de acrílico transparente protegiendo un chasis PCB fotorrealista con el mecanismo de tracción interno.' },
    '1': { title: '1. Motores DC (Tracción)', desc: 'Dos motores DC con acabado metálico dorado simulado, situados en el eje transversal para permitir la movilidad omnidireccional.' },
    '2': { title: '2. Módulo ESP32-CAM (Cámara)', desc: 'El cerebro del robot. Presenta un PCB verde mate fotorrealista con la lente principal de la cámara y los conectores de pines.' },
    '3': { title: '3. Baterías 18650 (Energía)', desc: 'Dos celdas de litio con envoltura metálica azul situadas estratégicamente en la base para mantener el centro de gravedad extremadamente bajo.' },
    '4': { title: '4. Sensor Ultrasonico (HC-SR04)', desc: 'Módulo frontal de aluminio mate fotorrealista con dos transductores acústicos para el escaneo y mapeo 2D del entorno.' },
    '5': { title: '5. Sensor de Sonido (KY-037)', desc: 'El "oído" del sistema. Módulo sensor simulado para detectar ruidos fuertes en el modo de vigilancia de seguridad.' },
    '6': { title: '6. Fotorresistencias (LDRs)', desc: 'Sensores de luz distribuidos para permitir que el robot busque instintivamente rincones oscuros y se esconda.' },
    '7': { title: '7. Diodo LED Blanco', desc: 'Luz de acento LED frontal ultra brillante de estado sólido para la iluminación del asistente interactivo.' },
    '8': { title: '8. Placa Base y Driver', desc: 'El chasis estructural hecho de material PCB verde oscuro, soportando el chip controlador L298N simulado en aluminio.' }
};
