document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard script loaded!');

    const csvUrls = {
        ihk: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTOIH0Dl54f6EKAHvwY5eMjstluFPNWXX-erkrDXlGcVMRDFZDGUdUjxtgzyD7qJWf-KX9GZ_UxVmx5/pub?gid=0&single=true&output=csv",
        ntp: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTOIH0Dl54f6EKAHvwY5eMjstluFPNWXX-erkrDXlGcVMRDFZDGUdUjxtgzyD7qJWf-KX9GZ_UxVmx5/pub?gid=2009702541&single=true&output=csv",
        pariwisata: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTOIH0Dl54f6EKAHvwY5eMjstluFPNWXX-erkrDXlGcVMRDFZDGUdUjxtgzyD7qJWf-KX9GZ_UxVmx5/pub?gid=1368898419&single=true&output=csv",
        transportasi: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTOIH0Dl54f6EKAHvwY5eMjstluFPNWXX-erkrDXlGcVMRDFZDGUdUjxtgzyD7qJWf-KX9GZ_UxVmx5/pub?gid=1693098622&single=true&output=csv",
        exim: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTOIH0Dl54f6EKAHvwY5eMjstluFPNWXX-erkrDXlGcVMRDFZDGUdUjxtgzyD7qJWf-KX9GZ_UxVmx5/pub?gid=826169716&single=true&output=csv"
    };

    let ihkData, ntpData, pariwisataData, transportasiData, eximData; // Store fetched data

    // Function to render charts with updated data
    const renderChart = (chartContainer, lineColor, chartData) => {
        const labels = chartData.map(row => row[0]);
        const data = chartData.map(row => parseFloat(row[1]));

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
                data: data
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
                        return w.globals.labels[dataPointIndex];
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
        new ApexCharts(chartContainer, options).render();
    };

    // Function to parse CSV data
    const parseCSV = (csvText) => {
        const lines = csvText.split('\n');
        const result = [];
        const headers = lines[0].split(',');

        for (let i = 1; i < lines.length; i++) {
            const data = lines[i].split(',');
            if (data.length === headers.length) {
                const entry = {};
                for (let j = 0; j < headers.length; j++) {
                    entry[headers[j].trim()] = data[j].trim();
                }
                result.push(entry);
            }
        }
        return result;
    };

    // Function to fetch CSV data
    const fetchCSVData = async (url) => {
        try {
            const response = await fetch(url);
            const csvText = await response.text();
            return parseCSV(csvText);
        } catch (error) {
            console.error("Error fetching CSV data:", error);
            return null;
        }
    };

    // Function to fetch all CSV data and then update the dashboard
    const fetchAllDataAndUpdate = async () => {
        ihkData = await fetchCSVData(csvUrls.ihk);
        ntpData = await fetchCSVData(csvUrls.ntp);
        pariwisataData = await fetchCSVData(csvUrls.pariwisata);
        transportasiData = await fetchCSVData(csvUrls.transportasi);
        eximData = await fetchCSVData(csvUrls.exim);

        // Only update the dashboard if all data has been fetched successfully
        if (ihkData && ntpData && pariwisataData && transportasiData && eximData) {
            updateDashboard();
        } else {
            console.error("Failed to fetch all data. Dashboard update aborted.");
        }
    };

    // Function to update the dashboard with the fetched data
    const updateDashboard = () => {
        // Update IHK card
        if (ihkData && ihkData.length > 0) {
            const ihkCard = document.getElementById('ihk-card');
            if (ihkCard) {
                const ihkValueElement = document.getElementById('ihk-value');
                const ihkDescriptionElement = document.getElementById('ihk-description');

                ihkValueElement.textContent = ihkData[1][1];
                ihkDescriptionElement.textContent = ihkData[1][0];

                const chartContainer = ihkCard.querySelector('.chart-container > div');
                const cardTitleElement = ihkCard.querySelector('.card-title');
                const computedStyle = window.getComputedStyle(cardTitleElement);
                const lineColor = computedStyle.backgroundColor;
                const chartData = ihkData.slice(1).map(row => [row[0], row[1]]);

                if (chartContainer) {
                    renderChart(chartContainer, lineColor, chartData);
                }
            }
        }

        // Update Inflasi MtM card
        if (ihkData && ihkData.length > 0) {
            const inflasiMtmCard = document.getElementById('inflasi-mtm-card');
            if (inflasiMtmCard) {
                const inflasiMtmValueElement = document.getElementById('inflasi-mtm-value');
                const inflasiMtmDescriptionElement = document.getElementById('inflasi-mtm-description');

                inflasiMtmValueElement.textContent = ihkData[1][2];
                inflasiMtmDescriptionElement.textContent = ihkData[1][0];

                const chartContainer = inflasiMtmCard.querySelector('.chart-container > div');
                const cardTitleElement = ihkCard.querySelector('.card-title');
                const computedStyle = window.getComputedStyle(cardTitleElement);
                const lineColor = computedStyle.backgroundColor;
                const chartData = ihkData.slice(1).map(row => [row[0], row[2]]);

                if (chartContainer) {
                    renderChart(chartContainer, lineColor, chartData);
                }
            }
        }

        // Update Inflasi YoY card
        if (ihkData && ihkData.length > 0) {
            const inflasiYoYCard = document.getElementById('inflasi-yoy-card');
            if (inflasiYoYCard) {
                const inflasiYoYValueElement = document.getElementById('inflasi-yoy-value');
                const inflasiYoYDescriptionElement = document.getElementById('inflasi-yoy-description');

                inflasiYoYValueElement.textContent = ihkData[1][3];
                inflasiYoYDescriptionElement.textContent = ihkData[1][0];

                const chartContainer = inflasiYoYCard.querySelector('.chart-container > div');
                const cardTitleElement = ihkCard.querySelector('.card-title');
                const computedStyle = window.getComputedStyle(cardTitleElement);
                const lineColor = computedStyle.backgroundColor;
                const chartData = ihkData.slice(1).map(row => [row[0], row[3]]);

                if (chartContainer) {
                    renderChart(chartContainer, lineColor, chartData);
                }
            }
        }

        // Update Inflasi YtD card
        if (ihkData && ihkData.length > 0) {
            const inflasiYtDCard = document.getElementById('inflasi-ytd-card');

            if (inflasiYtDCard) {
                const inflasiYtDValueElement = document.getElementById('inflasi-ytd-value');
                const inflasiYtDDescriptionElement = document.getElementById('inflasi-ytd-description');

                inflasiYtDValueElement.textContent = ihkData[1][4];
                inflasiYtDDescriptionElement.textContent = ihkData[1][0];

                const chartContainer = inflasiYtDCard.querySelector('.chart-container > div');
                const cardTitleElement = ihkCard.querySelector('.card-title');
                const computedStyle = window.getComputedStyle(cardTitleElement);
                const lineColor = computedStyle.backgroundColor;
                const chartData = ihkData.slice(1).map(row => [row[0], row[4]]);

                if (chartContainer) {
                    renderChart(chartContainer, lineColor, chartData);
                }
            }
        }

        // Update NTP card
        if (ntpData && ntpData.length > 0) {
            const ntpCard = document.getElementById('ntp-card');
            if (ntpCard) {
                const ntpValueElement = document.getElementById('ntp-value');
                const ntpDescriptionElement = document.getElementById('ntp-description');

                ntpValueElement.textContent = ntpData[1][1];
                ntpDescriptionElement.textContent = ntpData[1][0];

                const chartContainer = ntpCard.querySelector('.chart-container > div');
                 const cardTitleElement = document.querySelector(".metric-card.card-color-5 .card-title");
                const computedStyle = window.getComputedStyle(cardTitleElement);
                const lineColor = computedStyle.backgroundColor;
                const chartData = ntpData.slice(1).map(row => [row[0], row[1]]);

                if (chartContainer) {
                    renderChart(chartContainer, lineColor, chartData);
                }
            }
        }

        // Update TPK card
        if (pariwisataData && pariwisataData.length > 0) {
            const tpkCard = document.getElementById('tpk-card');
            if (tpkCard) {
                const tpkValueElement = document.getElementById('tpk-value');
                const tpkDescriptionElement = document.getElementById('tpk-description');

                tpkValueElement.textContent = pariwisataData[1][1];
                tpkDescriptionElement.textContent = pariwisataData[1][0];

                const chartContainer = tpkCard.querySelector('.chart-container > div');
                const cardTitleElement = document.querySelector(".metric-card.card-color-9 .card-title");
                const computedStyle = window.getComputedStyle(cardTitleElement);
                const lineColor = computedStyle.backgroundColor;
                const chartData = pariwisataData.slice(1).map(row => [row[0], row[1]]);

                if (chartContainer) {
                    renderChart(chartContainer, lineColor, chartData);
                }
            }
        }
        // Update Transportasi card
        if (transportasiData && transportasiData.length > 0) {
            const transportasiCard = document.getElementById('penumpang-udara-internasional-card');
            if (transportasiCard) {
                const transportasiValueElement = document.getElementById('penumpang-udara-internasional-value');
                const transportasiDescriptionElement = document.getElementById('penumpang-udara-internasional-description');

                transportasiValueElement.textContent = transportasiData[1][1];
                transportasiDescriptionElement.textContent = transportasiData[1][0];

                const chartContainer = transportasiCard.querySelector('.chart-container > div');
                const cardTitleElement = document.querySelector(".metric-card.card-color-13 .card-title");
                const computedStyle = window.getComputedStyle(cardTitleElement);
                const lineColor = computedStyle.backgroundColor;
                const chartData = transportasiData.slice(1).map(row => [row[0], row[1]]);

                if (chartContainer) {
                    renderChart(chartContainer, lineColor, chartData);
                }
            }
        }

        // Update exim card
        if (eximData && eximData.length > 0) {
            const eximCard = document.getElementById('nilai-ekspor-card');
            if (eximCard) {
                const eximValueElement = document.getElementById('nilai-ekspor-value');
                const eximDescriptionElement = document.getElementById('nilai-ekspor-description');

                eximValueElement.textContent = eximData[1][1];
                eximDescriptionElement.textContent = eximData[1][0];

                const chartContainer = eximCard.querySelector('.chart-container > div');
                const cardTitleElement = document.querySelector(".metric-card.card-color-16 .card-title");
                const computedStyle = window.getComputedStyle(cardTitleElement);
                const lineColor = computedStyle.backgroundColor;
                const chartData = eximData.slice(1).map(row => [row[0], row[1]]);

                if (chartContainer) {
                    renderChart(chartContainer, lineColor, chartData);
                }
            }
        }
    };

    // Call the function to fetch all data and update
    fetchAllDataAndUpdate();

    // Mobile menu toggle functionality (existing code)
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

    // Accordion functionality (existing code)
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