import streamlit as st 
import streamlit.components.v1 as stc 
import pandas as pd 
import pygwalker as pyg
import openpyxl
import plotly.express as px
import plotly.graph_objects as go 

# Page Configuration
st.set_page_config(page_title="Makro 32",layout="wide")

data = pd.read_excel('data/indikator32.xlsx')
df = pd.DataFrame(data)
df['Tahun'] = df['Tahun'].astype(str)
dfjabar = df[df['Wilayah'] == 'Provinsi Jawa Barat']
dfkabkot = df[df['Wilayah'] != 'Provinsi Jawa Barat']
dfkabkot2022 = dfkabkot[dfkabkot['Tahun'] == '2022']
tahun = df['Tahun'].unique()
variabel = dfjabar.columns.to_list()
wilayah = dfkabkot['Wilayah'].unique()

def main():
    st.title("Indikator Makro Jawa Barat")
    
    st.success("Series Indikator Makro Jawa Barat, Silakan memilih Indikator")
    kol1, kol2, kol3 = st.columns(3)
    
    with kol1:
        pilihan_variabel = st.multiselect("Pilih Indikator:", variabel, key='kol1jabar')
        st.bar_chart(dfjabar, x='Tahun', y=pilihan_variabel)
    with kol2:
        pilihan_variabel = st.multiselect("Pilih Indikator:", variabel, key='kol2jabar')
        st.line_chart(dfjabar, x='Tahun', y=pilihan_variabel)
    with kol3:
        pilihan_variabel = st.multiselect("Pilih Indikator:", variabel, key='kol3jabar')
        fig1 = px.scatter(dfjabar, x='Tahun', y=pilihan_variabel, size_max=60)
        st.plotly_chart(fig1, use_container_width=True)
    
    # Kabkot
    st.warning("Series Indikator Makro Kabupaten/Kota, Silakan memilih Wilayah dan Indikator")
    pilih_kabkot = st.selectbox("Pilih Wilayah:", wilayah, key='wilayah')
    
    kol1, kol2, kol3 = st.columns(3)
    
    with kol1:
        pilihan_variabel = st.multiselect("Pilih Indikator:", variabel, key='kol1kabkot')
        st.bar_chart(dfkabkot[dfkabkot['Wilayah'] == pilih_kabkot], x='Tahun', y=pilihan_variabel)
    with kol2:
        pilihan_variabel = st.multiselect("Pilih Indikator:", variabel, key='kol2kabkot')
        st.line_chart(dfkabkot[dfkabkot['Wilayah'] == pilih_kabkot], x='Tahun', y=pilihan_variabel)
    with kol3:
        pilihan_variabel = st.multiselect("Pilih Indikator:", variabel, key='kol3kabkot')
        fig2 = px.scatter(dfkabkot[dfkabkot['Wilayah'] == pilih_kabkot], x='Tahun', y=pilihan_variabel, size_max=60)
        st.plotly_chart(fig2, use_container_width=True)
    
    st.subheader("Jawa Barat menurut Kabupaten Kota")
    st.info("Silakan Memilih Tahun Data")
    kol1, kol2 = st.columns(2)
    with kol1:
        pilih_tahun = st.selectbox("Pilih tahun:", tahun, key='pie')
        fig3 = px.pie(dfkabkot[dfkabkot['Tahun'] == pilih_tahun], values='Penduduk', names='Wilayah', title=f"Distribusi Penduduk, {pilih_tahun}")
        st.plotly_chart(fig3, use_container_width=True)
    with kol2:
        pilih_tahun = st.selectbox("Pilih tahun:", tahun, key='scatter')

        data_filter_tahun = df[df['Tahun'] == pilih_tahun]

        fig4 = px.scatter(
            data_filter_tahun,
            x="pdrbperkapita",
            y="Usia Harapan Hidup (Tahun)",
            size="Penduduk",
            color="Koordinasi",
            hover_name="Wilayah",
            log_x=True,
            size_max=90,
            title=f"PDRB Perkapita - Usia Harapan Hidup, {pilih_tahun}",
        )
        st.plotly_chart(fig4, use_container_width=True)
    # with kol3:
    #     st.write("Jumlah Penduduk Miskin 2022 (000)")
    #     st.bar_chart(dfkabkot2022, x='Wilayah', y='Jumlah Penduduk Miskin (000)')
    
    with st.expander("**Tabel Lengkap:**"):
        st.write(df, hide_index=True, user_container_width=True)
    
    # Visualize
    with st.expander("**Silakan melakukan Visualisasi Sesuka Hati**"):
        st.write("Petunjuk: Silakan berkreasi dengan menentukan Sumbu X, Sumbu Y, Filter, Color dan Size. Cukup dengan drag variabel. Output grafik bisa diunduh menjadi file gambar, dan juga tabel csv.")
        pyg_html = pyg.walk(df,return_html=True)
        # Render with components
        stc.html(pyg_html,scrolling=True,height=1000)
    
    kol1, kol2, kol4 = st.columns(3)
    with kol1:
        with st.expander("Metadata"):
            stc.iframe('https://sirusa.web.bps.go.id/', height=500)
            st.link_button(label='SiRuSa', url='https://sirusa.bps.go.id')
            st.link_button(label='Indah', url='https://indah.bps.go.id/standar-data-statistik-nasional')
    with kol2:        
        with st.expander("Sumber Data"):
            stc.iframe('https://jabar.bps.go.id/site/pilihdata.html', height=500)
            kol1, kol2, kol3 = st.columns(3)
            with kol1:
                st.link_button(label='BPS Jabar', url='https://jabar.bps.go.id')
            with kol2:
                st.link_button(label='Web Sensus', url='https://sensus.bps.go.id') 
            with kol3:
                st.link_button(label='Open Data', url='https://opendata.jabarprov.go.id/id/dataset')
    with kol4:
        with st.expander("Glosarium"):
            st.write("Standar Data")
    
if __name__ == "__main__":
    main()
