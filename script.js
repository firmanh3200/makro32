const csvUrl = 'URL_FILE_CSV_ANDA'; // Ganti dengan URL file CSV Anda di GitHub

async function fetchData() {
  try {
    const response = await fetch(csvUrl);
    const csvData = await response.text();
    return processData(csvData);
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

function processData(csvData) {
  const lines = csvData.split('\n');
  const headers = lines[0].split(','); // Asumsi header ada di baris pertama
  const data = [];

  // Mulai dari baris kedua (indeks 1) untuk data
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length === headers.length) {
      const entry = {};
      for (let j = 0; j < headers.length; j++) {
        entry[headers[j].trim()] = values[j].trim(); // trim untuk menghilangkan whitespace
      }
      data.push(entry);
    }
  }

  // Ambil tahun dan bulan dari data baris pertama (data terbaru)
  if (data.length > 0) {
    const latestYear = data[0].tahun;
    const latestMonth = data[0].bulan;

    // Filter data untuk hanya mendapatkan entri yang sesuai dengan tahun dan bulan terbaru
    const latestData = data.filter(item => item.tahun === latestYear && item.bulan === latestMonth);
    return latestData;

  } else {
    console.warn('No data found in CSV file.');
    return null;
  }
}

function updateDashboard(latestData) {
  if (!latestData || latestData.length === 0) {
    console.warn('No data found for the latest month.');
    return;
  }

  const inflasiMtm = latestData.find(item => item.indikator === 'Inflasi MtM')?.nilai || '-';
  const inflasiYoY = latestData.find(item => item.indikator === 'Inflasi YoY')?.nilai || '-';
  const inflasiYtd = latestData.find(item => item.indikator === 'Inflasi YtD')?.nilai || '-';
  const ihk = latestData.find(item => item.indikator === 'Indeks Harga Konsumen')?.nilai || '-';

  document.getElementById('inflasi-mtm').textContent = inflasiMtm;
  document.getElementById('inflasi-yoy').textContent = inflasiYoY;
  document.getElementById('inflasi-ytd').textContent = inflasiYtd;
  document.getElementById('ihk').textContent = ihk;

    // Dapatkan tahun dan bulan dari data pertama
    const year = latestData[0].tahun;
    const month = latestData[0].bulan;
    document.getElementById('last-updated').textContent = `Data terakhir diperbarui: ${year}-${month}`;
}

// Panggil fungsi untuk mengambil dan menampilkan data saat halaman dimuat
window.onload = async () => {
  const latestData = await fetchData();
  if (latestData) {
    updateDashboard(latestData);
  }
};