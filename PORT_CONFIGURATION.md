# Port Configuration

## Issue Resolution

The development environment was experiencing port conflicts. The issue has been resolved with the following changes:

## Changes Made

1. **Backend Port**: Changed from port 3000 to port 3001
   - Reason: Port 3000 was already in use by the system (PORT=26053 environment variable was being overridden)
   - Solution: Modified `start-dev.sh` to explicitly set `PORT=3001`

2. **Frontend Proxy Configuration**: Updated to point to new backend port
   - File: `frontend/vite.config.ts`
   - Changed proxy target from `http://localhost:3000` to `http://localhost:3001`

3. **Environment Configuration**: Created `.env` file
   - File: `/workspace/.env`
   - Contents:
     ```
     PORT=3001
     DATABASE_PATH=./greengate.db
     NODE_ENV=development
     ```

## Current Configuration

### Services Running:
- **Backend API**: http://localhost:3001
  - Health check: http://localhost:3001/health
  - API endpoints: http://localhost:3001/api/*
  - Webhooks: http://localhost:3001/webhook

- **Frontend**: http://localhost:5174 (or 5173 if available)
  - Vite automatically selects an available port
  - Proxies `/api` and `/webhook` requests to backend at port 3001

### How to Start Services

Simply run:
```bash
./start-dev.sh
```

The script will:
1. Check and install dependencies if needed
2. Start the backend on port 3001
3. Start the frontend on the first available port (5173, 5174, etc.)
4. Set up automatic file watching and hot reload

### Verification

To verify services are running:
```bash
# Check backend
curl http://localhost:3001/health

# Check frontend (adjust port if needed)
curl http://localhost:5174/
```

## Notes

- The frontend automatically proxies API calls, so you don't need to worry about CORS
- If you see "port in use" errors, the start script will attempt to use the next available port
- All environment variables can be configured in the `.env` file
