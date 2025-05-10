const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const app = express();
const port = 3000;

// Middleware para manejar CORS y datos JSON.
app.use(cors());
app.use(express.json()); // Para parsear cuerpos de solicitudes en formato JSON.

// Configuración de conexión a la base de datos.
const dbConfig = {
  user: "root",
  password: "root",
  server: "172.30.30.35",
  database: "BIBLIOTECA",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

// Ruta para obtener datos de la tabla LIBRO.
app.get("/get-data", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query("SELECT * FROM LIBRO");
    res.json(result.recordset);
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    res.status(500).send("Error al conectar a la base de datos");
  }
});

// Ruta para insertar datos en la tabla LIBRO.
app.post("/add-book", async (req, res) => {
  const { Titulo, Autor, Fecha, ISBN } = req.body; // Datos enviados desde el cliente.
  try {
    const pool = await sql.connect(dbConfig);

    // Consulta SQL para insertar un nuevo registro.
    await pool
      .request()
      .input("Titulo", sql.VarChar, Titulo)
      .input("Autor", sql.VarChar, Autor)
      .input("Fecha", sql.Date, Fecha)
      .input("ISBN", sql.VarChar, ISBN)
      .query(
        "INSERT INTO LIBRO (Titulo, Autor, Fecha, ISBN) VALUES (@Titulo, @Autor, @Fecha, @ISBN)"
      );

    res.send("Libro agregado exitosamente.");
  } catch (error) {
    console.error("Error al insertar en la base de datos:", error);
    res.status(500).send("Error al insertar en la base de datos");
  }
});

// Inicia el servidor.
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
