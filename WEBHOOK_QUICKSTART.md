# Quick Start: Webhook Configuration

## 📋 5-Minute Setup Guide

### Prerequisites
- ✅ Greengate backend and frontend running
- ✅ WhatsApp credentials configured (Access Token, Phone Number ID)
- ✅ Meta Business Account with WhatsApp app

### Step 1: Access Webhooks Page (30 seconds)
1. Open Greengate: `http://localhost:5173`
2. Click **"Webhooks"** in the navigation menu

### Step 2: Copy Credentials (30 seconds)
1. Click **"Copy"** next to the Webhook URL
2. Click **"Copy"** next to the Verify Token
3. Keep these somewhere handy (you'll paste them in Meta)

### Step 3: Configure in Meta (2 minutes)
1. Go to https://developers.facebook.com/apps
2. Select your WhatsApp app
3. Click **WhatsApp** → **Configuration** in left menu
4. Under "Webhook", click **"Edit"**
5. Paste:
   - Webhook URL → "Callback URL" field
   - Verify Token → "Verify Token" field
6. Click **"Verify and Save"**
7. ✅ You should see a green checkmark

### Step 4: Subscribe to Events (1 minute)
1. Still on Configuration page
2. Under "Webhook Fields", click **"Manage"**
3. Enable these checkboxes:
   - ✅ `messages`
   - ✅ `message_status`
   - ✅ `message_template_status_update`
4. Click **"Save"**

### Step 5: Test (1 minute)
1. Go back to Greengate Webhooks page
2. Click **"🧪 Test Webhook"** button
3. Send a WhatsApp message to your business number
4. Go to **Messages** page
5. ✅ Your message should appear!

---

## 🚨 Troubleshooting

### Problem: "Webhook verification failed" in Meta
**Solution**: 
- Ensure your server is publicly accessible via HTTPS
- For local dev, use ngrok: `ngrok http 3000`
- Use the ngrok URL as your webhook URL

### Problem: "Not receiving messages"
**Solution**:
- Check that webhook events are subscribed (Step 4)
- Verify backend is running: `curl http://localhost:3000/health`
- Check backend logs for webhook POST requests

### Problem: "Local testing not working"
**Solution**:
```bash
# Install ngrok: https://ngrok.com/download
# Start ngrok
ngrok http 3000

# Use the HTTPS URL (e.g., https://abc123.ngrok.io/webhook)
# Update Meta with this URL
```

---

## 🎯 What's Next?

Once webhooks are working:
1. ✅ You'll receive all incoming messages automatically
2. ✅ Message statuses update in real-time
3. ✅ Template approvals sync automatically
4. ✅ Full two-way communication is enabled

---

## 📱 For Production Deployment

When deploying to production:
1. Set environment variable: `WEBHOOK_URL=https://yourdomain.com/webhook`
2. Ensure HTTPS is configured with valid SSL certificate
3. Update webhook URL in Meta to production URL
4. Test with real messages

---

## 🔗 More Help

- **Detailed Guide**: See `WEBHOOK_README.md`
- **Technical Docs**: See `WEBHOOK_FEATURE_SUMMARY.md`
- **Meta Docs**: https://developers.facebook.com/docs/whatsapp/webhooks
- **In-App Help**: Check the Troubleshooting section on the Webhooks page

---

**Total Setup Time**: ~5 minutes ⚡
**Difficulty**: Easy 🟢
