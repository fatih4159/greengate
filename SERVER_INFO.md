# 🌿 Greengate Server Information

## ✅ Servers Running

### Backend API
- **URL**: http://localhost:3000
- **Status**: Running
- **Health Check**: http://localhost:3000/health
- **Root**: http://localhost:3000 (shows API version info)

### Frontend UI
- **URL**: http://localhost:5173
- **Status**: Running
- **Network**: http://172.30.0.2:5173

## 🔧 Configuration Fixed

The issue was a **port configuration mismatch**:

### Original Issue:
- Frontend Vite was configured to run on port 3000 (same as backend)
- Frontend expected backend API on port 8080
- This caused port conflicts and routing issues

### Fixed Configuration:
- ✅ Backend: **Port 3000**
- ✅ Frontend: **Port 5173**
- ✅ Frontend proxy: Points to backend at localhost:3000

## 📝 How to Access

### Access the Frontend Application:
Open your browser and navigate to:
```
http://localhost:5173
```

### Access the Backend API:
```
http://localhost:3000
```

## 🚀 Starting the Servers

### Option 1: Use the startup script
```bash
./start-dev.sh
```

### Option 2: Manual start (two terminals)

**Terminal 1 - Backend:**
```bash
cd /workspace
PORT=3000 npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd /workspace/frontend
npm run dev
```

### Option 3: Background processes (current setup)
```bash
cd /workspace
PORT=3000 nohup npm run dev > /tmp/backend.log 2>&1 &

cd /workspace/frontend
nohup npm run dev > /tmp/frontend.log 2>&1 &
```

## 📊 Monitoring Logs

### Backend logs:
```bash
tail -f /tmp/backend.log
```

### Frontend logs:
```bash
tail -f /tmp/frontend.log
```

## 🛑 Stopping the Servers

```bash
# Kill backend
killall nodemon

# Kill frontend
pkill -f "vite"

# Or kill all node processes (careful!)
killall node
```

## 🔍 Troubleshooting

### Check if servers are running:
```bash
# Check processes
ps aux | grep -E "(nodemon|vite)"

# Check ports
lsof -i :3000  # Backend
lsof -i :5173  # Frontend
```

### Test backend:
```bash
curl http://localhost:3000/health
# Should return: {"status":"ok","timestamp":"..."}
```

### Test frontend:
```bash
curl -I http://localhost:5173/
# Should return: HTTP/1.1 200 OK
```

## ⚙️ Files Modified

1. **`/workspace/frontend/vite.config.ts`**
   - Changed frontend port from 3000 to 5173
   - Changed backend proxy from port 8080 to 3000

2. **`/workspace/.env`**
   - Created with PORT=3000 for backend

## 🎯 Next Steps

1. ✅ Servers are running
2. 📱 Access the frontend at http://localhost:5173
3. 🔧 Complete WhatsApp API setup in the UI
4. 📤 Start sending messages!

---

**Status**: ✅ All systems operational  
**Last Updated**: 2025-11-29
