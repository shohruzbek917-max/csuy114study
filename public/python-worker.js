/* Python executes in this worker, away from the UI and server. */
let pyodide;

async function initialize() {
  try {
    importScripts('/python/pyodide.js');
    pyodide = await loadPyodide({ indexURL: '/python/' });
    self.postMessage({ type: 'ready' });
  } catch (error) {
    self.postMessage({ type: 'initialization-error', error: String(error) });
  }
}

const runner = `
import builtins as _builtins
import contextlib as _contextlib
import io as _io
import json as _json
import math as _math
import random as _random
import traceback as _traceback

_payload = _json.loads(__study_payload)

class _LimitedOutput(_io.StringIO):
    def write(self, text):
        if self.tell() + len(text) > 20000:
            raise RuntimeError("Output limit reached (20,000 characters). Check your loop or print statements.")
        return super().write(text)

def _execute_case(stdin, function_name=None, args=None):
    stream = _LimitedOutput()
    errors = _LimitedOutput()
    inputs = _io.StringIO(str(stdin))
    namespace = {"__name__": "__main__"}
    original_input = _builtins.input
    original_random_state = _random.getstate()
    def study_input(prompt=""):
        if prompt:
            print(prompt, end="")
        value = inputs.readline()
        if value == "":
            raise EOFError("No more input. Add each input value on a new line in Standard input.")
        return value.rstrip("\\r\\n")
    _builtins.input = study_input
    if _payload.get("tests"):
        _random.seed(42)
    result = None
    error = None
    try:
        with _contextlib.redirect_stdout(stream), _contextlib.redirect_stderr(errors):
            exec(compile(_payload["code"], "<your code>", "exec"), namespace)
            if function_name:
                function = namespace.get(function_name)
                if not callable(function):
                    raise NameError("Define a function named " + function_name + ".")
                result = function(*(args or []))
    except BaseException:
        error = _traceback.format_exc()
    finally:
        _builtins.input = original_input
        if _payload.get("tests"):
            _random.setstate(original_random_state)
    return {"output": stream.getvalue() + errors.getvalue(), "value": result, "error": error}

def _same_value(actual, expected):
    if isinstance(actual, (float, int)) and isinstance(expected, (float, int)):
        return _math.isclose(actual, expected, rel_tol=1e-9, abs_tol=1e-9)
    return actual == expected

_tests = _payload.get("tests") or []
if not _tests:
    _run = _execute_case(_payload.get("stdin", ""))
    _response = {"output": _run["output"]}
    if _run["error"]:
        _response["error"] = _run["error"]
else:
    _results = []
    for _test in _tests:
        _function_name = _payload.get("functionName")
        _run = _execute_case(_test.get("stdin", ""), _function_name, _test.get("args", []))
        _actual = _run["value"] if _function_name else _run["output"].replace("\\r\\n", "\\n").strip()
        _expected = _test["expected"] if _function_name else str(_test["expected"]).replace("\\r\\n", "\\n").strip()
        _passed = _run["error"] is None and _same_value(_actual, _expected)
        _results.append({"passed": bool(_passed), "expected": _expected, "actual": _actual, "error": _run["error"]})
    _response = {"output": "", "results": _results}
_json.dumps(_response, default=str)
`;

self.onmessage = async ({ data }) => {
  if (data.type !== 'run') return;
  try {
    pyodide.globals.set('__study_payload', JSON.stringify(data.payload));
    const serialized = await pyodide.runPythonAsync(runner);
    self.postMessage({ type: 'result', id: data.id, result: JSON.parse(serialized) });
  } catch (error) {
    self.postMessage({ type: 'result', id: data.id, result: { output: '', error: String(error) } });
  }
};

initialize();
