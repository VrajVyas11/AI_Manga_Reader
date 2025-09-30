import { spawn } from "child_process";
import path from "path";
import os from "os";

class RapidOCRWrapper {
  constructor() {
    this.pythonCommand = this.getPythonCommand();
    const ocrScriptPath = process.env.NODE_ENV === 'production' 
      ? '/app/scripts/main.py'
      : path.resolve(process.cwd(), "scripts", "main.py");
    
    console.log("OCR script path:", ocrScriptPath);
    this.isProcessActive = false;
    this.currentLanguage = "en";
    
    this.startPythonProcess();
  }

  getPythonCommand() {
    return os.platform() === "win32" ? "python" : "python3";
  }

  startPythonProcess() {
    this.pythonProcess = spawn(this.pythonCommand, [this.getScriptPath()], {
      stdio: ["pipe", "pipe", "pipe"],
      encoding: "utf-8",
    });

    this.buffer = "";
    this.isProcessActive = true;

    this.pythonProcess.stdout.setEncoding("utf-8");
    this.pythonProcess.stdout.on("data", (data) => {
      this.buffer += data;
    });

    this.pythonProcess.stderr.on("data", (errData) => {
      const errorMsg = errData.toString().trim();
      if (errorMsg.includes("Neither CUDA nor MPS are available")) {
        console.warn("Warning:", errorMsg);
      } else if (errorMsg.startsWith("[TIME]") || errorMsg.startsWith("[MEMORY]")) {
        console.log(errorMsg);
      } else if (errorMsg && !errorMsg.includes("WARNING") && !errorMsg.includes("INFO")) {
        console.error("Python Error:", errorMsg);
      }
    });

    this.pythonProcess.on("exit", (code) => {
      this.isProcessActive = false;
      console.log(`Python process exited with code ${code}`);
    });

    this.pythonProcess.on("error", (error) => {
      this.isProcessActive = false;
      console.error("Python process error:", error);
    });
  }

  getScriptPath() {
    if (process.env.NODE_ENV === 'production') {
      return '/app/scripts/main.py';
    }
    return path.resolve(process.cwd(), "scripts", "main.py");
  }

  async ensureProcessActive() {
    if (!this.isProcessActive) {
      console.log("Restarting Python process...");
      this.startPythonProcess();
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  async sendCommand(command, args = "") {
    await this.ensureProcessActive();
    
    const startTime = performance.now();
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Command timeout: ${command} ${args}`));
      }, 60000);

      const fullCommand = `${command} ${args}\n`;
      console.log(`[JS] Sending command: ${fullCommand.trim()}`);
      
      if (!this.pythonProcess.stdin.writable) {
        reject(new Error("Python process stdin is not writable"));
        return;
      }

      let responseBuffer = "";
      const dataHandler = (data) => {
        responseBuffer += data.toString();
        
        // Check if we have a complete JSON response
        try {
          const lines = responseBuffer.split('\n').filter(line => line.trim());
          for (let i = lines.length - 1; i >= 0; i--) {
            try {
              const jsonResponse = JSON.parse(lines[i]);
              clearTimeout(timeout);
              this.pythonProcess.stdout.removeListener('data', dataHandler);
              
              if (jsonResponse.status === "error") {
                reject(new Error(jsonResponse.message));
              } else {
                const endTime = performance.now();
                console.log(`[JS TIME] Command '${command}': ${(endTime - startTime) / 1000}s`);
                resolve(jsonResponse);
              }
              return;
            } catch {
              // Continue to next line
              continue;
            }
          }
        } catch  {
          // Wait for more data
        }
      };

      this.pythonProcess.stdout.on('data', dataHandler);
      this.pythonProcess.stdin.write(fullCommand);

      // Error handler
      const errorHandler = (error) => {
        clearTimeout(timeout);
        this.pythonProcess.stdout.removeListener('data', dataHandler);
        reject(new Error(`Process error: ${error.message}`));
      };

      this.pythonProcess.once('error', errorHandler);
    });
  }

  async init(languages = "en") {
    this.currentLanguage = languages;
    const result = await this.sendCommand("init", `"${languages}"`);
    console.log(`OCR initialized for language: ${languages}`);
    return result;
  }

  async readText(imagePath, language = "en") {
    // Use provided language or fallback to current
    const targetLanguage = language || this.currentLanguage;
    const escapedPath = imagePath.replace(/"/g, '\\"');
    return this.sendCommand("read_text", `"${escapedPath}" "${targetLanguage}"`);
  }

  async close() {
    try {
      const response = await this.sendCommand("close");
      this.pythonProcess.stdin.end();
      this.isProcessActive = false;
      return response;
    } catch (err) {
      console.error("Error while closing:", err.message);
      this.pythonProcess.kill();
      this.isProcessActive = false;
    }
  }
}

export default RapidOCRWrapper;