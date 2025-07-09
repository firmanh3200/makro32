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
                        // Ensure categories exist and index is valid
                        return categories[dataPointIndex] ? categories[dataPointIndex] : 'N/A';
                    }
                },
                y: {
                    formatter: function (val, { series, seriesIndex, dataPointIndex, w }) {
                        // Display the series name and formatted value
                        const currentSeriesName = w.config.series[seriesIndex] ? w.config.series[seriesIndex].name : 'Value';
                        // Only show value if it's not null/undefined
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
    const initializeOtherCharts = (initializedChartIds = []) => {
        const allChartContainers = document.querySelectorAll('.chart-container > div');

        allChartContainers.forEach((chartContainer) => {
            const chartId = chartContainer.id;

            // Skip if this chart has already been initialized by CSV data
            if (initializedChartIds.includes(chartId)) {
                return;
            }

            const card = chartContainer.closest('.metric-card');
            if (!card) return;

            const cardTitleElement = card.querySelector('.card-title');

            if (chartContainer && cardTitleElement) {
                const computedStyle = window.getComputedStyle(cardTitleElement);
                const lineColor = computedStyle.backgroundColor;
                const seriesTitle = cardTitleElement.textContent.trim();

                let baseValue;
                let variance;
                const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']; // Default labels for random charts

                // Map the actual chart ID to the specific metric for data generation
                // Note: Charts 1-7 and 9-15 are now handled by CSV.
                // The cases below remain for charts that are still random (e.g., from Ekspor/Impor, if not CSV-driven yet)
                // And will be skipped if corresponding CSV is added in the future.
                switch (chartId) {
                    case 'chart8': // Indeks Dibayar - This was not in NTP CSV, so remains random here.
                        baseValue = 121.73; variance = 0.5; break;
                    case 'chart16': // Nilai Ekspor (Miliar USD)
                        baseValue = 3.33; variance = 0.5; break;
                    case 'chart17': // Kumulatif Ekspor (Miliar USD)
                        baseValue = 15.40; variance = 1.0; break;
                    case 'chart18': // Nilai Impor (Miliar USD)
                        baseValue = 1.03; variance = 0.2; break;
                    case 'chart19': // Kumulatif Impor (Miliar USD)
                        baseValue = 5.01; variance = 0.5; break;
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

    // Helper function to fetch and parse CSV, returning a promise
    const fetchAndParseCsv = (url) => {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(csvText => {
                return new Promise((resolve, reject) => {
                    Papa.parse(csvText, {
                        header: true,
                        dynamicTyping: true,
                        skipEmptyLines: true,
                        complete: function(results) {
                            resolve(results.data);
                        },
                        error: function(err) {
                            reject(err);
                        }
                    });
                });
            });
    };

    const ihkCsvUrl = 'https://raw.githubusercontent.com/firmanh3200/makro32/refs/heads/main/data/ihk.csv';
    const ntpCsvUrl = 'https://raw.githubusercontent.com/firmanh3200/makro32/refs/heads/main/data/ntp.csv';
    const pariwisataCsvUrl = 'https://raw.githubusercontent.com/firmanh3200/makro32/refs/heads/main/data/pariwisata.csv';
    const transportasiCsvUrl = 'https://raw.githubusercontent.com/firmanh3200/makro32/refs/heads/main/data/transportasi.csv';
    const eximCsvUrl = 'https://raw.githubusercontent.com/firmanh3200/makro32/refs/heads/main/data/exim.csv';

    let initializedCharts = []; // Keep track of charts initialized by CSV data

    // Helper function to update card values and charts
    function updateCardChart(cardSelector, valueKey, seriesData, categories, seriesName, unit = '', caption) {
        const card = document.querySelector(cardSelector);
        if (!card) return;
        
        // Use the last data point from the chronologically ordered seriesData for the current value
        const dataPoint = seriesData.length > 0 ? seriesData[seriesData.length - 1] : null;
        card.querySelector('.card-value').textContent = dataPoint !== null ? `${dataPoint.toFixed(2)}${unit}` : 'N/A';
        card.querySelector('.card-description a').textContent = caption;
        
        const chartId = card.querySelector('.chart-container div').id;
        const chartContainer = document.getElementById(chartId);
        const lineColor = window.getComputedStyle(card.querySelector('.card-title')).backgroundColor;
        
        initializedCharts.push(chartId);
        renderChart(chartContainer, lineColor, seriesData, categories, seriesName);
    }

    // Chain promises for sequential CSV data fetching and processing
    fetchAndParseCsv(ihkCsvUrl)
        .then(ihkData => {
            if (!ihkData || ihkData.length === 0) {
                console.error('No data found in IHK CSV.');
            } else {
                const latestMonthCaption = ihkData[0] && ihkData[0].Bulan ? ihkData[0].Bulan : 'N/A';

                const ihkSeriesData = [];
                const inflasiMtmSeriesData = [];
                const inflasiYoySeriesData = [];
                const inflasiYtdSeriesData = [];
                const chartCategories = [];

                // Iterate from the oldest data (last row) to the newest (first row)
                for (let i = ihkData.length - 1; i >= 0; i--) {
                    const row = ihkData[i];
                    if (row && row.Bulan !== undefined && row.IHK !== undefined && row.Inflasi_MtM !== undefined && row.Inflasi_YoY !== undefined && row.Inflasi_YtD !== undefined) {
                        chartCategories.push(row.Bulan);
                        ihkSeriesData.push(parseFloat(row.IHK));
                        inflasiMtmSeriesData.push(parseFloat(row.Inflasi_MtM));
                        inflasiYoySeriesData.push(parseFloat(row.Inflasi_YoY));
                        inflasiYtdSeriesData.push(parseFloat(row.Inflasi_YtD));
                    }
                }

                updateCardChart('.card-color-1', 'IHK', ihkSeriesData, chartCategories, 'IHK');
                updateCardChart('.card-color-2', 'Inflasi_MtM', inflasiMtmSeriesData, chartCategories, 'Inflasi MtM', '%');
                updateCardChart('.card-color-3', 'Inflasi_YoY', inflasiYoySeriesData, chartCategories, 'Inflasi YoY', '%');
                updateCardChart('.card-color-4', 'Inflasi_YtD', inflasiYtdSeriesData, chartCategories, 'Inflasi YtD', '%');
            }
            return fetchAndParseCsv(ntpCsvUrl); // Chain next fetch
        })
        .then(ntpData => {
            if (!ntpData || ntpData.length === 0) {
                console.error('No data found in NTP CSV.');
            } else {
                const latestMonthCaption = ntpData[0] && ntpData[0].Bulan ? ntpData[0].Bulan : 'N/A';

                const ntpSeriesData = [];
                const ntupSeriesData = [];
                const itSeriesData = []; // Changed from indeksDiterimaSeriesData
                const ibSeriesData = []; // New for 'Ib'
                const chartCategories = [];

                // Iterate from the oldest data (last row) to the newest (first row)
                for (let i = ntpData.length - 1; i >= 0; i--) {
                    const row = ntpData[i];
                    if (row && row.Bulan !== undefined && row.NTP !== undefined && row.NTUP !== undefined && row.It !== undefined && row.Ib !== undefined) {
                        chartCategories.push(row.Bulan);
                        ntpSeriesData.push(parseFloat(row.NTP));
                        ntupSeriesData.push(parseFloat(row.NTUP));
                        itSeriesData.push(parseFloat(row.It)); // Use 'It'
                        ibSeriesData.push(parseFloat(row.Ib)); // Use 'Ib'
                    }
                }

                updateCardChart('.card-color-5', 'NTP', ntpSeriesData, chartCategories, 'NTP', '', latestMonthCaption);
                updateCardChart('.card-color-6', 'NTUP', ntupSeriesData, chartCategories, 'NTUP', '', latestMonthCaption);
                updateCardChart('.card-color-7', 'It', itSeriesData, chartCategories, 'Indeks Diterima', '', latestMonthCaption); // Use 'It' data, but display name 'Indeks Diterima'
                updateCardChart('.card-color-8', 'Ib', ibSeriesData, chartCategories, 'Indeks Dibayar', '', latestMonthCaption); // New call for 'Ib' data, display name 'Indeks Dibayar'
            }
            return fetchAndParseCsv(pariwisataCsvUrl); // Chain next fetch
        })
        .then(pariwisataData => {
            if (!pariwisataData || pariwisataData.length === 0) {
                console.error('No data found in Pariwisata CSV.');
            } else {
                const latestMonth = pariwisataData[0];
                
                const categories = [];
                const tpkData = []; // Changed from tpkWismanData to tpkData
                const tpkBintangData = [];
                const tpkNonBintangData = [];
                const wismanData = [];

                // Extract tourism metrics chronologically
                for (let i = pariwisataData.length - 1; i >= 0; i--) {
                    const row = pariwisataData[i];
                    categories.push(row.Bulan);
                    tpkData.push(row.TPK); // Use 'TPK' column
                    tpkBintangData.push(row.TPK_Bintang);
                    tpkNonBintangData.push(row.TPK_Non_Bintang);
                    wismanData.push(row.Wisman);
                }

                updateCardChart('.card-color-9', 'TPK', tpkData, categories, 'TPK', '%', latestMonth.Bulan); // Update key and series name
                updateCardChart('.card-color-10', 'TPK_Bintang', tpkBintangData, categories, 'TPK Bintang', '%', latestMonth.Bulan);
                updateCardChart('.card-color-11', 'TPK_Non_Bintang', tpkNonBintangData, categories, 'TPK Non Bintang', '%', latestMonth.Bulan);
                updateCardChart('.card-color-12', 'Wisman', wismanData, categories, 'Kunjungan Wisman', '', latestMonth.Bulan);
            }
            return fetchAndParseCsv(transportasiCsvUrl); // Chain next fetch for transportasi
        })
        .then(transportasiData => {
            if (!transportasiData || transportasiData.length === 0) {
                console.error('No data found in Transportasi CSV. Initializing remaining charts with random data.');
            } else {
                const latestMonth = transportasiData[0];
                const categories = [];
                const penumpangUdaraInternasionalData = [];
                const penumpangUdaraDomestikData = [];
                const penumpangKeretaData = [];

                // Extract transportation metrics chronologically
                for (let i = transportasiData.length - 1; i >= 0; i--) {
                    const row = transportasiData[i];
                    categories.push(row.Bulan);
                    penumpangUdaraInternasionalData.push(parseFloat(row.Internasional));
                    penumpangUdaraDomestikData.push(parseFloat(row.Domestik));
                    penumpangKeretaData.push(parseFloat(row.Kereta));
                }

                updateCardChart('.card-color-13', 'Penumpang_Udara_Internasional', penumpangUdaraInternasionalData, categories, 'Penumpang Udara Internasional', '', latestMonth.Bulan);
                updateCardChart('.card-color-14', 'Penumpang_Udara_Domestik', penumpangUdaraDomestikData, categories, 'Penumpang Udara Domestik', '', latestMonth.Bulan);
                updateCardChart('.card-color-15', 'Penumpang_Kereta', penumpangKeretaData, categories, 'Penumpang Kereta (Juta)', '', latestMonth.Bulan);
            }
            return fetchAndParseCsv(eximCsvUrl); // Chain next fetch for exim
        })
        .then(eximData => {
            if (!eximData || eximData.length === 0) {
                console.error('No data found in Ekspor Impor CSV. Initializing remaining charts with random data.');
            } else {
                const latestMonth = eximData[0];
                const categories = [];
                const eksporData = []; // Changed variable name
                const kumEksporData = []; // Changed variable name
                const imporData = []; // Changed variable name
                const kumImporData = []; // Changed variable name

                // Extract exim metrics chronologically
                for (let i = eximData.length - 1; i >= 0; i--) {
                    const row = eximData[i];
                    categories.push(row.Bulan);
                    eksporData.push(parseFloat(row.Ekspor)); // Changed column name
                    kumEksporData.push(parseFloat(row.Kum_Ekspor)); // Changed column name
                    imporData.push(parseFloat(row.Impor)); // Changed column name
                    kumImporData.push(parseFloat(row.Kum_Impor)); // Changed column name
                }

                updateCardChart('.card-color-16', 'Ekspor', eksporData, categories, 'Nilai Ekspor', '', latestMonth.Bulan); // Updated valueKey
                updateCardChart('.card-color-17', 'Kum_Ekspor', kumEksporData, categories, 'Kumulatif Ekspor', '', latestMonth.Bulan); // Updated valueKey
                updateCardChart('.card-color-18', 'Impor', imporData, categories, 'Nilai Impor', '', latestMonth.Bulan); // Updated valueKey
                updateCardChart('.card-color-19', 'Kum_Impor', kumImporData, categories, 'Kumulatif Impor', '', latestMonth.Bulan); // Updated valueKey
            }
            initializeOtherCharts(initializedCharts); // Call init other charts after all CSVs processed
        })
        .catch(error => {
            console.error('Error fetching or parsing CSV data:', error);
            // If any CSV fetching fails (or network issue), initialize all remaining charts with random data
            initializeOtherCharts(initializedCharts);
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
