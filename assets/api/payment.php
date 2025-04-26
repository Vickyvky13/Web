<?php
header('Content-Type: application/json');

// Securely stored credentials
$merchantId = 'SU2504251824455203498132';
$secretKey = 'a09c0d23-4a54-4a62-babc-dc67cd587a74';

// Get data from frontend
$data = json_decode(file_get_contents('php://input'), true);
$amount = $data['amount'];
$product = $data['product'];

// Generate transaction ID
$transactionId = uniqid();

// PhonePe API call would go here
// This is just a simulation
$response = [
    'status' => 'success',
    'transactionId' => $transactionId,
    'redirectUrl' => "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay?merchantId=$merchantId&transactionId=$transactionId"
];

echo json_encode($response);
?>
