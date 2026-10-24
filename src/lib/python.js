let worker;
let readyPromise;
let status = "idle";
let sequence = 0;
let activeJob;
let queue = Promise.resolve();
const listeners = new Set();

function updateStatus(next) {
  status = next;
  listeners.forEach((listener) => listener(next));
}

export function getPythonStatus() {
  return status;
}

export function subscribePythonStatus(listener) {
  listeners.add(listener);
  listener(status);
  return () => listeners.delete(listener);
}

function disposeWorker() {
  worker?.terminate();
  worker = undefined;
  readyPromise = undefined;
  activeJob = undefined;
}

function initializePython() {
  if (readyPromise) return readyPromise;
  updateStatus("loading");
  readyPromise = new Promise((resolve, reject) => {
    worker = new Worker("/python-worker.js");
    const loadingTimer = setTimeout(() => {
      disposeWorker();
      updateStatus("error");
      reject(new Error("Python took too long to load. Please try again."));
    }, 60000);
    worker.onmessage = ({ data }) => {
      if (data.type === "ready") {
        clearTimeout(loadingTimer);
        updateStatus("ready");
        resolve();
      } else if (data.type === "initialization-error") {
        clearTimeout(loadingTimer);
        disposeWorker();
        updateStatus("error");
        reject(
          new Error("Python could not load. Refresh the page and try again."),
        );
      } else if (data.type === "result" && activeJob?.id === data.id) {
        clearTimeout(activeJob.timer);
        const finish = activeJob.resolve;
        activeJob = undefined;
        updateStatus("ready");
        finish(data.result);
      }
    };
    worker.onerror = () => {
      clearTimeout(loadingTimer);
      const fail = activeJob?.reject;
      if (activeJob) clearTimeout(activeJob.timer);
      disposeWorker();
      updateStatus("error");
      const error = new Error(
        "The Python worker stopped. Run your code again to restart it.",
      );
      fail?.(error);
      reject(error);
    };
  });
  return readyPromise;
}

/**
 * Runs Python in a browser worker, never on the server. With no tests, executes
 * once and returns captured output. With tests, each case gets fresh globals,
 * input and a fixed test random seed. Script output ignores leading/trailing whitespace;
 * function results compare Python values (floats use a small tolerance).
 * Infinite loops terminate the worker after eight seconds; a later run restarts it.
 */
export function runPython({ code, stdin = "", tests = [], functionName }) {
  const execute = async () => {
    await initializePython();
    return new Promise((resolve, reject) => {
      const id = ++sequence;
      updateStatus("running");
      const timer = setTimeout(() => {
        disposeWorker();
        updateStatus("idle");
        resolve({
          output: "",
          error:
            "Execution stopped after 8 seconds. Check for a loop that never ends, then run again.",
        });
      }, 8000);
      activeJob = { id, resolve, reject, timer };
      worker.postMessage({
        type: "run",
        id,
        payload: { code, stdin, tests, functionName },
      });
    });
  };
  const result = queue.then(execute, execute);
  queue = result.catch(() => {});
  return result;
}
