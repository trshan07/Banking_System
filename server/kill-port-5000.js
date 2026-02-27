// kill-port-5000.js
const { exec } = require('child_process');
const port = 5000;

console.log(`Attempting to kill process on port ${port}...`);

if (process.platform === 'win32') {
  // Windows
  exec(`netstat -ano | findstr :${port}`, (err, stdout) => {
    if (err) {
      console.log('Error finding process');
      return;
    }
    
    if (stdout) {
      const lines = stdout.split('\n');
      lines.forEach(line => {
        const match = line.match(/\s+(\d+)$/);
        if (match) {
          const pid = match[1].trim();
          exec(`taskkill /PID ${pid} /F`, (err) => {
            if (!err) {
              console.log(`✅ Successfully killed process ${pid} on port ${port}`);
            } else {
              console.log(`❌ Failed to kill process ${pid}`);
            }
          });
        }
      });
    } else {
      console.log(`✅ No process found running on port ${port}`);
    }
  });
} else {
  // Mac/Linux
  exec(`lsof -ti:${port} | xargs kill -9`, (err) => {
    if (!err) {
      console.log(`✅ Successfully killed process on port ${port}`);
    } else {
      console.log(`✅ No process found running on port ${port} or already killed`);
    }
  });
}