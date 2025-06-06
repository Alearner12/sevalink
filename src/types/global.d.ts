// Type definitions for global objects in both Node.js and browser environments

// This makes the file a module
export {};

declare global {
  // Extend the NodeJS namespace for process.env
  namespace NodeJS {
    // Allow any string key in process.env
    interface ProcessEnv {
      [key: string]: string | undefined;
      NODE_ENV: 'development' | 'production' | 'test';
      MONGODB_URI: string;
    }

    // Ensure process is defined with env
    interface Process {
      env: ProcessEnv;
    }

    // Ensure global is defined
    interface Global {
      _mongoose?: {
        conn: any;
        promise: Promise<any> | null;
      };
    }
  }


  // Declare process for browser environment
  const process: NodeJS.Process;
  
  // Declare global for Node.js environment
  const global: NodeJS.Global & typeof globalThis;
  
  // Extend Window interface for browser
  interface Window {
    __NEXT_DATA__: any;
  }
}

// This makes the file a module and prevents TypeScript errors
export {};
