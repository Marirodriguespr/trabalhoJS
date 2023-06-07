const express = require("express");
const router = express.Router();
const { findUserByEmail, createUser } = require("../database/user");
const z = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const LoginPrisma = z.object({
    senha: z.string(),
    email: z.string().email(),
});

const UserPrisma = z.object({
    senha: z.string().min(5),
    name: z.string().min(2),
    email: z.string().email(),
});

router.post("/register", async (req, res) => {
    try {
        const user = UserPrisma.parse(req.body);
        const existEmail = await findUserByEmail(user.email);
        if (existEmail) return res.status(400).json("E-mail already registered!");
        user.senha = bcrypt.hashSync(user.senha, 10);
        const userSalvo = await createUser(user);
        delete userSalvo.senha;
        res.json({ userSalvo: userSalvo });
    } catch (error) {
        if (error instanceof z.ZodError) return res.status(422).json({ message: error });
        return res.status(500).json({ message: error });
    }
});

router.post("/login", async (req, res) => {
    try {
        const login = LoginPrisma.parse(req.body);
        const user = await findUserByEmail(login.email);
        if (!user) return res.status(401).json({ message: "Not Authorized!" });
        const isSenha = bcrypt.compareSync(login.senha, user.senha);
        if (!isSenha) return res.status(401).json({ message: "Not Authorized!" });
        const payload = {
            userId: user.id,
            userName: user.name
        };
        const token = jwt.sign(payload, process.env.SECRET);
        res.json({ token });
    } catch (error) {
        if (error instanceof z.ZodError) return res.status(422).json({ message: error })
        res.status(500).json({ message: error });
    }
});
module.exports = router;