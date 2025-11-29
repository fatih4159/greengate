# 🌿 Greengate - Quick Start Guide

## What is Greengate?

Greengate is a **complete WhatsApp Business management platform** that allows you to:
- 📤 Send template and text messages
- 📥 Receive and track messages
- 🗂️ Manage WhatsApp templates
- 📊 Monitor message status in real-time
- 🔗 Integrate with your own systems via REST API

## 🚀 Quick Start (5 Minutes)

### 1. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Or use the shortcut:
npm run install:all
```

### 2. Start Development Servers

**Option A: Use the startup script (Recommended)**
```bash
./start-dev.sh
```

**Option B: Manual start (two terminals)**

Terminal 1 (Backend):
```bash
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

### 3. Open the Application

Open your browser and navigate to:
```
http://localhost:5173
```

### 4. Configure WhatsApp API

On first launch, you'll see a setup page. Enter:

1. **Access Token** - Get from Meta Business Manager
2. **Phone Number ID** - Your WhatsApp Business phone number ID
3. **WABA ID** (optional) - For template management
4. **Verify Token** (optional) - Auto-generated if not provided

Click "Save Configuration" and you're ready to go! 🎉

## 📍 Where to Get WhatsApp Credentials

1. Go to [Meta Business Manager](https://business.facebook.com/)
2. Navigate to **WhatsApp** → **API Setup**
3. Find your credentials:
   - **Phone Number ID**: Listed under your WhatsApp phone number
   - **Access Token**: Generate a permanent token (recommended) or use temporary
   - **WABA ID**: Your WhatsApp Business Account ID (in the URL or account settings)

## 🎯 What Can You Do?

### Dashboard
- View message statistics
- See recent messages
- Monitor activity

### Templates
- Sync templates from Meta API
- View template status
- Delete templates

### Messages
- View complete message history
- Filter by quantity
- See inbound and outbound messages
- Track delivery status

### Send Messages
- **Template Messages**: Pre-approved messages (can send anytime)
- **Text Messages**: Free-form text (24-hour window after receiving message)

## 📝 Example: Send Your First Message

1. **Sync Templates**
   - Go to "Templates" page
   - Click "Sync from Meta API"
   - Wait for templates to load

2. **Send a Template Message**
   - Go to "Send Message" page
   - Enter phone number (e.g., `491234567890`)
   - Select a template
   - Fill in parameters if needed
   - Click "Send Template Message"

3. **Check Status**
   - Go to "Messages" or "Dashboard"
   - See your sent message with status

## 🔌 API Usage

Greengate provides a REST API for integration:

```bash
# Send a template message
curl -X POST http://localhost:3000/api/messages/send \
  -H "Content-Type: application/json" \
  -d '{
    "to_number": "491234567890",
    "template_name": "welcome_message"
  }'

# Get all messages
curl http://localhost:3000/api/messages?limit=10

# Sync templates
curl -X POST http://localhost:3000/api/templates/sync
```

See `API.md` for complete API documentation.

## 🌐 Production Deployment

### Build for Production

```bash
# Build backend
npm run build

# Build frontend
cd frontend && npm run build

# Or build both:
npm run build:all
```

### Run in Production

```bash
# Backend
NODE_ENV=production npm start

# Frontend
# Serve frontend/dist/ with nginx or another web server
```

### Important for Production

1. **Use HTTPS** - WhatsApp webhooks require HTTPS
2. **Set environment variables** properly
3. **Configure reverse proxy** (nginx recommended)
4. **Set up webhook** in Meta Business Manager
5. **Add authentication** (not included by default)

See `README.md` for detailed deployment instructions.

## 🛠️ Useful Commands

```bash
# Start development servers
npm run dev                    # Backend only
cd frontend && npm run dev     # Frontend only
./start-dev.sh                 # Both (recommended)

# Build
npm run build                  # Backend
npm run build:all              # Backend + Frontend

# Clean
npm run clean                  # Remove all build artifacts and dependencies

# Health check
npm run test:health           # Test if backend is running

# Database access
sqlite3 greengate.db          # Direct database access
```

## 📚 Documentation

- **README.md** - Complete documentation in German
- **API.md** - Full API reference with examples
- **DEVELOPMENT.md** - Architecture and development guide
- **TROUBLESHOOTING.md** - Common issues and solutions
- **CHANGELOG.md** - Version history and changes

## ⚠️ Common Issues

### Backend won't start
```bash
# Check if port 3000 is available
lsof -i :3000

# Use different port
PORT=3001 npm run dev
```

### Frontend can't connect
```bash
# Make sure backend is running
curl http://localhost:3000/health

# Check if it returns: {"status":"ok","timestamp":"..."}
```

### Templates won't sync
```bash
# Make sure you set WABA ID in configuration
# Check access token has correct permissions
# Verify in Meta Business Manager that templates exist
```

### Messages won't send
```bash
# Template must be APPROVED status
# Phone number format: country code + number (no +)
# Example: 491234567890 (Germany), not +49 123 456 7890
```

See `TROUBLESHOOTING.md` for more solutions.

## 🎓 Learning Resources

### WhatsApp Business API
- [Official Documentation](https://developers.facebook.com/docs/whatsapp)
- [Cloud API Reference](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Template Guidelines](https://developers.facebook.com/docs/whatsapp/message-templates/guidelines)

### Technologies Used
- [Express.js](https://expressjs.com/) - Backend framework
- [React](https://react.dev/) - Frontend framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [SQLite](https://www.sqlite.org/) - Database

## 🤝 Getting Help

1. Check `TROUBLESHOOTING.md` first
2. Search existing GitHub issues
3. Create a new issue with:
   - Clear description
   - Steps to reproduce
   - Error messages
   - Environment details

## ✨ Features at a Glance

| Feature | Status | Description |
|---------|--------|-------------|
| Template Messages | ✅ | Send pre-approved templates anytime |
| Text Messages | ✅ | Send free text (24h window) |
| Receive Messages | ✅ | Process incoming messages via webhook |
| Status Tracking | ✅ | Track sent, delivered, read status |
| Template Sync | ✅ | Sync from Meta API |
| Message History | ✅ | View all messages |
| REST API | ✅ | Complete API for integrations |
| Modern UI | ✅ | React + Tailwind CSS |
| Real-time Updates | ⏳ | Coming soon (WebSocket) |
| Authentication | ⏳ | Coming soon |
| Media Support | ⏳ | Coming soon |
| Contact Management | ⏳ | Coming soon |

## 🎯 Next Steps

1. ✅ Complete setup and send first message
2. 📖 Read full documentation in `README.md`
3. 🔌 Explore the API in `API.md`
4. 🛠️ Configure webhook for receiving messages
5. 🚀 Deploy to production

## 💡 Pro Tips

- **Templates**: Create templates in Meta Business Manager first, then sync
- **Phone Numbers**: Always use international format without `+` symbol
- **Testing**: Use your own phone number for testing
- **Webhooks**: Use ngrok or similar for local webhook testing
- **Rate Limits**: Be aware of Meta's rate limits for your tier
- **24h Window**: Text messages only work within 24 hours after receiving message

## 🌟 Success!

You're now ready to use Greengate! 

Start by syncing your templates and sending your first message.

For questions or issues, check the documentation or open an issue on GitHub.

---

**Built with ❤️ for WhatsApp Business Automation**

**Version**: 1.0.0  
**License**: MIT  
**Documentation**: See README.md
