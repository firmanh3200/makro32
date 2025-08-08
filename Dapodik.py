import streamlit as st
import pandas as pd
import requests
import xlsxwriter
import lxml
import openpyxl
from bs4 import BeautifulSoup
from datetime import datetime

st.set_page_config(layout="wide")

# Ambil tanggal hari ini
tanggal_hari_ini = datetime.now().strftime("%d-%m-%Y")

st.subheader('Direktori Sekolah di Bawah Kemendikbud', divider='orange')
st.warning('Sumber: https://dapo.kemdikbud.go.id')

pilihan = ['Jawa Barat', 'Bogor', 'Sukabumi', 'Cianjur', 'Bandung', 'Garut', 'Tasikmalaya', 'Ciamis',
           'Kuningan', 'Cirebon', 'Majalengka', 'Sumedang', 'Indramayu', 'Subang', 'Purwakarta',
           'Karawang', 'Bekasi', 'Bandung Barat', 'Pangandaran', 'Kota Bogor', 'Kota Sukabumi',
           'Kota Bandung', 'Kota Cirebon', 'Kota Bekasi', 'Kota Depok', 'Kota Cimahi',
           'Kota Tasikmalaya', 'Kota Banjar']

wilayah = st.selectbox("Pilih Wilayah", pilihan, key='pilihan')

# Tentukan kode berdasarkan pilihan wilayah
kode_dict = {
    'Jawa Barat': '020000',
    'Bogor': '020500',
    'Sukabumi': '020600',
    'Cianjur': '020700', 
    'Bandung': '020800', 
    'Garut': '021100', 
    'Tasikmalaya': '021200', 
    'Ciamis': '021400',
    'Kuningan': '021500', 
    'Cirebon': '021700', 
    'Majalengka': '021600', 
    'Sumedang': '021000', 
    'Indramayu': '021800', 
    'Subang': '021900', 
    'Purwakarta': '022000',
    'Karawang': '022100', 
    'Bekasi': '022200', 
    'Bandung Barat': '022300', 
    'Pangandaran': '022500', 
    'Kota Bogor': '026100', 
    'Kota Sukabumi': '026200',
    'Kota Bandung': '026000', 
    'Kota Cirebon': '026300', 
    'Kota Bekasi': '026500', 
    'Kota Depok': '026600', 
    'Kota Cimahi': '026700',
    'Kota Tasikmalaya': '026800', 
    'Kota Banjar': '026900'
}

kode = kode_dict.get(wilayah, 'default_kode')

kodekab = kode[:4]

# PAUD
with st.expander('PAUD'):
    st.warning(f"Sumber: referensi.data.kemdikbud.go.id, Kondisi: {tanggal_hari_ini}")
    
    if wilayah == 'Jawa Barat':
        with st.container(border=True):
            # Ambil data dari URL
            url = 'https://referensi.data.kemdikbud.go.id/pendidikan/paud'
            response = requests.get(url)
            soup = BeautifulSoup(response.content, 'html.parser')

            # Temukan tabel dalam HTML
            table = soup.find('table')
            df = pd.read_html(str(table))[0]
            
            st.dataframe(df, use_container_width=True, hide_index=True)
            
            url2 = 'https://referensi.data.kemdikbud.go.id/pendidikan/paud/020000/1/all/all/all'
            response2 = requests.get(url2)
            soup2 = BeautifulSoup(response2.content, 'html.parser')

            # Temukan tabel dalam HTML
            table2 = soup2.find('table')
            df2 = pd.read_html(str(table2))[0]
            
            st.dataframe(df2, use_container_width=True, hide_index=True)

        st.subheader("", divider='green')
    else:
        st.warning(f'DIREKTORI PAUD DI {wilayah}')
        
        url = f'https://referensi.data.kemdikbud.go.id/pendidikan/paud/{kode}/2'
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')

        # Temukan tabel dalam HTML
        table = soup.find('table')
        df = pd.read_html(str(table))[0]
        
        st.dataframe(df, use_container_width=True, hide_index=True)
        
        st.subheader("", divider='orange')
        
        data = pd.read_csv('https://raw.githubusercontent.com/firmanh3200/makro32/refs/heads/main/dapodik/kodedikbud.csv', dtype={'kodekec':'str'})
        kecterpilih = st.selectbox('Pilih Kecamatan', data[data['kode'] == kodekab]['namakec'], key='kec01')
        kodeterpilih = data.loc[data['namakec'] == kecterpilih, 'kodekec'].values[0]
        
        url2 = f'https://referensi.data.kemdikbud.go.id/pendidikan/paud/{kodekab}{kodeterpilih}/3'
        response2 = requests.get(url2)
        soup2 = BeautifulSoup(response2.content, 'html.parser')

        # Temukan tabel dalam HTML
        table2 = soup2.find('table')
        df2 = pd.read_html(str(table2))[0]
        
        st.dataframe(df2, use_container_width=True, hide_index=True)
        
        desa = df2['Kelurahan'].unique()
        desaterpilih = st.selectbox("Pilih Desa/Kelurahan", desa, key='desa01')
        
        if desaterpilih:
            df3 = df2[df2['Kelurahan'] == desaterpilih]
            df3 = df3[['Kelurahan', 'Nama Satuan Pendidikan', 'Status', 'Alamat', 'NPSN']]
            st.dataframe(df3, use_container_width=True, hide_index=True)

