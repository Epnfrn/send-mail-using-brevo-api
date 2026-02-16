Programa de CLI escrito en JS que envía correo electrónico utilizando API de Brevo.

Requisitos:
- NodeJS
- Archivo .env con correo electrónico y API key de Brevo

Ejemplo de uso con contenido de correo electrónico directo en CLI:
```bash
node path/send-mail-using-brevo-api/script.js \
  --to "John D. <jhon@domain.com>" "Doe J. <doe@domain.com>" \
  --subject "Asunto del correo" \
  --content "Contenido textual de correo electrónico. Este es el contenido del correo."
```

Ejemplo de uso con contenido de correo electrónico a partir de archivo HTML:
```bash
node path/send-mail-using-brevo-api/script.js \
  --to "John D. <jhon@domain.com>" "Doe J. <doe@domain.com>" \
  --subject "Asunto del correo" \
  --content-file "/path/to/content.html"
```