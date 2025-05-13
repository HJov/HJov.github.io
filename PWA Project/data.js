// Data Module for handling data loading and management

// Load topics from JSON file
export async function loadTopics() {
    try {
        const response = await fetch('data/topics.json');
        
        if (!response.ok) {
            throw new Error(`Failed to load topics: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.topics;
    } catch (error) {
        console.error('Error loading topics:', error);
        
        // Return fallback topics if JSON loading fails
        return getFallbackTopics();
    }
}

// Save user progress
export function saveUserProgress(topicId, completed = true) {
    try {
        // Get existing progress
        const progress = JSON.parse(localStorage.getItem('userProgress') || '{}');
        
        // Update progress for this topic
        progress[topicId] = {
            completed,
            timestamp: Date.now()
        };
        
        // Save updated progress
        localStorage.setItem('userProgress', JSON.stringify(progress));
        return true;
    } catch (error) {
        console.error('Failed to save progress:', error);
        return false;
    }
}

// Get user progress
export function getUserProgress() {
    try {
        return JSON.parse(localStorage.getItem('userProgress') || '{}');
    } catch (error) {
        console.error('Failed to load progress:', error);
        return {};
    }
}

// Calculate completion percentage
export function getCompletionPercentage(topics) {
    const progress = getUserProgress();
    const totalTopics = topics.length;
    const completedTopics = Object.values(progress).filter(p => p.completed).length;
    
    return totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
}

// Fallback topics in case the JSON file can't be loaded
function getFallbackTopics() {
    return [
        {
            id: "earth",
            title: "Earth",
            icon: "🌎",
            type: "planet",
            description: "Our home planet, Earth, is the third planet from the Sun and the only astronomical object known to harbor life. About 71% of Earth's surface is water-covered, with oceans constituting most of this water.",
            image: "images/earth.jpg",
            audio: "audio/earth.mp3"
        },
        {
            id: "mars",
            title: "Mars",
            icon: "🔴",
            type: "planet",
            description: "Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System. Mars is often called the 'Red Planet' due to its reddish appearance, which is caused by iron oxide (rust) on its surface.",
            image: "images/mars.jpg",
            audio: "audio/mars.mp3"
        },
        {
            id: "hubble",
            title: "Hubble Telescope",
            icon: "🔭",
            type: "spacecraft",
            description: "The Hubble Space Telescope is a space telescope that was launched into low Earth orbit in 1990 and remains in operation. It's one of the largest and most versatile space telescopes and has been instrumental in numerous astronomical discoveries.",
            image: "images/hubble.jpg",
            audio: "audio/hubble.mp3"
        },
        {
            id: "blackhole",
            title: "Black Holes",
            icon: "⚫",
            type: "phenomenon",
            description: "A black hole is a region of spacetime where gravity is so strong that nothing—no particles or even electromagnetic radiation such as light