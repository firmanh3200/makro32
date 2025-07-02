document.addEventListener('DOMContentLoaded', () => {
    const spreadsheetId = 'YOUR_SPREADSHEET_ID'; // Ganti dengan ID spreadsheet Anda
    const sheets = [
        {
            sheetName: 'IHK',
            indicators: [
                { cardValueSelector: '.card-color-1 .card-value', chartContainerId: 'chart1', columnIndex: 1, bpsLink: 'https://jabar.bps.go.id/id/statistics-table/2/MjQyIzIzI=/ihk-menurut-kelompok-pengeluaran--persen-.html' }, // IHK
                { cardValueSelector: '.card-color-2 .card-value', chartContainerId: 'chart2', columnIndex: 2, bpsLink: 'https://jabar.bps.go.id/id/statistics-table/2/MSMy/inflasi-bulanan-menurut-kelompok-pengeluaran----m-to-m---persen-.html' }, // Inflasi MtM
                { cardValueSelector: '.card-color-3 .card-value', chartContainerId: 'chart3', columnIndex: 3, bpsLink: 'https://jabar.bps.go.id/id/statistics-table/2/ODAyIzI=/inflasi-year-on-year-menurut-kelompok-pengeluaran----y-on-y---persen-.html' }, // Inflasi YoY
                { cardValueSelector: '.card-color-4 .card-value', chartContainerId: 'chart4', columnIndex: 4, bpsLink: 'https://jabar.bps.go.id/id/statistics-table/2/ODE2IzI=/inflasi-year-to-date-menurut-kelompok-pengeluaran----y-to-d---persen-.html' }  // Inflasi YtD
            ]
        },
        // ... tambahkan sheet lain di sini dengan struktur serupa
    ];

    sheets.forEach(sheet => {
        sheet.indicators.forEach(indicator => {
            fetchDataAndPopulate(spreadsheetId, sheet.sheetName, indicator.cardValueSelector, indicator.chartContainerId, indicator.columnIndex, indicator.bpsLink);
        });
    });

    async function fetchDataAndPopulate(spreadsheetId, sheetName, cardValueSelector, chartContainerId, columnIndex, bpsLink) {
      const sheetId = getSheetIdByName(spreadsheetId, sheetName);

      if (sheetId === null) {
          console.error(`Sheet with name '${sheetName}' not found.`);
          return;
      }

      const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&gid=${sheetId}`;

      try {
          const response = await fetch(url);
          const text = await response.text();
          // Extract the JSON data from the Google Visualization API response
          const jsonString = text.substring(text.indexOf("(") + 1, text.lastIndexOf(")"));
          const data = JSON.parse(jsonString);

          // Extract column labels from the first row
          const cols = data.table.cols.map(col => col.label);
          console.log(cols);

          // Extract data rows from the table
          const rows = data.table.rows.map(row => {
              return row.c.map(cell => {
                  if (cell && cell.v !== null) {
                      return cell.v;
                  } else {
                      return null;
                  }
              });
          });

          console.log(rows);

          // Populate the data into the metric card and chart
          populateMetricCard(rows[0], cardValueSelector, columnIndex, bpsLink);
          renderChart(rows.slice(1, 6), chartContainerId, columnIndex);

      } catch (error) {
          console.error('Error fetching or parsing data:', error);
      }
  }

  function populateMetricCard(rowData, cardValueSelector, columnIndex, bpsLink) {
      // Get the current month
      const month = new Date().toLocaleString('default', { month: 'long' });
      const year = new Date().getFullYear();

      // Select the card value and description elements using the provided selectors
      const cardValueElement = document.querySelector(cardValueSelector);
      const cardDescriptionElement = cardValueElement.parentElement.nextElementSibling.querySelector('.card-description'); // Traverse to card description

      // Populate the card with data from the row
      if (cardValueElement) {
          cardValueElement.textContent = rowData[columnIndex];
      }
      if (cardDescriptionElement) {
          cardDescriptionElement.innerHTML = `<a href="${bpsLink}" target="_blank">${month} ${year}</a>`; // Ganti dengan link BPS
      }
  }

  function renderChart(chartData, chartContainerId, columnIndex) {
    const labels = chartData.map(row => row[0]); // Extract labels from the first column
    const dataValues = chartData.map(row => row[columnIndex]); // Extract data from the specified column

      const options = {
          chart: {
              type: 'line',
              height: '100%',
              width: '100%',
              toolbar: {
                  show: false
              },
              sparkline: {
                  enabled: true
              }
          },
          series: [{
              data: dataValues
          }],
          stroke: {
              curve: 'smooth',
              width: 2
          },
          colors: ['#4CAF50'],
          tooltip: {
              enabled: true,
              theme: 'dark',
              x: {
                  show: true,
                  formatter: function (val, { series, seriesIndex, dataPointIndex, w }) {
                      return labels[dataPointIndex];
                  }
              },
              y: {
                  formatter: function (val) {
                      return val.toFixed(2);
                  }
              }
          },
          grid: {
              show: false,
              padding: {
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0
              }
          },
          xaxis: {
              categories: labels,
              labels: {
                  show: false
              },
              axisBorder: {
                  show: false
              },
              axisTicks: {
                  show: false
              }
          },
          yaxis: {
              labels: {
                  show: false
              },
              axisBorder: {
                  show: false
              },
              axisTicks: {
                  show: false
              }
          },
          dataLabels: {
              enabled: false
          }
      };

      new ApexCharts(document.getElementById(chartContainerId), options).render();
  }

  function getSheetIdByName(spreadsheetId, sheetName) {
      let sheetId = null;

      // Construct the URL to fetch the spreadsheet metadata as JSON
      const metadataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets(properties(sheetId,title))&key=YOUR_API_KEY`;

      // Make a synchronous (blocking) request to fetch the metadata
      const xhr = new XMLHttpRequest();
      xhr.open("GET", metadataUrl, false);  // `false` makes the request synchronous
      xhr.send();

      if (xhr.status === 200) {
          const metadata = JSON.parse(xhr.responseText);
          const sheets = metadata.sheets;

          // Find the sheetId by matching the sheetName
          for (const sheet of sheets) {
              if (sheet.properties.title === sheetName) {
                  sheetId = sheet.properties.sheetId;
                  break;
              }
          }
      } else {
          console.error("Failed to fetch spreadsheet metadata:", xhr.status, xhr.statusText);
      }

      // Return the found sheetId or null if not found
      return sheetId;
  }
});