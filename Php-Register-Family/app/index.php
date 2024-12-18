<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro Familiar</title>
    <link rel="stylesheet" href="styles/styles.css">
</head>
<body>


    <main>
        <h1>Registro Familiar</h1>
        <form action="" method="post" enctype="multipart/form-data">
            <section class="sect">
                <label for="id">Identificación:</label>
                <input class="inp" type="number" name="id" id="id" min="1" max="100">
            </section>
            <section class="sect">
                <label for="nombre">Nombre:</label>
                <input class="inp" type="text" name="nombre" id="nombre">
            </section>
            <section class="sect">
                <label for="parentesco">Parentesco:</label>
                <input class="inp" type="text" name="parentesco" id="parentesco">
            </section>
            <section class="sect">
                <label for="foto">Foto:</label>
                <input class="inp" type="file" name="foto" id="foto" accept=".jpg, .jpeg, .png">
            </section>

            <section class="buttons">
                <input type="submit" value="Registrar" id="registrar" name="registrar">
                <input type="submit" value="Eliminar" id="eliminar" name="eliminar">
                <input type="submit" value="Modificar" id="modificar" name="modificar">
                <a href="listado.php">Listado</a>
            </section>
        <?php
        include('cargarEnv.php');
        cargarEnv();
        
        $host = getenv('DATABASE_HOST');
        $user = getenv('DATABASE_USER');
        $password = getenv('DATABASE_PASSWORD');
        $dbName = getenv('DATABASE_NAME');

        $rutaImagenes = "public/images/";

        if(isset($_REQUEST["eliminar"])){
            $id = $_POST["id"] ?? null;

            if($id == null){
                echo "<div class='msg'>No se recibieron datos</div>";
                return;
            }

            $conn = mysqli_connect($host, $user, $password, $dbName) or
            die("Problemas con la conexion");
    
            $sql = "DELETE FROM familia WHERE id = $id";
            if (mysqli_query($conn, $sql) === TRUE) {
                echo "<div class='msg'>Registro eliminado con éxito</div>";
            } else {
                echo "Error eliminando el registro: " . mysqli_error($conn);
            }
            mysqli_close($conn);
        }


        if(isset($_REQUEST["registrar"])){

            $nombre = $_POST['nombre'] ?? null;
            $parentesco = $_POST['parentesco'] ?? null;
            $foto = $_FILES['foto'] ?? null;



            if ($nombre == null || $parentesco == null || $foto == null) {
                echo "<div class='msg'>No se recibieron datos</div>";
                return;
            }
            $archivo = $foto['name'];
            if (isset($archivo) && $archivo != "") {
                //Obtenemos algunos datos necesarios sobre el archivo
                $tipo = $foto['type'];
                $tamano = $foto['size'];
                $temp = $foto['tmp_name'];

                //Se comprueba si el archivo a cargar es correcto observando su extensión y tamaño
                if (!((strpos($tipo, "gif") || strpos($tipo, "jpeg") || strpos($tipo, "jpg") || strpos($tipo, "png")) && ($tamano < 2000000))) {
                    echo '<div class="msg"><b>Error. La extensión o el tamaño de los archivos no es correcta.<br/>
                    - Se permiten archivos .gif, .jpg, .png. y de 200 kb como máximo.</b></div>';
                } else {
                    //Si la imagen es correcta en tamaño y tipo
                    //Se intenta subir al servidor
                    if (move_uploaded_file($temp, $rutaImagenes . "" . $archivo)) {
                        //Cambiamos los permisos del archivo a 777 para poder modificarlo posteriormente
                        chmod($rutaImagenes . $archivo, 0777);
                        //Mostramos el mensaje de que se ha subido con éxito
                        echo '<div class="msg"><b>Se ha subido correctamente la imagen.</b></div>';

                        $rutaImagenGuardada = $rutaImagenes . $archivo;

                        $conn = mysqli_connect($host, $user, $password, $dbName) or
                        die("Problemas con la conexion");
                    
                        $sql = "INSERT INTO familia (nombre, parentesco, foto) VALUES ('$nombre', '$parentesco', '$rutaImagenGuardada')";
                        if (mysqli_query($conn, $sql) === TRUE) {
                            echo "<div class='msg'>Registro insertado con éxito</div>";
                        } else {
                            echo "Error insertando el registro: " . mysqli_error($conn);
                        }
                        mysqli_close($conn);
                    } else {
                        //Si no se ha podido subir la imagen, mostramos un mensaje de error
                        echo '<div class="msg"><b>Ocurrió algún error al subir el fichero. No pudo guardarse.</b></div>';
                    }
                }
            }
        }
            

        if(isset($_REQUEST["modificar"])){ 
            $id = $_POST['id'] ?? null; 
            $nombre = $_POST['nombre'] ?? null; 
            $parentesco = $_POST['parentesco'] ?? null; 
            $foto = $_FILES['foto'] ?? null; 
        
            if ($id == null) { 
                echo "<div class='msg'>No se recibieron datos</div>";
                return; 
            } 
        
            $conn = mysqli_connect($host, $user, $password, $dbName) or die("Problemas con la conexion"); 
        
            if(isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) { 
                //Obtenemos algunos datos necesarios sobre el archivo 
                $tipo = $foto['type']; 
                $tamano = $foto['size']; 
                $temp = $foto['tmp_name']; 
        
                //Se comprueba si el archivo a cargar es correcto observando su extensión y tamaño 
                if (!((strpos($tipo, "gif") || strpos($tipo, "jpeg") || strpos($tipo, "jpg") || strpos($tipo, "png")) && ($tamano < 2000000))) { 
                    echo '<div class"msg"><b>Error. La extensión o el tamaño de los archivos no es correcta.<br/> 
                    - Se permiten archivos .gif, .jpg, .png. y de 200 kb como máximo.</b></div>';
                } else { 
                    //Si la imagen es correcta en tamaño y tipo 
                    //Se intenta subir al servidor 
                    if (move_uploaded_file($temp, $rutaImagenes . "" . $foto['name'])) { 
                        //Cambiamos los permisos del archivo a 777 para poder modificarlo posteriormente 
                        chmod($rutaImagenes . $foto['name'], 0777); 
                        //Mostramos el mensaje de que se ha subido con éxito 
                        echo "<div class='msg'><b>Se ha subido correctamente la imagen.</b></div>";
                        $rutaImagenGuardada = $rutaImagenes . $foto['name']; 
                        $sql = "UPDATE familia SET nombre = '$nombre', parentesco = '$parentesco', foto = '$rutaImagenGuardada' WHERE id = $id"; 
                    } else { 
                        //Si no se ha podido subir la imagen, mostramos un mensaje de error 
                        echo "<div class='msg'><b>Ocurrió algún error al subir el fichero. No pudo guardarse.</b></div>";
                    }
                } 
            } else { 
                $sql = "UPDATE familia SET nombre = '$nombre', parentesco = '$parentesco' WHERE id = $id"; 
            } 
        
            if (mysqli_query($conn, $sql) === TRUE) { 
                echo "<div class='msg'>Registro actualizado con éxito</div>";
            } else { 
                echo "Error actualizando el registro: " . mysqli_error($conn); 
            } 
            mysqli_close($conn); 
        }
            
        ?>
        </form>
    </main>
</body>
<script>
    if(window.history.replaceState){
        window.history.replaceState(null, null, window.location.href)
    }
</script>
</html>