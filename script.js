// Remove Chart.js imports
// import { Chart, registerables } from 'chart.js';

// No need to register components for ApexCharts when loaded globally
// Chart.register(...registerables);

document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard script loaded!');

    // Function to render charts
    // Now accepts specific series data, categories, and seriesName for tooltip
    const renderChart = (chartContainer, lineColor, seriesData, categories, seriesName = 'Value') => {
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
                name: seriesName, // Set the series name here
                data: seriesData
            }],
            stroke: {
                curve: 'smooth',
                width: 2
            },
            colors: [lineColor],
            tooltip: {
                enabled: true,
                theme: 'dark',
                x: {
                    show: true,
                    formatter: function (val, { series, seriesIndex, dataPointIndex, w }) {
                        return categories[dataPointIndex]; // Use actual categories
                    }
                },
                y: {
                    formatter: function (val, { series, seriesIndex, dataPointIndex, w }) {
                        // Display the series name and formatted value
                        // Access the series name from w.config.series for reliability
                        const currentSeriesName = w.config.series[seriesIndex] ? w.config.series[seriesIndex].name : 'Value';
                        return currentSeriesName + ': ' + (val !== null ? val.toFixed(2) : 'N/A');
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
                categories: categories, // Use actual categories
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

        new ApexCharts(chartContainer, options).render();
    };

    // Function to initialize charts that do NOT use CSV data (the rest of them)
    const initializeOtherCharts = () => {
        const otherMetricCards = document.querySelectorAll('.metric-card:not(.card-color-1):not(.card-color-2):not(.card-color-3):not(.card-color-4)');

        otherMetricCards.forEach((card) => {
            const chartContainer = card.querySelector('.chart-container > div');
            const cardTitleElement = card.querySelector('.card-title');

            if (chartContainer && cardTitleElement && chartContainer.id) {
                const chartId = chartContainer.id;
                const computedStyle = window.getComputedStyle(cardTitleElement);
                const lineColor = computedStyle.backgroundColor;
                const seriesTitle = cardTitleElement.textContent.trim(); // Use the card title as series name

                let baseValue;
                let variance;
                const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']; // Default labels for random charts

                // Map the actual chart ID to the specific metric for data generation
                switch (chartId) {
                    case 'chart5': // NTP
                        baseValue = 110.50; variance = 1.0; break;
                    case 'chart6': // NTUP
                        baseValue = 105.25; variance = 0.8; break;
                    case 'chart7': // Indeks Diterima
                        baseValue = 115.10; variance = 1.2; break;
                    case 'chart8': // Tingkat Pengangguran
                        baseValue = 7.76; variance = 0.4; break;
                    case 'chart9': // TPK
                        baseValue = 5.25; variance = 0.6; break;
                    case 'chart10': // TPK Bintang
                        baseValue = 7.50; variance = 0.3; break;
                    case 'chart11': // TPK Non Bintang
                        baseValue = 73.50; variance = 0.8; break;
                    case 'chart12': // Kunjungan Wisman
                        baseValue = 35.8; variance = 2.0; break;
                    case 'chart13': // Nilai Ekspor (Miliar USD)
                        baseValue = 2.5; variance = 0.3; break;
                    case 'chart14': // Nilai Impor (Miliar USD)
                        baseValue = 1.8; variance = 0.2; break;
                    case 'chart16': // Neraca Perdagangan
                        baseValue = 1.0; variance = 0.5; break; // Placeholder; should derive from actual Ekspor-Impor
                    case 'chart17': // TPAK (%)
                        baseValue = 68.20; variance = 0.5; break;
                    case 'chart18': // IHPB
                        baseValue = 112.50; variance = 1.0; break;
                    case 'chart19': // Penduduk Miskin (Ribu Jiwa)
                        baseValue = 4000; variance = 200; break;
                    default:
                        baseValue = 100; variance = 5;
                }
                const data = labels.map((_, i) => {
                    return parseFloat((baseValue + (Math.random() - 0.5) * variance * (i / labels.length + 0.5)).toFixed(2));
                });

                renderChart(chartContainer, lineColor, data, labels, seriesTitle);
            }
        });
    };

    const ihkCsvUrl = 'https://raw.githubusercontent.com/firmanh3200/makro32/refs/heads/main/data/ihk.csv';

    // Fetch and parse IHK CSV data for the first row of cards
    fetch(ihkCsvUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(csvText => {
            Papa.parse(csvText, {
                header: true, // Treat first row as headers (Bulan, IHK, Inflasi_MtM, etc.)
                dynamicTyping: true, // Convert numeric strings to numbers
                skipEmptyLines: true,
                complete: function(results) {
                    const data = results.data;
                    if (!data || data.length === 0) {
                        console.error('No data found in IHK CSV. Initializing all charts with random data as fallback.');
                        initializeOtherCharts(); // Initialize all charts using random data
                        return;
                    }

                    // Get the caption month from the first data row (latest month)
                    const latestMonthCaption = data[0] && data[0].Bulan ? data[0].Bulan : 'N/A';

                    // Prepare data arrays for charts.
                    // The user requested data "from last row to first row" for the graph,
                    // which means the oldest data point will be first in the chart series.
                    const ihkSeriesData = [];
                    const inflasiMtmSeriesData = [];
                    const inflasiYoySeriesData = [];
                    const inflasiYtdSeriesData = [];
                    const chartCategories = []; // Labels for the chart's X-axis

                    // Iterate from the oldest data (last row) to the newest (first row)
                    for (let i = data.length - 1; i >= 0; i--) {
                        const row = data[i];
                        if (row && row.Bulan !== undefined && row.IHK !== undefined && row.Inflasi_MtM !== undefined && row.Inflasi_YoY !== undefined && row.Inflasi_YtD !== undefined) {
                            chartCategories.push(row.Bulan);
                            ihkSeriesData.push(parseFloat(row.IHK));
                            inflasiMtmSeriesData.push(parseFloat(row.Inflasi_MtM));
                            inflasiYoySeriesData.push(parseFloat(row.Inflasi_YoY));
                            inflasiYtdSeriesData.push(parseFloat(row.Inflasi_YtD));
                        }
                    }

                    // Update and render for IHK (chart1)
                    const card1 = document.querySelector('.card-color-1');
                    if (card1) {
                        card1.querySelector('.card-value').textContent = (data[0] && data[0].IHK !== undefined) ? parseFloat(data[0].IHK).toFixed(2) : 'N/A';
                        card1.querySelector('.card-description a').textContent = latestMonthCaption;
                        const chart1Container = card1.querySelector('#chart1');
                        const lineColor1 = window.getComputedStyle(card1.querySelector('.card-title')).backgroundColor;
                        renderChart(chart1Container, lineColor1, ihkSeriesData, chartCategories, 'IHK');
                    }

                    // Update and render for Inflasi MtM (chart2)
                    const card2 = document.querySelector('.card-color-2');
                    if (card2) {
                        card2.querySelector('.card-value').textContent = (data[0] && data[0].Inflasi_MtM !== undefined) ? parseFloat(data[0].Inflasi_MtM).toFixed(2) + '%' : 'N/A';
                        card2.querySelector('.card-description a').textContent = latestMonthCaption;
                        const chart2Container = card2.querySelector('#chart2');
                        const lineColor2 = window.getComputedStyle(card2.querySelector('.card-title')).backgroundColor;
                        renderChart(chart2Container, lineColor2, inflasiMtmSeriesData, chartCategories, 'Inflasi MtM');
                    }

                    // Update and render for Inflasi YoY (chart3)
                    const card3 = document.querySelector('.card-color-3');
                    if (card3) {
                        card3.querySelector('.card-value').textContent = (data[0] && data[0].Inflasi_YoY !== undefined) ? parseFloat(data[0].Inflasi_YoY).toFixed(2) + '%' : 'N/A';
                        card3.querySelector('.card-description a').textContent = latestMonthCaption;
                        const chart3Container = card3.querySelector('#chart3');
                        const lineColor3 = window.getComputedStyle(card3.querySelector('.card-title')).backgroundColor;
                        renderChart(chart3Container, lineColor3, inflasiYoySeriesData, chartCategories, 'Inflasi YoY');
                    }

                    // Update and render for Inflasi YtD (chart4)
                    const card4 = document.querySelector('.card-color-4');
                    if (card4) {
                        card4.querySelector('.card-value').textContent = (data[0] && data[0].Inflasi_YtD !== undefined) ? parseFloat(data[0].Inflasi_YtD).toFixed(2) + '%' : 'N/A';
                        card4.querySelector('.card-description a').textContent = latestMonthCaption;
                        const chart4Container = card4.querySelector('#chart4');
                        const lineColor4 = window.getComputedStyle(card4.querySelector('.card-title')).backgroundColor;
                        renderChart(chart4Container, lineColor4, inflasiYtdSeriesData, chartCategories, 'Inflasi YtD');
                    }

                    // Initialize the remaining charts with random data
                    initializeOtherCharts();
                }
            });
        })
        .catch(error => {
            console.error('Error fetching or parsing IHK CSV:', error);
            // If fetching CSV fails, initialize all charts with random data as a fallback
            initializeOtherCharts();
        });

    // Mobile menu toggle functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    let menuOverlay = document.querySelector('.menu-overlay');

    // Function to create and remove overlay
    const toggleOverlay = (show) => {
        if (show && !menuOverlay) {
            menuOverlay = document.createElement('div');
            menuOverlay.classList.add('menu-overlay');
            document.body.appendChild(menuOverlay);
            menuOverlay.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                toggleOverlay(false); // Hide overlay
            });
        } else if (!show && menuOverlay) {
            menuOverlay.remove();
            menuOverlay = null; // Reset reference
        }
    };

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        toggleOverlay(navLinks.classList.contains('active'));
    });

    // Close menu when a link is clicked (for single page nav)
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                toggleOverlay(false);
            }
        });
    });

    // Accordion functionality
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionBody = header.nextElementSibling; // Get the accordion-body right after the header

            // Toggle active class on the header
            header.classList.toggle('active');

            // Toggle active class on the body
            if (accordionBody.classList.contains('active')) {
                accordionBody.style.maxHeight = '0';
                accordionBody.classList.remove('active');
            } else {
                accordionBody.style.maxHeight = accordionBody.scrollHeight + 'px';
                accordionBody.classList.add('active');
            }
        });
    });
});
