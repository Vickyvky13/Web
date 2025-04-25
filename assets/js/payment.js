// Payment configuration
const paymentConfig = {
    merchantId: "SU2504251824455203498132",
    callbackUrl: window.location.origin + "/payment-callback.html",
    env: "a09c0d23-4a54-4a62-babc-dc67cd587a74" // Change to "PROD" for production
};

// Initialize payment buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.trick__button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const product = this.getAttribute('data-product');
            const price = parseInt(this.getAttribute('data-price'));
            
            // Show modal
            document.getElementById('paymentModal').style.display = 'block';
            
            // Initiate payment
            initiatePayment(product, price);
        });
    });
    
    // Close modal
    document.querySelector('.close').addEventListener('click', function() {
        document.getElementById('paymentModal').style.display = 'none';
    });
});

// Payment function
async function initiatePayment(productName, amount) {
    try {
        // In production, call your backend API here
        const transactionId = 'TXN' + Date.now();
        
        // For demo, we'll use frontend-only approach (not recommended for production)
        const phonepeCheckout = new PhonePe.Checkout({
            merchantId: paymentConfig.merchantId,
            merchantTransactionId: transactionId,
            merchantUserId: 'USER' + Math.floor(Math.random() * 1000000),
            amount: amount * 100, // in paise
            redirectUrl: paymentConfig.callbackUrl,
            redirectMode: "POST",
            callbackUrl: paymentConfig.callbackUrl,
            env: paymentConfig.env
        });
        
        phonepeCheckout.start();
    } catch (error) {
        console.error("Payment error:", error);
        document.getElementById('paymentStatus').innerHTML = `
            <div class="error-message">
                <i class='bx bx-error'></i>
                <h3>Payment Error</h3>
                <p>${error.message}</p>
                <button class="button" onclick="initiatePayment('${productName}', ${amount})">
                    Try Again
                </button>
            </div>
        `;
    }
}