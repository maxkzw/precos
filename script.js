// Configuração Supabase
const supabaseUrl = "https://marhooghrscpriwqzzlm.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hcmhvb2docnNjcHJpd3F6emxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczMTg4MjIsImV4cCI6MjA1Mjg5NDgyMn0.wRbo-1S69oWpw6vCjRkGlvBdNrLBKCEA3YlsjFlkLjQ";
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Estado inicial
let localizacaoSelecionada = null;

// Configurar mapa
const mapa = L.map('map').setView([-14.235, -51.9253], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapa);

const marcador = L.marker([0, 0], { draggable: true }).addTo(mapa);
marcador.setOpacity(0);

mapa.on('click', function (evento) {
    const { lat, lng } = evento.latlng;
    localizacaoSelecionada = { lat, lng };
    marcador.setLatLng([lat, lng]);
    marcador.setOpacity(1);
    document.getElementById('selected-location').innerText = `Local selecionado: Latitude ${lat.toFixed(5)}, Longitude ${lng.toFixed(5)}`;
});

// Função para salvar preços
async function salvarPrecos() {
    if (!localizacaoSelecionada) {
        alert("Por favor, selecione um local no mapa antes de salvar.");
        return;
    }

    const precos = {
        gasolina_comum: document.getElementById('gasolina-comum').value || null,
        gasolina_aditivada: document.getElementById('gasolina-aditivada').value || null,
        etanol_comum: document.getElementById('etanol-comum').value || null,
        etanol_aditivado: document.getElementById('etanol-aditivado').value || null,
        diesel_s10: document.getElementById('diesel-s10').value || null,
        diesel_s500: document.getElementById('diesel-s500').value || null,
        gnv: document.getElementById('gnv').value || null,
        atualizado_em: new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }),
        latitude: localizacaoSelecionada.lat,
        longitude: localizacaoSelecionada.lng
    };

    const { data, error } = await supabase
        .from('precos_combustiveis')
        .insert([precos]);

    if (error) {
        alert("Erro ao salvar preços: " + error.message);
    } else {
        alert("Preços salvos com sucesso!");
    }
}
