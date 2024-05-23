const dropList = document.querySelectorAll(".drop-list select");
const fromCurrency = document.querySelector(".from select");
const toCurrency = document.querySelector(".to select");
const getButton = document.querySelector("form button");

// Populate the drop-down lists
for (let i = 0; i < dropList.length; i++) {
    for (let currency_code in country_list) {
        let selected;
        if (i === 0) {
            selected = currency_code === "USD" ? "selected" : "";
        } else if (i === 1) {
            selected = currency_code === "NPR" ? "selected" : "";
        }
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        dropList[i].insertAdjacentHTML("beforeend", optionTag);
    }
    dropList[i].addEventListener("change", e => {
        loadFlag(e.target);
    });
}

function loadFlag(element) {
    for (let code in country_code) { // Added let to declare the variable
        if (code == element.value) { // Corrected the syntax error
            let imgTag = element.parentElement.querySelector("img");
            imgTag.src = `https://flagcdn.com/${country_code[code]}/us.png`;
        }
    }
}

window.addEventListener("load", () => {
    getExchangeRate();
});

// Add event listener to the button
getButton.addEventListener("click", e => {
    e.preventDefault();
    getExchangeRate();
});

const exchangeIcon = document.querySelector(".drop-list .icon");
exchangeIcon.addEventListener("click", ()=>{
    let tempCode = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempCode;
    loadFlag(fromCurrency);
    loadFlag(toCurrency);
    getExchangeRate();
})

function getExchangeRate() {
    const amount = document.querySelector(".amount input");
    let amountVal = amount.value;
    if (amountVal === "" || amountVal === "0") {
        amount.value = "1";
        amountVal = amount.value;
    }

    const exchangeRateTxt = document.querySelector(".exchange-rate");
    exchangeRateTxt.innerText = "Getting exchange rate...";

    let url = `https://v6.exchangerate-api.com/v6/549ef0c1fa6b7dc1a8d16d63/latest/${fromCurrency.value}`;
    fetch(url)
        .then(response => response.json())
        .then(result => {
            let exchangeRate = result.conversion_rates[toCurrency.value];
            let totalExchangeRate = (amountVal * exchangeRate).toFixed(2);
            exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
        })
        .catch(error => {
            console.error('Error fetching exchange rate:', error);
            exchangeRateTxt.innerText = "Failed to get exchange rate.";
        });
}
