# Changelog

All notable changes to Greengate will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-01

### Added - Initial Release

#### Backend
- ✅ Express.js server with TypeScript
- ✅ SQLite database with three core tables (templates, messages, config)
- ✅ Configuration management API
- ✅ Template management with CRUD operations
- ✅ Template synchronization from Meta API
- ✅ Message sending (template and text messages)
- ✅ Webhook endpoints for receiving messages and status updates
- ✅ WhatsApp Business Cloud API integration
- ✅ Automatic database initialization
- ✅ Request logging middleware
- ✅ Error handling middleware
- ✅ CORS support

#### Frontend
- ✅ React 18 with TypeScript
- ✅ Vite for fast development and building
- ✅ Tailwind CSS for styling
- ✅ React Router for navigation
- ✅ Setup/initialization page for first-time configuration
- ✅ Dashboard with message statistics
- ✅ Template management page with sync functionality
- ✅ Message history page with filtering
- ✅ Send message page (templates and text)
- ✅ Responsive design
- ✅ Modern UI with gradient backgrounds and cards
- ✅ Real-time status updates display

#### API Endpoints
- ✅ `GET /health` - Health check
- ✅ `GET /api/config` - Get configuration status
- ✅ `POST /api/config/whatsapp` - Set WhatsApp configuration
- ✅ `GET /api/templates` - List all templates
- ✅ `GET /api/templates/:id` - Get template by ID
- ✅ `POST /api/templates/sync` - Sync templates from Meta API
- ✅ `POST /api/templates` - Create new template
- ✅ `PUT /api/templates/:id` - Update template
- ✅ `DELETE /api/templates/:id` - Delete template
- ✅ `GET /api/messages` - List messages with limit
- ✅ `GET /api/messages/:id` - Get message by ID
- ✅ `POST /api/messages/send` - Send template message
- ✅ `POST /api/messages/send-text` - Send text message
- ✅ `GET /webhook` - Webhook verification
- ✅ `POST /webhook` - Receive webhook events

#### Documentation
- ✅ Comprehensive README.md in German
- ✅ DEVELOPMENT.md with architecture details
- ✅ API.md with complete API reference
- ✅ TROUBLESHOOTING.md with common issues
- ✅ Code examples and usage guides
- ✅ Installation and configuration instructions

#### Features
- ✅ Template message sending with dynamic parameters
- ✅ Text message sending (within 24-hour window)
- ✅ Inbound message processing
- ✅ Message status tracking (sent, delivered, read)
- ✅ Support for various message types (text, image, video, audio, document, location)
- ✅ Phone number validation and formatting
- ✅ Template status filtering (only approved templates shown for sending)
- ✅ Automatic verify token generation
- ✅ Safe configuration handling (tokens not exposed to frontend)

#### Developer Experience
- ✅ TypeScript with strict mode
- ✅ Hot reload for development
- ✅ Development startup script
- ✅ Clear project structure
- ✅ Type-safe API service
- ✅ Reusable React components
- ✅ Custom Tailwind utilities

### Security
- ✅ Access tokens never sent to frontend
- ✅ Webhook verify token validation
- ✅ Input validation on all endpoints
- ✅ SQL injection prevention through parameterized queries

### Performance
- ✅ Async/await throughout
- ✅ Efficient database queries with limits
- ✅ Immediate webhook acknowledgment
- ✅ Asynchronous webhook processing

## [Unreleased]

### Planned Features

#### Short-term (v1.1)
- [ ] Authentication and user management
- [ ] WebSocket for real-time updates
- [ ] Better logging (structured logs)
- [ ] Unit and integration tests
- [ ] Docker support
- [ ] Environment-based configuration

#### Medium-term (v1.2)
- [ ] Media upload and management
- [ ] Contact management system
- [ ] Auto-reply functionality
- [ ] Template editor in GUI
- [ ] Message search and filtering
- [ ] Export functionality (CSV, JSON)
- [ ] Analytics dashboard
- [ ] Rate limiting

#### Long-term (v2.0)
- [ ] Multi-tenant support
- [ ] Multiple WhatsApp numbers
- [ ] Chatbot builder
- [ ] Workflow automation
- [ ] CRM integrations
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] A/B testing for templates
- [ ] Scheduled messages
- [ ] Message queuing

### Known Limitations
- No authentication/authorization
- Single WhatsApp Business number per instance
- No media file management
- No real-time frontend updates (requires manual refresh)
- Basic logging only
- No message queue for high volume
- No retry mechanism for failed sends
- No webhook signature verification

---

## Version History

### Version Format
- **Major.Minor.Patch** (e.g., 1.2.3)
- **Major**: Breaking changes
- **Minor**: New features (backward compatible)
- **Patch**: Bug fixes and minor improvements

### Release Notes Template

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- New features

### Changed
- Changes in existing functionality

### Deprecated
- Soon-to-be removed features

### Removed
- Removed features

### Fixed
- Bug fixes

### Security
- Security improvements
```

---

## Contributing

When contributing, please:
1. Update this CHANGELOG.md with your changes
2. Follow the existing format
3. Place changes under "Unreleased" section
4. Use appropriate category (Added, Changed, Fixed, etc.)
5. Include relevant issue/PR numbers

Example:
```markdown
### Added
- Template preview in send message page (#123)
- Bulk message sending feature (#124)

### Fixed
- Phone number validation for UK numbers (#125)
```

---

**Note**: This project follows Semantic Versioning. For more information, visit https://semver.org/
