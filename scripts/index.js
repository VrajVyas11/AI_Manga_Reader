import { spawn } from "child_process";
import path from "path";
import os from "os";

class RapidOCRWrapper {
  constructor() {
    this.pythonCommand = this.getPythonCommand();
    const ocrScriptPath = process.env.NODE_ENV === 'production' 
      ? '/app/scripts/main.py'  // Docker path
      : path.resolve(process.cwd(),"scripts", "main.py");  // Local path
    console.log("OCR script path:", ocrScriptPath);

    this.pythonProcess = spawn(this.pythonCommand, [ocrScriptPath], {
      stdio: ["pipe", "pipe", "pipe"],
      encoding: "utf-8",
    });

    this.pythonProcess.stdout.setEncoding("utf-8");
    this.buffer = "";
    this.pythonProcess.stdout.on("data", (data) => {
      this.buffer += data;
    });

    this.pythonProcess.stderr.on("data", (errData) => {
      const errorMsg = errData.toString().trim();
      if (errorMsg.includes("Neither CUDA nor MPS are available")) {
        console.warn("Warning:", errorMsg);
      } else if (errorMsg.startsWith("[TIME]") || errorMsg.startsWith("[MEM]")) {
        console.log(errorMsg);  // Log timing/memory info
      } else {
        // console.error(errorMsg);
      }
    });

    this.pythonProcess.on("exit", (code) => {
      console.log(`Python process exited with code ${code}`);
    });
  }

  getPythonCommand() {
    return os.platform() === "win32" ? "python" : "python3";
  }

  async sendCommand(command, args = "") {
    const startTime = performance.now();
    return new Promise((resolve, reject) => {
      this.pythonProcess.stdin.write(`${command} ${args}\n`);

      this.pythonProcess.stdout.once("data", (data) => {
        try {
          const parsedData = JSON.parse(data.toString().trim());
          if (parsedData.status === "error") {
            reject(new Error(parsedData.message));
          } else {
            resolve(parsedData);
          }
        } catch (error) {
          reject(new Error(`Invalid JSON response: ${data.toString()} ${error}`));
        }
        const endTime = performance.now();
        console.log(`[JS TIME] Command '${command} ${args}': ${(endTime - startTime) / 1000}s`);
      });
    });
  }

  async init(languages) {
    return this.sendCommand("init", languages);
  }

  async readText(imagePath) {
    return this.sendCommand("read_text", imagePath);
  }

  async close() {
    const response = await this.sendCommand("close").catch((err) => {
      console.error("Error while closing:", err.message);
    });
    this.pythonProcess.stdin.end();
    return response;
  }
}

export default RapidOCRWrapper;