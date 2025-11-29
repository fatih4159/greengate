# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### Installation Issues

#### Issue: `npm install` fails

**Symptoms:**
```
npm ERR! code ENOENT
npm ERR! syscall open
```

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json

# Reinstall
npm install
cd frontend && npm install
```

#### Issue: TypeScript compilation errors

**Symptoms:**
```
error TS2307: Cannot find module
```

**Solution:**
```bash
# Ensure all dependencies are installed
npm install

# Check TypeScript version
npx tsc --version

# Verify tsconfig.json is correct
cat tsconfig.json
```

---

### Backend Issues

#### Issue: Backend won't start - Port already in use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 npm run dev
```

#### Issue: Database errors

**Symptoms:**
```
Error opening database: SQLITE_CANTOPEN
```

**Solution:**
```bash
# Check file permissions
ls -la greengate.db

# Ensure directory is writable
chmod 755 .
chmod 644 greengate.db

# Or delete and recreate
rm greengate.db
# Restart server to recreate
npm run dev
```

#### Issue: Cannot connect to database

**Symptoms:**
```
Error: SQLITE_ERROR: no such table: templates
```

**Solution:**
The database tables are created automatically on first run. If they're missing:

```bash
# Stop the server
# Delete the database
rm greengate.db

# Restart - tables will be recreated
npm run dev
```

---

### Frontend Issues

#### Issue: Frontend won't start

**Symptoms:**
```
Failed to resolve import
```

**Solution:**
```bash
cd frontend

# Clear Vite cache
rm -rf node_modules/.vite

# Reinstall dependencies
npm install

# Try again
npm run dev
```

#### Issue: API calls failing

**Symptoms:**
```
Network Error
CORS Error
```

**Solution:**

1. Check if backend is running:
```bash
curl http://localhost:3000/health
```

2. Check Vite proxy configuration in `frontend/vite.config.ts`:
```typescript
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true
  }
}
```

3. Verify backend has CORS enabled (it should by default)

#### Issue: Page shows blank or loading forever

**Symptoms:**
- White screen
- Endless loading spinner

**Solution:**

1. Check browser console for errors (F12)
2. Verify backend is responding:
```bash
curl http://localhost:3000/api/config
```
3. Clear browser cache and reload

---

### WhatsApp API Issues

#### Issue: Cannot sync templates

**Symptoms:**
```
Failed to sync templates
Error: WhatsApp configuration not set
```

**Solution:**

1. Verify configuration is saved:
```bash
# Get current config
curl http://localhost:3000/api/config
```

2. Check that WABA ID is set (required for templates):
```bash
# Reconfigure with WABA ID
curl -X POST http://localhost:3000/api/config/whatsapp \
  -H "Content-Type: application/json" \
  -d '{
    "accessToken": "YOUR_TOKEN",
    "phoneNumberId": "YOUR_PHONE_ID",
    "wabaId": "YOUR_WABA_ID"
  }'
```

3. Verify access token has correct permissions in Meta Business Manager

#### Issue: Template messages fail to send

**Symptoms:**
```
Failed to send message
Template not found
```

**Solution:**

1. **Sync templates first:**
```bash
curl -X POST http://localhost:3000/api/templates/sync
```

2. **Check template status** - must be "APPROVED":
```bash
curl http://localhost:3000/api/templates
```

3. **Verify template exists in Meta:**
- Go to Meta Business Manager
- WhatsApp Manager → Message Templates
- Ensure template is approved

4. **Check template name** matches exactly (case-sensitive)

#### Issue: Text messages fail to send

**Symptoms:**
```
Failed to send text message
Error code 131026
```

**Solution:**

Text messages require a 24-hour window after receiving a message from the user.

**Options:**
1. Use template messages instead (always allowed)
2. Wait for user to send a message first
3. Check WhatsApp API error codes in Meta documentation

#### Issue: Invalid phone number format

**Symptoms:**
```
Invalid phone number format
Parameter value is not valid
```

