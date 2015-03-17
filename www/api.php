<?php
//open connection
$ch = curl_init();
$url = $_GET['domain'] . $_GET['path'];

//set the url, number of POST vars, POST data
curl_setopt($ch,CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 

//execute post
$result = curl_exec($ch);

echo $result;
//close connection
curl_close($ch);