const ctx = document.getElementById("myChart");

let oController = {
    flag: false,
    yeartozero: 0
}

const DATA_COUNT = 12;
let labels = [];
for (let i = 0; i < DATA_COUNT; ++i) {
  labels.push(i.toString());
}
const datapoints = [];
const datapoints1 = [];

let data = {
  labels: labels,
  datasets: [
    {
      label: "Savings",
      data: datapoints,
      borderColor: "rgb(255, 99, 132)",
      fill: false,
      cubicInterpolationMode: "monotone",
      tension: 0.4,
    },
    {
      label: "Portfolio value with anual spending after retirement",
      data: datapoints1,
      borderColor: "rgb(54, 162, 235)",
      fill: false,
      tension: 0.4,
    }
  ],
};

function createChart() {
  return new Chart(ctx, {
    type: "line",
    data: data,
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
        },
      },
      interaction: {
        intersect: false,
      },
      scales: {
        x: {
          display: true,
          title: {
            text: "Age (years)",
            display: true,
          },
        },
        y: {
          display: true,
          title: {
            display: true,
          },
          suggestedMin: 0,
          suggestedMax: 210,
        },
      },
    },
  });
}

let graphic = createChart();

function calcPortolio() {
  const returnPercentage = parseInt(
    document.getElementById("returnPercentage").value
  );
  const initialAsset = parseInt(document.getElementById("initialAssets").value);
  const initialAge = parseInt(document.getElementById("initialAge").value);
  const finalAge = parseInt(document.getElementById("finalAge").value);
  const anualSavings = parseInt(document.getElementById("anualSavings").value);
  const inflation = parseInt(document.getElementById("inflation").value);
  const anualSpending = parseInt(
    document.getElementById("anualSpending").value
  );
  const taxes = parseInt(document.getElementById("taxes").value);
  let aux = initialAsset;
  let auxSavings = initialAsset;
  let savings,
    anualSpendingWInflation = anualSpending,
    anualSpendingWInflationCalc = anualSpending,
    anualSavingsWInflation = anualSavings;
  let fire = [];
  let flag = false;
  closeAlert();
  deleteTable();
  fire.push({
    age: initialAge,
    savings: initialAsset,
    portfolio: aux,
    portfolioWSavings: aux,
    anualSavings: anualSavingsWInflation,
    anualSpending: 0,
    anualSpendingCalc: anualSpendingWInflationCalc,
  });

  //Calculo rentabilidade até ao retirement
  for (let index = initialAge; index < finalAge; index++) {
    aux = Math.floor(fire[index - initialAge].portfolioWSavings * ((returnPercentage - inflation) / 100 + 1));
    auxSavings = Math.floor(fire[index - initialAge].portfolioWSavings * ((returnPercentage - inflation) / 100 + 1) + fire[index - initialAge].anualSavings);
    anualSpendingWInflation = 0;
    anualSpendingWInflationCalc = Math.floor(fire[index - initialAge].anualSpendingCalc * (inflation / 100 + 1));
    anualSavingsWInflation = Math.floor(fire[index - initialAge].anualSavings * (inflation / 100 + 1));
    savings = Math.floor(fire[index - initialAge].savings + anualSavingsWInflation);
    fire.push({
      age: index + 1,
      savings: savings,
      portfolio: aux,
      portfolioWSavings: auxSavings,
      anualSavings: anualSavingsWInflation,
      anualSpending: anualSpendingWInflation,
      anualSpendingCalc: anualSpendingWInflationCalc,
    });
  }
  //calculo de despensa depois do retirement até aos 100 anos
  for (let index = finalAge; index < 100; index++) {
    //savings = Math.floor(initialAsset + anualSavings * (finalAge - initialAge));
    //Ao portfolio e lucros anuais, substrai-se o que se gasta anualmente + impostos.
    aux = 0;
    auxSavings = Math.floor(fire[index - initialAge].portfolioWSavings * ((returnPercentage - inflation) / 100 + 1) - fire[index - initialAge].anualSpending / (1 - taxes / 100));
    anualSpendingWInflation = Math.floor(fire[index - initialAge].anualSpendingCalc * (inflation / 100 + 1));
    anualSpendingWInflationCalc = Math.floor(fire[index - initialAge].anualSpendingCalc * (inflation / 100 + 1));
    anualSavingsWInflation = 0;
    savings = Math.floor(fire[index - initialAge].savings + anualSavingsWInflation);
    if (auxSavings < 0) {
      if (!flag) {
        showAlert(i18next.t('intro.mOutOfMoney') + (index + 1));
        flag = true;
        oController.flag = true;
        oController.yeartozero = index + 1;
      }

      fire.push({
        age: index + 1,
        savings: savings,
        portfolio: 0,
        portfolioWSavings: 0,
        anualSavings: anualSavingsWInflation,
        anualSpending: anualSpendingWInflation,
        anualSpendingCalc: anualSpendingWInflationCalc,
      });
    } else {
      fire.push({
        age: index + 1,
        savings: savings,
        portfolio: aux,
        portfolioWSavings: auxSavings,
        anualSavings: anualSavingsWInflation,
        anualSpending: anualSpendingWInflation,
        anualSpendingCalc: anualSpendingWInflationCalc,
      });
    }
  }
  flag = false;
  data.labels = fire.map((result) => result.age);
  data.datasets[0].data = fire.map((result) => result.savings);
  data.datasets[1].data = fire.map((result) => result.portfolioWSavings);
  graphic.destroy();
  graphic = createChart();
  createTable(fire);
  $('body').localize();
  $(document).ready(function () {
    $('#myTable').DataTable();
    //$('.dataTables_length').addClass('bs-select');
  });
  console.log(fire);
}

