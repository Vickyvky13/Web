function showTelegramDialog(amount, plan) {
    return new Promise((resolve) => {
        const dialogHTML = `
            <div id="telegram-dialog" class="payment-dialog">
                <div class="dialog-content">
                    <h3>Enter Your Telegram ID</h3>
                    <p>We'll use this ID to contact you about your purchase</p>
                    <input type="text" id="telegram-id" placeholder="@yourusername" required>
                    <div class="dialog-buttons">
                        <button id="cancel-dialog" class="button button--ghost">Cancel</button>
                        <button id="continue-dialog" class="button">Continue</button>
                    </div>
                </div>
            </div>`;

        document.body.insertAdjacentHTML('beforeend', dialogHTML);

        document.getElementById('cancel-dialog').addEventListener('click', () => {
            document.getElementById('telegram-dialog').remove();
            resolve(null);
        });

        document.getElementById('continue-dialog').addEventListener('click', () => {
            const telegramId = document.getElementById('telegram-id').value.trim();
            if (telegramId) {
                document.getElementById('telegram-dialog').remove();
                resolve(telegramId);
            } else {
                alert('Please enter a valid Telegram ID.');
            }
        });
    });
}


async function initiatePayment(amount, plan) {
    const telegramId = await showTelegramDialog(amount, plan);
    if (!telegramId) return;

    try {
        const response = await fetch(`https://phonepe-pgapi.onrender.com/payment/create-order?user_id=${encodeURIComponent(telegramId)}&amount=${amount}`, {
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