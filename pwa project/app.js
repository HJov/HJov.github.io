// Planet data storage using JSON
const planetsData = {
    "mercury": {
        "name": "Mercury",
        "info": "Mercury is the smallest and innermost planet in the Solar System. It completes an orbit around the Sun every 88 days, and is the closest planet to the Sun.",
        "image": "images/mercury.jpg"
    },
    "venus": {
        "name": "Venus",
        "info": "Venus is the second planet from the Sun and is Earth's closest planetary neighbor. It's the hottest planet in our solar system due to its thick atmosphere that traps heat.",
        "image": "images/venus.jpg"
    },
    "earth": {
        "name": "Earth",
        "info": "Earth is the third planet from the Sun and the only astronomical object known to harbor life. About 71% of Earth's surface is covered with water.",
        "image": "images/earth.jpg"
    },
    "mars": {
        "name": "Mars",
        "info": "Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System. It's often called the 'Red Planet' due to its reddish appearance.",
        "image": "images/mars.jpg"
    },
    "jupiter": {
        "name": "Jupiter",
        "info": "Jupiter is the fifth planet from the Sun and the largest in the Solar System. It's a gas giant with a mass one-thousandth that of the Sun.",
        "image": "images/jupiter.jpg"
    },
    "saturn": {
        "name": "Saturn",
        "info": "Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter. It's most notable for its prominent ring system.",
        "image": "images/saturn.jpg"
    },
    "uranus": {
        "name": "Uranus",
        "info": "Uranus is the seventh planet from the Sun. It's an ice giant with the third-largest diameter in our solar system and has a blue-green color due to methane in its atmosphere.",
        "image": "images/uranus.jpg"
    },
    "neptune": {
        "name": "Neptune",
        "info": "Neptune is the eighth and farthest planet from the Sun. It's the fourth-largest planet by diameter and the third-largest by mass, similar to Uranus.",
        "image": "images/neptune.jpg"
    }
};

// DOM elements
const canvas = document.getElementById('planetCanvas');
const ctx = canvas.getContext('2d');
const planetName = document.getElementById('planetName');
const planetInfo = document.getElementById('planetInfo');
const planetButtons = document.querySelectorAll('.planet-button');
const installButton = document.getElementById('install-button');

// Set canvas dimensions
function setCanvasDimensions() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

// Initial setup
setCanvasDimensions();
window.addEventListener('resize', setCanvasDimensions);

// Draw planet on canvas
function drawPlanet(imagePath) {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Create an image element
    const img = new Image();
    img.src = imagePath;
    
    // Draw the image when it loads
    img.onload = function() {
        const aspectRatio = img.width / img.height;
        
        // Calculate dimensions to maintain aspect ratio within canvas
        let width, height;
        if (canvas.width / canvas.height > aspectRatio) {
            height = canvas.height * 0.8;
            width = height * aspectRatio;
        } else {
            width = canvas.width * 0.8;
            height = width / aspectRatio;
        }
        
        // Center the image in the canvas
        const x = (canvas.width - width) / 2;
        const y = (canvas.height - height) / 2;
        
        // Draw the image
        ctx.drawImage(img, x, y, width, height);
    };
    
    // Error handling for image load
    img.onerror = function() {
        ctx.fillStyle = '#e94560';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Image not found', canvas.width / 2, canvas.height / 2);
    };
}

// Update planet information
function updatePlanetInfo(planet) {
    const data = planetsData[planet];
    
    if (data) {
        planetName.textContent = data.name;
        planetInfo.textContent = data.info;
        drawPlanet(data.image);
    }
}

// Event listeners for planet buttons
planetButtons.forEach(button => {
    button.addEventListener('click', function() {
        const planet = this.getAttribute('data-planet');
        updatePlanetInfo(planet);
    });
});

// PWA installation logic
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    // Update UI to notify the user they can add to home screen
    installButton.classList.remove('hidden');
});

installButton.addEventListener('click', async () => {
    if (deferredPrompt) {
        // Show the install prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        // We've used the prompt, and can't use it again, so clear it
        deferredPrompt = null;
        // Hide the install button
        installButton.classList.add('hidden');
    }
});

window.addEventListener('appinstalled', (evt) => {
    console.log('App was installed.');
    installButton.classList.add('hidden');
});

// Initial draw with default text
ctx.fillStyle = '#e6e6e6';
ctx.font = '20px Arial';
ctx.textAlign = 'center';
ctx.fillText('Select a planet to view', canvas.width / 2, canvas.height / 2);