const csvUrl = "https://raw.githubusercontent.com/firmanh3200/makro32/refs/heads/main/data/ihk.csv";

async function fetchData() {
    try {
        const response = await fetch(csvUrl);
        const csvData = await response.text();
        return parseCSV(csvData);
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const header = lines[0].split(',');
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const entry = {};
        for (let j = 0; j < header.length; j++) {
            entry[header[j]] = values[j];
        }
        data.push(entry);
    }
    return data;
}


function updateMetricCard(cardId, value, caption, chartData, categories, color) {
    const card = document.getElementById(cardId);
    card.querySelector('.value').textContent = value;
    card.querySelector('.caption').textContent = caption;

    const chartOptions = {
        series: [{ data: chartData }],
        chart: {
            type: 'line',
            height: '100%',  // Take full height of container
            width: '100%',   // Take full width of container
            toolbar: { show: false },
            zoom: { enabled: false },
            sparkline: {
                enabled: true // Enable sparkline to fill the container properly
            }
        },
        xaxis: {
            categories: categories,
            labels: { show: false },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: {
            labels: { show: false }
        },
        grid: {
            padding: { top: 0, right: 0, bottom: 0, left: 0 }
        },
        stroke: {
            curve: 'smooth',
            width: 2
        },
        colors: [color], // Use the provided color
        tooltip: {
            enabled: true,
            x: {
                formatter: function (val, { seriesIndex, dataPointIndex, w }) {
                    return categories[dataPointIndex];
                }
            },
            y: {
                formatter: function (val, { seriesIndex, dataPointIndex, w }) {
                    return val;
                }
            },
        }

    };

    const chart = new ApexCharts(card.querySelector(`#${cardId.replace('-card', '-chart')}`), chartOptions);
    chart.render();
}


async function initializeDashboard() {
    const data = await fetchData();

    if (!data) return;

    const lastIndex = data.length - 1; // Index of the last row
    const firstRow = data[0];

    // Function to safely extract data for chart and reverse it
    function getChartData(dataArray, dataField) {
        const startIndex = Math.max(0, dataArray.length - 5); // Ensure startIndex is not negative
        const chartData = dataArray.slice(startIndex).map(item => parseFloat(item[dataField]));
        return chartData.reverse(); // Reverse the data
    }

    // Function to safely extract categories (Bulan) for chart and reverse it
    function getChartCategories(dataArray) {
        const startIndex = Math.max(0, dataArray.length - 5); // Ensure startIndex is not negative
        const chartCategories = dataArray.slice(startIndex).map(item => item.Bulan);
        return chartCategories.reverse(); // Reverse the categories
    }


    // --- Helper function to get card title color ---
    function getCardTitleColor(cardId) {
        const cardTitle = document.querySelector(`#${cardId} .card-title`);
        return window.getComputedStyle(cardTitle).backgroundColor;
    }

    // Extract data for the first metric card (IHK)
    const ihkValue = firstRow.IHK;
    const ihkCaption = firstRow.Bulan;
    const ihkChartData = getChartData(data, 'IHK');
    const ihkCategories = getChartCategories(data);
    const ihkColor = getCardTitleColor('ihk-card');

    // Extract data for the second metric card (Inflasi MtM)
    const mtmValue = firstRow.Inflasi_MtM;
    const mtmCaption = firstRow.Bulan;
    const mtmChartData = getChartData(data, 'Inflasi_MtM');
    const mtmCategories = getChartCategories(data);
    const mtmColor = getCardTitleColor('mtm-card');

    // Extract data for the third metric card (Inflasi YoY)
    const yoyValue = firstRow.Inflasi_YoY;
    const yoyCaption = firstRow.Bulan;
    const yoyChartData = getChartData(data, 'Inflasi_YoY');
    const yoyCategories = getChartCategories(data);
    const yoyColor = getCardTitleColor('yoy-card');

    // Extract data for the fourth metric card (Inflasi YtD)
    const ytdValue = firstRow.Inflasi_YtD;
    const ytdCaption = firstRow.Bulan;
    const ytdChartData = getChartData(data, 'Inflasi_YtD');
    const ytdCategories = getChartCategories(data);
    const ytdColor = getCardTitleColor('ytd-card');


    updateMetricCard('ihk-card', ihkValue, ihkCaption, ihkChartData, ihkCategories, ihkColor);
    updateMetricCard('mtm-card', mtmValue, mtmCaption, mtmChartData, mtmCategories, mtmColor);
    updateMetricCard('yoy-card', yoyValue, yoyCaption, yoyChartData, yoyCategories, yoyColor);
    updateMetricCard('ytd-card', ytdValue, ytdCaption, ytdChartData, ytdCategories, ytdColor);
}

initializeDashboard();