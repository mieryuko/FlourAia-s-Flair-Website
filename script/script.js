document.addEventListener('DOMContentLoaded', function() {
    // Initialize slider if it exists
    const slides = document.querySelectorAll('.wrapper');
    if (slides.length > 0) {
        let currentIndex = 0;
        const totalSlides = slides.length;
        
        function showSlides() {
            const slider = document.querySelector('.slider');
            if (!slider) return;
            
            if (currentIndex === totalSlides) {
                slider.style.transition = 'none';
                currentIndex = 0;
                slider.style.transform = `translateX(0vw)`;
                
                setTimeout(() => {
                    slider.style.transition = 'transform 0.5s ease';
                }, 20);
            } else {
                const offset = -currentIndex * 100;
                slider.style.transform = `translateX(${offset}vw)`;
            }
            
            currentIndex++;
            if (currentIndex > totalSlides) {
                currentIndex = totalSlides;
            }
        }
        
        setInterval(showSlides, 2000);
        showSlides();
    }
    const openOverlayBtns = document.querySelectorAll(".openOverlay");
    const overlays = document.querySelectorAll(".overlay");
    const closeBtns = document.querySelectorAll(".close-btn");
const counters = {};
    
    // Initialize counter values for each overlay
    document.querySelectorAll('.overlay').forEach(overlay => {
        counters[overlay.id] = 1;
    });

    // Handle increment/decrement buttons
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('incrementBtn') || event.target.classList.contains('decrementBtn')) {
            const overlay = event.target.closest('.overlay');
            const counter = overlay.querySelector('.counterValue');
            const currentValue = parseInt(counter.textContent);
            
            if (event.target.classList.contains('incrementBtn')) {
                counter.textContent = currentValue + 1;
                counters[overlay.id] = currentValue + 1;
            } else if (currentValue > 1) {
                counter.textContent = currentValue - 1;
                counters[overlay.id] = currentValue - 1;
            }
        }
    });

    function isBuildYourBoxOverlay(overlay) {
        return overlay.dataset.isBuildYourBox === 'true' ||  overlay.dataset.browniecategory === 'true'; 
    }

    function getOverlayInfo(overlay) {
        const name = overlay.querySelector('.itemName')?.textContent || '';
        const priceText = overlay.querySelector('.productprice')?.textContent || '₱0';
        const price = parseFloat(priceText.replace('₱', '').replace(',', '')) || 0;
        const imgSrc = overlay.querySelector('.overlayImg img')?.src || '';
        const quantity = counters[overlay.id] || 1; 
    
        let flavors = [];
    
        
        const boxSelection = overlay.querySelector('.boxOfs');
        const selectedBoxSize = boxSelection ? boxSelection.options[boxSelection.selectedIndex]?.text : 'None';
        flavors.push(`Box: ${selectedBoxSize}`); 
    
        
        const cakeBaseSelection = overlay.querySelector('#cakebase');
        if (cakeBaseSelection) {
            const selectedCakeBase = cakeBaseSelection.options[cakeBaseSelection.selectedIndex]?.text || 'None';
            flavors.push(`Base: ${selectedCakeBase}`); 
        }

        
        const isBuildYourBoxOverlay = overlay.dataset.isBuildYourBox === 'true';

        if (isBuildYourBoxOverlay) {
            
            for (let i = 1; i <= 5; i++) {
                const flavorSelect = overlay.querySelector(`#flavor${i}`);
                if (flavorSelect) {
                    const selectedFlavor = flavorSelect.options[flavorSelect.selectedIndex]?.text || 'None';
                    flavors.push(`Flavors: ${selectedFlavor}`); 
                }
            }
        } else {
            
            const flavorSelect = overlay.querySelector('#flavor');
            if (flavorSelect) {
                const selectedFlavor = flavorSelect.options[flavorSelect.selectedIndex]?.text || 'None';
                flavors.push(`Flavors: ${selectedFlavor}`); 
            }
        }
    
        
        const fillingSelect = overlay.querySelector('#filling');
        if (fillingSelect) {
            const selectedFilling = fillingSelect.options[fillingSelect.selectedIndex]?.text || 'None';
            flavors.push(`Filling: ${selectedFilling}`); 
        }
    
        

        // Get all frosting colors including dynamically added ones
        const colorDropdowns = overlay.querySelectorAll('.color-dropdowns');
        colorDropdowns.forEach(dropdown => {
            const colorSelect = dropdown.querySelector('.color-select');
            if (colorSelect) {
                const selectedColor = colorSelect.options[colorSelect.selectedIndex]?.text || 'None';
                flavors.push(`Frosting: ${selectedColor}`); // Add label "Frosting" to the color
            }

            // Check for 'Other' color input
            const otherInput = dropdown.querySelector('.other-input');
            if (colorSelect.value === 'other' && otherInput) {
                const otherColorValue = otherInput.value || 'None';
                flavors.push(`Frosting: ${otherColorValue}`); // Add label "Frosting" to the other color
            }
        });
    
        
        const imageInput = overlay.querySelector('#imageInput');
        const imageFile = imageInput ? imageInput.files[0] : null;
        const imageName = imageFile ? imageFile.name : ''; 
        flavors.push(imageName); 
    
        
        const userNoteInput = overlay.querySelector('#userNote');
        const userNote = userNoteInput ? userNoteInput.value : '';
    
        return {
            name,
            price,
            imgSrc,
            quantity,
            flavors, 
            image: imageFile ? imageFile.name : '', 
            userNote, 
            subTotal: price * quantity 
        };
    }

    // Handle Add Color button click using event delegation
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('button-add-color')) {
            const colorDropdownsContainer = event.target.previousElementSibling; // Get the color dropdowns container
            const newColorDropdown = createColorDropdown(); // Create a new color dropdown
            colorDropdownsContainer.appendChild(newColorDropdown); // Append it to the container
        }
    });

    
    // Function to create a new color dropdown with a remove button
    function createColorDropdown() {
        const colorDropdownDiv = document.createElement('div');
        colorDropdownDiv.classList.add('color-dropdowns');

        const label = document.createElement('label');
        label.textContent = 'Frosting color:';

        const select = document.createElement('select');
        select.classList.add('color-select');
        select.innerHTML = `
            <option value="white">White</option>
            <option value="red">Red</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="other">Other</option>
        `;

        const otherColorInputContainer = document.createElement('div');
        otherColorInputContainer.classList.add('hidden', 'box-selection');
        otherColorInputContainer.style.display = 'none'; // Initially hidden

        const otherLabel = document.createElement('label');
        otherLabel.textContent = 'Other color:';
        const otherInput = document.createElement('input');
        otherInput.type = 'text';
        otherInput.classList.add('other-input');
        otherInput.placeholder = 'Type a color...';

        otherColorInputContainer.appendChild(otherLabel);
        otherColorInputContainer.appendChild(otherInput);

        // Add event listener to show/hide the other color input
        select.addEventListener('change', function() {
            if (this.value === 'other') {
                otherColorInputContainer.style.display = 'block';
            } else {
                otherColorInputContainer.style.display = 'none';
                otherInput.value = ''; // Clear input if not needed
            }
        });

        // Create the Remove button
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove Color';
        removeButton.classList.add('remove-color-btn');

        // Add event listener for the Remove button
        removeButton.addEventListener('click', function() {
            colorDropdownDiv.remove(); // Remove the color dropdown div
        });

        colorDropdownDiv.appendChild(label);
        colorDropdownDiv.appendChild(select);
        colorDropdownDiv.appendChild(otherColorInputContainer);
        colorDropdownDiv.appendChild(removeButton); // Append the Remove button

        return colorDropdownDiv;
    }
    
