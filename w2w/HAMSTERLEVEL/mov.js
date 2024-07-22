document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;

    // Define CSS keyframes for falling and rotating animations
    const styleSheet = document.createElement('style');
    styleSheet.innerHTML = `
        @keyframes falling {
            to { top: ${window.innerHeight + 150}px; }
        }
        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(styleSheet);

    // Function to create and animate a juice box
    function createAndAnimateJuiceBox() {
        const img = document.createElement('img');
        img.src = 'w2w/HAMSTERLEVEL/favicon.gif';
        img.style.position = 'fixed';
        img.style.maxWidth = '80px';
        img.style.height = 'auto';
        img.style.zIndex = '15';
        img.style.pointerEvents = 'none';

        // Generate a random starting position
        const startX = Math.random() * window.innerWidth;
        img.style.left = `${startX}px`;

        // Adjust initial top position to start further off-screen
        img.style.top = '-150px'; // Start further above the screen

        // Append the image to the body
        body.appendChild(img);

        // Add animation for falling and rotating with random durations
        const fallingDuration = 4 + Math.random() * 2; // between 4 and 6 seconds
        const rotateDuration = 5 + Math.random(); // between 2 and 3 seconds
        img.style.animation = `falling ${fallingDuration}s linear forwards, rotate ${rotateDuration}s linear infinite`;

        // Remove the image after it has fallen out of view to clean up DOM
        setTimeout(() => {
            img.remove();
        }, fallingDuration * 1000); // Match the timeout to the falling duration
    }

    // Create initial set of juice boxes
    for (let i = 0; i < 9; i++) {
        createAndAnimateJuiceBox();
    }

    // Continuously create new juice boxes at random intervals
    setInterval(createAndAnimateJuiceBox, 1000); // Adjust interval as needed
});