function showAlert(msg) {
  let panel = document.querySelector("#myPanel");
  let alertPanel = document.createElement("div");
  alertPanel.setAttribute("id", "myAlertPanel");
  alertPanel.setAttribute(
    "class",
    "alert alert-danger alert-dismissible fade show"
  );
  alertPanel.setAttribute("role", "alert");
  let strongText = document.createElement("strong");
  strongText.innerHTML = msg;
  alertPanel.replaceChildren(strongText);
  let btn = document.createElement("button");
  btn.setAttribute("type", "button");
  btn.setAttribute("id", "alert-button");
  btn.setAttribute("class", "btn-close");
  btn.setAttribute("data-bs-dismiss", "alert");
  btn.setAttribute("aria-label", "Close");
  let span = document.createElement("span");
  span.innerHTML = "✖️";
  btn.appendChild(span);
  alertPanel.appendChild(btn);
  panel.replaceChildren(alertPanel);
}

function closeAlert() {
  let panel = document.querySelector("#myPanel");
  panel.replaceChildren();
}
function deleteTable() {
  let table = document.querySelector("#table-js");
  table.replaceChildren();
}

function currencyChange() {
  var currency = document.getElementById("selectCurrency").value;
  switch (currency) {
    case "Euro €":
      document.getElementById("currencyAnualSpending").innerText = "€";
      document.getElementById("currencyinitialAssets").innerText = "€";
      document.getElementById("currencyAnualSavings").innerText = "€";
      break;
    case "Dolar $":
      document.getElementById("currencyAnualSpending").innerText = "$";
      document.getElementById("currencyinitialAssets").innerText = "$";
      document.getElementById("currencyAnualSavings").innerText = "$";
      break;

    default:
      break;
  }
}

function createTable(fire) {
  //set header of table
  let tableData = document.getElementById("table-js");
  let table = `
    <table  id = "myTable" class="table table-striped table-bordered table-sm" cellspacing="0" width="100%">
    <thead>
        <tr>
            <th scope="col" data-i18n="intro.year"></th>
            <th scope="col" data-i18n="intro.anualsavingsWInflation"></th>
            <th scope="col" data-i18n="intro.anualspendingWInflation"></th>
            <th scope="col" data-i18n="intro.totalinvested">Total invested </th>
            <th scope="col"data-i18n="intro.portfolio">Portfolio</th>
        </tr>
    </thead>
    <tbody>
    `;
  //create//append rows
  for (i = 0; i < fire.length; i++) {
    table =
      table +
      `<tr>
        <th scope="row">${fire[i].age}</th>
        <td>${fire[i].anualSavings.toLocaleString(undefined, {
          minimumFractionDigits: 2,})}
        </td>
          <td>${fire[i].anualSpending.toLocaleString(undefined, {
            minimumFractionDigits: 2,})}
          </td>
        <td>${fire[i].savings.toLocaleString(undefined, {
          minimumFractionDigits: 2,})}
        </td>
        <td>${fire[i].portfolioWSavings.toLocaleString(undefined, {
          minimumFractionDigits: 2,})}
        </td>
        </tr>`;
  }
  //close off table
  table =
    table +
    `</tbody>
    </table>`;

  tableData.innerHTML = table;
}

i18next.on('languageChanged', () => {
  graphic.data.datasets[0].label = i18next.t('intro.savings')
  graphic.data.datasets[1].label = i18next.t('intro.tPortfolio')
  if (oController.flag){
    closeAlert();
    showAlert(i18next.t('intro.mOutOfMoney') + oController.yeartozero);
  }
    
  graphic.update()
});