function updateCartTable() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartTableBody = document.getElementById('cartTableBody');
        const totalAmount = document.getElementById('totalAmount');
        
        if (!cartTableBody || !totalAmount) return;
        
        cartTableBody.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            item.subTotal = item.price * item.quantity;
            const row = document.createElement('tr');
            
            const buildYourBoxText = `
                <br>
                <div class="detailsButton">
                    <button class="toggle-flavors" data-index="${index}">Details</button>
                </div>
                <div class="buildYourBoxText">
                    <div class="flavors-list" style="overflow: hidden" data-index="${index}">
                        ${item.flavors.map(flavor => `<div class="flavor">${flavor}</div>`).join('')}
                    </div>
                </div>
            `;
    
            row.innerHTML = `
                <td>
                    <label class="custom-checkbox">
                        <input type="checkbox" class="item-checkbox" data-index="${index}">
                        <span></span>
                    </label>
                </td>                
                <td class='itemImg'><img src="${item.imgSrc}" alt="${item.name}" style="width: 100px; height: auto;"></td>
                <td class='text-right'>${item.name}${buildYourBoxText}</td>
                <td class='text-right'>₱${item.price.toFixed(2)}</td>
                <td class='text-right counter-button'>
                    <button class="counterbtn increment-btn" data-index="${index}">+</button>
                    <p class="counter" id="counterValue">${item.quantity}</p>
                    <button class="counterbtn decrement-btn" data-index="${index}">-</button>
                </td>
                <td><button class="remove-item" data-index="${index}">Remove</button></td>
            `;

            const checkbox = row.querySelector('.item-checkbox');
            if (checkbox) {
                checkbox.checked = item.isChecked || false;
                checkbox.addEventListener('change', function() {
                    item.isChecked = this.checked;
                    if (this.checked) {
                        total += item.subTotal;
                    } else {
                        total -= item.subTotal;
                    }
                    totalAmount.textContent = `₱${total.toFixed(2)}`;
                    localStorage.setItem('cart', JSON.stringify(cart));
                });

                // If item is checked, add to total
                if (item.isChecked) {
                    total += item.subTotal;
                }
            }
            
            cartTableBody.appendChild(row);
        });

        // Update total amount
        totalAmount.textContent = `₱${total.toFixed(2)}`;

        // Add event listeners for the toggle-flavors buttons
        document.querySelectorAll('.toggle-flavors').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                const flavorsList = document.querySelector(`.flavors-list[data-index="${index}"]`);
                
                if (flavorsList) {
                    if (flavorsList.style.maxHeight) {
                        flavorsList.style.maxHeight = null;
                        flavorsList.style.opacity = 0;
                        flavorsList.style.overflow = 'hidden';
                        this.textContent = 'Details';
                    } else {
                        flavorsList.style.maxHeight = '500px';
                        flavorsList.style.opacity = 1;
                        flavorsList.style.overflow = 'visible';
                        this.textContent = 'Hide';
                    }
                }
            });
        });
    
        
    

    }


    
    document.querySelectorAll('.AddToCart').forEach(button => {
        button.addEventListener('click', function() {
            const overlay = this.closest('.overlay');
            const itemInfo = getOverlayInfo(overlay);
            const cart = JSON.parse(localStorage.getItem('cart')) || [];

            if(isBuildYourBoxOverlay(overlay)){
                alert(`${itemInfo.name} BUILD YOUR BOX!`);
            }
                
                cart.push(itemInfo);
                localStorage.setItem('cart', JSON.stringify(cart));
                alert(`${itemInfo.name} has been added to your cart!`);
                updateCartTable(); 
        });
    });

    // Handle Order Now button click
    document.querySelectorAll('.OrderNow').forEach(button => {
        button.addEventListener('click', function() {
            const overlay = this.closest('.overlay');
            const itemInfo = getOverlayInfo(overlay);
            const cart = JSON.parse(localStorage.getItem('cart')) || [];

            // Add item to cart
            cart.push(itemInfo);
            localStorage.setItem('cart', JSON.stringify(cart));
            alert(`${itemInfo.name} has been added to your cart!`);
            
            // Redirect to cart page
            window.location.href = 'cart.html'; 
        });
    });


    
    openOverlayBtns.forEach(button => {
        button.addEventListener("click", function() {
            const overlayId = this.getAttribute("data-overlay");
            overlays.forEach(overlay => overlay.style.display = "none"); 
            const overlay = document.getElementById(overlayId);
            overlay.style.display = "block"; 
            counters[overlayId] = 1; 
            updatePrice(overlay); 
        });
    });

    closeBtns.forEach(closeBtn => {
        closeBtn.addEventListener("click", function() {
            const overlay = this.closest(".overlay");
            overlay.style.display = "none"; 
        });
    });

    
    
    function updatePrice(overlay) {
        const boxSelection = overlay.querySelector('.boxOfs');
        const priceDisplay = overlay.querySelector('.productprice');

        if (boxSelection && priceDisplay) {
            const selectedOption = boxSelection.options[boxSelection.selectedIndex];
            const price = selectedOption ? selectedOption.getAttribute('data-price') : 0;
            priceDisplay.textContent = `₱${price}`;
        } else {
            console.error("Box selection or price display not found for overlay:", overlay.id);
        }
    }

    
    overlays.forEach(overlay => {
        const boxSelection = overlay.querySelector('.boxOfs');
        if (boxSelection) {
            boxSelection.addEventListener('change', () => {
                updatePrice(overlay); 
                const selectedOption = boxSelection.options[boxSelection.selectedIndex];
                counters[overlay.id] = selectedOption ? parseInt(selectedOption.value) : 1; 
            });
        }
    });

    
    function removeItemFromCart(index) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.splice(index, 1); 
        localStorage.setItem('cart', JSON.stringify(cart)); 
        updateCartTable(); 
    }

    
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('remove-item')) {
        const index = event.target.getAttribute('data-index');
        removeItemFromCart(index); 
    }
});

// Add event listener for the checkout button
document.querySelector('.payment-btn')?.addEventListener('click', function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const checkedItems = [];
    
    // Get all checked items
    document.querySelectorAll('.item-checkbox').forEach((checkbox, index) => {
        if (checkbox.checked) {
            const item = cart[index];
            item.isChecked = true;
            checkedItems.push(item);
        }
    });
    
    // Save checked items to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Redirect to orderinfo page if items are selected
    if (checkedItems.length > 0) {
        window.location.href = 'orderinfo.html';
    } else {
        alert('Please select items to checkout');
    }
});

    
    document.addEventListener('click', function(event) {
        const target = event.target;

        if (target.classList.contains('increment-btn')) {
            const index = target.getAttribute('data-index');
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart[index].quantity++; 
            localStorage.setItem('cart', JSON.stringify(cart)); 
            updateCartTable(); 
        } else if (target.classList.contains('decrement-btn')) {
            const index = target.getAttribute('data-index');
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart[index].quantity > 1) { 
                cart[index].quantity--; 
                localStorage.setItem('cart', JSON.stringify(cart)); 
                updateCartTable(); 
            }
            
        }
    });

    
    updateCartTable();
});

