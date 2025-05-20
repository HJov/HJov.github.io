// ===== register SW =====
if ('serviceWorker' in navigator){
  navigator.serviceWorker.register('/service-worker.js');
}

// ===== install prompt =====
let deferredPrompt, installBtn = document.getElementById('install');
window.addEventListener('beforeinstallprompt', e=>{
  e.preventDefault(); deferredPrompt = e; installBtn.hidden = false;
});
installBtn.addEventListener('click', async()=>{
  installBtn.hidden = true;
  deferredPrompt.prompt();
  if((await deferredPrompt.userChoice).outcome!=='accepted') installBtn.hidden=false;
  deferredPrompt = null;
});

// ===== dataset + UI =====
const ctx = document.getElementById('stage').getContext('2d');
const audio = new Audio(), menu = document.getElementById('menu');

fetch('./data/topics.json')
  .then(r=>r.json())
  .then(d=>init(d.planets));

function init(planets){
  planets.forEach((p,i)=>{
    const b=document.createElement('button');
    b.className='btn btn-primary m-1'; b.textContent=p.title;
    b.onclick=()=>show(p);
    menu.appendChild(b);
    if(i===0) show(p);    // render first item immediately
  });
}

function show({image,description,audio:audSrc}){
  const img=new Image();
  img.onload=()=>{
    ctx.clearRect(0,0,800,400);
    ctx.drawImage(img,0,0,800,400);
    ctx.fillStyle='white'; ctx.font='20px sans-serif';
    wrapText(description,20,360,760,24);
  };
  img.src=image;

  audio.src=audSrc; audio.play();
}

// simple text-wrapper for canvas
function wrapText(text,x,y,maxWidth,lineHeight){
  const words=text.split(' '); let line='';
  for(let n=0;n<words.length;n++){
    const test=line+words[n]+' ';
    if(ctx.measureText(test).width>maxWidth&&n>0){
      ctx.fillText(line,x,y); line=words[n]+' '; y+=lineHeight;
    }else line=test;
  }
  ctx.fillText(line,x,y);
}
