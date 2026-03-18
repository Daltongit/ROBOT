export const budgetData = {
    total: "$64.00",
    items: [
        { item: "Módulo ESP32-CAM (con cámara)", qty: 1, cost: "$10.00", total: "$10.00" },
        { item: "Módulo programador FTDI", qty: 1, cost: "$4.00", total: "$4.00" },
        { item: "Tarjeta MicroSD (8GB o 16GB)", qty: 1, cost: "$6.00", total: "$6.00" },
        { item: "Esfera de acrílico transparente", qty: 1, cost: "$10.00", total: "$10.00" },
        { item: "Motor DC amarillo con rueda", qty: 2, cost: "$2.50", total: "$5.00" },
        { item: "Driver de Motores (L298N Mini)", qty: 1, cost: "$3.50", total: "$3.50" },
        { item: "Sensor Ultrasonico (HC-SR04)", qty: 1, cost: "$2.00", total: "$2.00" },
        { item: "Sensor de sonido (KY-037)", qty: 1, cost: "$2.00", total: "$2.00" },
        { item: "Fotorresistencia (LDR) + Resist.", qty: 2, cost: "$0.50", total: "$1.00" },
        { item: "LED Blanco + Resistencia", qty: 1, cost: "$0.50", total: "$0.50" },
        { item: "Batería de Litio 18650 (3.7V)", qty: 2, cost: "$5.00", total: "$10.00" },
        { item: "Portapilas para 2x 18650", qty: 1, cost: "$2.00", total: "$2.00" },
        { item: "Módulo reductor de voltaje (Buck)", qty: 1, cost: "$2.50", total: "$2.50" },
        { item: "Kit de Cables Jumper", qty: 1, cost: "$3.00", total: "$3.00" },
        { item: "Protoboard Mini", qty: 1, cost: "$2.00", total: "$2.00" },
        { item: "Interruptor (Switch On/Off)", qty: 1, cost: "$0.50", total: "$0.50" }
    ]
};

export const noveltyText = `
    <h3>¿Por qué es novedosa esta idea?</h3>
    <p>La novedad del proyecto radica en la integración inteligente de múltiples funcionalidades avanzadas en una plataforma robótica de ultra-bajo costo.</p>
    <ul>
        <li><strong>Factor de Forma Único:</strong> Utilizar una esfera transparente proporciona movilidad omnidireccional y protección total para los componentes internos.</li>
        <li><strong>Convergencia de Modos:</strong> Combina en un solo dispositivo un sistema de seguridad, un asistente interactivo y una herramienta de modelado 2D.</li>
        <li><strong>Democratización de la Tecnología:</strong> Demuestra que es posible crear robótica compleja con un presupuesto de tan solo $64.00 usando el ESP32.</li>
    </ul>
`;

export const explorerData = {
    'r': { title: 'Plano Coronal del Robot', desc: 'Diseño estructural basado en una placa vertical central que divide la esfera transparente de acrílico, distribuyendo el peso óptimamente.' },
    '1': { title: 'Cámara y Módulo (ESP32-CAM)', desc: '¿Por qué lo necesitamos?: Es el "cerebro". Maneja WiFi, graba video y ejecuta el código principal del robot.' },
    '2': { title: 'Motores DC con Rueda (x2)', desc: '¿Por qué los necesitamos?: Van adentro de la esfera para hacerla rodar. Están conectados al eje central transversal.' },
    '3': { title: 'Baterías 18650 y Portapilas', desc: '¿Por qué las necesitamos?: Dan la potencia a los motores y al módulo ESP32. Ubicadas en la base (en ángulo) para bajar el centro de gravedad.' },
    '4': { title: 'Sensor Ultrasónico (HC-SR04)', desc: '¿Por qué lo necesitamos?: Para medir distancias y ayudar con el mapeo 2D. Ubicado en la parte superior izquierda del plano.' },
    '5': { title: 'Sensor de Sonido (Micrófono KY-037)', desc: '¿Por qué lo necesitamos?: Es el "oído" para detectar ruidos en el modo de seguridad. Está ubicado en la placa central.' },
    '6': { title: 'Driver de Motores (L298N Mini)', desc: '¿Por qué lo necesitamos?: Recibe las órdenes del ESP32 y le da fuerza a los motores. Montado en la placa central.' },
    '7': { title: 'Conjunto de LEDs y LDRs', desc: '¿Por qué los necesitamos?: Las LDR detectan la luz para buscar rincones oscuros y esconderse. El LED es la "linterna" del asistente interactivo.' },
    '8': { title: 'Módulo Reductor (Buck) / MicroSD', desc: '¿Por qué los necesitamos?: El Buck baja el voltaje a 5V exactos para no quemar el ESP32. La MicroSD sirve para guardar los videos del modo seguridad.' }
};
