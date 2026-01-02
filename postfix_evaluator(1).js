let exp = [];        // space-separated tokens
let index = 0;
let stack = [];
let history = [];
let finished = false;

const info = document.getElementById("info");
const input = document.getElementById("exp");

/* ================= SAVE STATE ================= */
function saveState(message, current = "") {
    history.push({
        index,
        stack: [...stack],
        current,
        message,
        finished
    });
}

/* ================= RESTORE STATE ================= */
function restoreState(state) {
    index = state.index;
    stack = [...state.stack];
    finished = state.finished;

    document.getElementById("current").innerText = state.current;
    document.getElementById("postfix").innerText =
        stack.length ? stack[stack.length - 1] : "";
    info.innerText = state.message;

    renderStackTree();
}

/* ================= VALIDATE POSTFIX ================= */
function isValidPostfix(tokens) {
    let count = 0;

    for (let token of tokens) {
        if (/^-?\d+$/.test(token)) {
            count++;
        } else if (/^[+\-*/]$/.test(token)) {
            if (count < 2) return false;
            count--;
        } else {
            return false;
        }
    }
    return count === 1;
}

/* ================= START ================= */
function start() {
    const value = input.value.trim();

    if (value === "") {
        info.innerText = "⚠ Enter a Postfix Expression";
        return;
    }

    exp = value.split(/\s+/);

    if (!isValidPostfix(exp)) {
        info.innerText = "⚠ Invalid Postfix Expression";
        return;
    }

    document.getElementById("visualSection").classList.remove("hidden");

    index = 0;
    stack = [];
    history = [];
    finished = false;

    document.getElementById("stack").innerHTML = "";
    document.getElementById("current").innerText = "";
    document.getElementById("postfix").innerText = "";

    info.innerText = "Postfix Evaluation Started";

    saveState("Evaluation Started");
}

/* ================= APPLY OPERATOR ================= */
function applyOperator(op, a, b) {
    a = Number(a);
    b = Number(b);

    switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return b !== 0 ? a / b : "∞";
    }
}

/* ================= NEXT STEP ================= */
function nextStep() {

    // 🚫 Stop if evaluation is finished
    if (finished) return;

    let message = "";
    let current = "";

    // ✅ Final result step
    if (index === exp.length && stack.length === 1) {
        const result = stack[0];
        finished = true;

        document.getElementById("current").innerText = "";
        document.getElementById("postfix").innerText = result;
        info.innerText = `Final Result = ${result}`;

        saveState(`Final Result = ${result}`);
        renderStackTree();
        return;
    }

    // 🚫 Safety check
    if (index >= exp.length) return;

    current = exp[index++];

    if (/^-?\d+$/.test(current)) {
        stack.push(current);
        message = `Operand ${current} pushed to stack`;
    }
    else if (/^[+\-*/]$/.test(current)) {
        const b = stack.pop();
        const a = stack.pop();
        const result = applyOperator(current, a, b);
        stack.push(result);
        message = `Applied '${current}' on ${a} and ${b}`;
    }

    document.getElementById("current").innerText = current;
    document.getElementById("postfix").innerText =
        stack.length ? stack[stack.length - 1] : "";

    info.innerText = message;
    saveState(message, current);
    renderStackTree();
}

/* ================= PREVIOUS STEP ================= */
function prevStep() {
    if (history.length <= 1) return;
    history.pop();
    restoreState(history[history.length - 1]);
}

/* ================= STACK TREE ================= */
function renderStackTree() {
    const container = document.getElementById("stack");
    container.innerHTML = "";

    stack.forEach(value => {
        const node = document.createElement("div");
        node.className = "stack-node";
        node.innerText = value;
        container.appendChild(node);
    });
}

/* ================= RESET ON CLEAR ================= */
input.addEventListener("input", () => {
    if (input.value.trim() === "") {
        exp = [];
        stack = [];
        index = 0;
        history = [];
        finished = false;

        document.getElementById("visualSection").classList.add("hidden");
        document.getElementById("stack").innerHTML = "";
        document.getElementById("current").innerText = "";
        document.getElementById("postfix").innerText = "";

        info.innerText = "Enter a Postfix Expression and click Start";
    }
});
