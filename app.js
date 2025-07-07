const palette = document.getElementById("color-palette");
const preview = document.getElementById("colores-seleccionados");
const whatsappBtn = document.getElementById("whatsapp-btn");
const cameraBtn = document.getElementById("camera-toggle");
const video = document.getElementById("camera-feed");
let stream = null;
let seleccionados = [];

// Paleta tipo círculo cromático
const total = 256;
for (let i = 0; i < total; i++) {
  const angle = (i / total) * 2 * Math.PI;
  const hue = Math.floor((i / total) * 360);
  const color = `hsl(${hue}, 100%, 50%)`;

  const div = document.createElement("div");
  div.className = "color-box";
  div.style.backgroundColor = color;
  const radius = 45;
  const x = 50 + radius * Math.cos(angle);
  const y = 50 + radius * Math.sin(angle); // círculo completo
  div.style.left = `${x}%`;
  div.style.top = `${y}%`;
  div.style.transform = `translate(-50%, -50%)`;

  div.addEventListener("click", () => {
    const hex = hslToHex(hue, 100, 50);
    document.body.style.backgroundColor = hex;

    if (div.classList.contains("seleccionado")) {
      div.classList.remove("seleccionado");
      seleccionados = seleccionados.filter(c => c !== hex);
    } else {
      div.classList.add("seleccionado");
      seleccionados.push(hex);
    }

    actualizarVistaPrevia();
  });

  palette.appendChild(div);
}

function actualizarVistaPrevia() {
  preview.innerHTML = "";
  seleccionados.forEach(hex => {
    const box = document.createElement("div");
    box.className = "color-box";
    box.style.backgroundColor = hex;
    preview.appendChild(box);
  });

  if (seleccionados.length) {
    const texto = `Colores seleccionados: ${seleccionados.join(", ")}`;
    const numero = "+59899751622"; // CAMBIA AQUÍ tu número real de WhatsApp
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
    whatsappBtn.href = url;
    whatsappBtn.style.display = "inline-flex";
  } else {
    whatsappBtn.style.display = "none";
  }
}

function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  let c = (1 - Math.abs(2 * l - 1)) * s;
  let x = c * (1 - Math.abs((h / 60) % 2 - 1));
  let m = l - c / 2;
  let [r, g, b] = [0, 0, 0];

  if (0 <= h && h < 60) [r, g, b] = [c, x, 0];
  else if (60 <= h && h < 120) [r, g, b] = [x, c, 0];
  else if (120 <= h && h < 180) [r, g, b] = [0, c, x];
  else if (180 <= h && h < 240) [r, g, b] = [0, x, c];
  else if (240 <= h && h < 300) [r, g, b] = [x, 0, c];
  else if (300 <= h && h < 360) [r, g, b] = [c, 0, x];

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return "#" + [r, g, b].map(x =>
    x.toString(16).padStart(2, "0")
  ).join("");
}

function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(x =>
    x.toString(16).padStart(2, "0")
  ).join("");
}

// Activar cámara y selección manual de color
cameraBtn.addEventListener("click", async () => {
  if (stream) {
    stream.getTracks().forEach(t => t.stop());
    stream = null;
    video.style.display = "none";
    video.removeEventListener("click", onVideoClick);
  } else {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      video.srcObject = stream;
      video.style.display = "block";
      video.addEventListener("click", onVideoClick);
    } catch (err) {
      alert("No se pudo acceder a la cámara: " + err.message);
    }
  }
});

// Función que captura color al hacer clic en el video
function onVideoClick(event) {
  const rect = video.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const scaleX = video.videoWidth / rect.width;
  const scaleY = video.videoHeight / rect.height;
  const pixel = ctx.getImageData(x * scaleX, y * scaleY, 1, 1).data;
  const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);

  document.body.style.backgroundColor = hex;

  if (!seleccionados.includes(hex)) {
    seleccionados.push(hex);
    actualizarVistaPrevia();
  }
  alert("Color seleccionado: " + hex);
}
