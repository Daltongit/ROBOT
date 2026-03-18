// js/data.js

// 1. Datos del Presupuesto y Componentes (Extraídos de la imagen 2)
export const componentsData = {
    total: "$64.00",
    items: [
        { componente: "Módulo ESP32-CAM (con cámara)", cantidad: 1, precio: "$10.00", total: "$10.00", funcion: "El \"cerebro\". Maneja WiFi, graba video y ejecuta el código." },
        { componente: "Módulo programador FTDI", cantidad: 1, precio: "$4.00", total: "$4.00", funcion: "Para conectar el ESP32 a la computadora y subirle el código." },
        { componente: "Tarjeta MicroSD (8GB o 16GB)", cantidad: 1, precio: "$6.00", total: "$6.00", funcion: "Para guardar los videos del modo de seguridad." },
        { componente: "Esfera de acrílico transparente", cantidad: 1, precio: "$10.00", total: "$10.00", funcion: "El cuerpo del robot (una bola de hámster sirve perfecto)." },
        { componente: "Motor DC amarillo con rueda", cantidad: 2, precio: "$2.50", total: "$5.00", funcion: "Van adentro de la esfera para hacerla rodar." },
        { componente: "Driver de Motores (L298N Mini)", cantidad: 1, precio: "$3.50", total: "$3.50", funcion: "Recibe las órdenes del ESP32 y le da fuerza a los motores." },
        { componente: "Sensor Ultrasonico (HC-SR04)", cantidad: 1, precio: "$2.00", total: "$2.00", funcion: "Para medir distancias y ayudar con el mapeo 2D." },
        { componente: "Sensor de sonido (KY-037)", cantidad: 1, precio: "$2.00", total: "$2.00", funcion: "El \"oído\" para detectar ruidos en el modo seguridad." },
        { componente: "Fotorresistencia (LDR) + Resist.", cantidad: 2, precio: "$0.50", total: "$1.00", funcion: "Detectan la luz para buscar un rincón oscuro y esconderse." },
        { componente: "LED Blanco + Resistencia", cantidad: 1, precio: "$0.50", total: "$0.50", funcion: "La \"linterna\" del asistente interactivo." },
        { componente: "Batería de Litio 18650 (3.7V)", cantidad: 2, precio: "$5.00", total: "$10.00", funcion: "Dan la potencia a los motores y al módulo ESP32." },
        { componente: "Portapilas para 2x 18650", cantidad: 1, precio: "$2.00", total: "$2.00", funcion: "Para sostener las baterías de forma segura." },
        { componente: "Módulo reductor de voltaje (Buck)", cantidad: 1, precio: "$2.50", total: "$2.50", funcion: "Baja el voltaje a 5V exactos para no quemar el ESP32." },
        { componente: "Kit de Cables Jumper", cantidad: 1, precio: "$3.00", total: "$3.00", funcion: "Para conectar todos los sensores y módulos sin soldar." },
        { componente: "Protoboard Mini", cantidad: 1, precio: "$2.00", total: "$2.00", funcion: "Para distribuir la energía (tierra y voltaje) fácilmente." },
        { componente: "Interruptor (Switch On/Off)", cantidad: 1, precio: "$0.50", total: "$0.50", funcion: "Para prender y apagar el robot sin desconectar cables." }
    ]
};

// 2. Texto de Novedad del Proyecto
export const noveltyTextHTML = `
    <p>La novedad de este proyecto radica en la <strong>integración inteligente de múltiples funcionalidades avanzadas en una plataforma robótica de ultra-bajo costo</strong>.</p>
    <ul>
        <li><strong>Factor de Forma Único:</strong> Utilizar una esfera transparente (como una bola de hámster) no solo es una solución de bajo costo, sino que proporciona movilidad omnidireccional intrínseca y protección total para los componentes internos, ideal para entornos domésticos.</li>
        <li><strong>Convergencia de Modos:</strong> Combina en un solo dispositivo un sistema de seguridad (monitoreo de video y sonido), un asistente interactivo (respuesta a luz/sonido) y una herramienta de modelado 2D. Normalmente, estas funciones requieren robots mucho más caros.</li>
        <li><strong>Democratización de la Tecnología:</strong> Al utilizar componentes estándar y accesibles (como el ESP32-CAM) y materiales reciclados/de bajo costo, el proyecto demuestra que es posible crear robótica compleja con un presupuesto de tan solo $64.00, abriendo la puerta a que más entusiastas y estudiantes desarrollen estas tecnologías.</li>
    </ul>
    <p>En resumen, no estamos inventando cada componente individual, sino que estamos <strong>innovando en cómo los combinamos y los hacemos accesibles</strong> en un formato práctico y económico.</p>
`;