# DIKDAS
with st.expander('PENDIDIKAN DASAR'):
    
    if wilayah == 'Jawa Barat':
        st.warning(f"Sumber: referensi.data.kemdikbud.go.id, Kondisi: {tanggal_hari_ini}")
    
        with st.container(border=True):
            # Ambil data dari URL
            url = 'https://referensi.data.kemdikbud.go.id/pendidikan/dikdas'
            response = requests.get(url)
            soup = BeautifulSoup(response.content, 'html.parser')

            # Temukan tabel dalam HTML
            table = soup.find('table')
            df = pd.read_html(str(table))[0]
            
            st.dataframe(df, use_container_width=True, hide_index=True)
        
        url2 = 'https://referensi.data.kemdikbud.go.id/pendidikan/dikdas/020000/1/all/all/all'
        response2 = requests.get(url2)
        soup2 = BeautifulSoup(response2.content, 'html.parser')

        # Temukan tabel dalam HTML
        table2 = soup2.find('table')
        df2 = pd.read_html(str(table2))[0]
        
        st.dataframe(df2, use_container_width=True, hide_index=True)


    else:
        st.warning(f'Direktori Pendidikan Dasar di {wilayah}')
        url = f'https://referensi.data.kemdikbud.go.id/pendidikan/dikdas/{kode}/2'
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')

        # Temukan tabel dalam HTML
        table = soup.find('table')
        df = pd.read_html(str(table))[0]
        
        st.dataframe(df, use_container_width=True, hide_index=True)
        
        st.subheader("", divider='orange')
        
        data = pd.read_csv('https://raw.githubusercontent.com/firmanh3200/makro32/refs/heads/main/dapodik/kodedikbud.csv', dtype={'kodekec':'str'})
        kecterpilih = st.selectbox('Pilih Kecamatan', data[data['kode'] == kodekab]['namakec'], key='kec02')
        kodeterpilih = data.loc[data['namakec'] == kecterpilih, 'kodekec'].values[0]
        
        url2 = f'https://referensi.data.kemdikbud.go.id/pendidikan/dikdas/{kodekab}{kodeterpilih}/3'
        response2 = requests.get(url2)
        soup2 = BeautifulSoup(response2.content, 'html.parser')

        # Temukan tabel dalam HTML
        table2 = soup2.find('table')
        df2 = pd.read_html(str(table2))[0]
        df2 = df2.sort_values(by='Kelurahan')
        
        st.dataframe(df2, use_container_width=True, hide_index=True)
        
        desa = df2['Kelurahan'].unique()
        desaterpilih = st.selectbox("Pilih Desa/Kelurahan", desa, key='desa02')
        
        if desaterpilih:
            df3 = df2[df2['Kelurahan'] == desaterpilih]
            df3 = df3[['Kelurahan', 'Nama Satuan Pendidikan', 'Status', 'Alamat', 'NPSN']]
            st.dataframe(df3, use_container_width=True, hide_index=True)
            
