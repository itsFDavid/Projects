<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro</title>
    <link rel="stylesheet" href="styles/registro.css">
</head>
<body>
<?php
include('cargarEnv.php');
cargarEnv();

$host = getenv('DATABASE_HOST');
$user = getenv('DATABASE_USER');
$password = getenv('DATABASE_PASSWORD');
$dbName = getenv('DATABASE_NAME');

// Verifica si las variables se cargaron correctamente
if (!$host || !$user || !$password || !$dbName) {
    die('Error: Variables de entorno no definidas');
}

$id = $_POST['id'] ?? null;
$nombre = $_POST['nombre'] ?? null;
$parentesco = $_POST['parentesco'] ?? null;
$foto = $_FILES['foto'] ?? null;

$rutaImagenes = "public/images/";

$data = array(
    'id' => $id,
    'nombre' => $nombre,
    'parentesco' => $parentesco,
    'foto' => $foto
);

if ($data != null) {
    $archivo = $foto['name'];
    if (isset($archivo) && $archivo != "") {
        //Obtenemos algunos datos necesarios sobre el archivo
        $tipo = $foto['type'];
        $tamano = $foto['size'];
        $temp = $foto['tmp_name'];

        //Se comprueba si el archivo a cargar es correcto observando su extensión y tamaño
        if (!((strpos($tipo, "gif") || strpos($tipo, "jpeg") || strpos($tipo, "jpg") || strpos($tipo, "png")) && ($tamano < 2000000))) {
            echo '<div><b>Error. La extensión o el tamaño de los archivos no es correcta.<br/>
            - Se permiten archivos .gif, .jpg, .png. y de 200 kb como máximo.</b></div>';
        } else {
            //Si la imagen es correcta en tamaño y tipo
            //Se intenta subir al servidor
            if (move_uploaded_file($temp, $rutaImagenes . "" . $archivo)) {
                //Cambiamos los permisos del archivo a 777 para poder modificarlo posteriormente
                chmod($rutaImagenes . $archivo, 0777);
                //Mostramos el mensaje de que se ha subido con éxito
                echo '<div><b>Se ha subido correctamente la imagen.</b></div>';
                //Mostramos la imagen subida
                echo '<p><img src="' . $rutaImagenes . $archivo . '"></p>';

                $rutaImagenGuardada = $rutaImagenes . $archivo;

                $conn = mysqli_connect($host, $user, $password, $dbName) or
                die("Problemas con la conexion");
            
                $sql = "INSERT INTO familia (nombre, parentesco, foto) VALUES ('$nombre', '$parentesco', '$rutaImagenGuardada')";
                if (mysqli_query($conn, $sql) === TRUE) {
                    echo "Registro insertado con éxito";
                } else {
                    echo "Error insertando el registro: " . mysqli_error($conn);
                }
                mysqli_close($conn);
            } else {
                //Si no se ha podido subir la imagen, mostramos un mensaje de error
                echo '<div><b>Ocurrió algún error al subir el fichero. No pudo guardarse.</b></div>';
            }
        }
    }
} else {
    echo "No se han recibido datos";
}


?>
</body>
</html>