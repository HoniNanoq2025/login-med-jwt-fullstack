require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs"); // Hashing bibliotek til passwords
const jwt = require("jsonwebtoken");

const app = express();

const PORT = process.env.PORT;

const JWT_SECRET = process.env.JWT_SECRET;

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

const users = [
  {
    id: 1,
    email: "user@mail.com",
    password: bcrypt.hashSync("user123456", 10),
    role: "user",
  },
  {
    id: 2,
    email: "editor@mail.com",
    password: bcrypt.hashSync("editor123456", 10),
    role: "editor",
  },
  {
    id: 3,
    email: "admin@mail.com",
    password: bcrypt.hashSync("admin123456", 10),
    role: "admin",
  },
];

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email og password kræves!" });

    const user = users.find((u) => u.email === email);
    if (!user) return res.status(401).json({ message: "Ugyldigt login!" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Ugyldigt login" });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server fejl" });
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Ingen token" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(401).json({ message: "Token ugyldigt eller udløbet!" });

    req.user = decoded;

    next();
  });
}

app.get("/profile", authenticateToken, (req, res) => {
  res.json({ message: "Adgang givet", user: req.user });
});

app.get("/editor", authenticateToken, (req, res) => {
  if (!["editor", "admin"].includes(req.user.role))
    return res.status(403).json({ message: "Adgang nægtet!" });
  res.json({ message: "Velkommen til editor panelet!", user: req.user });
});

app.get("/admin", authenticateToken, (req, res) => {
  if (!["admin"].includes(req.user.role))
    return res.status(403).json({ message: "Adgang nægtet!" });
  res.json({ message: "Velkommen til admin panelet", user: req.user });
});

app.get("/user/:id", authenticateToken, (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find((u) => u.id === userId);

  if (!user) return res.status(404).json({ message: "Bruger ikke fundet!" });

  res.json({ id: user.id, email: user.email, role: user.role });
});

app.listen(PORT, () => {
  console.log(`Serveren kører på port ${PORT}`);
});