# DIKMEN
with st.expander('PENDIDIKAN MENENGAH'):
    if wilayah == 'Jawa Barat':
        st.warning(f"Sumber: referensi.data.kemdikbud.go.id, Kondisi: {tanggal_hari_ini}")
    
        with st.container(border=True):
            # Ambil data dari URL
            url = 'https://referensi.data.kemdikbud.go.id/pendidikan/dikmen'
            response = requests.get(url)
            soup = BeautifulSoup(response.content, 'html.parser')

            # Temukan tabel dalam HTML
            table = soup.find('table')
            df = pd.read_html(str(table))[0]
            
            st.dataframe(df, use_container_width=True, hide_index=True)
        
        url2 = 'https://referensi.data.kemdikbud.go.id/pendidikan/dikmen/020000/1/all/all/all'
        response2 = requests.get(url2)
        soup2 = BeautifulSoup(response2.content, 'html.parser')

        # Temukan tabel dalam HTML
        table2 = soup2.find('table')
        df2 = pd.read_html(str(table2))[0]
        
        st.dataframe(df2, use_container_width=True, hide_index=True)


    else:
        st.warning(f'DIREKTORI PENDIDIKAN MENENGAH DI {wilayah}')
        
        url = f'https://referensi.data.kemdikbud.go.id/pendidikan/dikmen/{kode}/2'
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')

        # Temukan tabel dalam HTML
        table = soup.find('table')
        df = pd.read_html(str(table))[0]
        
        st.dataframe(df, use_container_width=True, hide_index=True)
        
        st.subheader("", divider='orange')
        
        data = pd.read_csv('https://raw.githubusercontent.com/firmanh3200/makro32/refs/heads/main/dapodik/kodedikbud.csv', dtype={'kodekec':'str'})
        kecterpilih = st.selectbox('Pilih Kecamatan', data[data['kode'] == kodekab]['namakec'], key='kec03')
        kodeterpilih = data.loc[data['namakec'] == kecterpilih, 'kodekec'].values[0]
        
        url2 = f'https://referensi.data.kemdikbud.go.id/pendidikan/dikmen/{kodekab}{kodeterpilih}/3'
        response2 = requests.get(url2)
        soup2 = BeautifulSoup(response2.content, 'html.parser')

        # Temukan tabel dalam HTML
        table2 = soup2.find('table')
        df2 = pd.read_html(str(table2))[0]
        
        st.dataframe(df2, use_container_width=True, hide_index=True)
        
        desa = df2['Kelurahan'].unique()
        desaterpilih = st.selectbox("Pilih Desa/Kelurahan", desa, key='desa03')
        
        if desaterpilih:
            df3 = df2[df2['Kelurahan'] == desaterpilih]
            df3 = df3[['Kelurahan', 'Nama Satuan Pendidikan', 'Status', 'Alamat', 'NPSN']]
            st.dataframe(df3, use_container_width=True, hide_index=True)
            
