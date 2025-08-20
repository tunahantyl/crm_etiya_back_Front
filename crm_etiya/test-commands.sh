#!/bin/bash

echo "=== Customer API Test Scripts ==="

echo "1. Yeni müşteri oluştur:"
echo 'curl -X POST http://localhost:8080/api/customers \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Test Müşteri\",
    \"email\": \"test@example.com\",
    \"phone\": \"0532-123-4567\",
    \"address\": \"İstanbul, Türkiye\",
    \"notes\": \"Test müşteri\"
  }"'

echo -e "\n2. Tüm müşterileri listele:"
echo "curl -X GET http://localhost:8080/api/customers"

echo -e "\n3. Aktif müşterileri getir:"
echo "curl -X GET http://localhost:8080/api/customers/active"

echo -e "\n4. ID ile müşteri getir:"
echo "curl -X GET http://localhost:8080/api/customers/1"

echo -e "\n5. Müşteri arama:"
echo "curl -X GET 'http://localhost:8080/api/customers/search?searchTerm=Test'"