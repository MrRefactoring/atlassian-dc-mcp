import { spawn, exec } from 'child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { existsSync, watch } from 'node:fs';
import { platform } from 'node:os';

const DEBOUNCE_MS = 200;

class WatchManager {
  constructor(packageName, options = {}) {
    this.runProcess = null;
    this.watcher = null;
    this.isShuttingDown = false;
    this.isBuilding = false;
    this.rebuildQueued = false;
    this.debounceTimer = null;
    this.packageName = packageName;
    this.verbose = options.verbose || false;
  }

  start() {
    // Get the current file path and directory (root of monorepo)
    const fileName = fileURLToPath(import.meta.url);
    const rootDir = dirname(fileName);

    // Determine the package directory
    let packageDir;
    if (this.packageName) {
      packageDir = join(rootDir, 'packages', this.packageName);
      if (!existsSync(packageDir)) {
        console.error(`Package '${this.packageName}' not found in packages directory`);
        process.exit(1);
      }
    } else {
      console.error('No package specified. Please specify a package name.');
      console.log('Usage: node mcp-live-debug.js <package-name>');
      console.log('Available packages: bitbucket, core, confluence, jira');
      process.exit(1);
    }

    this.packageDir = packageDir;

    if (this.verbose) {
      console.log(`Starting debug session for package: ${this.packageName}`);
      console.log(`Working directory: ${packageDir}`);
    }

    const srcDir = join(packageDir, 'src');
    this.watcher = watch(srcDir, { recursive: true }, () => {
      this.scheduleRebuild();
    });

    this.rebuildAndRun();
  }

  scheduleRebuild() {
    if (this.isShuttingDown) return;

    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.rebuildAndRun();
    }, DEBOUNCE_MS);
  }

  rebuildAndRun() {
    if (this.isShuttingDown) return;

    if (this.isBuilding) {
      this.rebuildQueued = true;
      return;
    }

    this.isBuilding = true;

    const npxCmd = platform() === 'win32' ? 'npx.cmd' : 'npx';
    const tscFlags = this.verbose ? '' : '--quiet';

    exec(`${npxCmd} tsc ${tscFlags}`, { cwd: this.packageDir }, (error, stdout, stderr) => {
      this.isBuilding = false;

      if (this.isShuttingDown) return;

      if (error) {
        if (this.verbose || stderr) {
          console.error(stderr || stdout);
        }
        console.error('Build failed, waiting for changes...');
      } else {
        this.runBuiltServer();
      }

      if (this.rebuildQueued) {
        this.rebuildQueued = false;
        this.rebuildAndRun();
      }
    });
  }

  runBuiltServer() {
    this.stopRunProcess();

    if (this.isShuttingDown) return;

    this.runProcess = spawn('node', ['./build/index.js'], {
      stdio: 'inherit',
      cwd: this.packageDir,
      env: {
        ...process.env,
        PORT: '3098'
      }
    });

    this.runProcess.on('error', (err) => {
      if (!this.isShuttingDown) {
        console.error('Failed to start server:', err);
      }
    });

    this.runProcess.on('exit', (code) => {
      if (!this.isShuttingDown && this.verbose && code !== 0) {
        console.error(`Process exited with code ${code}`);
      }
    });
  }

  stopRunProcess() {
    if (!this.runProcess) return;
    this.runProcess.kill('SIGTERM');
    this.runProcess = null;
  }

  stop() {
    this.isShuttingDown = true;
    clearTimeout(this.debounceTimer);

    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }

    this.stopRunProcess();

    return Promise.resolve();
  }
}

// Get the package name from command line arguments
const packageName = process.argv[2];
const verbose = process.argv.includes('--verbose') || process.argv.includes('-v');

// Create watch manager with the specified package
const watchManager = new WatchManager(packageName, { verbose });

// Start the process
watchManager.start();

if (verbose) {
  console.log('\nPress Ctrl+C to stop the debug session');
}

// Handle process termination
process.on('SIGINT', async () => {
  if (verbose) {
    console.log('\nReceived SIGINT. Shutting down gracefully...');
  }
  await watchManager.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  if (verbose) {
    console.log('\nReceived SIGTERM. Shutting down gracefully...');
  }
  await watchManager.stop();
  process.exit(0);
});

// Catch and log any unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
