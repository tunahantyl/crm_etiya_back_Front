# CRM Sistemi API Dokümantasyonu

## 🔑 Authentication Endpoints

### POST /api/auth/login
```json
Request:
{
  "email": "string",
  "password": "string"
}

Response: {
  "token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "ADMIN" | "USER"
  }
}
```

### POST /api/auth/register
```json
Request:
{
  "email": "string",
  "password": "string",
  "fullName": "string"
}

Response: {
  "token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "USER"
  }
}
```

### POST /api/auth/change-password
```json
Request:
{
  "currentPassword": "string",
  "newPassword": "string"
}

Response: {
  "message": "Password updated successfully"
}
```

### GET /api/auth/me
```json
Response: {
  "id": "string",
  "email": "string",
  "name": "string",
  "role": "ADMIN" | "USER"
}
```

## 👥 Customer Endpoints

### GET /api/customers
```json
Response: [
  {
    "id": "number",
    "name": "string",
    "email": "string",
    "phone": "string",
    "createdAt": "date",
    "isActive": "boolean"
  }
]

Query Parameters:
- page (number, default: 1)
- limit (number, default: 10)
- search (string, optional)
- isActive (boolean, optional)
```

### POST /api/customers
```json
Request:
{
  "name": "string",
  "email": "string",
  "phone": "string"
}

Response:
{
  "id": "number",
  "name": "string",
  "email": "string",
  "phone": "string",
  "createdAt": "date",
  "isActive": true
}
```

### GET /api/customers/:id
```json
Response:
{
  "id": "number",
  "name": "string",
  "email": "string",
  "phone": "string",
  "createdAt": "date",
  "isActive": "boolean"
}
```

### PUT /api/customers/:id
```json
Request:
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "isActive": "boolean"
}

Response:
{
  "id": "number",
  "name": "string",
  "email": "string",
  "phone": "string",
  "createdAt": "date",
  "isActive": "boolean"
}
```

### DELETE /api/customers/:id
```json
Response:
{
  "message": "Customer deleted successfully"
}
```

## ✅ Task Endpoints

### GET /api/tasks
```json
Response: [
  {
    "id": "number",
    "title": "string",
    "description": "string",
    "status": "PENDING" | "IN_PROGRESS" | "COMPLETED",
    "customerId": "number",
    "customerName": "string",
    "assignedUserId": "string",
    "assignedTo": "string",
    "dueDate": "date",
    "createdAt": "date",
    "updatedAt": "date"
  }
]

Query Parameters:
- page (number, default: 1)
- limit (number, default: 10)
- status (string, optional)
- customerId (number, optional)
- assignedUserId (string, optional)
```

### POST /api/tasks
```json
Request:
{
  "title": "string",
  "description": "string",
  "customerId": "number",
  "assignedUserId": "string",
  "dueDate": "date"
}

Response:
{
  "id": "number",
  "title": "string",
  "description": "string",
  "status": "PENDING",
  "customerId": "number",
  "customerName": "string",
  "assignedUserId": "string",
  "assignedTo": "string",
  "dueDate": "date",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### GET /api/tasks/:id
```json
Response:
{
  "id": "number",
  "title": "string",
  "description": "string",
  "status": "PENDING" | "IN_PROGRESS" | "COMPLETED",
  "customerId": "number",
  "customerName": "string",
  "assignedUserId": "string",
  "assignedTo": "string",
  "dueDate": "date",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### PUT /api/tasks/:id
```json
Request:
{
  "title": "string",
  "description": "string",
  "customerId": "number",
  "assignedUserId": "string",
  "dueDate": "date",
  "status": "PENDING" | "IN_PROGRESS" | "COMPLETED"
}

Response:
{
  "id": "number",
  "title": "string",
  "description": "string",
  "status": "string",
  "customerId": "number",
  "customerName": "string",
  "assignedUserId": "string",
  "assignedTo": "string",
  "dueDate": "date",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### PATCH /api/tasks/:id/status
```json
Request:
{
  "status": "PENDING" | "IN_PROGRESS" | "COMPLETED"
}

Response:
{
  "id": "number",
  "status": "string",
  "updatedAt": "date"
}
```

## 📊 Dashboard Endpoints

### GET /api/dashboard/stats
```json
Response:
{
  "totalCustomers": "number",
  "totalTasks": "number",
  "completedTasks": "number",
  "pendingTasks": "number",
  "tasksByStatus": {
    "PENDING": "number",
    "IN_PROGRESS": "number",
    "COMPLETED": "number"
  },
  "taskTrend": [
    {
      "date": "string",
      "completed": "number",
      "created": "number"
    }
  ]
}
```

### GET /api/dashboard/recent-customers
```json
Response: [
  {
    "id": "number",
    "name": "string",
    "email": "string",
    "createdAt": "date"
  }
]
```

### GET /api/dashboard/pending-tasks
```json
Response: [
  {
    "id": "number",
    "title": "string",
    "customerName": "string",
    "dueDate": "date"
  }
]
```

## 🔒 Güvenlik Gereksinimleri

1. **Authentication:**
   - JWT token kullanımı
   - Token süresi: 1 saat
   - Refresh token desteği

2. **Authorization:**
   - Role-based access control (ADMIN/USER)
   - Resource-based authorization

3. **Validasyonlar:**
   - Input sanitization
   - Rate limiting
   - CORS yapılandırması

## 📝 Notlar

1. Tüm tarih alanları ISO 8601 formatında olmalı
2. Tüm API yanıtları pagination desteği içermeli
3. Hata yanıtları standart format kullanmalı:
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object (optional)"
  }
}
```
4. Başarılı yanıtlar HTTP 2xx kodları kullanmalı
5. Validation hataları HTTP 400 kodu ile dönmeli
6. Yetkilendirme hataları HTTP 401/403 kodları ile dönmeli