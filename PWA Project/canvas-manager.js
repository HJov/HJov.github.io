// Canvas Manager for handling all canvas operations
export class CanvasManager {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext('2d');
        this.images = {};
        this.currentScene = null;
        this.animationId = null;
        this.stars = this.generateStars(200);
        this.particleEffects = [];
        
        // Initialize canvas size
        this.resizeCanvas();
    }
    
    // Resize canvas to maintain aspect ratio
    resizeCanvas() {
        const containerWidth = this.canvas.parentElement.clientWidth;
        this.canvas.width = containerWidth;
        this.canvas.height = containerWidth * 0.5625; // 16:9 aspect ratio
        
        // Redraw current scene after resize
        if (this.currentScene) {
            this.drawScene(this.currentScene);
        } else {
            this.drawWelcomeScene();
        }
    }
    
    // Load a new scene based on topic
    async loadScene(topic) {
        // Cancel any ongoing animation
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        this.currentScene = topic;
        
        // Load image if not already loaded
        if (!this.images[topic.id]) {
            try {
                this.images[topic.id] = await this.loadImage(topic.image);
            } catch (error) {
                console.error(`Failed to load image for ${topic.title}:`, error);
                // Use a placeholder or fallback image
                this.images[topic.id] = null;
            }
        }
        
        // Start animation for this scene
        this.animateScene();
    }
    
    // Load an image and return a promise
    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
            img.src = src;
        });
    }
    
    // Generate star field
    generateStars(count) {
        const stars = [];
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random(),
                y: Math.random(),
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.7 + 0.3,
                twinkleSpeed: Math.random() * 0.02 + 0.005
            });
        }
        return stars;
    }
    
    // Draw starry background
    drawStarryBackground() {
        const { width, height } = this.canvas;
        
        // Draw gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#0a1128');
        gradient.addColorStop(1, '#1c2e4a');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, width, height);
        
        // Draw stars
        const now = Date.now() / 1000;
        
        this.stars.forEach(star => {
            const twinkle = Math.sin(now * star.twinkleSpeed * 10) * 0.2 + 0.8;
            
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`;
            this.ctx.beginPath();
            this.ctx.arc(
                star.x * width,
                star.y * height,
                star.size,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
        });
    }
    
    // Draw welcome scene
    drawWelcomeScene() {
        this.drawStarryBackground();
        
        const { width, height } = this.canvas;
        
        // Draw welcome text
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 32px Arial, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('Welcome to Space Explorer', width / 2, height / 2 - 20);
        
        this.ctx.font = '20px Arial, sans-serif';
        this.ctx.fillText('Select a topic below to begin your journey', width / 2, height / 2 + 20);
    }
    
    // Draw scene for specific topic
    drawScene(topic) {
        this.drawStarryBackground();
        
        const { width, height } = this.canvas;
        const image = this.images[topic.id];
        
        if (image) {
            // Calculate dimensions to maintain aspect ratio
            const scale = Math.min(0.8, 0.8 * (width / image.width));
            const imgWidth = image.width * scale;
            const imgHeight = image.height * scale;
            
            // Center image
            const x = (width - imgWidth) / 2;
            const y = (height - imgHeight) / 2;
            
            // Apply animation based on topic type
            if (topic.type === 'planet') {
                this.drawPlanet(image, x, y, imgWidth, imgHeight);
            } else if (topic.type === 'spacecraft') {
                this.drawSpacecraft(image, x, y, imgWidth, imgHeight);
            } else if (topic.type === 'phenomenon') {
                this.drawPhenomenon(image, x, y, imgWidth, imgHeight);
            } else {
                // Default drawing
                this.ctx.drawImage(image, x, y, imgWidth, imgHeight);
            }
        } else {
            // Fallback if image not available
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = 'bold 24px Arial, sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(topic.title, width / 2, height / 2);
        }
        
        // Draw interactive particles
        this.updateAndDrawParticles();
    }
    
    // Draw planet with rotation effect
    drawPlanet(image, x, y, width, height) {
        const centerX = x + width / 2;
        const centerY = y + height / 2;
        const time = Date.now() / 1000;
        
        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(time * 0.05); // Slow rotation
        this.ctx.drawImage(image, -width / 2, -height / 2, width, height);
        this.ctx.restore();
    }
    
    // Draw spacecraft with slight floating effect
    drawSpacecraft(image, x, y, width, height) {
        const time = Date.now() / 1000;
        const floatY = Math.sin(time) * 5; // Floating effect
        
        this.ctx.drawImage(image, x, y + floatY, width, height);
    }
    
    // Draw astronomical phenomenon with glow effect
    drawPhenomenon(image, x, y, width, height) {
        const centerX = x + width / 2;
        const centerY = y + height / 2;
        const time = Date.now() / 1000;
        
        // Draw glow effect
        const glowSize = 20 + Math.sin(time * 2) * 10;
        const gradient = this.ctx.createRadialGradient(
            centerX, centerY, width / 3,
            centerX, centerY, width / 2 + glowSize
        );
        
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, width / 2 + glowSize, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw the image
        this.ctx.drawImage(image, x, y, width, height);
    }
    
    // Add interactive particle effect on click
    addParticleEffect(x, y, color = '#ffffff') {
        for (let i = 0; i < 20; i++) {
            this.particleEffects.push({
                x,
                y,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 10,
                speedY: (Math.random() - 0.5) * 10,
                color,
                life: 1.0 // Full life
            });
        }
    }
    
    // Update and draw particles
    updateAndDrawParticles() {
        for (let i = this.particleEffects.length - 1; i >= 0; i--) {
            const particle = this.particleEffects[i];
            
            // Update particle position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.life -= 0.02; // Decrease life
            
            // Draw particle
            this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.life})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Remove dead particles
            if (particle.life <= 0) {
                this.particleEffects.splice(i, 1);
            }
        }
    }
    
    // Animate the current scene
    animateScene() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw current scene
        if (this.currentScene) {
            this.drawScene(this.currentScene);
        } else {
            this.drawWelcomeScene();
        }
        
        // Continue animation loop
        this.animationId = requestAnimationFrame(() => this.animateScene());
    }
    
    // Handle canvas click for interactive elements
    handleClick(x, y) {
        // Add particle effect on click
        this.addParticleEffect(x, y);
        
        // Add additional interactive behaviors as needed
    }
}