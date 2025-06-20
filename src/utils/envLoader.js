import fs from 'fs';
import path from 'path';

// Load environment variables from .env.local file
export function loadEnvVariables() {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const envLines = envContent.split('\n');
      
      envLines.forEach(line => {
        // Skip comments and empty lines
        if (line.startsWith('#') || !line.trim()) {
          return;
        }
        
        // Parse key-value pairs
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          const value = match[2].trim();
          
          // Set environment variable if not already set
          if (!process.env[key]) {
            process.env[key] = value;
          }
        }
      });
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error loading environment variables:', error);
    return false;
  }
}
