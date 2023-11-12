import streamlit as st 
import streamlit.components.v1 as stc 
import pandas as pd 
import pygwalker as pyg
import openpyxl 

# Page Configuration
st.set_page_config(page_title="Makro 32",layout="wide")

data = pd.read_excel('data/indikator32.xlsx')
df = pd.DataFrame(data)
df['Tahun'] = df['Tahun'].astype(str)

dfjabar = df[df['Wilayah'] == 'Provinsi Jawa Barat']
dfkabkot = df[df['Wilayah'] != 'Provinsi Jawa Barat']

def main():
    st.title("Indikator Makro Jawa Barat")
    kol1, kol2, kol3 = st.columns(3)
    
    with kol1:
        st.write("Jumlah Penduduk")
        st.bar_chart(dfjabar, x='Tahun', y='Penduduk')
    with kol2:
        st.write("Garis Kemiskinan")
        st.line_chart(dfjabar, x='Tahun', y='Garis Kemiskinan (Rp/Kapita/Bulan)')
    with kol3:
        st.write("Jumlah Penduduk Miskin (000)")
        st.bar_chart(dfjabar, x='Tahun', y='Jumlah Penduduk Miskin (000)')
    
    with st.expander("**Tabel Lengkap:**"):
        st.write(df, hide_index=True, user_container_width=True)
    
    # Visualize
    with st.expander("**Silakan melakukan Visualisasi Sesuka Hati**"):
        st.write("Petunjuk: Silakan berkreasi dengan menentukan Sumbu X, Sumbu Y, Filter, Color dan Size. Cukup dengan drag variabel. Output grafik bisa diunduh menjadi file gambar, dan juga tabel csv.")
        pyg_html = pyg.walk(df,return_html=True)
        # Render with components
        stc.html(pyg_html,scrolling=True,height=1000)
    kol1, kol2 = st.columns(2)
    with kol1:
        with st.expander("Metadata"):
            stc.iframe('https://sirusa.web.bps.go.id/', height=500)
    with kol2:        
        with st.expander("Sumber Data"):
            stc.iframe('https://jabar.bps.go.id/site/pilihdata.html', height=500)
            kol1, kol2, kol3 = st.columns(3)
            with kol1:
                st.link_button(label='BPS Jawa Barat', url='https://jabar.bps.go.id')
            with kol2:
                st.link_button(label='Web Sensus', url='https://sensus.bps.go.id') 
            with kol3:
                st.link_button(label='Open Data Jabar', url='https://opendata.jabarprov.go.id/id/dataset')
        
if __name__ == "__main__":
    main()