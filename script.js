document.addEventListener('DOMContentLoaded', () => {
    const pages = document.querySelectorAll('.page');
    const book = document.getElementById('book');
    let currentPage = 1;
    let isFireworksLaunched = false;

    // --- 1. Page Turning Logic ---
    function turnPage() {
        if (currentPage <= pages.length) {
            const pageToFlip = document.getElementById(`p${currentPage}`);
            if (pageToFlip) {
                pageToFlip.classList.add('turned-page');
                currentPage++;
                
                // បង្ខំឱ្យវីដេអូចាក់ និងព្យាយាមបើកសម្លេង
                const videos = pageToFlip.querySelectorAll('.flip-video');
                videos.forEach(video => {
                    // កំណត់ muted = false ដើម្បីព្យាយាមបើកសម្លេង
                    video.muted = false; 
                    video.play().catch(error => {
                        console.log("Autoplay with sound prevented:", error);
                        // ប្រសិនបើ Autoplay ជាមួយសម្លេងបរាជ័យ (ដោយសារ Browser) 
                        // វានៅតែបង្ហាញវីដេអូ, តែអ្នកមើលត្រូវចុចបើកសម្លេងដោយខ្លួនឯង
                        video.muted = true;
                        video.play();
                    });
                });
            }
        }
        
        // Launch fireworks when the book is first opened (Page 1 is clicked)
        if (currentPage === 2 && !isFireworksLaunched) {
            launchSingleFireworkShow();
            isFireworksLaunched = true;
        }
    }

    // Attach click listener to the entire book container
    book.addEventListener('click', turnPage);

    // --- 2. Single Full-Screen Firework Effect ---
    const fireworksContainer = document.getElementById('fireworks-container');

    function createExplosion(x, y, color) {
        const explosion = document.createElement('div');
        explosion.classList.add('firework-explosion');
        explosion.style.left = `${x}px`;
        explosion.style.top = `${y}px`;
        fireworksContainer.appendChild(explosion);

        // Create sparks in a circle
        for (let i = 0; i < 40; i++) {
            const spark = document.createElement('div');
            spark.classList.add('spark');
            spark.style.backgroundColor = color;
            
            // Randomize direction and distance
            const angle = Math.random() * 360;
            const distance = Math.random() * 150 + 50; 
            
            spark.style.transform = `rotate(${angle}deg) translateX(${distance}px)`;
            
            explosion.appendChild(spark);
        }

        // Remove the explosion element after the animation
        setTimeout(() => {
            explosion.remove();
        }, 1500); 
    }

    function launchSingleFireworkShow() {
        // Activate fireworks container visibility
        document.body.classList.add('firework-active');
        
        // Target position (near the top center of the screen)
        const targetX = window.innerWidth / 2;
        const targetY = window.innerHeight * 0.3; // Explode around 30% from the top
        const color = `hsl(${Math.random() * 360}, 100%, 70%)`;
        
        // 1. Create the shell (the line going up)
        const shell = document.createElement('div');
        shell.classList.add('firework-shell');
        shell.style.left = `${targetX}px`;
        shell.style.bottom = '0';
        fireworksContainer.appendChild(shell);
        
        // Define where the shell should fly to
        shell.style.setProperty('--target-y', `${window.innerHeight - targetY}px`);

        // 2. Explode after flight time
        setTimeout(() => {
            shell.remove();
            createExplosion(targetX, targetY, color);
            
            // Optional: Create a few delayed smaller explosions for dramatic effect
            setTimeout(() => { createExplosion(targetX - 100, targetY + 50, 'yellow'); }, 300);
            setTimeout(() => { createExplosion(targetX + 150, targetY - 70, 'cyan'); }, 600);
        }, 1000); // 1 second flight time

    }

    // Inject CSS for the new firework animation
    const style = document.createElement('style');
    style.innerHTML = `
        .firework-shell {
            position: absolute;
            width: 5px;
            height: 5px;
            background-color: white;
            border-radius: 50%;
            box-shadow: 0 0 10px white;
            animation: launch 1s ease-out forwards;
        }

        @keyframes launch {
            0% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(calc(var(--target-y) * -1)); opacity: 0; }
        }

        .firework-explosion {
            position: absolute;
            width: 10px;
            height: 10px;
        }
        
        .spark {
            position: absolute;
            width: 3px;
            height: 3px;
            border-radius: 50%;
            animation: trail 1.5s ease-out forwards;
        }

        @keyframes trail {
            0% { transform: scale(1) translate(0, 0); opacity: 1; }
            100% { transform: scale(0) translate(0, 0); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});