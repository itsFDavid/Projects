<?php


class Database {
    private $dbname;
    private $host;
    private $username;
    private $password;

    public function __construct() {
        $this->host = getenv('DATABASE_HOST');
        $this->username = getenv('DB_USERNAME');
        $this->password = getenv('DB_PASSWORD');
        $this->dbname = getenv('DATABASE_NAME');
    }

    public function insertIntoFamily($nombre, $parentesco, $foto){
        $conn = mysqli_connect($this->host, $this->username, $this->password, $this->dbname) 
        or die("Conexion Fallida");

        $sql = "INSERT INTO familia (nombre, parentesco, foto) VALUES ('$nombre', '$parentesco', '$foto')";
        if (mysqli_query($conn, $sql) === TRUE) {
            echo "Registro insertado con éxito";
        } else {
            echo "Error insertando el registro: " . mysqli_error($conn);
        }
        mysqli_close($conn);
    }

    public function selectFromFamily(){
        $conn = mysqli_connect($this->host, $this->username, $this->password, $this->dbname)
        or die("Conexion Fallida");

        $sql = "SELECT * FROM familia";
        $result = mysqli_query($conn, $sql) or die("Error en la consulta: " . mysqli_error($conn));

        while($person = mysqli_fetch_array($result)){
            echo "<div class='persona'>";
            echo "<img src='" . $person['foto'] . "' alt=''>";
            echo "<p>" . $person['nombre'] . "</p>";
            echo "<p>" . $person['parentesco'] . "</p>";
            echo "</div>";
        }

        mysqli_close($conn);
    }

    public function deleteFromFamily($id){
        $conn = mysqli_connect($this->host, $this->username, $this->password, $this->dbname)
        or die("Conexion Fallida");

        $sql = "DELETE FROM familia WHERE id = $id";
        if (mysqli_query($conn, $sql) === TRUE) {
            echo "Registro eliminado con éxito";
        } else {
            echo "Error eliminando el registro: " . mysqli_error($conn);
        }
        mysqli_close($conn);
    }

    public function updateFamily($id, $nombre, $parentesco, $foto){
        $conn = mysqli_connect($this->host, $this->username, $this->password, $this->dbname)
        or die("Conexion Fallida");

        $sql = "UPDATE familia 
        SET nombre = '$nombre',
        parentesco = '$parentesco', 
        foto = '$foto' 
        WHERE id = $id";

        if (mysqli_query($conn, $sql) === TRUE) {
            echo "Registro actualizado con éxito";
        } else {
            echo "Error actualizando el registro: " . mysqli_error($conn);
        }
        mysqli_close($conn);
    }
}
?>