**Solution:**

Phone numbers must be in international format **without** `+`:

✅ Correct:
```
491234567890  (Germany)
14155551234   (USA)
```

❌ Wrong:
```
+491234567890  (has +)
01234567890    (missing country code)
```

#### Issue: Access token expired

**Symptoms:**
```
Error code 190: Access token has expired
```

**Solution:**

1. Generate new access token in Meta Business Manager
2. Update configuration:
```bash
curl -X POST http://localhost:3000/api/config/whatsapp \
  -H "Content-Type: application/json" \
  -d '{
    "accessToken": "NEW_TOKEN",
    "phoneNumberId": "YOUR_PHONE_ID"
  }'
```

---

### Webhook Issues

#### Issue: Webhook verification fails

**Symptoms:**
```
Webhook verification failed: token mismatch
```

**Solution:**

1. **Check verify token in database:**
```bash
# Query database directly
sqlite3 greengate.db "SELECT value FROM config WHERE key='webhook_verify_token';"
```

2. **Use the same token in Meta Business Manager:**
- Go to WhatsApp Manager → Configuration → Webhook
- Enter the exact verify token from step 1

3. **If token is missing, set it:**
```bash
curl -X POST http://localhost:3000/api/config/whatsapp \
  -H "Content-Type: application/json" \
  -d '{
    "accessToken": "YOUR_TOKEN",
    "phoneNumberId": "YOUR_PHONE_ID",
    "verifyToken": "my_secure_token_123"
  }'
```

#### Issue: Webhook not receiving messages

**Symptoms:**
- No messages appear in database
- Webhook POST never called

**Solution:**

1. **Verify webhook is publicly accessible:**
```bash
# Test from external service (e.g., webhook.site)
curl https://your-domain.com/webhook
```

2. **Check webhook subscriptions in Meta:**
- Must subscribe to: `messages` and `message_status`
- Verify webhook is active (green checkmark)

3. **Check server logs** for incoming requests

4. **Ensure HTTPS in production** (Meta requires HTTPS)

5. **Test webhook manually:**
```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "object": "whatsapp_business_account",
    "entry": [{
      "changes": [{
        "value": {
          "messages": [{
            "from": "491234567890",
            "id": "test123",
            "timestamp": "1234567890",
            "type": "text",
            "text": {"body": "Test"}
          }],
          "metadata": {
            "phone_number_id": "123",
            "display_phone_number": "4915123456789"
          }
        }
      }]
    }]
  }'
```

#### Issue: Duplicate messages in database

**Symptoms:**
- Same message appears multiple times

**Solution:**

This is normal - Meta may retry webhooks. The code checks for duplicates using `whatsapp_id`.

If you see duplicates:
```sql
-- Check for duplicates
sqlite3 greengate.db "SELECT whatsapp_id, COUNT(*) FROM messages GROUP BY whatsapp_id HAVING COUNT(*) > 1;"
```

The duplicate check should prevent this, but if it happens:
1. Check that `whatsapp_id` is being saved correctly
2. Verify unique constraint on `whatsapp_id` column

---

### Performance Issues

#### Issue: Slow database queries

**Symptoms:**
- API responses take > 1 second
- Frontend feels sluggish

**Solution:**

1. **Add indexes** to frequently queried columns:
```sql
sqlite3 greengate.db
CREATE INDEX idx_messages_timestamp ON messages(timestamp);
CREATE INDEX idx_messages_direction ON messages(direction);
CREATE INDEX idx_templates_name ON templates(name);
CREATE INDEX idx_templates_status ON templates(status);
```

2. **Limit query results:**
```typescript
// Always use LIMIT in queries
await db.all('SELECT * FROM messages ORDER BY timestamp DESC LIMIT 50');
```

3. **Consider vacuum:**
```bash
sqlite3 greengate.db "VACUUM;"
```

#### Issue: Memory leaks

**Symptoms:**
- Backend memory usage grows over time
- Eventually crashes

**Solution:**

