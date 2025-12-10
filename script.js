
// Librerías
require("dotenv").config();
const { Command } = require("commander");               // funcionalidad de args de CLI


// Constantes globables
const BREVO_API_KEY = process.env.BREVO_API_KEY;               
const BREVO_MAIL = process.env.BREVO_MAIL;

const API_URL = 'https://api.brevo.com/v3/smtp/email';


// Instanciar objeto que representa el programa de CLI
const program = new Command();

// Configurar args de CLI
program
    .option("--to <destinatarios...>", "Array de destinatarios con formato 'Nombre <correo>'")
    .option("--subject <string>", "Asunto del correo electrónico")
    .option("--content <string>", "Contenido del correo electrónico");

program.parse();
const options = program.opts();


// Contenido del correo con formato
const HTMLString = `
    <html>
        <head></head>
        <body>
            <p>${options.content}</p>
        </body>
    </html>
`
// Estructura de datos que representa el correo
const mail = {
    sender: {
        name: "[TEST] Correo electrónico programático",
        email: BREVO_MAIL
    },
    to: formatRecipientsList(options.to),
    subject: options.subject,
    htmlContent: HTMLString
};

// Estructura de datos que representa la información que se enviará a la API de Brevo como petición POST
const brevoAPIPostData = {
    method: "POST",
    headers: {
        accept: "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json"
    },
    body: JSON.stringify(mail)
};


// Funciones helper

// Función: Transformar array de destinatarios (strings) a un array de estructuras de datos con formato compatible con API de Brevo
//   Args: Array de strings que corresponden a los destinatarios (se obtiene de los args de CLI al ejecutar el programa)
//   RV: Array de estructuras de datos que representan los destinatarios del correo 
//   NOTA: El formato del array y de sus estructuras de datos contenidas es idéntico con el formato que recibe la API de Brevo en
//     la estructura de datos "mail" en su propiedad "to:" [{...}, ...]
function formatRecipientsList(rL) {                                                        // rL -> [ "Leonardo C. A. <correo@domain.com>", ... ]

    // RegExp
    const regexpMail = new RegExp(/<[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}>/, "i");         // Ej. <mail@domain.com>

    // Array que será el RV
    let recipientsList = [];

    for (let i = 0; i < rL.length; i++) {                               

        let recipientMail = rL[i].match(regexpMail)[0];                     
        let recipientName = rL[i].replace(recipientMail, "").trimEnd();

        recipientMail = recipientMail.replace(/[<>]/g, "");

        const recipient = {
            email: recipientMail,
            name: recipientName
        };

        recipientsList.push(recipient);
    }

    return recipientsList;
}

// Función main() (asincrónica para poder usar await)
async function main() {

    // Petición POST a la API de Brevo
    const response = await fetch(API_URL, brevoAPIPostData);
    const responseBody = await response.text();

    // Mostrar información sobre la respuesta HTTP de la API Brevo
    console.log("Response Status:", response.status);
    console.log("Response Body:", responseBody);

    // Chequeo error en la petición POST
    if (!response.ok) {
        console.error(`Error al hacer petición POST a la API Brevo: ${responseBody}`, { status: 500 });
        process.exit(1);
    }

    // Responder si todo salió ok
    console.log("Correo electrónico enviado exitosamente a través de API Brevo")
}



main();

