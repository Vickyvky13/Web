// payment.js
async function initiatePhonePePayment(productName, amount) {
    try {
        const response = await fetch('/api/payment.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                product: productName,
                amount: amount
            })
        });
        
        const data = await response.json();
        
        if(data.status === 'success') {
            // Redirect to PhonePe payment page
            window.location.href = data.redirectUrl;
        } else {
            alert('Payment initialization failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while processing payment');
    }
}