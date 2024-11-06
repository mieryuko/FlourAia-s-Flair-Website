document.addEventListener('DOMContentLoaded', function() {
    let currentIndex = 0;
    const slides = document.querySelectorAll('.wrapper');
    const totalSlides = slides.length;

    // Check if slides are found
    if (totalSlides === 0) {
        console.error('No slides found!');
        return; // Exit if no slides are found
    }

    // Function to show slides
    function showSlides() {
        const slider = document.querySelector('.slider');
        
        // If we've reached the end, reset to the beginning instantly
        if (currentIndex === totalSlides) {
            // Disable transition for instant jump
            slider.style.transition = 'none'; 
            currentIndex = 0; // Reset to the first slide
            slider.style.transform = `translateX(0vw)`; // Jump back to the first slide

            // Re-enable transition for the next normal slide
            setTimeout(() => {
                slider.style.transition = 'transform 0.5s ease'; // Re-enable transition
            }, 20); // Small delay to ensure the transition is applied
        } else {
            const offset = -currentIndex * 100;     
            slider.style.transform = `translateX(${offset}vw)`; // Apply the transform for the current slide
        }

        // Increment the current index
        currentIndex++;

        // If we've reached the end, reset the current index to show the first slide on the next iteration
        if (currentIndex > totalSlides) {
            currentIndex = totalSlides; // Set to totalSlides to trigger the reset on the next call
        }
    }

    // Start the slideshow automatically every 1 second (1000 milliseconds)
    setInterval(showSlides, 1000); // Adjusted to 1000 ms for quick transitions

    // Initial call to show the first slide immediately
    showSlides();
});