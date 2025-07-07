// Fungsi untuk mengambil data CSV dari URL
async function fetchData(url) {
    try {
        const response = await fetch(url);
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
    const headers = lines[0].split(","); // Ambil header
    const data = [];

    for (let i = 1; i < lines.length; i++) { // Mulai dari baris kedua (setelah header)
        const values = lines[i].split(",");
        if (values.length === headers.length) { // Validasi jumlah kolom
            const entry = {};
            for (let j = 0; j < headers.length; j++) {
                entry[headers[j].trim()] = values[j].trim(); // trim untuk menghilangkan whitespace
            }
            data.push(entry);
        }
    }
    return data;
}


// Fungsi untuk membuat metric card dan line chart
function createMetricCard(containerId, title, value, bulan, chartData, chartLabels) {
    const container = document.getElementById(containerId);  //Contoh dengan DOM API biasa
    if (!container) {
        console.error(`Container with ID "${containerId}" not found.`);
        return;
    }

    // Bersihkan container (jika sudah ada isinya)
    container.innerHTML = "";

    // Judul Metric Card
    const titleElement = document.createElement("h2");
    titleElement.textContent = title;
    container.appendChild(titleElement);

    // Elemen untuk menampilkan nilai metric
    const valueElement = document.createElement("div");
    valueElement.textContent = value;
    valueElement.classList.add("value"); // Tambahkan class CSS
    container.appendChild(valueElement);

    // Elemen untuk menampilkan bulan (keterangan)
    const bulanElement = document.createElement("div");
    bulanElement.textContent = `Bulan: ${bulan}`;
    bulanElement.classList.add("bulan"); // Tambahkan class CSS
    container.appendChild(bulanElement);


    //Elemen Canvas untuk Chart
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);

    // Inisialisasi Chart.js (atau library charting pilihan Anda)
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartLabels,
            datasets: [{
                label: title,
                data: chartData,
                borderColor: 'blue',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}




// Main function
async function main() {
    const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTOIH0Dl54f6EKAHvwY5eMjstluFPNWXX-erkrDXlGcVMRDFZDGUdUjxtgzyD7qJWf-KX9GZ_UxVmx5/pub?gid=0&single=true&output=csv";
    const csvText = await fetchData(url);

    if (csvText) {
        const data = parseCSV(csvText);

        if (data.length > 0) {
            // Ambil data terbaru (baris pertama setelah header)
            const latestData = data[0];
            const bulan = latestData["Bulan"];

            // Ambil 5 bulan terakhir untuk chart
            const lastFiveMonths = data.slice(0, 5); //Ambil 5 data teratas.  Perhatikan urutannya mungkin terbalik.
            const chartLabels = lastFiveMonths.map(item => item["Bulan"]); //Ambil label bulan
            // Pastikan data chart terurut dengan benar.  Jika data dari CSV terbalik, perlu dibalik.
            chartLabels.reverse();

            // Ekstrak data untuk chart
            const ihkChartData = lastFiveMonths.map(item => parseFloat(item["IHK"]));
            const inflasiMtMChartData = lastFiveMonths.map(item => parseFloat(item["Inflasi MtM"]));
            const inflasiYoYChartData = lastFiveMonths.map(item => parseFloat(item["Inflasi YoY"]));
            const inflasiYtdChartData = lastFiveMonths.map(item => parseFloat(item["Inflasi YtD"]));

            ihkChartData.reverse(); //Balik urutan data jika perlu
            inflasiMtMChartData.reverse();
            inflasiYoYChartData.reverse();
            inflasiYtdChartData.reverse();



            // Buat metric cards
            createMetricCard("ihk-metric", "IHK", latestData["IHK"], bulan, ihkChartData, chartLabels);
            createMetricCard("inflasi-mtm-metric", "Inflasi MtM", latestData["Inflasi MtM"], bulan, inflasiMtMChartData, chartLabels);
            createMetricCard("inflasi-yoy-metric", "Inflasi YoY", latestData["Inflasi YoY"], bulan, inflasiYoYChartData, chartLabels);
            createMetricCard("inflasi-ytd-metric", "Inflasi YtD", latestData["Inflasi YtD"], bulan, inflasiYtdChartData, chartLabels);


        } else {
            console.warn("No data found in the CSV file.");
        }
    }
}

// Panggil fungsi main saat halaman dimuat
window.onload = main;