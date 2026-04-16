require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors'); // <--- 1. IMPORTA CORS
const cloudinary = require('./cloudinary');
const { Moto } = require('./models');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors()); // <--- 2. ACTIVA CORS (Para que Angular no te dé error)
app.use(express.json());

// CREATE: Subir moto con imagen
app.post('/motos', upload.single('imagen'), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        const nuevaMoto = await Moto.create({
            marca: req.body.marca,
            modelo: req.body.modelo,
            cilindrada: req.body.cilindrada,
            imagen_url: result.secure_url
        });
        res.status(201).json(nuevaMoto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ ALL: Ver todas
app.get('/motos', async (req, res) => {
    const motos = await Moto.findAll();
    res.json(motos);
});

// READ ONE: Buscar una específica por ID (Para ver detalles)
app.get('/motos/:id', async (req, res) => {
    try {
        const moto = await Moto.findByPk(req.params.id);
        if (!moto) return res.status(404).json({ error: "Moto no encontrada" });
        res.json(moto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE: Editar datos de una moto
app.put('/motos/:id', async (req, res) => {
    try {
        const moto = await Moto.findByPk(req.params.id);
        if (!moto) return res.status(404).json({ error: "No existe la moto" });
        
        await moto.update(req.body);
        res.json(moto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE: Borrar moto
app.delete('/motos/:id', async (req, res) => {
    try {
        await Moto.destroy({ where: { id: req.params.id } });
        res.json({ message: "Moto eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Servir archivos estáticos (para que se vea tu index.html y callrestapi.js)
// Asumiendo que tu index.html está en la raíz de la carpeta api-postgres
app.use(express.static(__dirname));

// Cambiamos el puerto para que use el que Render nos asigne
const PORT = process.env.PORT || 3000;

// Importa la conexión de tus modelos
const db = require('./models'); 

// Sincroniza la base de datos (Crea las tablas si no existen)
db.sequelize.sync({ alter: true })
  .then(() => console.log("Tablas sincronizadas con Aiven (Postgres)"))
  .catch(err => console.log(" Error al sincronizar: " + err.message));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 API Motos lista en puerto ${PORT}`);
});
