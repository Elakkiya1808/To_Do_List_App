const express = require('express');
const cors = require('cors');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');

const app = express();
const PORT = 3500;

// ✅ Pass default data into the constructor for Low (lowdb v7+)
const adapter = new JSONFile('db.json');
const defaultData = { items: [] };
const db = new Low(adapter, defaultData);

app.use(cors());
app.use(express.json());

async function startServer() {
  try {
    await db.read();

    // Ensure db.data exists
    db.data ||= defaultData;

    app.get('/items', async (req, res) => {
      await db.read();
      res.json(db.data.items);
    });

    app.post('/items', async (req, res) => {
      const newItem = req.body;
      db.data.items.push(newItem);
      await db.write();
      res.status(201).json(newItem);
    });

    app.patch('/items/:id', async (req, res) => {
      const { id } = req.params;
      const { checked } = req.body;
      const item = db.data.items.find(i => i.id.toString() === id);
      if (item) {
        item.checked = checked;
        await db.write();
        res.json(item);
      } else {
        res.status(404).json({ message: 'Item not found' });
      }
    });

    app.delete('/items/:id', async (req, res) => {
      const { id } = req.params;
      db.data.items = db.data.items.filter(i => i.id.toString() !== id);
      await db.write();
      res.status(204).end();
    });

    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error starting server:", err.message);
  }
}

startServer();
