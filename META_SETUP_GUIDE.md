# 📱 Meta WhatsApp Business API - Complete Setup Guide

## 🎯 Overview

This guide provides step-by-step instructions for setting up the Meta WhatsApp Business API, from creating accounts to obtaining all necessary credentials for Greengate.

### What You'll Get
- ✅ Meta Business Account
- ✅ WhatsApp Business Account (WABA)
- ✅ Access Token (for API calls)
- ✅ Phone Number ID
- ✅ WABA ID
- ✅ Test Phone Number (optional, for development)
- ✅ Webhook Configuration

### Prerequisites
- Valid email address
- Facebook account (personal or business)
- Phone number for verification
- Business information (name, address, website)
- Credit card (for business verification, not charged initially)

---

## 📋 Table of Contents

1. [Create Meta Business Account](#1-create-meta-business-account)
2. [Set Up WhatsApp Business App](#2-set-up-whatsapp-business-app)
3. [Get Phone Number](#3-get-phone-number)
4. [Generate Access Token](#4-generate-access-token)
5. [Find Your API Credentials](#5-find-your-api-credentials)
6. [Create Message Templates](#6-create-message-templates)
7. [Configure Webhooks](#7-configure-webhooks)
8. [Verify Your Business](#8-verify-your-business)
9. [Apply for Higher Tier Access](#9-apply-for-higher-tier-access)
10. [Testing Your Setup](#10-testing-your-setup)
11. [Common Issues & Solutions](#11-common-issues--solutions)

---

## 1. Create Meta Business Account

### Step 1.1: Access Meta Business Suite

1. Go to **[Meta Business Suite](https://business.facebook.com/)**
2. Click **"Create Account"** (top right)
3. Log in with your Facebook account (or create one)

### Step 1.2: Set Up Your Business

1. **Business Name**: Enter your business name
2. **Your Name**: Enter your full name
3. **Business Email**: Use a business email address (important for verification)
4. Click **"Submit"**

### Step 1.3: Complete Business Profile

1. Navigate to **Business Settings** (gear icon)
2. Go to **Business Info**
3. Fill in:
   - **Business Address**: Physical address required
   - **Phone Number**: Business phone (for verification)
   - **Website**: Your business website (if available)
   - **Business Type**: Select appropriate category
   - **Tax ID**: Optional but recommended for verification

4. Click **"Save Changes"**

### Important Notes
- ⚠️ Use real, verifiable information
- ⚠️ The email must be accessible (you'll receive verification emails)
- ⚠️ Business name should match your legal business name

---

## 2. Set Up WhatsApp Business App

### Step 2.1: Create WhatsApp Business App

1. In **Meta Business Suite**, go to **Business Settings**
2. In the left menu, scroll down to **Accounts**
3. Click **"WhatsApp Accounts"**
4. Click **"Add"** → **"Create a WhatsApp Business Account"**

### Step 2.2: Configure WABA (WhatsApp Business Account)

1. **Account Name**: Choose a descriptive name (e.g., "YourCompany WhatsApp")
2. **Time Zone**: Select your business timezone
3. **Business Manager**: Select your business (already selected)
4. Click **"Next"**

### Step 2.3: Create Developer App

You need a Meta App to access the API:

1. Go to **[Meta for Developers](https://developers.facebook.com/)**
2. Click **"My Apps"** (top right)
3. Click **"Create App"**

4. Select **"Business"** as app type → Click **"Next"**

5. Fill in app details:
   - **App Name**: e.g., "YourCompany WhatsApp API"
   - **App Contact Email**: Your email
   - **Business Account**: Select your business
   - Click **"Create App"**

6. You'll be redirected to the App Dashboard

### Step 2.4: Add WhatsApp Product

1. In your App Dashboard, scroll down to **"Add Products to Your App"**
2. Find **"WhatsApp"** and click **"Set Up"**
3. Click **"Get Started"**
4. Select your WhatsApp Business Account (or create new one)
5. Click **"Continue"**

**🎉 Congratulations!** You now have a WhatsApp Business Account connected to your app.

---

## 3. Get Phone Number

### Option A: Use Meta's Test Number (Development Only)

Meta provides a free test number for development:

1. In your **App Dashboard** → **WhatsApp** → **Getting Started**
2. You'll see a test phone number (e.g., `+1 555-0100`)
3. **Add Test Recipients**:
   - Scroll to **"To"** section
   - Click **"Add Recipient"**
   - Enter your personal WhatsApp number
   - Verify with the code sent to your WhatsApp
4. **Limitations**:
   - ⚠️ Can only send to verified test numbers (max 5)
   - ⚠️ 1000 messages per month
   - ⚠️ Cannot receive messages
   - ⚠️ Not for production use

### Option B: Add Your Own Phone Number (Production)

To use your own number for production:

#### Step 3.1: Prepare Your Phone Number

Requirements:
- ✅ Must be able to receive SMS or voice calls
- ✅ Not already registered with WhatsApp (personal or business)
- ✅ Not a landline (mobile number required)
- ✅ Not a VOIP number (in most cases)

**Important**: If your number is already on WhatsApp:
- You'll need to migrate it (see Section 11)
- Or use a different number

#### Step 3.2: Add Phone Number to WABA

1. Go to **Meta Business Suite** → **Business Settings**
2. Click **"WhatsApp Accounts"** (left menu)
3. Select your WhatsApp Business Account
4. Click **"Phone Numbers"** tab
5. Click **"Add Phone Number"**

#### Step 3.3: Enter Phone Number Details

1. **Phone Number**: Enter with country code (e.g., +49 123 456 7890)
2. **Display Name**: Your business name (what recipients will see)
3. **Description**: Internal description (optional)
4. **Category**: Select business category
5. Click **"Next"**

#### Step 3.4: Verify Phone Number

Choose verification method:
- **SMS**: Receive code via text message
- **Voice Call**: Receive code via automated call

1. Select method and click **"Next"**
2. Enter the 6-digit verification code
3. Click **"Verify"**

**🎉 Phone Number Added!** You can now send messages from this number.

---

## 4. Generate Access Token

You need an access token to make API calls.

### Step 4.1: Temporary Access Token (Development)

1. Go to **[Meta for Developers](https://developers.facebook.com/)**
2. Click **"My Apps"** → Select your app
3. Go to **WhatsApp** → **Getting Started**
4. Scroll to **"Send and Receive Messages"**
5. Under **"Temporary access token"**, click **"Generate Token"**
6. Copy the token (valid for 24 hours)

⚠️ **Warning**: Temporary tokens expire after 24 hours. Use for testing only!

### Step 4.2: Permanent Access Token (Production)

For production, you need a System User with a permanent token:

#### Create System User

1. Go to **Meta Business Suite** → **Business Settings**
2. Click **"Users"** → **"System Users"** (left menu)
3. Click **"Add"** (top right)
4. Enter:
   - **System User Name**: e.g., "WhatsApp API User"
   - **System User Role**: **Admin** (for full access)
5. Click **"Create System User"**

#### Assign Assets to System User

1. Click on your newly created System User
2. Click **"Add Assets"**
3. Select **"Apps"**
4. Find your WhatsApp app and toggle it **ON**
5. Select **"Full Control"**
6. Click **"Save Changes"**

7. Again click **"Add Assets"**
8. Select **"WhatsApp Accounts"**
9. Find your WABA and toggle it **ON**
10. Select **"Full Control"**
11. Click **"Save Changes"**

#### Generate Permanent Token

1. Still on System User page, click **"Generate New Token"**
2. **Select App**: Choose your WhatsApp app
3. **Permissions**: Select these scopes:
   - ✅ `whatsapp_business_management` (required)
   - ✅ `whatsapp_business_messaging` (required)
   - ✅ `business_management` (recommended)
4. **Token Expiration**: Select **"Never"** (or 60 days and refresh regularly)
5. Click **"Generate Token"**
6. **⚠️ COPY THE TOKEN IMMEDIATELY** - You won't see it again!
7. Store securely (password manager recommended)

---

## 5. Find Your API Credentials

You need three main credentials for Greengate:

### 5.1: Access Token
- ✅ Generated in Step 4
- Example: `EAAxxxxxxxxxxxxxxxxxxxxx` (very long string)

### 5.2: Phone Number ID

1. Go to **Meta for Developers** → **My Apps** → Your App
2. Click **WhatsApp** → **Getting Started**
3. Under **"Send and Receive Messages"**, you'll see:
   ```
   Phone number ID: 123456789012345
   ```
4. Copy this number

**Alternative Method**:
1. Go to **Meta Business Suite** → **Business Settings**
2. Click **"WhatsApp Accounts"**
3. Select your WABA
4. Click **"Phone Numbers"** tab
5. Click on your phone number
6. The **Phone Number ID** is shown at the top

### 5.3: WhatsApp Business Account ID (WABA ID)

1. Go to **Meta Business Suite** → **Business Settings**
2. Click **"WhatsApp Accounts"** (left menu)
3. Select your WhatsApp Business Account
4. The **WABA ID** is shown at the top of the page
   - Format: `102xxxxxxxxxx` (13-15 digits)

**Alternative Method**:
- Look at the URL when viewing your WABA:
  ```
  https://business.facebook.com/wa/manage/phone-numbers/?waba_id=123456789012345
  ```
- The number after `waba_id=` is your WABA ID

### Summary of Credentials

```env
ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PHONE_NUMBER_ID=123456789012345
WABA_ID=102xxxxxxxxxx
```

**🎉 You now have all credentials needed for Greengate!**

---

## 6. Create Message Templates

WhatsApp requires pre-approved templates for proactive messaging.

### Step 6.1: Access Template Manager

1. Go to **Meta Business Suite** → **Business Settings**
2. Click **"WhatsApp Accounts"** (left menu)
3. Select your WABA
4. Click **"Message Templates"** tab
5. Click **"Create Template"**

### Step 6.2: Template Categories

Choose the right category:

- **UTILITY**: Account updates, transactions, alerts (recommended for most)
  - Example: Order confirmations, appointment reminders, OTPs
  - ✅ No marketing approval needed
  - ✅ Faster approval (usually same day)

- **MARKETING**: Promotions, offers, updates
  - Example: Sales, new products, special offers
  - ⚠️ Requires business verification
  - ⚠️ Slower approval (2-3 days)
  - ⚠️ May require additional compliance

- **AUTHENTICATION**: One-time passwords, security codes
  - Example: Login codes, verification codes
  - ✅ Fastest approval
  - ⚠️ Must include `{{1}}` for OTP code

### Step 6.3: Create Your First Template

#### Example: Welcome Message (UTILITY)

1. **Template Name**: `welcome_message` (lowercase, underscores only)
2. **Category**: `UTILITY`
3. **Languages**: Select your language(s) - e.g., `English`, `German`
4. Click **"Continue"**

#### Add Template Content

**Header** (optional):
- **Type**: Text, Image, Video, or Document
- **Text Example**: "Welcome to {{1}}!"
  - `{{1}}` is a variable (company name)

**Body** (required):
- **Text**: 
  ```
  Hello {{1}}, thank you for contacting us! 
  
  Your inquiry has been received and ticket number {{2}} has been created. 
  
  Our team will respond within 24 hours.
  ```
- Variables: `{{1}}` = customer name, `{{2}}` = ticket number
- **Sample Content**: Click "Add sample" and provide examples:
  - Sample 1: "John Smith"
  - Sample 2: "#12345"

**Footer** (optional):
- **Text**: "Reply STOP to unsubscribe"
- No variables allowed in footer

**Buttons** (optional):
- **Call to Action**: Phone number or website URL
- **Quick Reply**: Pre-defined response options (max 3)

Example buttons:
- Button 1: "Call Us" → Type: PHONE_NUMBER → `+1234567890`
- Button 2: "Visit Website" → Type: URL → `https://yourcompany.com`

5. Click **"Submit"**

### Step 6.4: Wait for Approval

- **Status**: You'll see "Pending" initially
- **Review Time**: 
  - UTILITY: Usually same day (often within hours)
  - MARKETING: 1-3 business days
  - AUTHENTICATION: Usually within 1 hour
- **Notification**: You'll receive email when approved/rejected

### Step 6.5: Common Rejection Reasons

❌ **Template Violations**:
- Contains marketing content in UTILITY category
- Has spelling/grammar errors
- Uses aggressive language
- Includes emojis (some reviewers reject)
- Has placeholder text instead of real examples
- Variables not properly formatted
- Missing required sample content

✅ **Best Practices**:
- Use clear, professional language
- Provide realistic sample content
- Match category to content type
- Follow [WhatsApp Template Guidelines](https://developers.facebook.com/docs/whatsapp/message-templates/guidelines)
- Test in multiple languages if multilingual

### Template Examples

#### Example 1: Order Confirmation (UTILITY)
```
Name: order_confirmation
Category: UTILITY

Body:
Hi {{1}},

Your order #{{2}} has been confirmed!

Items: {{3}}
Total: {{4}}
Estimated delivery: {{5}}

Track your order: {{6}}

Thank you for shopping with us!

Samples: John, 12345, 2x T-Shirts, $49.99, Dec 5, https://track.link/12345
```

#### Example 2: Appointment Reminder (UTILITY)
```
Name: appointment_reminder
Category: UTILITY

Body:
Hello {{1}},

Reminder: You have an appointment on {{2}} at {{3}}.

Location: {{4}}

Reply YES to confirm or call us to reschedule.

Samples: Sarah, December 15, 10:00 AM, 123 Main St
```

#### Example 3: OTP Code (AUTHENTICATION)
```
Name: otp_verification
Category: AUTHENTICATION

Body:
Your verification code is: {{1}}

This code expires in 5 minutes. Do not share it with anyone.

Samples: 123456
```

#### Example 4: Promotional (MARKETING)
```
Name: flash_sale
Category: MARKETING

Header: 🎉 FLASH SALE!

Body:
Hi {{1}},

Get {{2}}% off all items for the next 24 hours!

Use code: {{3}}

Shop now: {{4}}

Samples: John, 30, FLASH30, https://shop.com

Button: Visit Store → https://shop.com
```

---

## 7. Configure Webhooks

Webhooks let you receive incoming messages and status updates.

### Step 7.1: Generate Verify Token

Create a random string for webhook verification:

```bash
# Generate random token (Linux/Mac)
openssl rand -hex 32

# Or use online generator: https://randomkeygen.com/
```

Example: `a7b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

**Save this token** - you'll need it for both Meta and Greengate configuration.

### Step 7.2: Deploy Greengate (or Use ngrok for Testing)

#### Option A: Production Deployment

1. Deploy Greengate to a server with HTTPS
2. Your webhook URL will be: `https://yourdomain.com/webhook`

#### Option B: Local Testing with ngrok

For local development:

1. Install ngrok: https://ngrok.com/download
2. Start Greengate backend:
   ```bash
   npm run dev
   ```
3. In another terminal, start ngrok:
   ```bash
   ngrok http 3000
   ```
4. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
5. Your webhook URL: `https://abc123.ngrok.io/webhook`

⚠️ **Note**: ngrok URLs change on restart (use paid plan for static URLs)

### Step 7.3: Configure in Greengate

1. Open Greengate: `http://localhost:5173`
2. Go to **Setup** page
3. Enter your credentials:
   - **Access Token**: From Step 4
   - **Phone Number ID**: From Step 5
   - **WABA ID**: From Step 5
   - **Webhook Verify Token**: The token you generated above
4. Click **"Save Configuration"**

### Step 7.4: Configure Webhook in Meta

1. Go to **Meta for Developers** → **My Apps** → Your App
2. Click **WhatsApp** → **Configuration** (left menu)
3. Under **"Webhook"**, click **"Edit"**

4. Fill in:
   - **Callback URL**: `https://yourdomain.com/webhook` (or ngrok URL)
   - **Verify Token**: The token you generated in Step 7.1
   - Click **"Verify and Save"**

5. If verification succeeds, you'll see a green checkmark ✓

### Step 7.5: Subscribe to Webhook Events

1. Still on **Configuration** page
2. Under **"Webhook Fields"**, click **"Manage"**
3. Subscribe to these events:
   - ✅ **messages** (incoming messages)
   - ✅ **message_status** (delivery, read receipts)
   - ✅ **message_template_status_update** (template approvals)
4. Click **"Save"**

### Step 7.6: Test Webhook

1. Send a WhatsApp message to your business number
2. Check Greengate:
   - Go to **Dashboard** or **Messages** page
   - You should see the incoming message
3. Check backend logs:
   ```bash
   # You should see:
   Webhook POST received
   Processing message: { ... }
   Message saved to database
   ```

**Troubleshooting Webhook Issues**: See Section 11

---

## 8. Verify Your Business

Business verification unlocks higher messaging limits and features.

### Step 8.1: Why Verify?

**Benefits**:
- ✅ Higher tier messaging limits (see Section 9)
- ✅ Access to MARKETING templates
- ✅ Official verified badge (green checkmark)
- ✅ Better trust with customers
- ✅ Required for scaling

**Without Verification**:
- ⚠️ Limited to Tier 1 (1,000 conversations/day)
- ⚠️ UTILITY templates only
- ⚠️ May face restrictions

### Step 8.2: Start Verification Process

1. Go to **Meta Business Suite** → **Business Settings**
2. Click **"Security Center"** (left menu)
3. Click **"Start Verification"**

### Step 8.3: Verification Methods

#### Method 1: Business Documents (Fastest)

Upload one of:
- **Articles of Incorporation**
- **Tax Registration Certificate**
- **Business License**
- **Utility Bill** (business address)

Requirements:
- ✅ Clear, readable scan or photo
- ✅ Shows business name matching your account
- ✅ Shows business address
- ✅ Issued within last year
- ✅ Official government or utility company document

#### Method 2: Phone Verification

1. Provide business phone number
2. Receive automated call
3. Enter verification code

Requirements:
- ✅ Must be listed publicly (Google, Yellow Pages, etc.)
- ✅ Must match business info on Meta

#### Method 3: Domain Verification

1. Provide business website domain
2. Add Meta verification code to DNS or HTML
3. Meta verifies ownership

Requirements:
- ✅ Active website
- ✅ Access to DNS or website code
- ✅ Domain matches business

### Step 8.4: Submit and Wait

- **Review Time**: Usually 1-3 business days
- **Status Check**: Business Settings → Security Center
- **Notification**: Email when complete

### Step 8.5: What If Rejected?

Common reasons:
- Document quality too low
- Name mismatch
- Address mismatch
- Document expired or unofficial

**Solution**:
1. Review rejection email for specific reason
2. Upload better documents
3. Ensure all info matches exactly
4. Resubmit

---

## 9. Apply for Higher Tier Access

Meta uses a tiered system for messaging limits.

### Step 9.1: Understanding Tiers

| Tier | Daily Limit | Requirements |
|------|-------------|--------------|
| **Tier 0** | 50 conversations | Default for new businesses |
| **Tier 1** | 1,000 conversations | Phone number verified |
| **Tier 2** | 10,000 conversations | Auto-upgrade based on quality |
| **Tier 3** | 100,000 conversations | Auto-upgrade based on quality |
| **Tier 4** | Unlimited | Auto-upgrade based on quality |

**Conversation** = 24-hour messaging window with a unique user

### Step 9.2: Check Your Current Tier

1. Go to **Meta Business Suite** → **Business Settings**
2. Click **"WhatsApp Accounts"**
3. Select your WABA
4. Click **"Phone Numbers"** tab
5. Your tier is shown next to each phone number

### Step 9.3: Upgrade from Tier 0 to Tier 1

**Automatic** when you:
1. ✅ Add and verify a phone number (Step 3)
2. ✅ Complete business profile
3. ✅ Submit Facebook Business Verification (Step 8)

Usually happens within 24 hours of verification.

### Step 9.4: Upgrade to Tier 2+ (Quality-Based)

Meta automatically upgrades based on:

**Quality Rating** (most important):
- ✅ Low block rate (<1%)
- ✅ Low report rate (<0.1%)
- ✅ High response rate
- ✅ Fast response time
- ✅ No policy violations

**Usage**:
- Send quality messages
- Reach 50% of current tier limit over 7 days
- Maintain for 2 consecutive 7-day periods

**Timeline**:
- **Tier 1 → 2**: ~2-3 weeks of good performance
- **Tier 2 → 3**: ~1-2 months
- **Tier 3 → 4**: ~2-3 months

### Step 9.5: Best Practices for Tier Upgrade

✅ **Do**:
- Send messages users want and expect
- Use appropriate templates
- Respond quickly to incoming messages
- Monitor and fix issues immediately
- Get explicit opt-in before messaging
- Provide clear opt-out mechanism
- Send at appropriate times (not late night)

❌ **Don't**:
- Send unsolicited messages (spam)
- Buy contact lists
- Send messages to wrong numbers
- Ignore incoming messages
- Send low-quality content
- Violate Meta's policies
- Send too frequently

### Step 9.6: Monitor Quality Rating

1. Go to **Meta Business Suite** → **WhatsApp Manager**
2. Click **"Insights"** tab
3. Check:
   - **Quality Rating**: Green (high), Yellow (medium), Red (low)
   - **Message Status**: Sent, delivered, read rates
   - **Response Time**: Average and 24h rate
   - **Block Rate**: Should be <1%

⚠️ **Warning**: Red quality rating can result in:
- No tier upgrades
- Downgrade to lower tier
- Account suspension

---

## 10. Testing Your Setup

### Step 10.1: Test API Connection

Use curl to test:

```bash
# Set your credentials
ACCESS_TOKEN="your_access_token"
PHONE_NUMBER_ID="your_phone_number_id"

# Test API - Get Phone Number Info
curl -X GET \
  "https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}?fields=verified_name,display_phone_number,quality_rating" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}"

# Expected response:
{
  "verified_name": "Your Business Name",
  "display_phone_number": "+1 234 567 8900",
  "quality_rating": "GREEN",
  "id": "123456789012345"
}
```

### Step 10.2: Send Test Message

Using Greengate:

1. Make sure templates are synced:
   - Go to **Templates** page
   - Click **"Sync from Meta API"**
   - Wait for templates to load

2. Send a test message:
   - Go to **Send Message** page
   - Enter your WhatsApp number (that you added as test recipient)
   - Select a template
   - Fill in any required parameters
   - Click **"Send Template Message"**

3. Check your WhatsApp:
   - You should receive the message within seconds
   - Status in Greengate should update to "delivered"

### Step 10.3: Test Webhook

1. Send a message TO your business number from WhatsApp
2. Check Greengate:
   - Go to **Messages** page
   - You should see the incoming message
3. Check it's marked as **INBOUND**

### Step 10.4: Test Template Variables

Create a test template with variables:

```bash
# Using curl
curl -X POST \
  "https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "1234567890",
    "type": "template",
    "template": {
      "name": "welcome_message",
      "language": {
        "code": "en"
      },
      "components": [
        {
          "type": "body",
          "parameters": [
            {
              "type": "text",
              "text": "John Smith"
            },
            {
              "type": "text",
              "text": "Greengate"
            }
          ]
        }
      ]
    }
  }'
```

### Step 10.5: Test Different Message Types

1. **Template Message**: Already tested above
2. **Text Message** (within 24h window):
   ```bash
   curl -X POST \
     "https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages" \
     -H "Authorization: Bearer ${ACCESS_TOKEN}" \
     -H "Content-Type: application/json" \
     -d '{
       "messaging_product": "whatsapp",
       "to": "1234567890",
       "type": "text",
       "text": {
         "body": "This is a test text message"
       }
     }'
   ```

3. **Reply to Message**:
   - Have someone send you a message first
   - Within 24 hours, send a text message back

---

## 11. Common Issues & Solutions

### Issue 1: "Phone number is already registered on WhatsApp"

**Problem**: You want to use a number that's already on WhatsApp Personal.

**Solutions**:

**Option A: Migrate Number** (Recommended)
1. Download chat history from WhatsApp app (if needed)
2. Uninstall WhatsApp from your phone
3. Wait 30 days (WhatsApp holding period)
4. Then add to WhatsApp Business API

**Option B: Use Different Number**
- Get a new dedicated business number
- Don't use personal WhatsApp number

**Option C: Use WhatsApp Business App** (Not API)
- Limited to WhatsApp Business mobile app
- Can't use Cloud API
- Not suitable for Greengate

### Issue 2: "Webhook verification failed"

**Symptoms**: Red X when setting webhook URL

**Causes & Solutions**:

1. **Wrong Verify Token**
   - ✅ Ensure token matches in both Greengate config and Meta
   - ✅ No spaces or special characters issues
   - ✅ Case-sensitive

2. **URL Not Accessible**
   - ✅ URL must be publicly accessible
   - ✅ HTTPS required (not HTTP)
   - ✅ No localhost URLs (use ngrok)
   - ✅ Test URL in browser: `https://yourdomain.com/webhook?hub.verify_token=YOUR_TOKEN&hub.challenge=123&hub.mode=subscribe`
   - ✅ Should return: `123`

3. **Greengate Not Running**
   - ✅ Backend must be running: `npm run dev`
   - ✅ Check health: `curl http://localhost:3000/health`

4. **Firewall/Security**
   - ✅ Allow inbound traffic on port 443
   - ✅ Check cloud provider security groups
   - ✅ Verify SSL certificate is valid

### Issue 3: "Template rejected"

**Common Reasons**:

1. **Wrong Category**
   - Marketing content in UTILITY category
   - → Use MARKETING category or rewrite as UTILITY

2. **Poor Sample Content**
   - Placeholder text like "XXX" or "example"
   - → Use realistic sample data

3. **Policy Violations**
   - Aggressive language, threats, adult content
   - → Follow [WhatsApp Commerce Policy](https://www.whatsapp.com/legal/commerce-policy)

4. **Format Issues**
   - Broken variable syntax `{1}` instead of `{{1}}`
   - → Use correct format: `{{1}}`, `{{2}}`, etc.

### Issue 4: "Message not delivered"

**Check These**:

1. **Phone Number Format**
   - ✅ Correct: `491234567890` (country code + number, no +)
   - ❌ Wrong: `+49 123 456 7890`, `0123 456 7890`

2. **Template Status**
   - ✅ Template must be "APPROVED"
   - Check in Templates page

3. **24-Hour Window (for text messages)**
   - Text messages only work within 24h of receiving a message
   - Use template messages otherwise

4. **Recipient Phone**
   - User must have WhatsApp installed
   - Number must be correct
   - User hasn't blocked your business

5. **Rate Limits**
   - Check you haven't exceeded tier limit
   - Check Meta's rate limit errors

6. **Account Status**
   - Check quality rating isn't RED
   - Verify account isn't suspended

### Issue 5: "Invalid access token"

**Solutions**:

1. **Token Expired**
   - Temporary tokens last 24 hours
   - → Generate permanent token (Step 4.2)

2. **Wrong Token**
   - Copied incorrectly
   - → Regenerate and copy carefully

3. **Insufficient Permissions**
   - Token needs correct scopes
   - → Regenerate with `whatsapp_business_messaging` and `whatsapp_business_management`

4. **App Misconfiguration**
   - Token from wrong app
   - → Verify app ID and regenerate token

### Issue 6: "Can't sync templates"

**Causes**:

1. **No WABA ID**
   - → Add WABA ID in Greengate configuration

2. **Wrong WABA ID**
   - → Verify WABA ID in Meta Business Settings

3. **No Templates Created**
   - → Create templates in Meta first (Step 6)

4. **API Permissions**
   - → Check access token has `whatsapp_business_management` permission

### Issue 7: "Business verification failed"

**Solutions**:

1. **Document Quality**
   - → Upload high-resolution scan
   - → Ensure text is clearly readable

2. **Name Mismatch**
   - Business name on document must match Meta account exactly
   - → Update either the document or business name

3. **Old Documents**
   - → Use documents less than 1 year old

4. **Wrong Document Type**
   - → Use official government or utility documents only

### Issue 8: "Can't upgrade to higher tier"

**Requirements**:

1. **For Tier 1**:
   - Complete business verification
   - Verify phone number
   - Wait 24-48 hours

2. **For Tier 2+**:
   - Maintain GREEN quality rating
   - Send enough messages (50%+ of current limit)
   - Do this for 2 consecutive 7-day periods
   - No policy violations

3. **If Stuck**:
   - Check quality rating (must be GREEN)
   - Review block/report rates
   - Improve message quality
   - Respond faster to incoming messages

### Issue 9: "Greengate setup page won't save"

**Check**:

1. **All Required Fields**
   - Access Token: Required
   - Phone Number ID: Required
   - WABA ID: Optional but recommended
   - Verify Token: Auto-generated if empty

2. **Backend Connection**
   - Check backend is running
   - Check browser console for errors (F12)
   - Verify CORS settings

3. **Token Format**
   - Access token should start with `EAA`
   - Phone Number ID: 15 digits
   - WABA ID: 13-15 digits starting with `10`

### Issue 10: "Incoming messages not showing"

**Troubleshoot**:

1. **Webhook Not Configured**
   - Verify webhook URL in Meta (Step 7)
   - Check webhook events are subscribed

2. **Backend Not Accessible**
   - Test webhook URL publicly
   - Check ngrok is running (if using)

3. **Database Issues**
   - Check `greengate.db` exists and is writable
   - Check backend logs for errors

4. **Message Types**
   - Greengate supports text messages
   - Media messages might not be displayed (check backend logs)

---

## 12. Best Practices & Tips

### Security

✅ **Do**:
- Store access token securely (environment variables)
- Use system user tokens (not personal)
- Rotate tokens periodically
- Never commit tokens to git
- Use HTTPS everywhere
- Implement rate limiting

❌ **Don't**:
- Share tokens publicly
- Use temporary tokens in production
- Store tokens in frontend code
- Expose tokens in logs

### Message Quality

✅ **Do**:
- Get explicit user consent before messaging
- Send relevant, expected messages
- Respond to incoming messages quickly
- Use templates appropriately
- Provide clear opt-out instructions
- Send at reasonable hours

❌ **Don't**:
- Spam users
- Buy contact lists
- Send messages to wrong recipients
- Ignore incoming messages
- Send too frequently
- Violate WhatsApp policies

### Template Management

✅ **Do**:
- Create templates before you need them (approval takes time)
- Use clear, professional language
- Test templates with sample data
- Keep templates updated
- Delete unused templates

❌ **Don't**:
- Use misleading content
- Put marketing content in UTILITY templates
- Use too many variables
- Create duplicate templates

### Monitoring

✅ **Do**:
- Monitor quality rating weekly
- Check message delivery rates
- Track response times
- Review block/report rates
- Monitor tier limits
- Set up alerts for issues

❌ **Don't**:
- Ignore quality rating drops
- Exceed tier limits
- Miss failed messages
- Ignore webhook errors

### Scaling

✅ **Do**:
- Start with test number
- Verify business early
- Focus on quality over quantity
- Gradually increase volume
- Monitor performance
- Plan for growth

❌ **Don't**:
- Send maximum messages immediately
- Ignore tier progression
- Sacrifice quality for volume

---

## 13. Quick Reference

### Important URLs

- **Meta Business Suite**: https://business.facebook.com/
- **Meta for Developers**: https://developers.facebook.com/
- **WhatsApp Cloud API Docs**: https://developers.facebook.com/docs/whatsapp/cloud-api
- **Template Guidelines**: https://developers.facebook.com/docs/whatsapp/message-templates/guidelines
- **WhatsApp Policies**: https://www.whatsapp.com/legal/business-policy

### API Endpoints

```
Base URL: https://graph.facebook.com/v18.0

Send Message:
POST /{phone-number-id}/messages

Get Templates:
GET /{waba-id}/message_templates

Upload Media:
POST /{phone-number-id}/media

Get Media:
GET /{media-id}
```

### Useful Commands

```bash
# Test webhook locally
curl "http://localhost:3000/webhook?hub.verify_token=YOUR_TOKEN&hub.challenge=123&hub.mode=subscribe"

# Test API connection
curl -X GET \
  "https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}"

# Send test message
curl -X POST \
  "https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"messaging_product":"whatsapp","to":"1234567890","type":"template","template":{"name":"hello_world","language":{"code":"en_US"}}}'
```

### Credential Checklist

```
✅ Access Token (EAAxxxxxxxxx...)
✅ Phone Number ID (15 digits)
✅ WABA ID (13-15 digits, starts with 10)
✅ Webhook Verify Token (random string)
✅ Phone Number Verified
✅ Business Verified (for production)
✅ Templates Created & Approved
✅ Webhook Configured & Tested
```

---

## 14. Next Steps

After completing this guide:

1. **✅ Configure Greengate**
   - Enter all credentials in setup page
   - Test connection
   - Sync templates

2. **✅ Send First Message**
   - Use test number or your own phone
   - Try template message
   - Verify delivery

3. **✅ Set Up Webhooks**
   - Configure URL in Meta
   - Test incoming messages
   - Monitor webhook logs

4. **✅ Create Production Templates**
   - Design templates for your use cases
   - Submit for approval
   - Wait for approval before using

5. **✅ Verify Business**
   - Submit verification documents
   - Wait for approval
   - Unlock higher tiers

6. **✅ Monitor & Optimize**
   - Check quality rating regularly
   - Improve based on feedback
   - Scale up gradually

---

## 15. Support & Resources

### Official Documentation
- [WhatsApp Business Platform](https://developers.facebook.com/docs/whatsapp)
- [Cloud API Quick Start](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started)
- [Message Templates](https://developers.facebook.com/docs/whatsapp/message-templates)
- [Webhooks](https://developers.facebook.com/docs/whatsapp/webhooks)

### Community
- [Meta Developers Community](https://developers.facebook.com/community/)
- [WhatsApp Business Developers Group](https://www.facebook.com/groups/wadevs)
- [Stack Overflow - WhatsApp Tag](https://stackoverflow.com/questions/tagged/whatsapp)

### Tools
- [Postman WhatsApp Collection](https://www.postman.com/meta/workspace/whatsapp-business-platform)
- [ngrok](https://ngrok.com/) - Local webhook testing
- [Webhook.site](https://webhook.site/) - Test webhook payloads

### Greengate Documentation
- `README.md` - Complete project documentation
- `API.md` - API reference
- `QUICKSTART.md` - Quick setup guide
- `TROUBLESHOOTING.md` - Common issues

---

## 📝 Summary Checklist

Use this checklist to track your progress:

### Account Setup
- [ ] Created Meta Business Account
- [ ] Created Meta Developer App
- [ ] Added WhatsApp Product to App
- [ ] Created WhatsApp Business Account (WABA)
- [ ] Completed business profile

### Phone Number
- [ ] Decided on test vs production number
- [ ] Added phone number to WABA
- [ ] Verified phone number
- [ ] Added test recipients (if using test number)

### Access & Credentials
- [ ] Generated access token (permanent)
- [ ] Found Phone Number ID
- [ ] Found WABA ID
- [ ] Generated webhook verify token
- [ ] Saved all credentials securely

### Templates
- [ ] Created first template
- [ ] Submitted for approval
- [ ] Template approved
- [ ] Synced templates in Greengate

### Webhooks
- [ ] Deployed Greengate (or set up ngrok)
- [ ] Configured webhook URL in Meta
- [ ] Subscribed to webhook events
- [ ] Tested incoming messages

### Verification (Optional but Recommended)
- [ ] Submitted business verification
- [ ] Verification approved
- [ ] Upgraded to Tier 1

### Testing
- [ ] Configured Greengate with credentials
- [ ] Sent test template message
- [ ] Received test message via webhook
- [ ] Verified messages in dashboard

### Production Ready
- [ ] All templates approved
- [ ] Business verified
- [ ] HTTPS domain configured
- [ ] Monitoring set up
- [ ] Quality rating GREEN

---

**🎉 Congratulations!** You're now ready to use WhatsApp Business API with Greengate!

For questions or issues, refer to:
- Section 11 (Common Issues)
- `TROUBLESHOOTING.md` in Greengate repo
- Meta's official documentation

---

**Last Updated**: November 2025  
**Meta API Version**: v18.0  
**Greengate Version**: 1.0.0

**License**: MIT  
**Maintained by**: Greengate Development Team
