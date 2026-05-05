document.addEventListener("DOMContentLoaded", function () {
    // 1. Get and Parse Data
    const rawData = localStorage.getItem("jlk_cart");
    const cart = JSON.parse(rawData) || [];
    const productContainer = document.querySelector(".door-delivery-container");
    const deliveryFee = 2000;

    if (!cart || cart.length === 0) {
        if (productContainer) productContainer.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    // 2. Dynamic Date Calculation (Between Today and 5 Days Later)
    const today = new Date();
    const deliveryMax = new Date(today);
    deliveryMax.setDate(today.getDate() + 5);
    
    const options = { day: '2-digit', month: 'long' };
    const startDate = today.toLocaleDateString('en-GB', options);
    const endDate = deliveryMax.toLocaleDateString('en-GB', options);
    
    // This creates the string: "28 April and 03 May" (based on today's date)
    const deliveryRange = `${startDate} and ${endDate}`;

    // Update the static delivery text at the top of the page
    const topDeliveryText = document.querySelector('.delivery-option p:last-child');
    if (topDeliveryText) {
        topDeliveryText.innerText = `Delivery between ${deliveryRange}`;
    }

    // 3. Build Product HTML
    let subtotal = 0;
    let productHTML = "";
    cart.forEach(item => {
        const price = Number(item.price) || 0;
        const qty = Number(item.quantity) || 1;
        subtotal += price * qty;
        productHTML += `
            <div class="product" style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                <img src="${item.image}" width="70px" style="border-radius: 8px;">
                <div class="product-info">
                    <p style="margin: 0; font-weight: bold;">${item.name}</p>
                    <p style="margin: 5px 0;">₦${price.toLocaleString()}</p>
                    <p style="margin: 0; color: #666;">Qty: ${qty}</p>
                </div>
            </div>`;
    });

    if (productContainer) {
        productContainer.innerHTML = `<p><strong>Door Delivery</strong></p><p>Delivery between ${deliveryRange}.</p>${productHTML}`;
    }

    // 4. Update Summary UI
    const qtyElem = document.getElementById("summary-qty");
    const subtotalElem = document.getElementById("summary-subtotal");
    const totalElem = document.getElementById("summary-total");
    let totalQty = cart.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);

    if (qtyElem) qtyElem.innerText = totalQty;
    if (subtotalElem) subtotalElem.innerText = subtotal.toLocaleString();
    if (totalElem) totalElem.innerText = (subtotal + deliveryFee).toLocaleString();

    // 5. Load Saved Address
    const savedAddress = JSON.parse(localStorage.getItem("customerAddress"));
    
    if (!savedAddress || !savedAddress.fullName) {
        alert("Please provide a delivery address first.");
        window.location.href = "add-address.html";
        return;
    } else {
        const nameDisplay = document.querySelector(".card-address .title");
        const addressDisplay = document.querySelector(".card-address p:last-child");
        if (nameDisplay) nameDisplay.innerHTML = `<strong></strong>${savedAddress.fullName}`;
        if (addressDisplay) addressDisplay.innerHTML = `<strong></strong>${savedAddress.fullAddress}<br>${savedAddress.displayLine2}`;
    }

    // 6. Confirm Order & Send via Formspree
    const confirmBtn = document.getElementById('confirm-order-btn');

    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            const totalAmount = totalElem ? totalElem.innerText : "0";
            
            let productList = cart.map(item => {
                return `• ${item.name} (Qty: ${item.quantity}) - ₦${(Number(item.price) * Number(item.quantity)).toLocaleString()}`;
            }).join("\n");

            const orderData = {
                customer_name: savedAddress.fullName,
                customer_email: savedAddress.email || "No Email Provided",
                delivery_address: `${savedAddress.fullAddress}, ${savedAddress.displayLine2}`,
                order_summary: productList,
                grand_total: `₦${totalAmount}`,
                delivery_window: deliveryRange // Fixed variable name to match deliveryRange
            };

            confirmBtn.innerText = "Processing...";
            confirmBtn.disabled = true;

            fetch("https://formspree.io/f/xdayrbwg", {
                method: "POST",
                body: JSON.stringify(orderData),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    localStorage.removeItem('jlk_cart'); 
                    window.location.href = 'order-success.html';
                } else {
                    throw new Error('Formspree server error');
                }
            })
            .catch((error) => {
                console.error('Formspree Error:', error);
                alert("Order failed to send. Please check your internet connection.");
                confirmBtn.innerText = "Confirm Order";
                confirmBtn.disabled = false;
            });
        });
    }
});