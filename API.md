# 📡 Greengate API Reference

## Base URL

```
http://localhost:3000
```

## Authentication

Currently, no authentication is required. All API endpoints are open.
> ⚠️ **Important**: Implement authentication before deploying to production!

---

## Configuration Endpoints

### Get Configuration Status

Get the current configuration status (sanitized).

```http
GET /api/config
```

**Response:**
```json
{
  "hasAccessToken": true,
  "hasWabaId": true,
  "hasPhoneNumberId": true,
  "hasVerifyToken": true,
  "phoneNumberId": "123456789012345",
  "wabaId": "123456789012345"
}
```

### Set WhatsApp Configuration

Configure WhatsApp API credentials.

```http
POST /api/config/whatsapp
Content-Type: application/json
```

**Request Body:**
```json
{
  "accessToken": "EAAxxxxxxxxxxxxx",
  "phoneNumberId": "123456789012345",
  "wabaId": "123456789012345",
  "verifyToken": "my_secure_verify_token"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Configuration saved successfully"
}
```

**Required Fields:**
- `accessToken` (string): Your Meta API access token
- `phoneNumberId` (string): WhatsApp Business phone number ID

**Optional Fields:**
- `wabaId` (string): WhatsApp Business Account ID (required for template management)
- `verifyToken` (string): Webhook verify token (auto-generated if not provided)

---

## Template Endpoints

### List All Templates

Get all templates from the local database.

```http
GET /api/templates
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "welcome_message",
    "language_code": "de",
    "category": "UTILITY",
    "meta_template_id": "1234567890",
    "status": "APPROVED",
    "content_json": "{...}",
    "created_at": "2024-01-01T12:00:00.000Z",
    "updated_at": "2024-01-01T12:00:00.000Z"
  }
]
```

### Get Template by ID

Get a specific template by its database ID.

```http
GET /api/templates/:id
```

**Response:**
```json
{
  "id": 1,
  "name": "welcome_message",
  "language_code": "de",
  "category": "UTILITY",
  "meta_template_id": "1234567890",
  "status": "APPROVED",
  "content_json": "{...}",
  "created_at": "2024-01-01T12:00:00.000Z",
  "updated_at": "2024-01-01T12:00:00.000Z"
}
```

### Sync Templates from Meta API

Synchronize templates from Meta API to local database.

```http
POST /api/templates/sync
```

**Response:**
```json
{
  "success": true,
  "synced_count": 5,
  "total_count": 5
}
```

### Create New Template

Create a new template via Meta API.

```http
POST /api/templates
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "new_template",
  "language_code": "de",
  "category": "UTILITY",
  "components": [
    {
      "type": "BODY",
      "text": "Hallo {{1}}, willkommen!"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "template_id": 2,
  "meta_template": {
    "id": "1234567890",
    "status": "PENDING",
    "category": "UTILITY"
  }
}
```

### Update Template

Update a template in the local database.

```http
PUT /api/templates/:id
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "APPROVED"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Template updated successfully"
}
```

### Delete Template

Delete a template from both Meta API and local database.

```http
DELETE /api/templates/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Template deleted successfully"
}
```

---

## Message Endpoints

### List All Messages

Get messages from the database.

```http
GET /api/messages?limit=50
```

**Query Parameters:**
- `limit` (number, optional): Maximum number of messages to return (default: 50)

**Response:**
```json
[
  {
    "id": 1,
    "whatsapp_id": "wamid.xxx",
    "to_number": "491234567890",
    "from_number": "4915123456789",
    "template_name": "welcome_message",
    "direction": "OUTBOUND",
    "status": "DELIVERED",
    "body": "Template: welcome_message",
    "timestamp": "2024-01-01T12:00:00.000Z",
    "created_at": "2024-01-01T12:00:00.000Z",
    "updated_at": "2024-01-01T12:00:00.000Z"
  }
]
```

### Get Message by ID

Get a specific message by its database ID.

```http
GET /api/messages/:id
```

