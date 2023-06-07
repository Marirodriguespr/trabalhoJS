const express = require("express");
const router = express.Router();
const { addReceita, getReceitas, deleteReceita, updateReceita, findReceitaById } = require("../database/receita");
const { z } = require("zod");
const auth = require("../middleware/auth");

router.get("/receita", auth, async (req, res) => {
  const tasks = await getReceitas(req.userId);
  res.json({
    tasks,
  });
});

const receitaSchema = z.object({
  name: z.string().min(2),
  descricao: z.string().min(5),
  tempo: z.string(),
})

router.put("/receita/:id", auth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const rec = await findReceitaById(id);
    if (!rec) return res.status(404).json({ message: "Receita not Found!" });
    const receita = receitaSchema.parse(req.body);
    const receitas = await updateReceita(id, receita);
    res.json({
      receitas
    });
  } catch (error) {
    res.status(500).json({ message: error.error });
  }
});

router.post("/receita", auth, async (req, res) => {
  try {
    const receita = receitaSchema.parse(req.body);
    const receitaNew = await addReceita(receita, req.userId);
    res.status(201).json(receitaNew);
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(422).json({ message: error.error });
    res.status(500).json({ message: error.error });
  }
})

router.delete("/receita/:id", auth, async (req, res) => {
  const id = Number(req.params.id);
  const rec = await findReceitaById(id);
  if (!rec) return res.status(404).json({ message: "Receita not Found!" });
  await deleteReceita(id);
  res.json({
    status: "Delete with sucess!"
  });
});

module.exports = router;