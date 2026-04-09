// função global (IMPORTANTE)
function apenasNumeros(input) {
  input.value = input.value.replace(/\D/g, '');
}

document.addEventListener("DOMContentLoaded", function () {

  let profissionais = [];

  const selectEsp = document.getElementById('especialidade');
  const selectProf = document.getElementById('profissional');
  const selectData = document.getElementById('data');

  // carregar profissionais
  fetch('http://localhost:3000/profissionais')
    .then(res => res.json())
    .then(data => {
      profissionais = data;

      const especialidades = [...new Set(data.map(p => p.especialidade))];

      selectEsp.innerHTML = '<option value="">Selecione especialidade</option>';

      especialidades.forEach(esp => {
        const option = document.createElement('option');
        option.value = esp;
        option.text = esp;
        selectEsp.appendChild(option);
      });
    })
    .catch(err => console.error("Erro ao carregar profissionais:", err));


  // filtrar profissionais
  selectEsp.addEventListener('change', function () {
    const esp = this.value;

    selectProf.innerHTML = '<option value="">Selecione profissional</option>';

    const filtrados = profissionais.filter(p => p.especialidade === esp);

    filtrados.forEach(p => {
      const option = document.createElement('option');
      option.value = p.nome;
      option.text = p.nome;
      selectProf.appendChild(option);
    });
  });


  // carregar datas
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

});


// AGENDAR
function agendar() {
  fetch('http://localhost:3000/agendar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nome: document.getElementById('nome').value,
      cpf: document.getElementById('cpf').value,
      profissional: document.getElementById('profissional').value,
      data: document.getElementById('data').value
    })
  })
  .then(() => {
    alert("Agendamento realizado com sucesso!");
    document.getElementById('nome').value = '';
    document.getElementById('cpf').value = '';
    });
}


// CONSULTAR
function consultar() {
  const cpf = document.getElementById('cpfConsulta').value;

  fetch(`http://localhost:3000/agendamentos/${cpf}`)
    .then(res => res.json())
    .then(data => {
      const lista = document.getElementById('resultado');
      lista.innerHTML = '';

      // 👉 Se não encontrar nada
      if (data.length === 0) {
        const li = document.createElement('li');
        li.textContent = "Nenhum agendamento encontrado.";
        lista.appendChild(li);
        return;
      }

      // 👉 Se encontrar agendamentos
      data.forEach(a => {
        const li = document.createElement('li');
        li.textContent = `${a.nome} - ${a.profissional} - ${a.data}`;
        lista.appendChild(li);
      });
    })
    .catch(() => {
      alert("Erro ao consultar agendamento.");
    });
}


// CANCELAR
function cancelar() {
  const cpf = document.getElementById('cpfCancelar').value;

  fetch(`http://localhost:3000/agendamentos/${cpf}`, {
    method: 'DELETE'
  })
  .then(() => alert("Cancelado com sucesso!"));
}