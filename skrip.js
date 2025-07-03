document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard script loaded!');

    const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTOIH0Dl54f6EKAHvwY5eMjstluFPNWXX-erkrDXlGcVMRDFZDGUdUjxtgzyD7qJWf-KX9GZ_UxVmx5/pub?output=csv"; // Ganti dengan URL CSV Anda!

    const metricCards = document.querySelectorAll('.metric-card');

    // Function to render charts with updated data
    const renderChart = (chartContainer, lineColor, chartData) => {
        const labels = chartData.slice(1).map(row => row[0]); // Extract dates, skipping the header row
        const data = chartData.slice(1).map(row => parseFloat(row[1])); // Extract values

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
                    entry[headers[j].trim()] = data[j].trim(); // Remove extra spaces
                }
                result.push(entry);
            }
        }
        return result;
    };

    // Function to fetch and update data from CSV
    const fetchDataAndUpdate = async () => {
        try {
            const response = await fetch(csvUrl);
            const csvText = await response.text(); // Get the response as text

            const parsedData = parseCSV(csvText); // Parse the CSV data
            console.log(parsedData);

            // Now update the dashboard with the fetched data
            updateDashboard(parsedData);

        } catch (error) {
            console.error("Error fetching or parsing CSV data:", error);
        }
    };
    // Function to update the dashboard with the fetched data
    const updateDashboard = (data) => {
        // Example: Update IHK card with data from "ihk" sheet
        if (data && data.length > 0) {
            const ihkData = data.slice(0,6); // get data from the last 6 months
            const ihkCard = document.querySelector('.metric-card.card-color-1'); // Adjust selector if needed

            if (ihkCard) {
                // Update value and description
                ihkCard.querySelector('.card-value').textContent = ihkData[0]['IHK']; // Assuming the latest value is in the first row, "IHK" column
                ihkCard.querySelector('.card-description a').textContent = ihkData[0]['Bulan']; // Assuming the latest date is in the first row, "Bulan" column

                // Update chart
                const chartContainer = ihkCard.querySelector('.chart-container > div');
                const cardTitleElement = ihkCard.querySelector('.card-title');
                const computedStyle = window.getComputedStyle(cardTitleElement);
                const lineColor = computedStyle.backgroundColor;

                const chartData = ihkData.map(item => [item['Bulan'], item['IHK']]); // create array of arrays

                if (chartContainer) {
                    renderChart(chartContainer, lineColor, chartData);
                }
            }
        }
        // Repeat similar blocks for other metric cards and sheets
        if (data && data.length > 0) {
            const ntpData = data.slice(0,6);
            const ntpCard = document.querySelector('.metric-card.card-color-5');

            if (ntpCard) {
                ntpCard.querySelector('.card-value').textContent = ntpData[0]['NTP'];
                ntpCard.querySelector('.card-description a').textContent = ntpData[0]['Bulan'];

                const chartContainer = ntpCard.querySelector('.chart-container > div');
                const cardTitleElement = ntpCard.querySelector('.card-title');
                const computedStyle = window.getComputedStyle(cardTitleElement);
                const lineColor = computedStyle.backgroundColor;

                const chartData = ntpData.map(item => [item['Bulan'], item['NTP']]);

                if (chartContainer) {
                    renderChart(chartContainer, lineColor, chartData);
                }
            }
        }
        if (data && data.length > 0) {
            const pariwisataData = data.slice(0,6);
            const pariwisataCard = document.querySelector('.metric-card.card-color-9');

            if (pariwisataCard) {
                pariwisataCard.querySelector('.card-value').textContent = pariwisataData[0]['TPK'];
                pariwisataCard.querySelector('.card-description a').textContent = pariwisataData[0]['Bulan'];

                const chartContainer = pariwisataCard.querySelector('.chart-container > div');
                const cardTitleElement = pariwisataCard.querySelector('.card-title');
                const computedStyle = window.getComputedStyle(cardTitleElement);
                const lineColor = computedStyle.backgroundColor;

                const chartData = pariwisataData.map(item => [item['Bulan'], item['TPK']]);

                if (chartContainer) {
                    renderChart(chartContainer, lineColor, chartData);
                }
            }
        }
        if (data && data.length > 0) {
            const transportasiData = data.slice(0,6);
            const transportasiCard = document.querySelector('.metric-card.card-color-13');

            if (transportasiCard) {
                transportasiCard.querySelector('.card-value').textContent = transportasiData[0]['Penumpang Udara Internasional'];
                transportasiCard.querySelector('.card-description a').textContent = transportasiData[0]['Bulan'];

                const chartContainer = transportasiCard.querySelector('.chart-container > div');
                const cardTitleElement = transportasiCard.querySelector('.card-title');
                const computedStyle = window.getComputedStyle(cardTitleElement);
                const lineColor = computedStyle.backgroundColor;

                const chartData = transportasiData.map(item => [item['Bulan'], item['Penumpang Udara Internasional']]);

                if (chartContainer) {
                    renderChart(chartContainer, lineColor, chartData);
                }
            }
        }
        if (data && data.length > 0) {
            const eximData = data.slice(0,6);
            const eximCard = document.querySelector('.metric-card.card-color-16');

            if (eximCard) {
                eximCard.querySelector('.card-value').textContent = eximData[0]['Nilai Ekspor (Miliar USD)'];
                eximCard.querySelector('.card-description a').textContent = eximData[0]['Bulan'];

                const chartContainer = eximCard.querySelector('.chart-container > div');
                const cardTitleElement = eximCard.querySelector('.card-title');
                const computedStyle = window.getComputedStyle(cardTitleElement);
                const lineColor = computedStyle.backgroundColor;

                const chartData = eximData.map(item => [item['Bulan'], item['Nilai Ekspor (Miliar USD)']]);

                if (chartContainer) {
                    renderChart(chartContainer, lineColor, chartData);
                }
            }
        }
        console.log(data);

        // Inflasi MtM
        if (data && data.length > 0) {
            const ihkData = data.slice(0,6);
            const ihkCard = document.querySelector('.metric-card.card-color-2'); // Adjust selector if needed

            if (ihkCard) {
                // Update value and description
                ihkCard.querySelector('.card-value').textContent = ihkData[0]['Inflasi MtM'] + '%'; // Assuming the latest value is in the first row, "Inflasi MtM" column
                ihkCard.querySelector('.card-description a').textContent = ihkData[0]['Bulan']; // Assuming the latest date is in the first row, "Bulan" column

                // Update chart
                const chartContainer = ihkCard.querySelector('.chart-container > div');
                const cardTitleElement = ihkCard.querySelector('.card-title');
                const computedStyle = window.getComputedStyle(cardTitleElement);
                const lineColor = computedStyle.backgroundColor;

                const chartData = ihkData.map(item => [item['Bulan'], item['Inflasi MtM']]);

                if (chartContainer) {
                    renderChart(chartContainer, lineColor, chartData);
                }
            }
        }

        // Inflasi YoY
        if (data && data.length > 0) {
            const ihkData = data.slice(0,6);
            const ihkCard = document.querySelector('.metric-card.card-color-3'); // Adjust selector if needed

            if (ihkCard) {
                // Update value and description
                ihkCard.querySelector('.card-value').textContent = ihkData[0]['Inflasi YoY'] + '%'; // Assuming the latest value is in the first row, "Inflasi YoY" column
                ihkCard.querySelector('.card-description a').textContent = ihkData[0]['Bulan']; // Assuming the latest date is in the first row, "Bulan" column

                // Update chart
                const chartContainer = ihkCard.querySelector('.chart-container > div');
                const cardTitleElement = ihkCard.querySelector('.card-title');
                const computedStyle = window.getComputedStyle(cardTitleElement);
                const lineColor = computedStyle.backgroundColor;

                const chartData = ihkData.map(item => [item['Bulan'], item['Inflasi YoY']]);

                if (chartContainer) {
                    renderChart(chartContainer, lineColor, chartData);
                }
            }
        }

        // Inflasi Ytd
        if (data && data.length > 0) {
            const ihkData = data.slice(0,6);
            const ihkCard = document.querySelector('.metric-card.card-color-4'); // Adjust selector if needed

            if (ihkCard) {
                // Update value and description
                ihkCard.querySelector('.card-value').textContent = ihkData[0]['Inflasi YtD'] + '%'; // Assuming the latest value is in the first row, "Inflasi YtD" column
                ihkCard.querySelector('.card-description a').textContent = ihkData[0]['Bulan']; // Assuming the latest date is in the first row, "Bulan" column

                // Update chart
                const chartContainer = ihkCard.querySelector('.chart-container > div');
                const cardTitleElement = ihkCard.querySelector('.card-title');
                const computedStyle = window.getComputedStyle(cardTitleElement);
                const lineColor = computedStyle.backgroundColor;

                const chartData = ihkData.map(item => [item['Bulan'], item['Inflasi YtD']]);

                if (chartContainer) {
                    renderChart(chartContainer, lineColor, chartData);
                }
            }
        }
    };

    // Call the function to fetch and update data
    fetchDataAndUpdate();

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