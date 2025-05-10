
// Dialog for collecting user details
function showUserDetailsDialog(amount, plan) {
    return new Promise((resolve) => {
        const dialogHTML = `
            <div id="user-details-dialog" class="payment-dialog">
                <div class="dialog-content">
                    <h3>Enter Your Details</h3>
                    <input type="text" id="user-name" placeholder="Full Name" required>
                    <input type="text" id="telegram-id" placeholder="Telegram ID" required>
                    <input type="email" id="user-email" placeholder="Email Address" required>
                    <input type="tel" id="user-phone" placeholder="Phone Number" required>
                    <div class="dialog-buttons">
                        <button onclick="closeDialog()" class="button button--ghost">Cancel</button>
                        <button onclick="submitDialog()" class="button">Continue to Payment</button>
                    </div>
                </div>
            </div>`;

        document.body.insertAdjacentHTML('beforeend', dialogHTML);
        
        window.closeDialog = () => {
            document.getElementById('user-details-dialog').remove();
            resolve(null);
        };

        window.submitDialog = () => {
            const userDetails = {
                name: document.getElementById('user-name').value,
                telegramId: document.getElementById('telegram-id').value,
                email: document.getElementById('user-email').value,
                phone: document.getElementById('user-phone').value
            };

            if (userDetails.name && userDetails.telegramId && userDetails.email && userDetails.phone) {
                document.getElementById('user-details-dialog').remove();
                resolve(userDetails);
            } else {
                alert('Please fill in all fields');
            }
        };
    });
}

async function initiatePayment(amount, plan) {
    const userDetails = await showUserDetailsDialog(amount, plan);
    if (!userDetails) return;

    try {
        const response = await fetch(`https://phonepe-pgapi.onrender.com/payment/create-order?user_id=${encodeURIComponent(userDetails.telegramId)}&amount=${amount}`, {
            method: 'POST',
            headers: {
                'accept': 'application/json'
            },
            body: null
        });

        const data = await response.json();

        if (data.success && data.payment_url) {
            window.location.href = data.payment_url;
        } else {
            alert('Payment initialization failed. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to process payment. Please try again.');
    }
}
