
// Dialog for collecting Telegram ID
function showTelegramDialog(amount, plan) {
    return new Promise((resolve) => {
        const dialogHTML = `
            <div id="telegram-dialog" class="payment-dialog">
                <div class="dialog-content">
                    <h3>Enter Your Telegram ID</h3>
                    <p>We'll use this ID to contact you about your purchase</p>
                    <input type="text" id="telegram-id" placeholder="Enter Telegram ID" required>
                    <div class="dialog-buttons">
                        <button onclick="closeDialog()" class="button button--ghost">Cancel</button>
                        <button onclick="submitDialog()" class="button">Continue</button>
                    </div>
                </div>
            </div>`;

        document.body.insertAdjacentHTML('beforeend', dialogHTML);
        
        window.closeDialog = () => {
            document.getElementById('telegram-dialog').remove();
            resolve(null);
        };

        window.submitDialog = () => {
            const telegramId = document.getElementById('telegram-id').value;
            if (telegramId) {
                document.getElementById('telegram-dialog').remove();
                resolve(telegramId);
            }
        };
    });
}

async function initiatePayment(amount, plan) {
    const telegramId = await showTelegramDialog(amount, plan);
    if (!telegramId) return;

    try {
        const response = await fetch(`https://637vvx-8000.csb.app/payment/create-order?user_id=${telegramId}&amount=${amount}`);
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