# DIKTI
with st.expander('PENDIDIKAN TINGGI'):
    st.warning(f"Sumber: referensi.data.kemdikbud.go.id, Kondisi: {tanggal_hari_ini}")
    if wilayah == 'Jawa Barat':
        with st.container(border=True):
            # Ambil data dari URL
            url = 'https://referensi.data.kemdikbud.go.id/pendidikan/dikti'
            response = requests.get(url)
            soup = BeautifulSoup(response.content, 'html.parser')

            # Temukan tabel dalam HTML
            table = soup.find('table')
            df = pd.read_html(str(table))[0]
            
            st.dataframe(df, use_container_width=True, hide_index=True)
        st.subheader("", divider='green')
        
        url2 = 'https://referensi.data.kemdikbud.go.id/pendidikan/dikti/020000/1/all/all/all'
        response2 = requests.get(url2)
        soup2 = BeautifulSoup(response2.content, 'html.parser')

        # Temukan tabel dalam HTML
        table2 = soup2.find('table')
        df2 = pd.read_html(str(table2))[0]
        
        st.dataframe(df2, use_container_width=True, hide_index=True)
    
    else:
        st.warning(f'DIREKTORI PENDIDIKAN TINGGI di {wilayah}')
        url = f'https://referensi.data.kemdikbud.go.id/pendidikan/dikti/{kode}/2'
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')

        # Temukan tabel dalam HTML
        table = soup.find('table')
        df = pd.read_html(str(table))[0]
        
        st.dataframe(df, use_container_width=True, hide_index=True)
        
        st.subheader("", divider='orange')
        
        data = pd.read_csv('https://raw.githubusercontent.com/firmanh3200/makro32/refs/heads/main/dapodik/kodedikbud.csv', dtype={'kodekec':'str'})
        kecterpilih = st.selectbox('Pilih Kecamatan', 
                                   data[data['kode'] == kodekab]['namakec'], 
                                   key='kec04')
        kodeterpilih = data.loc[data['namakec'] == kecterpilih, 'kodekec'].values[0]
        
        url2 = f'https://referensi.data.kemdikbud.go.id/pendidikan/dikti/{kodekab}{kodeterpilih}/3'
        response2 = requests.get(url2)
        soup2 = BeautifulSoup(response2.content, 'html.parser')

        # Temukan tabel dalam HTML
        table2 = soup2.find('table')
        df2 = pd.read_html(str(table2))[0]
        
        st.dataframe(df2, use_container_width=True, hide_index=True)
        
        desa = df2['Kelurahan'].unique()
        desaterpilih = st.selectbox("Pilih Desa/Kelurahan", desa, key='desa04')
        
        if desaterpilih:
            df3 = df2[df2['Kelurahan'] == desaterpilih]
            df3 = df3[['Kelurahan', 'Nama Satuan Pendidikan', 'Status', 'Alamat', 'NPSN']]
            st.dataframe(df3, use_container_width=True, hide_index=True)
            
# DIKMAS
with st.expander('PENDIDIKAN MASYARAKAT'):
    if wilayah == 'Jawa Barat':
        st.warning(f"Sumber: referensi.data.kemdikbud.go.id, Kondisi: {tanggal_hari_ini}")
    
        with st.container(border=True):
            # Ambil data dari URL
            url = 'https://referensi.data.kemdikbud.go.id/pendidikan/dikmas'
            response = requests.get(url)
            soup = BeautifulSoup(response.content, 'html.parser')

            # Temukan tabel dalam HTML
            table = soup.find('table')
            df = pd.read_html(str(table))[0]
            
            st.dataframe(df, use_container_width=True, hide_index=True)

        st.subheader("", divider='green')
        
        url2 = 'https://referensi.data.kemdikbud.go.id/pendidikan/dikmas/020000/1/jn/all/all'
        response2 = requests.get(url2)
        soup2 = BeautifulSoup(response2.content, 'html.parser')

        # Temukan tabel dalam HTML
        table2 = soup2.find('table')
        df2 = pd.read_html(str(table2))[0]
        
        st.dataframe(df2, use_container_width=True, hide_index=True)

    else:
        url = f'https://referensi.data.kemdikbud.go.id/pendidikan/dikmas/{kode}/2'
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')

        # Temukan tabel dalam HTML
        table = soup.find('table')
        df = pd.read_html(str(table))[0]
        
        st.dataframe(df, use_container_width=True, hide_index=True)
        
        st.subheader("", divider='orange')
        
        data = pd.read_csv('https://raw.githubusercontent.com/firmanh3200/makro32/refs/heads/main/dapodik/kodedikbud.csv', dtype={'kodekec':'str'})
        kecterpilih = st.selectbox('Pilih Kecamatan', data[data['kode'] == kodekab]['namakec'], key='kec05')
        kodeterpilih = data.loc[data['namakec'] == kecterpilih, 'kodekec'].values[0]
        
        url2 = f'https://referensi.data.kemdikbud.go.id/pendidikan/dikmas/{kodekab}{kodeterpilih}/3'
        response2 = requests.get(url2)
        soup2 = BeautifulSoup(response2.content, 'html.parser')

        # Temukan tabel dalam HTML
        table2 = soup2.find('table')
        df2 = pd.read_html(str(table2))[0]
        
        st.dataframe(df2, use_container_width=True, hide_index=True)
        
        desa = df2['Kelurahan'].unique()
        desaterpilih = st.selectbox("Pilih Desa/Kelurahan", desa, key='desa05')
        
        if desaterpilih:
            df3 = df2[df2['Kelurahan'] == desaterpilih]
            df3 = df3[['Kelurahan', 'Nama Satuan Pendidikan', 'Status', 'Alamat', 'NPSN']]
            st.dataframe(df3, use_container_width=True, hide_index=True)
        
