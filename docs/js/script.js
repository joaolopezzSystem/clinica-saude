// ========================
// CONFIG API (LOCAL vs ONLINE)
// ========================
const API_URL =
  window.location.hostname.includes("localhost") ||
  window.location.hostname.includes("127.0.0.1")
    ? "http://localhost:3000"
    : "https://clinica-saude-api.onrender.com";


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
  // CARREGAR PROFISSIONAIS
  // ========================
  fetch(`${API_URL}/profissionais`)
    .then(res => res.json())
    .then(data => {
      profissionais = data;
      carregarEspecialidades();
    })
    .catch(() => {
      // fallback
      profissionais = [
        { nome: "Dr. João Silva", especialidade: "Cardiologia" },
        { nome: "Dra. Maria Souza", especialidade: "Dermatologia" },
        { nome: "Dr. Pedro Lima", especialidade: "Ortopedia" }
      ];
      carregarEspecialidades();
    });

  // ========================
  // ESPECIALIDADES
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
  // DATAS
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
  // HORÁRIOS
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

});


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
  })
  .catch(() => {
    alert("Erro ao agendar.");
  });
}


// ========================
// CONSULTAR (AGORA COM ID)
// ========================
function consultar() {
  const cpf = document.getElementById('cpfConsulta').value;
  const lista = document.getElementById('resultado');
  lista.innerHTML = '';

  fetch(`${API_URL}/agendamentos/${cpf}`)
    .then(res => res.json())
    .then(data => {
      if (!data || data.length === 0) {
        lista.innerHTML = "<li>Nenhum agendamento encontrado.</li>";
        return;
      }

      data.forEach(a => {
        const li = document.createElement('li');

        li.innerHTML = `
          ${a.nome} - ${a.profissional} - ${a.data} às ${a.hora}
          <br>
          <strong>ID:</strong> ${a.id}
          <br>
          <button onclick="cancelar(${a.id})" class="btn btn-sm btn-danger mt-1">
            Cancelar
          </button>
          <hr>
        `;

        lista.appendChild(li);
      });
    })
    .catch(() => {
      alert("Erro ao consultar.");
    });
}


// ========================
// CANCELAR POR ID
// ========================
function cancelar(id) {
  fetch(`${API_URL}/agendamentos/${id}`, {
    method: 'DELETE'
  })
  .then(() => {
    alert("Agendamento cancelado!");
    consultar(); // atualiza lista
  })
  .catch(() => alert("Erro ao cancelar."));
}