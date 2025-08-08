// script.js
document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard script loaded!');

    const metricCards = document.querySelectorAll('.metric-card');
    const sheetUrl = "https://raw.githubusercontent.com/firmanh3200/makro32/refs/heads/main/data/ihk.csv"; // URL CSV

    // Fungsi untuk mengambil data CSV dari URL
    async function fetchData(url) {
        try {
            // Menggunakan server-side proxy (ganti dengan URL proxy Anda)
            const response = await fetch('http://localhost:3000/sheetdata');  //Asumsi Proxy ada di localhost:3000
            const csvText = await response.text();
            return csvText;
        } catch (error) {
            console.error("Error fetching data:", error);
            return null;
        }
    }

    // Fungsi untuk mem-parse data CSV
    function parseCSV(csvText) {
        const lines = csvText.split("\n");
        const headers = lines[0].split(",").map(header => header.trim()); // Ambil header dan trim
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(",").map(value => value.trim()); // Ambil values dan trim
            if (values.length === headers.length) {
                const entry = {};
                for (let j = 0; j < headers.length; j++) {
                    entry[headers[j]] = values[j];
                }
                data.push(entry);
            }
        }
        return data;
    }

    // Fungsi untuk merender chart
    const renderChart = (chartContainer, lineColor, chartData, chartLabels) => {
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
                data: chartData
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
                        return chartLabels[dataPointIndex];
                    }
                },
                y: {
                    formatter: function (val) {
                        return val;
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
                categories: chartLabels,
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

        const chart = new ApexCharts(chartContainer, options);
        chart.render();
    };

    async function initializeDashboard() {
        const csvText = await fetchData(sheetUrl);

        if (csvText) {
            const data = parseCSV(csvText);

            // Pastikan ada data
            if (data.length === 0) {
                console.warn("No data found in CSV");
                return;
            }

            // Ambil 5 bulan terakhir (atau kurang jika data kurang dari 5 bulan)
            const lastFiveMonths = data.slice(0, 5); // Ambil 5 data teratas
            const chartLabels = lastFiveMonths.map(item => item["Bulan"]).reverse(); //Ambil Label dan REVERSE
            const latestData = data[0]; // Data Terbaru

            // Prepare chart data
            const ihkChartData = lastFiveMonths.map(item => parseFloat(item["IHK"])).reverse();
            const inflasiMtMChartData = lastFiveMonths.map(item => parseFloat(item["Inflasi MtM"].replace("%", ""))).reverse(); //Hilangkan simbol persen
            const inflasiYoYChartData = lastFiveMonths.map(item => parseFloat(item["Inflasi YoY"].replace("%", ""))).reverse(); //Hilangkan simbol persen
            const inflasiYtdChartData = lastFiveMonths.map(item => parseFloat(item["Inflasi YtD"].replace("%", ""))).reverse(); //Hilangkan simbol persen


            // Update data di dashboard
            document.querySelector('#ihk-metric .card-value').textContent = latestData["IHK"];
            document.querySelector('#ihk-metric .card-description a').textContent = latestData["Bulan"];
            document.querySelector('#inflasi-mtm-metric .card-value').textContent = latestData["Inflasi MtM"];
            document.querySelector('#inflasi-mtm-metric .card-description a').textContent = latestData["Bulan"];
            document.querySelector('#inflasi-yoy-metric .card-value').textContent = latestData["Inflasi YoY"];
            document.querySelector('#inflasi-yoy-metric .card-description a').textContent = latestData["Bulan"];
            document.querySelector('#inflasi-ytd-metric .card-value').textContent = latestData["Inflasi YtD"];
            document.querySelector('#inflasi-ytd-metric .card-description a').textContent = latestData["Bulan"];

            // Inisialisasi chart dengan data yang benar
            renderChart(document.querySelector('#chart1'), getCardColor('#ihk-metric'), ihkChartData, chartLabels);
            renderChart(document.querySelector('#chart2'), getCardColor('#inflasi-mtm-metric'), inflasiMtMChartData, chartLabels);
            renderChart(document.querySelector('#chart3'), getCardColor('#inflasi-yoy-metric'), inflasiYoYChartData, chartLabels);
            renderChart(document.querySelector('#chart4'), getCardColor('#inflasi-ytd-metric'), inflasiYtdChartData, chartLabels);

            function getCardColor(selector) {
                const cardTitleElement = document.querySelector(selector + ' .card-title');
                const computedStyle = window.getComputedStyle(cardTitleElement);
                return computedStyle.backgroundColor;
            }

        }
    }

    initializeDashboard();

    // Mobile menu toggle functionality (unchanged)
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    let menuOverlay = document.querySelector('.menu-overlay');

    // Function to create and remove overlay (unchanged)
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

    // Close menu when a link is clicked (for single page nav) (unchanged)
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                toggleOverlay(false);
            }
        });
    });

    // Accordion functionality (unchanged)
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