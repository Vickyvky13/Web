function showLoadingDialog() {
    const loadingHTML = `
        <div id="loading-dialog" class="payment-dialog">
            <div class="dialog-content">
                <div class="loading-spinner"></div>
                <p>Kindly wait while we securely redirect you to the payment page...</p>
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

function showAlert(message, type = 'error') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `custom-alert ${type}`;
    alertDiv.innerHTML = `
        <div class="alert-content">
            <p>${message}</p>
        </div>
    `;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

function showTelegramDialog(amount, plan) {
    return new Promise((resolve) => {
        const dialogHTML = `
            <div id="telegram-dialog" class="payment-dialog">
                <div class="dialog-content">
                    <h3>Enter Your Telegram ID</h3>
                    <p>You can enter either your Telegram <strong>numeric user ID</strong> or your <strong>@username</strong>. 
                    <strong>Please double-check</strong> to ensure the information is accurate, as we’ll use it to contact you regarding your purchase.</p>
                    <input type="text" id="telegram-id" placeholder="@yourusername" required>
                    <p class="validation-message" id="validation-message"></p>
                    <div class="dialog-buttons">
                        <button id="cancel-dialog" class="button button--ghost">Cancel</button>
                        <button id="continue-dialog" class="button" disabled>Continue</button>
                    </div>
                </div>
            </div>`;

        document.body.insertAdjacentHTML('beforeend', dialogHTML);

        const telegramInput = document.getElementById('telegram-id');
        const continueButton = document.getElementById('continue-dialog');
        const validationMessage = document.getElementById('validation-message');

        telegramInput.addEventListener('input', () => {
            const value = telegramInput.value.trim();
            if (value.length < 3) {
                validationMessage.textContent = 'Minimum 3 characters required';
                continueButton.disabled = true;
            } else {
                validationMessage.textContent = '';
                continueButton.disabled = false;
            }
        });

        document.getElementById('cancel-dialog').addEventListener('click', () => {
            document.getElementById('telegram-dialog').remove();
            resolve(null);
        });

        document.getElementById('continue-dialog').addEventListener('click', () => {
            const telegramId = telegramInput.value.trim();
            if (telegramId && telegramId.length >= 3) {
                document.getElementById('telegram-dialog').remove();
                showLoadingDialog();
                resolve(telegramId);
            } else {
                showAlert('Please enter a valid Telegram ID with at least 3 characters.');
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
            removeLoadingDialog();
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