// file:    src/config/debug.ts


export const DEBUG =
  import.meta.env.DEV && false; 
  // 👉 set to false to disable ALL logs

export const log = (...args: any[]) => {
  if (DEBUG) {
    console.log(...args);
  }
};

export const logGroup = (label: string, data?: any) => {
  if (DEBUG) {
    console.group(label);
    if (data) console.log(data);
    console.groupEnd();
  }
};