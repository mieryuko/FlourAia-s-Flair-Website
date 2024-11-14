document.addEventListener("DOMContentLoaded", function() {
    const openOverlayBtns = document.querySelectorAll(".openOverlay");
    const overlays = document.querySelectorAll(".overlay");
    const closeBtns = document.querySelectorAll(".close-btn");
    const counters = {};
    openOverlayBtns.forEach(button => {
        button.addEventListener("click", function() {
            const overlayId = this.getAttribute("data-overlay");
            overlays.forEach(overlay => {
                overlay.style.display = "none"; // Hide all overlays
            });
            const overlay = document.getElementById(overlayId);
            overlay.style.display = "block"; // Show the selected overlay
            counters[overlayId] = 0;
            updateCounterDisplay(overlayId);
        });
    });
    closeBtns.forEach(closeBtn => {
        closeBtn.addEventListener("click", function() {
            const overlay = this.closest(".overlay");
            overlay.style.display = "none"; // Hide the overlay
        });
    });
    overlays.forEach(overlay => {
        overlay.addEventListener("click", function(event) {
            if (event.target === overlay) {
                overlay.style.display = "none"; // Hide overlay
            }
        });
    });
    overlays.forEach(overlay => {
        const incrementBtn = overlay.querySelector("#incrementBtn");
        const decrementBtn = overlay.querySelector("#decrementBtn");
        const overlayId = overlay.id;
        incrementBtn.addEventListener('click', () => {
            counters[overlayId]++;
            updateCounterDisplay(overlayId);
        });
        decrementBtn.addEventListener('click', () => {
            if (counters[overlayId] > 0) {
                counters[overlayId]--;
                updateCounterDisplay(overlayId);
            }
        });
    });
    function updateCounterDisplay(overlayId) {
        const counterValue = document.getElementById(overlayId).querySelector("#counterValue");
        counterValue.textContent = counters[overlayId];
    }
});