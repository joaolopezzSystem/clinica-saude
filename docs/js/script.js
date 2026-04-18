
// ========================
// CONFIG API (LOCAL vs ONLINE)
// ========================
const API_URL = window.location.hostname === "localhost"
  ? "http://localhost:3000"
  : "";


// ========================
// FUNÇÃO GLOBAL
// ========================
function apenasNumeros(input) {
  input.value = input.value.replace(/\D/g, '');
}


// ========================
// CARREGAMENTO INICIAL
// ========================
document.addEventListener("DOMContentLoaded", function () {

  let profissionais = [];

  const selectEsp = document.getElementById('especialidade');
  const selectProf = document.getElementById('profissional');
  const selectData = document.getElementById('data');
  const selectHora = document.getElementById('hora');

  // ========================
  // FUNÇÃO PARA CARREGAR ESPECIALIDADES
  // ========================
  function carregarEspecialidades() {
    const especialidades = [...new Set(profissionais.map(p => p.especialidade))];

    selectEsp.innerHTML = '<option value="">Selecione especialidade</option>';

    especialidades.forEach(esp => {
      const option = document.createElement('option');
      option.value = esp;
      option.text = esp;
      selectEsp.appendChild(option);
    });
  }

// ========================
// CARREGAR PROFISSIONAIS (API + FALLBACK)
// ========================
fetch(`${API_URL}/profissionais`)
  .then(res => {
    if (!res.ok) throw new Error("API não respondeu");
    return res.json();
  })
  .then(data => {
    profissionais = data;
    carregarEspecialidades();
  })
  .catch(() => {
    console.warn("Usando dados locais (fallback)");

    profissionais = [
      { nome: "Dr. João Silva", especialidade: "Cardiologia" },
      { nome: "Dra. Maria Souza", especialidade: "Dermatologia" },
      { nome: "Dr. Pedro Lima", especialidade: "Ortopedia" }
    ];

    carregarEspecialidades();
  });


// ========================
// FUNÇÃO AUXILIAR
// ========================
function carregarEspecialidades() {
  const especialidades = [...new Set(profissionais.map(p => p.especialidade))];

  selectEsp.innerHTML = '<option value="">Selecione especialidade</option>';

  especialidades.forEach(esp => {
    const option = document.createElement('option');
    option.value = esp;
    option.text = esp;
    selectEsp.appendChild(option);
  });
}

  // ========================
  // FILTRAR PROFISSIONAIS
  // ========================
  selectEsp.addEventListener('change', function () {
    const esp = this.value;

    selectProf.innerHTML = '<option value="">Selecione profissional</option>';

    const filtrados = profissionais.filter(p =>
      p.especialidade.toLowerCase() === esp.toLowerCase()
    );

    filtrados.forEach(p => {
      const option = document.createElement('option');
      option.value = p.nome;
      option.text = p.nome;
      selectProf.appendChild(option);
    });
  });


  // ========================
  // DATAS (PRÓXIMOS 7 DIAS)
  // ========================
  function carregarDatas() {
    selectData.innerHTML = '<option value="">Selecione data</option>';

    const hoje = new Date();

    for (let i = 1; i <= 7; i++) {
      const data = new Date();
      data.setDate(hoje.getDate() + i);

      const option = document.createElement('option');
      option.value = data.toISOString().split('T')[0];
      option.text = data.toLocaleDateString();

      selectData.appendChild(option);
    }
  }

  carregarDatas();


  // ========================
  // HORÁRIOS (08h às 18h)
  // ========================
  function carregarHorarios() {
    selectHora.innerHTML = '<option value="">Selecione horário</option>';

    for (let h = 8; h < 18; h++) {
      const hora = `${h.toString().padStart(2, '0')}:00`;

      const option = document.createElement('option');
      option.value = hora;
      option.text = hora;

      selectHora.appendChild(option);
    }
  }

  carregarHorarios();

}); // fechamento correto


// ========================
// AGENDAR
// ========================
function agendar() {
  fetch(`${API_URL}/agendar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nome: document.getElementById('nome').value,
      cpf: document.getElementById('cpf').value,
      profissional: document.getElementById('profissional').value,
      data: document.getElementById('data').value,
      hora: document.getElementById('hora').value
    })
  })
  .then(() => {
    alert("Agendamento realizado com sucesso!");
    document.getElementById('nome').value = '';
    document.getElementById('cpf').value = '';
  })
  .catch(() => {
    alert("Erro ao agendar.");
  });
}


// ========================
// CONSULTAR
// ========================
function consultar() {
  const cpf = document.getElementById('cpfConsulta').value;
  const lista = document.getElementById('resultado');
  lista.innerHTML = '';

  // 👉 Se estiver no GitHub Pages (sem backend)
  if (!API_URL) {
    const li = document.createElement('li');
    li.textContent = "Consulta disponível apenas no ambiente local (backend).";
    lista.appendChild(li);
    return;
  }

  // 👉 Ambiente local (funcionamento real)
  fetch(`${API_URL}/agendamentos/${cpf}`)
    .then(res => {
      if (!res.ok) throw new Error("Erro na API");
      return res.json();
    })
    .then(data => {
      if (!data || data.length === 0) {
        const li = document.createElement('li');
        li.textContent = "Nenhum agendamento encontrado.";
        lista.appendChild(li);
        return;
      }

      data.forEach(a => {
        const li = document.createElement('li');
        li.textContent = `${a.nome} - ${a.profissional} - ${a.data} às ${a.hora}`;
        lista.appendChild(li);
      });
    })
    .catch(() => {
      alert("Erro ao consultar agendamento.");
    });
}

// ========================
// FUNÇÃO DE RENDERIZAÇÃO
// ========================
function renderResultado(data) {
  const lista = document.getElementById('resultado');

  lista.innerHTML = '';

  if (!data || data.length === 0) {
    const li = document.createElement('li');
    li.textContent = "Nenhum agendamento encontrado.";
    lista.appendChild(li);
    return;
  }

  data.forEach(a => {
    const li = document.createElement('li');
    li.textContent = `${a.nome} - ${a.profissional} - ${a.data} às ${a.hora}`;
    lista.appendChild(li);
  });
}

// ========================
// CANCELAR
// ========================
function cancelar() {
  const cpf = document.getElementById('cpfCancelar').value;

  fetch(`${API_URL}/agendamentos/${cpf}`, {
    method: 'DELETE'
  })
  .then(() => alert("Cancelado com sucesso!"))
  .catch(() => alert("Erro ao cancelar."));
}