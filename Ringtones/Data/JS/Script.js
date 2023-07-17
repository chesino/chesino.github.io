let audio1 = new Audio();
audio1.src = "./Dont Côi.mp3";

const container = document.getElementById("container");
const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let audioSource = audioCtx.createMediaElementSource(audio1);
let analyser = audioCtx.createAnalyser();

audioSource.connect(analyser);
analyser.connect(audioCtx.destination);
analyser.fftSize = 128 * 16;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
const barWidth = canvas.width / bufferLength * 2;
let x = 0;

function playAudio() {
    audio1.play();
}

function animate() {
    x = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArray);
    drawVisualizer({
        bufferLength,
        dataArray,
        barWidth
    });
    requestAnimationFrame(animate);
}

function drawVisualizer({ bufferLength, dataArray, barWidth }) {
    let barHeight;
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        const red = (i * barHeight);
        const green = i;
        const blue = barHeight;
        ctx.fillStyle = `rgb(${green}, ${blue}, ${red})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth;
    }
}

animate();

container.addEventListener("click", playAudio);