# YAYASAN
with st.expander('YAYASAN PENDIDIKAN'):
    if wilayah == 'Jawa Barat':
        st.warning(f"Sumber: referensi.data.kemdikbud.go.id, Kondisi: {tanggal_hari_ini}")
    
        with st.container(border=True):
            # Ambil data dari URL
            url = 'https://referensi.data.kemdikbud.go.id/pendidikan/yayasan'
            response = requests.get(url)
            soup = BeautifulSoup(response.content, 'html.parser')

            # Temukan tabel dalam HTML
            table = soup.find('table')
            df = pd.read_html(str(table))[0]
            
            st.dataframe(df, use_container_width=True, hide_index=True)
        st.subheader("", divider='green')
        
        # Ambil data dari URL
        url2 = 'https://referensi.data.kemdikbud.go.id/pendidikan/yayasan/020000/1'
        response2 = requests.get(url2)
        soup2 = BeautifulSoup(response2.content, 'html.parser')

        # Temukan tabel dalam HTML
        table2 = soup2.find('table')
        df2 = pd.read_html(str(table2))[0]
        
        st.dataframe(df2, use_container_width=True, hide_index=True)

    else:
        url = f'https://referensi.data.kemdikbud.go.id/pendidikan/yayasan/{kode}/2'
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')

        # Temukan tabel dalam HTML
        table = soup.find('table')
        df = pd.read_html(str(table))[0]
        
        st.dataframe(df, use_container_width=True, hide_index=True)
        
        st.subheader("", divider='orange')
        
        data = pd.read_csv('https://raw.githubusercontent.com/firmanh3200/makro32/refs/heads/main/dapodik/kodedikbud.csv', dtype={'kodekec':'str'})
        kecterpilih = st.selectbox('Pilih Kecamatan', data[data['kode'] == kodekab]['namakec'], key='kec06')
        kodeterpilih = data.loc[data['namakec'] == kecterpilih, 'kodekec'].values[0]
        
        url2 = f'https://referensi.data.kemdikbud.go.id/pendidikan/yayasan/{kodekab}{kodeterpilih}/3'
        response2 = requests.get(url2)
        soup2 = BeautifulSoup(response2.content, 'html.parser')

        # Temukan tabel dalam HTML
        table2 = soup2.find('table')
        df2 = pd.read_html(str(table2))[0]
        
        st.dataframe(df2, use_container_width=True, hide_index=True)
        
        desa = df2['Kelurahan'].unique()
        desaterpilih = st.selectbox("Pilih Desa/Kelurahan", desa, key='desa06')
        
        if desaterpilih:
            df3 = df2[df2['Kelurahan'] == desaterpilih]
            df3 = df3[['Kelurahan', 'Nama Yayasan', 'Alamat', 'NPYP']]
            st.dataframe(df3, use_container_width=True, hide_index=True)