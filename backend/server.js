const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cors());

// Caminhos dos arquivos
const caminhoProfissionais = path.join(__dirname, 'data', 'profissionais.json');
const caminhoAgendamentos = path.join(__dirname, 'data', 'agendamentos.json');

// =========================
// 📌 LISTAR PROFISSIONAIS
// =========================
app.get('/profissionais', (req, res) => {
  const dados = JSON.parse(fs.readFileSync(caminhoProfissionais));
  res.json(dados);
});


// =========================
// 📌 FILTRAR POR ESPECIALIDADE
// =========================
app.get('/profissionais/especialidade/:esp', (req, res) => {
  const { esp } = req.params;
  const dados = JSON.parse(fs.readFileSync(caminhoProfissionais));

  const filtrados = dados.filter(p =>
    p.especialidade.toLowerCase() === esp.toLowerCase()
  );

  res.json(filtrados);
});


// =========================
// 📌 BUSCAR POR NOME
// =========================
app.get('/profissionais/busca/:nome', (req, res) => {
  const { nome } = req.params;
  const dados = JSON.parse(fs.readFileSync(caminhoProfissionais));

  const resultado = dados.filter(p =>
    p.nome.toLowerCase().includes(nome.toLowerCase())
  );

  res.json(resultado);
});


// =========================
// 📌 AGENDAR CONSULTA
// =========================
app.post('/agendar', (req, res) => {
  const novoAgendamento = req.body;

  const agendamentos = JSON.parse(fs.readFileSync(caminhoAgendamentos));

  agendamentos.push(novoAgendamento);

  fs.writeFileSync(caminhoAgendamentos, JSON.stringify(agendamentos, null, 2));

  res.json({ mensagem: "Agendamento realizado com sucesso!" });
});


// =========================
// 📌 CONSULTAR POR CPF
// =========================
app.get('/agendamentos/:cpf', (req, res) => {
  const { cpf } = req.params;

  const agendamentos = JSON.parse(fs.readFileSync(caminhoAgendamentos));

  const resultado = agendamentos.filter(a => a.cpf === cpf);

  res.json(resultado);
});


// =========================
// 📌 CANCELAR AGENDAMENTO
// =========================
app.delete('/agendamentos/:cpf', (req, res) => {
  const { cpf } = req.params;

  let agendamentos = JSON.parse(fs.readFileSync(caminhoAgendamentos));

  const novos = agendamentos.filter(a => a.cpf !== cpf);

  fs.writeFileSync(caminhoAgendamentos, JSON.stringify(novos, null, 2));

  res.json({ mensagem: "Agendamento(s) cancelado(s) com sucesso!" });
});


// =========================
// 🚀 INICIAR SERVIDOR
// =========================
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});