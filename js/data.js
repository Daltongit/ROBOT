// Base de datos exacta de tus 16 componentes
export const componentsList = [
    { id: 'c1', name: "Módulo ESP32-CAM", qty: 1, price: "$10.00", total: "$10.00", func: "El 'cerebro'. Maneja WiFi, graba video y ejecuta el código." },
    { id: 'c2', name: "Módulo programador FTDI", qty: 1, price: "$4.00", total: "$4.00", func: "Para conectar el ESP32 a la computadora y subirle el código." },
    { id: 'c3', name: "Tarjeta MicroSD", qty: 1, price: "$6.00", total: "$6.00", func: "Para guardar los videos del modo de seguridad." },
    { id: 'c4', name: "Esfera de acrílico", qty: 1, price: "$10.00", total: "$10.00", func: "El cuerpo protector transparente del robot (Movilidad y Coraza)." },
    { id: 'c5', name: "Motor DC amarillo", qty: 2, price: "$2.50", total: "$5.00", func: "Van adentro de la esfera conectados al chasis para hacerla rodar." },
    { id: 'c6', name: "Driver L298N Mini", qty: 1, price: "$3.50", total: "$3.50", func: "Recibe las órdenes del ESP32 y le da la potencia necesaria a los motores." },
    { id: 'c7', name: "Sensor Ultrasónico", qty: 1, price: "$2.00", total: "$2.00", func: "Mide distancias rebotando sonido para ayudar con el mapeo 2D del entorno." },
    { id: 'c8', name: "Sensor de sonido", qty: 1, price: "$2.00", total: "$2.00", func: "El 'oído'. Módulo vital para detectar ruidos sospechosos en el modo seguridad." },
    { id: 'c9', name: "Fotorresistencia (LDR)", qty: 2, price: "$0.50", total: "$1.00", func: "Detectan la intensidad de luz para buscar rincones oscuros y esconderse." },
    { id: 'c10', name: "LED Blanco + Resist.", qty: 1, price: "$0.50", total: "$0.50", func: "Actúa como la 'linterna' del asistente interactivo para alumbrar el camino." },
    { id: 'c11', name: "Batería Litio 18650", qty: 2, price: "$5.00", total: "$10.00", func: "Celdas de alta capacidad que dan la potencia general a los motores y al circuito." },
    { id: 'c12', name: "Portapilas 2x 18650", qty: 1, price: "$2.00", total: "$2.00", func: "Mantiene las baterías fijas en la base para bajar el centro de gravedad." },
    { id: 'c13', name: "Módulo Buck", qty: 1, price: "$2.50", total: "$2.50", func: "Regulador. Baja el voltaje de las baterías a 5V exactos para no quemar el ESP32." },
    { id: 'c14', name: "Kit Cables Jumper", qty: 1, price: "$3.00", total: "$3.00", func: "Permite interconectar todos los sensores y módulos de forma rápida sin soldar." },
    { id: 'c15', name: "Protoboard Mini", qty: 1, price: "$2.00", total: "$2.00", func: "Plataforma central para distribuir la energía (tierra y voltaje) a los componentes." },
    { id: 'c16', name: "Interruptor", qty: 1, price: "$0.50", total: "$0.50", func: "Corta la energía general para prender y apagar el robot sin desconectar cables." }
];

export const budgetTotal = "$64.00";

export const noveltyText = `
    <h3 style="border:none; text-align:left; font-size:1.8rem; margin-top:0; color:#00bcd4;">¿Por qué es novedosa esta idea?</h3>
    <p>La novedad radica en la integración de múltiples funcionalidades en una plataforma robótica de ultra-bajo costo.</p>
    <ul>
        <li><strong>Factor de Forma Único:</strong> Una esfera transparente protege los 16 componentes internos, evita atascos y otorga movilidad omnidireccional fluida.</li>
        <li><strong>Convergencia de Modos:</strong> Combina un sistema de vigilancia de seguridad (cámara/micrófono), un asistente interactivo (luz) y modelado 2D (ultrasónico) en un solo equipo.</li>
        <li><strong>Democratización Tecnológica:</strong> Demuestra que se puede hacer robótica integral y compleja con un presupuesto accesible de tan solo $64.00 gracias a la eficiencia del diseño del ESP32.</li>
    </ul>
`;
