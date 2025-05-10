function showLoadingDialog() {
    const loadingHTML = `
        <div id="loading-dialog" class="payment-dialog">
            <div class="dialog-content">
                <div class="loading-spinner"></div>
                <p>Kindly wait while we securely redirect you to the payment page.</p>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', loadingHTML);
}

function removeLoadingDialog() {
    const loadingDialog = document.getElementById('loading-dialog');
    if (loadingDialog) {
        loadingDialog.remove();
    }
}

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
                showLoadingDialog();
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
        const [response] = await Promise.all([
            fetch(`https://phonepe-pgapi.onrender.com/payment/create-order?user_id=${encodeURIComponent(telegramId)}&amount=${amount}`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json'
                },
                body: null
            }),
            new Promise(resolve => setTimeout(resolve, 2000)) // Minimum 2 second delay
        ]);

        const data = await response.json();

        if (data.success && data.payment_url) {
            window.location.href = data.payment_url;
        } else {
            removeLoadingDialog();
            alert('Payment initialization failed. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        removeLoadingDialog();
        alert('Failed to process payment. Please try again.');
    }
}