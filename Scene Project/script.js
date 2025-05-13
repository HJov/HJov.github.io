const canvas = document.getElementById('sceneCanvas');
const ctx = canvas.getContext('2d');

const backgroundImage = new Image();
backgroundImage.src = 'images/Pokemon_Background.jpeg';

const Charizard = new Image();
Charizard.src = 'images/Charizard.jpeg';

const Blastoise = new Image();
Blastoise.src = 'images/Blastoise.jpeg';

Promise.all([
    new Promise(resolve => backgroundImage.onload = resolve),
    new Promise(resolve => Charizard.onload = resolve),
    new Promise(resolve => Blastoise.onload = resolve)
]).then(() => {
    drawScene();
});

function drawScene() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    
    ctx.drawImage(Blastoise, 10, 300, 300, 200);
    
    ctx.drawImage(Charizard, 470, 300, 300, 200);
    
    ctx.font = 'bold 40px Arial';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    
    ctx.fillText('Pokemon Arena', canvas.width / 2, 80);

    ctx.font = 'italic 24px Arial';
    ctx.fillText('Habab', canvas.width / 2, 120);
    
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
}