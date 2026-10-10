const convertButton = document.querySelector(".btnConvert");
const currencySelectToConvert = document.querySelector(".currency-select-to-convert");
const currencySelect = document.querySelector(".currency-select");
const inputCurrency = document.querySelector(".input-currency");
// 1. Mapeamento de dados das moedas (fácil de adicionar novas moedas no futuro)
const currencyDetails = {
    USD: { name: 'Dólar Americano', logo: './assets/Dolar.png' },
    EUR: { name: 'Euro',            logo: './assets/Euro.png' },
    GBP: { name: 'Libra',           logo: './assets/Libra.png' },
    BRL: { name: 'Real',            logo: './assets/Real.png' },
};

let rates = {};

inputCurrency.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");

    if (!value) {
        e.target.value = "";
        return;
    }

    value = (parseFloat(value) / 100).toFixed(2);

    e.target.value = Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
});

async function atualizarRates(base = "USD") {
    try {
        const resposta = await fetch(`https://open.er-api.com/v6/latest/${base}`);
        //const resposta = await fetch(`https://api.frankfurter.app/latest?from=${base}`);
        //const resposta = await fetch(`https://api.exchangerate.host/latest?base=${base}`);

        const dados = await resposta.json();

        rates = dados.rates;

        console.log("Resposta completa da API:", dados);
        console.log("Taxas atualizadas:", rates);
    } catch (erro) {
        console.error("Erro ao buscar taxas:", erro);
    }
}

function convertValues() {
    if (currencySelectToConvert.value === currencySelect.value) {
        alert("Você escolheu o mesmo tipo de moeda para conversão. Por favor escolha tipos diferentes.");
        return;
    }

    let rawValue = inputCurrency.value.replace(/\./g, "").replace(",", ".");
    const inputCurrencyValue = parseFloat(rawValue);
    const currencyValueToConvert = document.querySelector(".currency-value-to-convert");
    const currencyValueConverted = document.querySelector(".currency-value-converted");

    if (isNaN(inputCurrencyValue)) {
        alert("Digite um valor válido!");
        return;
    }

    const origem = currencySelectToConvert.value;
    const destino = currencySelect.value;

    const taxaOrigem = rates[origem];
    const taxaDestino = rates[destino];

    if (!taxaOrigem || !taxaDestino) {
        alert("Não foi possível obter os valores das taxas das moedas para conversão. Por favor verifique sua cenexão.");
        return;
    }

    const convertido = inputCurrencyValue * (taxaDestino / taxaOrigem);

    currencyValueConverted.innerHTML = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: destino.toUpperCase()
    }).format(convertido);

    currencyValueToConvert.innerHTML = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: origem.toUpperCase()
    }).format(inputCurrencyValue);
    changeCurrency()
}



// 2. Função auxiliar isolada para atualizar a interface
function updateCurrencyDOM(currencyCode, nameElement, logoElement) {
    const data = currencyDetails[currencyCode];
    
    if (data) {
        nameElement.innerHTML = data.name;
        logoElement.src = data.logo;
    }
}

// 3. Função principal simplificada
function changeCurrency() {
    // Seleção dos elementos do DOM
    const currencyNameConvert = document.querySelector("#currency-name-convert");
    const currencyName = document.querySelector("#currency-name-converted");
    const currencyLogoConvert = document.querySelector(".currency-logo-convert");
    const currencyLogoConverted = document.querySelector(".currency-logo-converted");

    // Execução da lógica sem repetição de IFs
    updateCurrencyDOM(currencySelectToConvert.value, currencyNameConvert, currencyLogoConvert);
    updateCurrencyDOM(currencySelect.value, currencyName, currencyLogoConverted);
}



convertButton.addEventListener("click", convertValues);
inputCurrency.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        convertValues();
    }
});

atualizarRates();
setInterval(atualizarRates, 60000); // atualiza a cada 1 minuto
