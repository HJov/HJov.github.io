// Get canvas and context
const canvas = document.getElementById('sceneCanvas');
const ctx = canvas.getContext('2d');

// Image paths
const imagePaths = {
    forest: 'https://img.freepik.com/free-vector/forest-scene-with-various-forest-trees_1308-57640.jpg?size=626&ext=jpg',
    beach: 'https://img.freepik.com/free-vector/beach-background-flat-design_23-2147820968.jpg?size=626&ext=jpg',
    space: 'https://img.freepik.com/free-vector/watercolor-galaxy-background_52683-63441.jpg?size=626&ext=jpg',
    character: 'https://img.freepik.com/free-vector/cute-astronaut-character-icon-illustration-space-icon-concept-flat-cartoon-style_138676-2053.jpg?size=338&ext=jpg',
    tree: 'https://img.freepik.com/free-vector/tree-cartoon-style-isolated-white-background_1308-62098.jpg?size=338&ext=jpg',
    cloud: 'https://img.freepik.com/free-vector/cartoon-cloud-set-isolated-white-background_1308-68445.jpg?size=626&ext=jpg',
    bird: 'https://img.freepik.com/free-vector/cute-bird-minimal-flat-cartoon-illustration_193606-363.jpg?size=338&ext=jpg',
};

// Load images
const images = {};
let loadedCount = 0;
const totalImages = Object.keys(imagePaths).length;

for (const key in imagePaths) {
    images[key] = new Image();
    images[key].src = imagePaths[key];
    images[key].onload = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
            // All images loaded, draw initial scene
            updateScene();
        }
    };
}

// Scene state
const state = {
    background: 'forest',
    characterX: 300,
    showItem1: true, // tree
    showItem2: true, // cloud
    showItem3: true  // bird
};

// Update scene based on current state
function updateScene() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    if (images[state.background]) {
        ctx.drawImage(images[state.background], 0, 0, canvas.width, canvas.height);
    }
    
    // Draw items if enabled
    if (state.showItem1 && images.tree) {
        ctx.drawImage(images.tree, 100, 250, 80, 100);
    }
    
    if (state.showItem2 && images.cloud) {
        ctx.drawImage(images.cloud, 450, 50, 100, 60);
    }
    
    if (state.showItem3 && images.bird) {
        ctx.drawImage(images.bird, 400, 200, 60, 60);
    }
    
    // Draw character
    if (images.character) {
        ctx.drawImage(images.character, state.characterX, 250, 70, 70);
    }
}

// Event Listeners

// Background radio buttons
const backgroundRadios = document.querySelectorAll('input[name="background"]');
backgroundRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        state.background = e.target.value;
        updateScene();
    });
});

// Character position slider
const slider = document.getElementById('positionSlider');
const sliderValue = document.getElementById('sliderValue');

slider.addEventListener('input', (e) => {
    state.characterX = parseInt(e.target.value);
    sliderValue.textContent = state.characterX;
    updateScene();
});

// Item checkboxes
document.getElementById('item1').addEventListener('change', (e) => {
    state.showItem1 = e.target.checked;
    updateScene();
});

document.getElementById('item2').addEventListener('change', (e) => {
    state.showItem2 = e.target.checked;
    updateScene();
});

document.getElementById('item3').addEventListener('change', (e) => {
    state.showItem3 = e.target.checked;
    updateScene();
});

// Sound buttons
document.getElementById('soundEffect1').addEventListener('click', () => {
    playSound('birdSound');
});

document.getElementById('soundEffect2').addEventListener('click', () => {
    playSound('windSound');
});

document.getElementById('soundEffect3').addEventListener('click', () => {
    playSound('magicSound');
});

// Helper function to play sounds
function playSound(id) {
    const sound = document.getElementById(id);
    sound.currentTime = 0; // Reset to start
    sound.play();
}