**Response:**
```json
{
  "id": 1,
  "whatsapp_id": "wamid.xxx",
  "to_number": "491234567890",
  "from_number": "4915123456789",
  "template_name": "welcome_message",
  "direction": "OUTBOUND",
  "status": "DELIVERED",
  "body": "Template: welcome_message",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "created_at": "2024-01-01T12:00:00.000Z",
  "updated_at": "2024-01-01T12:00:00.000Z"
}
```

### Send Template Message

Send a template message via WhatsApp Business API.

```http
POST /api/messages/send
Content-Type: application/json
```

**Request Body:**
```json
{
  "to_number": "491234567890",
  "template_name": "welcome_message",
  "components": [
    {
      "type": "body",
      "parameters": [
        {
          "type": "text",
          "text": "Max Mustermann"
        }
      ]
    }
  ]
}
```

**Required Fields:**
- `to_number` (string): Recipient phone number (with country code, no +)
- `template_name` (string): Name of the approved template

**Optional Fields:**
- `components` (array): Template parameters (if template has variables)

**Response:**
```json
{
  "success": true,
  "message_id": 1,
  "whatsapp_id": "wamid.xxx",
  "result": {
    "messaging_product": "whatsapp",
    "contacts": [...],
    "messages": [...]
  }
}
```

**Template Parameter Examples:**

Simple text parameter:
```json
{
  "components": [
    {
      "type": "body",
      "parameters": [
        { "type": "text", "text": "John Doe" },
        { "type": "text", "text": "Order #12345" }
      ]
    }
  ]
}
```

With header image:
```json
{
  "components": [
    {
      "type": "header",
      "parameters": [
        {
          "type": "image",
          "image": {
            "link": "https://example.com/image.jpg"
          }
        }
      ]
    },
    {
      "type": "body",
      "parameters": [
        { "type": "text", "text": "John Doe" }
      ]
    }
  ]
}
```

With button URL:
```json
{
  "components": [
    {
      "type": "button",
      "sub_type": "url",
      "index": "0",
      "parameters": [
        {
          "type": "text",
          "text": "order-12345"
        }
      ]
    }
  ]
}
```

### Send Text Message

Send a plain text message (only within 24-hour window after receiving a message from the user).

```http
POST /api/messages/send-text
Content-Type: application/json
```

**Request Body:**
```json
{
  "to_number": "491234567890",
  "text": "Hallo, wie kann ich Ihnen helfen?"
}
```

**Required Fields:**
- `to_number` (string): Recipient phone number (with country code, no +)
- `text` (string): Message text

**Response:**
```json
{
  "success": true,
  "message_id": 2,
  "whatsapp_id": "wamid.yyy",
  "result": {
    "messaging_product": "whatsapp",
    "contacts": [...],
    "messages": [...]
  }
}
```

---

## Webhook Endpoints

### Webhook Verification (GET)

Used by Meta to verify the webhook endpoint.

```http
GET /webhook?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=CHALLENGE_STRING
```

**Response:**
Returns the `hub.challenge` value if verification succeeds.

### Webhook Event Receiver (POST)

Receives incoming messages and status updates from Meta.

```http
POST /webhook
Content-Type: application/json
```

**Request Body (Incoming Message Example):**
```json
{
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "WHATSAPP_BUSINESS_ACCOUNT_ID",
      "changes": [
        {
          "value": {
            "messaging_product": "whatsapp",
            "metadata": {
              "display_phone_number": "4915123456789",
              "phone_number_id": "PHONE_NUMBER_ID"
            },
            "messages": [
              {
                "from": "491234567890",
                "id": "wamid.xxx",
                "timestamp": "1234567890",
                "type": "text",
                "text": {
                  "body": "Hello!"
                }
              }
            ]
          }
        }
      ]
    }
  ]
}
```

**Request Body (Status Update Example):**
```json
{
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "WHATSAPP_BUSINESS_ACCOUNT_ID",
      "changes": [
        {
          "value": {
            "messaging_product": "whatsapp",
            "metadata": {
              "display_phone_number": "4915123456789",
              "phone_number_id": "PHONE_NUMBER_ID"
            },
            "statuses": [
              {
                "id": "wamid.xxx",
                "status": "delivered",
                "timestamp": "1234567890",
                "recipient_id": "491234567890"
              }
            ]
          }
        }
      ]
    }
  ]
}
```

