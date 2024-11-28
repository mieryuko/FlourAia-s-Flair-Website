document.addEventListener("DOMContentLoaded", function() {
    const openOverlayBtns = document.querySelectorAll(".openOverlay");
    const overlays = document.querySelectorAll(".overlay");
    const closeBtns = document.querySelectorAll(".close-btn");
    const counters = {};

// Function to initialize color select functionality
    function initializeColorSelect(select) {
        // Add change event listener
        select.addEventListener('change', function() {
            const otherInputContainer = this.parentElement.querySelector('.hidden');
            if (this.value === 'other') {
                otherInputContainer.style.display = 'block';
            } else {
                otherInputContainer.style.display = 'none';
            }
        });
        
        // Check initial value
        if (select.value === 'other') {
            const otherInputContainer = select.parentElement.querySelector('.hidden');
            if (otherInputContainer) {
                otherInputContainer.style.display = 'block';
            }
        }
    }

    // Initialize all existing color selects
    document.querySelectorAll('.color-select').forEach(select => {
        initializeColorSelect(select);
    });


    // Add new color dropdown functionality
    document.querySelectorAll('.button-add-color').forEach(button => {
        button.addEventListener('click', function() {
            const colorDropdowns = this.previousElementSibling;
            const newColorDropdown = colorDropdowns.querySelector('.color-dropdowns').cloneNode(true);
            
            // Reset the new dropdown's selection and hide the "other" input
            const select = newColorDropdown.querySelector('.color-select');
            select.value = 'white';
            newColorDropdown.querySelector('.hidden').style.display = 'none';

            
            
            // Add event listener to the new color select
            select.addEventListener('change', function() {
                const otherInputContainer = this.parentElement.querySelector('.hidden');
                if (this.value === 'other') {
                    otherInputContainer.style.display = 'block';
                } else {
                    otherInputContainer.style.display = 'none';
                }
            });

            colorDropdowns.appendChild(newColorDropdown);
        });
    });

    openOverlayBtns.forEach(button => {
        button.addEventListener("click", function() {
            const overlayId = this.getAttribute("data-overlay");
            overlays.forEach(overlay => {
                overlay.style.display = "none";
            });
            const overlay = document.getElementById(overlayId);
            overlay.style.display = "flex"; // Changed to flex for better centering
            overlay.style.alignItems = "flex-start"; // Align items at the top
            overlay.style.justifyContent = "center"; // Center horizontally
            counters[overlayId] = 1;
            updateCounterDisplay(overlayId);

            // Reset scroll position
            overlay.querySelector('.overlay-content').scrollTop = 0;
            
            // Ensure the body doesn't scroll when overlay is open
            document.body.style.overflow = 'hidden';
        });
    });

    closeBtns.forEach(closeBtn => {
        closeBtn.addEventListener("click", function() {
            const overlay = this.closest(".overlay");
            overlay.style.display = "none";
            // Restore body scroll when overlay is closed
            document.body.style.overflow = '';
        });
    });

    overlays.forEach(overlay => {
        overlay.addEventListener("click", function(event) {
            if (event.target === overlay) {
                overlay.style.display = "none";
                // Restore body scroll when overlay is closed
                document.body.style.overflow = '';
            }
        });

        const incrementBtn = overlay.querySelector(".incrementBtn");
        const decrementBtn = overlay.querySelector(".decrementBtn");
        const overlayId = overlay.id;

        if (incrementBtn && decrementBtn) {
            incrementBtn.addEventListener('click', () => {
                counters[overlayId] = (counters[overlayId] || 1) + 1;
                updateCounterDisplay(overlayId);
            });

            decrementBtn.addEventListener('click', () => {
                if (counters[overlayId] > 1) {
                    counters[overlayId]--;
                    updateCounterDisplay(overlayId);
                }
            });
        }
    });

    function updateCounterDisplay(overlayId) {
        const counterValue = document.getElementById(overlayId).querySelector(".counterValue");
        if (counterValue) {
            counterValue.textContent = counters[overlayId];
        }
    }
});
