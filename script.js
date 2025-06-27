// Remove Chart.js imports
// import { Chart, registerables } from 'chart.js';

// No need to register components for ApexCharts when loaded globally
// Chart.register(...registerables);

document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard script loaded!');

    const metricCards = document.querySelectorAll('.metric-card');

    // Function to render charts
    const renderChart = (chartContainer, lineColor, baseValue, variance) => {
        const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const data = labels.map((_, i) => {
            return parseFloat((baseValue + (Math.random() - 0.5) * variance * (i / labels.length + 0.5)).toFixed(2));
        });

        const options = {
            chart: {
                type: 'line',
                height: '100%',
                width: '100%',
                toolbar: {
                    show: false // Hide chart toolbar (zoom, pan, download, etc.)
                },
                sparkline: { // Use sparkline mode for minimal chart
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
                show: false, // Hide grid lines
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

        // Use the globally available ApexCharts constructor
        new ApexCharts(chartContainer, options).render();
    };

    // Initialize all charts initially (even if hidden in accordion, ApexCharts handles this fine)
    metricCards.forEach((card) => {
        const chartContainer = card.querySelector('.chart-container > div'); // Select the div element which is the actual chart container
        const cardTitleElement = card.querySelector('.card-title');

        // Ensure chartContainer exists and has an ID
        if (chartContainer && cardTitleElement && chartContainer.id) {
            const chartId = chartContainer.id; // Get the actual ID from the HTML element
            const computedStyle = window.getComputedStyle(cardTitleElement);
            const lineColor = computedStyle.backgroundColor;

            let baseValue;
            let variance;
            
            // Map the actual chart ID to the specific metric for data generation
            switch (chartId) {
                case 'chart1': // IHK
                    baseValue = 108.38; variance = 0.5; break;
                case 'chart2': // Inflasi MtM
                    baseValue = -0.32; variance = 0.2; break;
                case 'chart3': // Inflasi YoY
                    baseValue = 1.47; variance = 0.5; break;
                case 'chart4': // Inflasi YtD
                    baseValue = 0.98; variance = 0.3; break;
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
                case 'chart14': // Kum Ekspor (Miliar USD)
                    baseValue = 1.8; variance = 0.2; break;
                case 'chart15': // Nilai Impor (Miliar USD)
                    baseValue = 1.8; variance = 0.2; break;
                case 'chart16': // Neraca Perdagangan
                    baseValue = 0.7; variance = 0.5; break; // Approx. Ekspor - Impor
                case 'chart17': // TPAK (%)
                    baseValue = 68.20; variance = 0.5; break;
                case 'chart18': // IHPB
                    baseValue = 112.50; variance = 1.0; break;
                case 'chart19': // Penduduk Miskin (Ribu Jiwa)
                    baseValue = 4000; variance = 200; break;
                default:
                    baseValue = 100; variance = 5;
            }
            renderChart(chartContainer, lineColor, baseValue, variance);
        }
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