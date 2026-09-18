document.addEventListener('DOMContentLoaded', () => {
    // Select all cart items
    const getCartItems = () => document.querySelectorAll('.w-full.lg\\:w-2\\/3 > .grid.items-center');
    
    const updateCartTotals = () => {
        let subtotal = 0;
        const items = getCartItems();
        
        items.forEach(item => {
            // Price is in the second child div
            const priceText = item.children[1].textContent;
            const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
            
            // Qty input is in the third child div
            const qty = parseInt(item.children[2].querySelector('input').value);
            
            const itemSubtotal = price * qty;
            
            // Subtotal is in the fourth child div
            item.children[3].innerHTML = `<span class="md:hidden text-gray-500 mr-2 uppercase tracking-widest text-xs">Subtotal:</span>$${itemSubtotal.toFixed(2)}`;
            
            subtotal += itemSubtotal;
        });
        
        // Update Order Summary
        // Subtotal element
        const orderSummarySubtotal = document.querySelector('.lg\\:w-1\\/3 .bg-white .flex:nth-of-type(1) .font-medium');
        if (orderSummarySubtotal) {
            orderSummarySubtotal.textContent = `$${subtotal.toFixed(2)}`;
        }
        
        // Total element
        const orderSummaryTotal = document.querySelector('.lg\\:w-1\\/3 .bg-white .flex:nth-of-type(3) span:last-child');
        if (orderSummaryTotal) {
            const shipping = subtotal > 0 ? 15 : 0; // If cart is empty, no shipping
            orderSummaryTotal.textContent = `$${(subtotal + shipping).toFixed(2)}`;
        }
    };

    // Attach event listeners to initial items
    const attachListeners = (item) => {
        const removeBtn = item.children[0].querySelector('button');
        const minusBtn = item.children[2].querySelectorAll('button')[0];
        const plusBtn = item.children[2].querySelectorAll('button')[1];
        const input = item.children[2].querySelector('input');
        
        removeBtn.addEventListener('click', () => {
            // Add a small fade out animation
            item.style.transition = 'opacity 0.3s ease';
            item.style.opacity = '0';
            setTimeout(() => {
                item.remove();
                updateCartTotals();
            }, 300);
        });
        
        minusBtn.addEventListener('click', () => {
            let val = parseInt(input.value);
            if (val > 1) {
                input.value = val - 1;
                updateCartTotals();
            }
        });
        
        plusBtn.addEventListener('click', () => {
            let val = parseInt(input.value);
            input.value = val + 1;
            updateCartTotals();
        });
    };

    getCartItems().forEach(attachListeners);
});
