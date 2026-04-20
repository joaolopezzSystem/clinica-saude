const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// =========================
// MIDDLEWARES
// =========================
app.use(express.json());
app.use(cors());

// =========================
// CAMINHOS DOS ARQUIVOS
// =========================
const caminhoProfissionais = path.join(__dirname, 'data', 'profissionais.json');
const caminhoAgendamentos = path.join(__dirname, 'data', 'agendamentos.json');

// =========================
// FUNÇÃO SEGURA PARA LER JSON
// =========================
function lerJSON(caminho) {
  try {
    if (!fs.existsSync(caminho)) {
      return [];
    }

    const data = fs.readFileSync(caminho, 'utf-8');

    if (!data) return [];

    return JSON.parse(data);
  } catch (error) {
    console.error("Erro ao ler JSON:", error);
    return [];
  }
}

// =========================
// FUNÇÃO PARA SALVAR JSON
// =========================
function salvarJSON(caminho, dados) {
  try {
    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));
  } catch (error) {
    console.error("Erro ao salvar JSON:", error);
  }
}

// =========================
// 📌 LISTAR PROFISSIONAIS
// =========================
app.get('/profissionais', (req, res) => {
  const dados = lerJSON(caminhoProfissionais);
  res.json(dados);
});

// =========================
// 📌 FILTRAR POR ESPECIALIDADE
// =========================
app.get('/profissionais/especialidade/:esp', (req, res) => {
  const { esp } = req.params;
  const dados = lerJSON(caminhoProfissionais);

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
  const dados = lerJSON(caminhoProfissionais);

  const resultado = dados.filter(p =>
    p.nome.toLowerCase().includes(nome.toLowerCase())
  );

  res.json(resultado);
});

// =========================
// 📌 AGENDAR CONSULTA (COM ID)
// =========================
app.post('/agendar', (req, res) => {

  const agendamentos = lerJSON(caminhoAgendamentos);

  const novoAgendamento = {
    id: Date.now(),
    nome: req.body.nome,
    cpf: req.body.cpf,
    profissional: req.body.profissional,
    data: req.body.data,
    hora: req.body.hora
  };

  agendamentos.push(novoAgendamento);

  salvarJSON(caminhoAgendamentos, agendamentos);

  res.json({ mensagem: "Agendamento realizado com sucesso!" });
});

// =========================
// 📌 CONSULTAR POR CPF
// =========================
app.get('/agendamentos/:cpf', (req, res) => {
  const { cpf } = req.params;

  const agendamentos = lerJSON(caminhoAgendamentos);

  const resultado = agendamentos.filter(a => a.cpf === cpf);

  res.json(resultado);
});

// =========================
// 📌 CANCELAR POR ID
// =========================
app.delete('/agendamentos/:id', (req, res) => {
  const { id } = req.params;

  let agendamentos = lerJSON(caminhoAgendamentos);

  const novos = agendamentos.filter(a => String(a.id) !== String(id));

  salvarJSON(caminhoAgendamentos, novos);

  res.json({ mensagem: "Agendamento cancelado com sucesso!" });
});

// =========================
// 🚀 INICIAR SERVIDOR
// =========================
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});