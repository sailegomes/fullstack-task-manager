const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Arquivo do banco SQLite (fica salvo dentro da pasta backend)
const dbPath = path.join(__dirname, "database.db");
const db = new sqlite3.Database(dbPath);

// Criação da tabela caso ela ainda não exista
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      done INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
});

// Função só pra deixar o retorno mais amigável
function mapTask(row) {
  return {
    id: row.id,
    title: row.title,
    done: !!row.done,
    created_at: row.created_at,
  };
}

// Lista todas as tarefas
app.get("/tasks", (req, res) => {
  db.all("SELECT * FROM tasks ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar tarefas." });
    return res.json(rows.map(mapTask));
  });
});

// Cria uma nova tarefa
app.post("/tasks", (req, res) => {
  const title = String(req.body?.title ?? "").trim();
  if (!title) return res.status(400).json({ error: "Título é obrigatório." });

  db.run("INSERT INTO tasks (title, done) VALUES (?, ?)", [title, 0], function (err) {
    if (err) return res.status(500).json({ error: "Erro ao criar tarefa." });

    db.get("SELECT * FROM tasks WHERE id = ?", [this.lastID], (err2, row) => {
      if (err2) return res.status(500).json({ error: "Erro ao retornar tarefa criada." });
      return res.status(201).json(mapTask(row));
    });
  });
});

// Atualiza título e/ou status de conclusão
app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const title = req.body?.title;
  const done = req.body?.done;

  if (!Number.isInteger(id)) return res.status(400).json({ error: "ID inválido." });

  // Busca a tarefa atual antes de alterar
  db.get("SELECT * FROM tasks WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar tarefa." });
    if (!row) return res.status(404).json({ error: "Tarefa não encontrada." });

    const newTitle = title !== undefined ? String(title).trim() : row.title;
    const newDone = done !== undefined ? (done ? 1 : 0) : row.done;

    if (!newTitle) return res.status(400).json({ error: "Título não pode ficar vazio." });

    db.run(
      "UPDATE tasks SET title = ?, done = ? WHERE id = ?",
      [newTitle, newDone, id],
      function (err2) {
        if (err2) return res.status(500).json({ error: "Erro ao atualizar tarefa." });

        db.get("SELECT * FROM tasks WHERE id = ?", [id], (err3, updated) => {
          if (err3) return res.status(500).json({ error: "Erro ao retornar tarefa atualizada." });
          return res.json(mapTask(updated));
        });
      }
    );
  });
});

// Remove uma tarefa pelo ID
app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "ID inválido." });

  db.run("DELETE FROM tasks WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: "Erro ao remover tarefa." });
    if (this.changes === 0) return res.status(404).json({ error: "Tarefa não encontrada." });
    return res.status(204).send();
  });
});

// Endpoint simples só pra testar se a API está de pé
app.get("/health", (req, res) => res.json({ ok: true }));

const PORT = 3333;
app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
