document.addEventListener('DOMContentLoaded', function() {
    // Display selected items from cart
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const selectedItems = cart.filter(item => item.isChecked);
    const selectedItemsContainer = document.getElementById('selected-items');
    const subtotalAmount = document.getElementById('subtotal-amount');
    const totalAmount = document.getElementById('total-amount');
    const deliveryFee = 80; // Fixed delivery fee
    const placeOrderBtn = document.getElementById('placed-btn');
    const receiptOverlay = document.getElementById('receipt-overlay');
    const returnHomeBtn = document.getElementById('return-home');

    function displaySelectedItems() {
        if (!selectedItemsContainer) return;
        
        let subtotal = 0;
        selectedItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('selected-item');
            
            // Calculate item subtotal
            const itemSubtotal = item.price * item.quantity;
            subtotal += itemSubtotal;

            itemElement.innerHTML = `
                <div class="item-details">
                    <img src="${item.imgSrc}" alt="${item.name}" style="width: 60px; height: auto;">
                    <div class="item-info">
                        <h5>${item.name}</h5>
                        <p>Quantity: ${item.quantity}</p>
                        
                       
                    </div>
                    <div class="item-subtotal">
                        ₱${itemSubtotal.toFixed(2)}
                    </div>
                </div>
            `;
            selectedItemsContainer.appendChild(itemElement);
        });

        // Update totals
        if (subtotalAmount) subtotalAmount.textContent = `₱${subtotal.toFixed(2)}`;
        if (totalAmount) totalAmount.textContent = `₱${(subtotal + deliveryFee).toFixed(2)}`;
    }

    // Phone number validation
    const phoneInput = document.getElementById('phone-num');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(event) {
            const phone = event.target.value;
            const phoneRegex = /^09\d{9}$/;
            const phoneError = document.getElementById('phone-error');
            
            if (phoneRegex.test(phone)) {
                phoneError.style.display = 'none';
            } else {
                phoneError.style.display = 'block';
            }
        });
    }

// Check if all required fields are filled
    function checkRequiredFields() {
        const firstName = document.getElementById('first-name')?.value;
        const lastName = document.getElementById('last-name')?.value;
        const email = document.getElementById('email')?.value;
        const phone = document.getElementById('phone-num')?.value;
        const street = document.getElementById('street')?.value;
        const city = document.getElementById('city')?.value;
        const zip = document.getElementById('zip')?.value;
        const phoneRegex = /^09\d{9}$/;

        const isValid = firstName && lastName && email && phone && 
                       phoneRegex.test(phone) && street && 
                       city && city !== '' && zip;

        if (placeOrderBtn) {
            placeOrderBtn.disabled = !isValid;
            placeOrderBtn.style.cursor = isValid ? 'pointer' : 'not-allowed';
        }

        return isValid;
    }

    // Add input event listeners to all required fields
    const requiredFields = ['first-name', 'last-name', 'email', 'phone-num', 
                           'street', 'city', 'zip'];
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', checkRequiredFields);
        }
    });

    // Generate receipt content
    function generateReceiptContent() {
        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone-num').value;
        const street = document.getElementById('street').value;
        const apartment = document.getElementById('apartment').value;
        const city = document.getElementById('city').value;
        const zip = document.getElementById('zip').value;
        const notes = document.getElementById('message').value;

        const receiptDetails = document.getElementById('receipt-details');
        if (!receiptDetails) return;

        const total = parseFloat(totalAmount.textContent.replace('₱', ''));
        const subtotal = parseFloat(subtotalAmount.textContent.replace('₱', ''));

        receiptDetails.innerHTML = `
            <div class="receipt-section">
                <h3>Customer Information</h3>
                <p>Name: ${firstName} ${lastName}</p>
                <p>Email: ${email}</p>
                <p>Phone: ${phone}</p>
                <p>Address: ${street}${apartment ? ', ' + apartment : ''}</p>
                <p>City: ${city}</p>
                <p>ZIP: ${zip}</p>
            </div>
            <div class="receipt-section">
                <h3>Order Details</h3>
                ${selectedItems.map(item => `
                    <div class="receipt-item">
                        <p>${item.name} x ${item.quantity}</p>
                        <p>₱${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                `).join('')}
            </div>
            <div class="receipt-section">
                <div class="receipt-total">
                    <p>Subtotal: ₱${subtotal.toFixed(2)}</p>
                    <p>Delivery Fee: ₱${deliveryFee.toFixed(2)}</p>
                    <p><strong>Total: ₱${total.toFixed(2)}</strong></p>
                </div>
            </div>
            ${notes ? `
            <div class="receipt-section">
                <h3>Order Notes</h3>
                <p>${notes}</p>
            </div>
            ` : ''}
        `;
    }

    // Form submission
    const paymentBtn = document.querySelector('.payment-btn');
    if (paymentBtn) {
        paymentBtn.addEventListener('click', function(event) {
            event.preventDefault();
            
            // Validate phone number
            const phone = document.getElementById('phone-num')?.value;
            const phoneRegex = /^09\d{9}$/;
            
            if (!phone || !phoneRegex.test(phone)) {
                const phoneError = document.getElementById('phone-error');
                if (phoneError) phoneError.style.display = 'block';
                return;
            }

            // Enable place order button if all fields are valid
            if (checkRequiredFields()) {
                placeOrderBtn.disabled = false;
                placeOrderBtn.style.cursor = 'pointer';
            }

            // Add your payment processing logic here
            alert('Payment successful! You can now place your order.');
        });
    }

    // Place order button click handler
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', function() {
            if (checkRequiredFields()) {
                generateReceiptContent();
                receiptOverlay.style.display = 'flex';
            }
        });
    }

    // Return home button click handler
    if (returnHomeBtn) {
        returnHomeBtn.addEventListener('click', function() {
            window.location.href = 'home.html';
        });
    }

    // Initialize the display
    displaySelectedItems();
    checkRequiredFields();
});