1. **Update to latest Node.js LTS**
2. **Monitor with:**
```bash
node --max-old-space-size=512 dist/server.js
```
3. **Check for unclosed database connections**
4. **Review async/await usage** (ensure all promises are handled)

---

### Development Issues

#### Issue: Hot reload not working

**Symptoms:**
- Changes don't appear
- Need to restart manually

**Solution:**

**Backend:**
```bash
# Ensure nodemon is working
npm run dev

# Check nodemon.json or package.json watch settings
# Should watch: backend/**/*.ts
```

**Frontend:**
```bash
# Vite should auto-reload
# If not, try:
rm -rf node_modules/.vite
npm run dev
```

#### Issue: TypeScript types not updating

**Symptoms:**
```
Type 'X' is not assignable to type 'Y'
```

**Solution:**
```bash
# Clear TypeScript cache
rm -rf node_modules/.cache

# Restart IDE/editor
# For VS Code: Cmd+Shift+P → "Restart TypeScript Server"
```

---

## Diagnostic Commands

### Check System Status

```bash
# Backend status
curl http://localhost:3000/health

# List all templates
curl http://localhost:3000/api/templates

# List recent messages
curl http://localhost:3000/api/messages?limit=5

# Check configuration
curl http://localhost:3000/api/config
```

### Database Inspection

```bash
# Open SQLite shell
sqlite3 greengate.db

# List tables
.tables

# Show table schema
.schema templates
.schema messages
.schema config

# Count records
SELECT COUNT(*) FROM templates;
SELECT COUNT(*) FROM messages;

# View recent messages
SELECT * FROM messages ORDER BY timestamp DESC LIMIT 10;

# View configuration
SELECT * FROM config;

# Exit
.quit
```

### Log Analysis

```bash
# Backend logs (if running in background)
tail -f backend.log

# Search for errors
grep -i error backend.log

# Count errors by type
grep -i error backend.log | sort | uniq -c
```

---

## Getting Help

### Before Asking for Help

1. **Check the logs** (backend console)
2. **Try the diagnostic commands** above
3. **Search for the error message** in this guide
4. **Check Meta's API documentation**
5. **Verify your WhatsApp API credentials**

### Information to Include

When reporting an issue, include:

1. **Error message** (full stack trace if available)
2. **Steps to reproduce**
3. **Expected vs actual behavior**
4. **Environment:**
   - Node.js version: `node --version`
   - npm version: `npm --version`
   - OS: `uname -a` (Linux/Mac) or `ver` (Windows)
5. **Relevant logs** (backend console output)
6. **Configuration** (sanitized - no tokens!)

### Useful Debug Commands

```bash
# Node.js version
node --version

# npm version
npm --version

# Check if ports are available
netstat -an | grep 3000
netstat -an | grep 5173

# Check database file
ls -lh greengate.db
file greengate.db

# Test network connectivity
curl https://graph.facebook.com/v18.0/
```

---

## Emergency Recovery

### Complete Reset

If nothing works, start fresh:

```bash
# Stop all processes
killall node

# Backup database (optional)
cp greengate.db greengate.db.backup

# Remove everything
rm -rf node_modules frontend/node_modules
rm -rf dist frontend/dist
rm package-lock.json frontend/package-lock.json
rm greengate.db

# Reinstall
npm install
cd frontend && npm install && cd ..

# Rebuild
npm run build
cd frontend && npm run build && cd ..

# Start fresh
npm run dev
```

---

## Still Having Issues?

1. Check GitHub Issues: [Your Repository URL]
2. Read the API documentation: `API.md`
3. Review development guide: `DEVELOPMENT.md`
4. Check Meta's WhatsApp API docs: https://developers.facebook.com/docs/whatsapp

---

**Remember**: Most issues are related to:
1. ❌ Configuration (missing/wrong tokens)
2. ❌ Phone number format
3. ❌ Template not approved
4. ❌ Webhook not publicly accessible

Always check these first! 🔍
