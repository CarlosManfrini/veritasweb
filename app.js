const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// Conexión a la base de datos MongoDB
mongoose.connect('mongodb://localhost/votos', { useNewUrlParser: true, useUnifiedTopology: true });

// Configurar sesiones
app.use(session({
  secret: 'secret_key',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost/votos' }),
}));

// Configurar middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Rutas
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

app.use('/', indexRouter);
app.use('/auth', authRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
let stream = null;
const video = document.getElementById('cameraStream');
const toggleBtn = document.getElementById('toggleCamera');

toggleBtn.addEventListener('click', async () => {
    if (!stream) {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            video.style.display = 'block';
        } catch (err) {
            alert('No se pudo acceder a la cámara.');
            console.error(err);
        }
    } else {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        video.style.display = 'none';
        stream = null;
    }
});

