const API = "http://localhost:3333";

const taskForm = document.getElementById("taskForm");
const titleInput = document.getElementById("titleInput");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const reloadBtn = document.getElementById("reloadBtn");

async function fetchTasks() {
    const res = await fetch(`${API}/tasks`);
    if (!res.ok) throw new Error("Erro ao carregar tarefas");
    return res.json();
}

function render(tasks) {
    taskList.innerHTML = "";

    if (!tasks.length) {
        emptyState.style.display = "block";
        return;
    }
    emptyState.style.display = "none";

    for (const t of tasks) {
        const li = document.createElement("li");
        li.className = "item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = !!t.done;
        checkbox.addEventListener("change", async () => {
            await updateTask(t.id, { done: checkbox.checked });
            await load();
        });

        const title = document.createElement("div");
        title.className = "title" + (t.done ? " done" : "");
        title.textContent = t.title;

        const actions = document.createElement("div");
        actions.className = "actions";

        const editBtn = document.createElement("button");
        editBtn.type = "button";
        editBtn.textContent = "Editar";
        editBtn.addEventListener("click", async () => {
            const newTitle = prompt("Editar tarefa:", t.title);
            if (newTitle === null) return;
            await updateTask(t.id, { title: newTitle });
            await load();
        });

        const delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.textContent = "Excluir";
        delBtn.addEventListener("click", async () => {
            const ok = confirm("Deseja excluir esta tarefa?");
            if (!ok) return;
            await deleteTask(t.id);
            await load();
        });

        actions.append(editBtn, delBtn);
        li.append(checkbox, title, actions);
        taskList.appendChild(li);
    }
}

async function createTask(title) {
    const res = await fetch(`${API}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Erro ao criar tarefa");
    }
    return res.json();
}

async function updateTask(id, data) {
    const res = await fetch(`${API}/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Erro ao atualizar tarefa");
    }
    return res.json();
}

async function deleteTask(id) {
    const res = await fetch(`${API}/tasks/${id}`, { method: "DELETE" });
    if (!(res.status === 204)) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Erro ao excluir tarefa");
    }
}

async function load() {
    try {
        const tasks = await fetchTasks();
        render(tasks);
    } catch (e) {
        alert(e.message);
    }
}

taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    if (!title) return;

    try {
        await createTask(title);
        titleInput.value = "";
        await load();
    } catch (err) {
        alert(err.message);
    }
});

reloadBtn.addEventListener("click", load);

load();