const API_URL = window.GP_API_URL.replace(/\/+$/, "");
let countdownTimer = null;

async function getJson(path) {
  const response = await fetch(`${API_URL}${path}`);
  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }
  if (!response.ok) {
    const detail = data && typeof data === "object" ? data.detail : data;
    throw new Error(typeof detail === "string" ? detail : `Falha HTTP ${response.status}`);
  }
  return data;
}

function displayCountdown(dateValue) {
  const target = new Date(dateValue).getTime();
  const title = document.getElementById("countdownTitle");
  const message = document.getElementById("countdownMessage");
  if (!Number.isFinite(target)) {
    message.textContent = "A data oficial da divulgação ainda não foi definida.";
    return;
  }

  const tick = () => {
    const remaining = target - Date.now();
    if (remaining <= 0) {
      title.textContent = "Chegou a hora!";
      message.textContent = "Confira abaixo o status da divulgação oficial.";
      for (const id of ["days", "hours", "minutes", "seconds"]) {
        document.getElementById(id).textContent = "00";
      }
      clearInterval(countdownTimer);
      return;
    }
    const values = {
      days: Math.floor(remaining / 86400000),
      hours: Math.floor((remaining / 3600000) % 24),
      minutes: Math.floor((remaining / 60000) % 60),
      seconds: Math.floor((remaining / 1000) % 60),
    };
    for (const [id, value] of Object.entries(values)) {
      document.getElementById(id).textContent = String(value).padStart(2, "0");
    }
    message.textContent = "O cronômetro usa o horário local do seu dispositivo.";
  };
  tick();
  countdownTimer = setInterval(tick, 1000);
}

function renderRanking(entries) {
  const body = document.getElementById("rankingRows");
  body.replaceChildren();
  if (!entries.length) {
    const row = body.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 3;
    cell.textContent = "Os resultados oficiais ainda não estão disponíveis.";
    return;
  }
  entries.forEach((entry, index) => {
    const row = body.insertRow();
    row.insertCell().textContent = `${index + 1}º`;
    row.insertCell().textContent = entry.nome_escuderia || "Escuderia";
    const score = Number(entry.nota_final);
    row.insertCell().textContent = Number.isFinite(score) ? score.toFixed(2) : "—";
  });
}

async function loadResults() {
  const message = document.getElementById("resultsMessage");
  const badge = document.getElementById("resultsBadge");
  try {
    const status = await getJson("/divulgacao");
    if (status?.data_divulgacao) displayCountdown(status.data_divulgacao);
    if (!status?.mostrar_resultado) {
      badge.textContent = "Em breve";
      message.textContent = "A classificação será exibida quando a organização liberar os resultados.";
      renderRanking([]);
      return;
    }
    const ranking = await getJson("/ranking");
    badge.textContent = "Publicado";
    badge.classList.add("published");
    message.textContent = "Classificação oficial do Grand Prix 2026.";
    renderRanking(ranking);
  } catch (error) {
    badge.textContent = "Indisponível";
    message.textContent = `Não foi possível carregar os resultados: ${error.message}`;
    renderRanking([]);
  }
}

loadResults();
