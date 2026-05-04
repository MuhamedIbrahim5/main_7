<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$dataFile = __DIR__ . '/data.json';

if (!file_exists($dataFile)) {
    http_response_code(404);
    echo json_encode(['error' => 'Data file not found']);
    exit;
}

$data = file_get_contents($dataFile);
echo $data;
?>
