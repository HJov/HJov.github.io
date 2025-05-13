// Main App Logic
import { loadTopics } from './data.js';
import { CanvasManager } from './canvas-manager.js';

// DOM Elements
const spaceCanvas = document.getElementById('spaceCanvas');
const topicTitle = document.getElementById('topicTitle');
const topicDescription = document.getElementById('topicDescription');
const topicMenu = document.getElementById('topicMenu');
const audioPlayer = document.getElementById('audioPlayer');
const playAudioBtn = document.getElementById('playAudioBtn');
const loadingIndicator = document.getElementById('loadingIndicator');
const installButton = document.getElementById('install-button');

// State variables
let topics = [];
let currentTopicIndex = 0;
let canvasManager;
let deferredPrompt;

// Initialize the application
async function initApp() {
    try {
        // Initialize canvas
        canvasManager = new CanvasManager(spaceCanvas);
        
        // Load topics from JSON
        topics = await loadTopics();
        
        // Generate topic buttons
        generateTopicMenu(topics);
        
        // Set initial content
        setActiveTopicByIndex(0);
        
        // Hide loading indicator
        loadingIndicator.classList.add('d-none');
        
        // Setup event listeners
        setupEventListeners();
        
    } catch (error) {
        console.error('Failed to initialize app:', error);
        topicDescription.textContent = 'Failed to load app content. Please refresh the page or try again later.';
        loadingIndicator.classList.add('d-none');
    }
}

// Generate topic menu buttons
function generateTopicMenu(topics) {
    topicMenu.innerHTML = '';
    
    topics.forEach((topic, index) => {
        const colDiv = document.createElement('div');
        colDiv.className = 'col-6 col-md-4 col-lg-3';
        
        const button = document.createElement('button');
        button.className = 'topic-button w-100';
        button.setAttribute('data-index', index);
        button.innerHTML = `
            <span class="topic-icon">${topic.icon}</span>
            <span>${topic.title}</span>
        `;
        
        button.addEventListener('click', () => {
            setActiveTopicByIndex(index);
        });
        
        colDiv.appendChild(button);
        topicMenu.appendChild(colDiv);
    });
}

// Set active topic by index
function setActiveTopicByIndex(index) {
    if (index < 0 || index >= topics.length) return;
    
    currentTopicIndex = index;
    const topic = topics[currentTopicIndex];
    
    // Update active button styles
    const buttons = document.querySelectorAll('.topic-button');
    buttons.forEach((btn, i) => {
        if (i === index) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update content
    topicTitle.textContent = topic.title;
    topicDescription.textContent = topic.description;
    
    // Update audio source
    audioPlayer.src = topic.audio;
    audioPlayer.load();
    
    // Update canvas
    canvasManager.loadScene(topic);
    
    // Save user's last viewed topic
    localStorage.setItem('lastViewedTopic', index);
}

// Setup event listeners
function setupEventListeners() {
    // Audio playback
    playAudioBtn.addEventListener('click', () => {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playAudioBtn.innerHTML = '<i class="bi bi-pause-fill"></i> Pause';
        } else {
            audioPlayer.pause();
            playAudioBtn.innerHTML = '<i class="bi bi-volume-up-fill"></i> Listen';
        }
    });
    
    // Reset audio button when audio ends
    audioPlayer.addEventListener('ended', () => {
        playAudioBtn.innerHTML = '<i class="bi bi-volume-up-fill"></i> Listen';
    });
    
    // Window resize event for canvas resizing
    window.addEventListener('resize', () => {
        canvasManager.resizeCanvas();
    });
    
    // Handle PWA installation
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later
        deferredPrompt = e;
        // Update UI to notify the user they can install the PWA
        installButton.classList.remove('d-none');
    });
    
    installButton.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        
        // Show the install prompt
        deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to install prompt: ${outcome}`);
        
        // We've used the prompt, and can't use it again, so clear it
        deferredPrompt = null;
        
        // Hide the install button
        installButton.classList.add('d-none');
    });
    
    // Handle app installed
    window.addEventListener('appinstalled', () => {
        console.log('PWA was installed');
        // Hide the install button
        installButton.classList.add('d-none');
    });
}

// Check if app is already installed
function checkIfInstalled() {
    if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('App is already installed');
        installButton.classList.add('d-none');
    }
}

// Check for a previously viewed topic
function loadLastViewedTopic() {
    const lastViewedIndex = localStorage.getItem('lastViewedTopic');
    if (lastViewedIndex !== null) {
        const index = parseInt(lastViewedIndex, 10);
        if (!isNaN(index) && index >= 0 && index < topics.length) {
            setActiveTopicByIndex(index);
        }
    }
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    checkIfInstalled();
});

// Export functions for potential use by other modules
export { setActiveTopicByIndex };