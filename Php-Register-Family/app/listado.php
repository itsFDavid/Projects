<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Listado</title>
    <link rel="stylesheet" href="styles/listado.css">
</head>
<body>
    <nav class="menu">
        <a href="index.php">Inicio</a>
    </nav>
    <h1>Listado de registros</h1>
<?php
include('cargarEnv.php');
cargarEnv();

$host = getenv('DATABASE_HOST');
$user = getenv('DATABASE_USER');
$password = getenv('DATABASE_PASSWORD');
$dbName = getenv('DATABASE_NAME');


$conn = mysqli_connect($host, $user, $password, $dbName) or
die("Problemas con la conexion");

$sql = "SELECT * FROM familia";
$result = mysqli_query($conn, $sql) or die("Error en la consulta: " . mysqli_error($conn));

if(mysqli_num_rows($result) == 0){
    echo "<h2>No hay registros</h2>";
    mysqli_close($conn);
    exit();
}

echo "<div class='personas'>";
while($person = mysqli_fetch_array($result)){
    echo "<div class='persona'>";
    echo "<div class='foto'>";
    echo "<img src='" . $person['foto'] . "' alt='imagen de registro'>";
    echo "</div>";
    
    
    echo "<div class='datos'>";
    echo "<label >Identificación no: ". $person['id']."</label>";
    echo "<label>Nombre: </label>";
    echo "<p>" . $person['nombre'] . "</p>";
    echo "<label>Parentesco: </label>";
    echo "<p>" . $person['parentesco'] . "</p>";
    echo "</div>";
    echo "</div>";
}
echo "</div>";

mysqli_close($conn);
?>
</body>
</html>