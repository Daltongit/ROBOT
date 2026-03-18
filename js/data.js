// La lista exacta de tu imagen de Excel (16 componentes)
export const componentsList = [
    { id: 'c1', name: "Módulo ESP32-CAM", qty: 1, price: "$10.00", total: "$10.00", func: "El 'cerebro'. Maneja WiFi, graba video y ejecuta el código." },
    { id: 'c2', name: "Módulo programador FTDI", qty: 1, price: "$4.00", total: "$4.00", func: "Para conectar el ESP32 a la computadora y subirle el código." },
    { id: 'c3', name: "Tarjeta MicroSD", qty: 1, price: "$6.00", total: "$6.00", func: "Para guardar los videos del modo de seguridad." },
    { id: 'c4', name: "Esfera de acrílico", qty: 1, price: "$10.00", total: "$10.00", func: "El cuerpo del robot (una bola de hámster sirve perfecto)." },
    { id: 'c5', name: "Motor DC amarillo", qty: 2, price: "$2.50", total: "$5.00", func: "Van adentro de la esfera para hacerla rodar." },
    { id: 'c6', name: "Driver L298N Mini", qty: 1, price: "$3.50", total: "$3.50", func: "Recibe las órdenes del ESP32 y le da fuerza a los motores." },
    { id: 'c7', name: "Sensor Ultrasónico", qty: 1, price: "$2.00", total: "$2.00", func: "Para medir distancias y ayudar con el mapeo 2D." },
    { id: 'c8', name: "Sensor de sonido", qty: 1, price: "$2.00", total: "$2.00", func: "El 'oído' para detectar ruidos en el modo seguridad." },
    { id: 'c9', name: "Fotorresistencia (LDR)", qty: 2, price: "$0.50", total: "$1.00", func: "Detectan la luz para buscar un rincón oscuro y esconderse." },
    { id: 'c10', name: "LED Blanco + Resist.", qty: 1, price: "$0.50", total: "$0.50", func: "La 'linterna' del asistente interactivo." },
    { id: 'c11', name: "Batería Litio 18650", qty: 2, price: "$5.00", total: "$10.00", func: "Dan la potencia a los motores y al módulo ESP32." },
    { id: 'c12', name: "Portapilas 2x 18650", qty: 1, price: "$2.00", total: "$2.00", func: "Para sostener las baterías de forma segura." },
    { id: 'c13', name: "Módulo Buck", qty: 1, price: "$2.50", total: "$2.50", func: "Baja el voltaje a 5V exactos para no quemar el ESP32." },
    { id: 'c14', name: "Kit Cables Jumper", qty: 1, price: "$3.00", total: "$3.00", func: "Para conectar todos los sensores y módulos sin soldar." },
    { id: 'c15', name: "Protoboard Mini", qty: 1, price: "$2.00", total: "$2.00", func: "Para distribuir la energía (tierra y voltaje) fácilmente." },
    { id: 'c16', name: "Interruptor", qty: 1, price: "$0.50", total: "$0.50", func: "Para prender y apagar el robot sin desconectar cables." }
];

export const budgetTotal = "$64.00";

export const noveltyText = `
    <h3 style="border:none; text-align:left; font-size:1.8rem; margin-top:0;">¿Por qué es novedosa esta idea?</h3>
    <p>La novedad radica en la integración de múltiples funcionalidades en una plataforma robótica de ultra-bajo costo.</p>
    <ul>
        <li><strong>Factor de Forma Único:</strong> Una esfera transparente protege los 16 componentes internos y da movilidad omnidireccional.</li>
        <li><strong>Convergencia:</strong> Combina sistema de seguridad, asistente interactivo y modelado 2D en un solo equipo.</li>
        <li><strong>Democratización:</strong> Demuestra que se puede hacer robótica compleja con solo $64.00 gracias a la eficiencia del diseño centralizado.</li>
    </ul>
`;
