<?php
function cargarEnv() {
    $envFile = "/Users/david/Desktop/dev/Projects/Php-Register-Family/.env"; // Ruta del archivo .env
    if (file_exists($envFile)) {
        $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES); // Leer todas las líneas
        foreach ($lines as $line) {
            // Eliminar comentarios y espacios
            $line = trim($line);
            if (strpos($line, '#') === 0) continue; // Ignorar líneas de comentarios
            if (strpos($line, '=') !== false) {
                list($key, $value) = explode('=', $line, 2);
                // Eliminar espacios adicionales
                $key = trim($key);
                $value = trim($value);
                putenv("$key=$value"); // Define la variable de entorno
                $_ENV[$key] = $value; // También la agrega al array $_ENV
            }
        }
    } else {
        echo "No se encontró el archivo .env";
    }
}
?>