**Response:**
```
EVENT_RECEIVED
```

> ⚠️ **Important**: The webhook must respond with 200 OK within 20 seconds or Meta will retry.

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": "Error message",
  "details": "Detailed error information"
}
```

### Common HTTP Status Codes

- `200 OK` - Request succeeded
- `400 Bad Request` - Invalid request parameters
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

### Example Error Responses

**Missing required fields:**
```json
{
  "error": "to_number and template_name are required"
}
```

**Template not found:**
```json
{
  "error": "Template not found in database"
}
```

**WhatsApp API error:**
```json
{
  "error": "Failed to send message",
  "details": "Invalid phone number format"
}
```

**Configuration missing:**
```json
{
  "error": "WhatsApp configuration not set. Please configure access token and phone number ID."
}
```

---

## Phone Number Format

All phone numbers must be in international format **without** the `+` prefix:

✅ **Correct:**
- `491234567890` (Germany)
- `14155551234` (USA)
- `447911123456` (UK)

❌ **Incorrect:**
- `+491234567890` (with + prefix)
- `01234567890` (missing country code)

---

## Rate Limits

Be aware of Meta's rate limits:
- **Business Messages**: 1,000 messages per day (free tier)
- **Template Messages**: Unlimited (within Meta's guidelines)
- **API Calls**: Variable, see Meta documentation

---

## Webhooks - Supported Message Types

### Text Messages
```json
{
  "type": "text",
  "text": {
    "body": "Message text"
  }
}
```

### Image Messages
```json
{
  "type": "image",
  "image": {
    "caption": "Image caption",
    "mime_type": "image/jpeg",
    "sha256": "...",
    "id": "IMAGE_ID"
  }
}
```

### Video Messages
```json
{
  "type": "video",
  "video": {
    "caption": "Video caption",
    "mime_type": "video/mp4",
    "sha256": "...",
    "id": "VIDEO_ID"
  }
}
```

### Audio Messages
```json
{
  "type": "audio",
  "audio": {
    "mime_type": "audio/ogg; codecs=opus",
    "sha256": "...",
    "id": "AUDIO_ID"
  }
}
```

### Document Messages
```json
{
  "type": "document",
  "document": {
    "filename": "document.pdf",
    "mime_type": "application/pdf",
    "sha256": "...",
    "id": "DOCUMENT_ID"
  }
}
```

### Location Messages
```json
{
  "type": "location",
  "location": {
    "latitude": 52.5200,
    "longitude": 13.4050,
    "name": "Berlin",
    "address": "Berlin, Germany"
  }
}
```

---

## Best Practices

1. **Always validate phone numbers** before sending
2. **Use approved templates** for initial contact
3. **Handle webhook retries** (Meta may send duplicates)
4. **Log all API interactions** for debugging
5. **Implement retry logic** for failed sends
6. **Monitor rate limits** to avoid being blocked
7. **Use HTTPS in production** for webhooks
8. **Validate webhook signatures** (not yet implemented)

---

## Testing

### Using curl

**Get templates:**
```bash
curl http://localhost:3000/api/templates
```

**Send template message:**
```bash
curl -X POST http://localhost:3000/api/messages/send \
  -H "Content-Type: application/json" \
  -d '{
    "to_number": "491234567890",
    "template_name": "welcome_message"
  }'
```

**Sync templates:**
```bash
curl -X POST http://localhost:3000/api/templates/sync
```

### Using Postman

Import the following as a Postman collection:
1. Create new collection "Greengate API"
2. Add requests for each endpoint
3. Set base URL variable: `{{baseUrl}} = http://localhost:3000`

---

## Support

For issues and questions:
- Check the logs: Backend console output
- Enable debug mode: Set `NODE_ENV=development`
- Review WhatsApp API documentation: https://developers.facebook.com/docs/whatsapp

---

**API Version**: 1.0.0  
**Last Updated**: 2024-01-01
