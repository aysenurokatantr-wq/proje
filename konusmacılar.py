from docx import Document
from docx.shared import Pt, RGBColor, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

doc = Document()

# Title
title = doc.add_heading('5. TÜBİTEM Zirvesi – Konuşmacı Listesi', 0)
title.alignment = WD_ALIGN_PARAGRAPH.CENTER

subtitle = doc.add_paragraph('9–10 Temmuz 2026 | Müzeyyen Erkul Gaziantep Bilim Merkezi')
subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
subtitle.runs[0].bold = True

doc.add_paragraph()

speakers = [
    {
        "name": "Prof. Dr. Orhan AYDIN",
        "role": "Açılış Konuşmacısı",
        "institution": "YÖK (Yükseköğretim Kurulu) Başkanı",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Orhan+Ayd%C4%B1n+Y%C3%96K",
        "session": "Açılış Konuşmaları"
    },
    {
        "name": "Fatma ŞAHİN",
        "role": "Açılış Konuşmacısı",
        "institution": "Gaziantep Büyükşehir Belediyesi Başkanı",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Fatma+%C5%9Eahin+Gaziantep",
        "session": "Açılış Konuşmaları"
    },
    {
        "name": "Mehmet Fatih KACIR",
        "role": "Açılış Konuşmacısı",
        "institution": "T.C. Sanayi ve Teknoloji Bakanlığı",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Mehmet+Fatih+Kac%C4%B1r",
        "session": "Açılış Konuşmaları"
    },
    {
        "name": "Ömer KÖKÇAM",
        "role": "TÜBİTAK Bilim ve Toplum Başkanı",
        "institution": "TÜBİTAK",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=%C3%96mer+K%C3%B6k%C3%A7am+T%C3%BCb%C4%B0TAK",
        "session": "Açılış – 13:30-14:00"
    },
    {
        "name": "Prof. Dr. Türker KILIÇ",
        "role": "Beyin Cerrahı / Davetli Konuşmacı",
        "institution": "İstinye Üniversitesi Tıp Fakültesi Dekanı",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=T%C3%BCrker+K%C4%B1l%C4%B1%C3%A7+%C4%B0stinye+%C3%9Cniversitesi",
        "session": "Özel Oturum-1 – 13:30-14:00"
    },
    {
        "name": "Doç. Dr. Özgür BOLAT",
        "role": "Eğitim Bilimci, Yazar, Danışman",
        "institution": "Cambridge Üniversitesi mezunu; Anne Baba Okulu / NTV",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=%C3%96zg%C3%BCr+Bolat+e%C4%9Fitim",
        "session": "Özel Oturum-2 – 14:00-14:45"
    },
    {
        "name": "Fuat SAMİ",
        "role": "Girişimci, LabX Kurucusu",
        "institution": "LabX / Imperial College London mezunu",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Fuat+Sami+LabX",
        "session": "Özel Oturum-3 – 15:00-15:45"
    },
    {
        "name": "Dr. Robert SEMPER",
        "role": "Bilim ve Eğitim Programları Direktörü",
        "institution": "Exploratorium (San Francisco, ABD)",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Robert+Semper+Exploratorium",
        "session": "1. Oturum: Bilim Merkezlerinin Toplumsal Rolüne Küresel Bakış – 16:00-17:00"
    },
    {
        "name": "Rosalia VARGAS",
        "role": "Portekiz Bilimsel ve Teknoloji Ajansı Başkanı",
        "institution": "Portekiz Bilimsel ve Teknoloji Ajansı / Ecsite",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Rosalia+Vargas+Portugal+Science",
        "session": "1. Oturum: Bilim Merkezlerinin Toplumsal Rolüne Küresel Bakış – 16:00-17:00"
    },
    {
        "name": "Sadullah UZUN",
        "role": "Millî Teknoloji Genel Müdürü (V.)",
        "institution": "T.C. Sanayi ve Teknoloji Bakanlığı – Millî Teknoloji ve Yapay Zekâ Genel Müdürlüğü",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Sadullah+Uzun+Sanayi+Teknoloji",
        "session": "2. Oturum: Milli Teknoloji Hamlesi – 17:15-18:00"
    },
    {
        "name": "Dr. Elvan KUZUCU HIDIR",
        "role": "T3 Vakfı Yönetim Kurulu Başkanı ve Genel Müdürü",
        "institution": "T3 Vakfı / Türkiye Uzay Ajansı Yönetim Kurulu Üyesi",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Elvan+Kuzucu+H%C4%B1d%C4%B1r+T3+Vakf%C4%B1",
        "session": "2. Oturum: Milli Teknoloji Hamlesi – 17:15-18:00"
    },
    {
        "name": "Dr. Kenan BARUT",
        "role": "Strateji Direktörü",
        "institution": "Cambridge Partnership for Education",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Kenan+Barut+Cambridge+Partnership",
        "session": "Forum Özel Oturumu – 11:30-12:15"
    },
    {
        "name": "Prof. Dr. Fatma Gülay HASDOĞAN",
        "role": "Endüstriyel Tasarım Bölüm Başkanı / Jüri Üyesi",
        "institution": "ODTÜ (Orta Doğu Teknik Üniversitesi) – Endüstriyel Tasarım Bölümü",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=G%C3%BClay+Hasdo%C4%9Fan+ODT%C3%9C",
        "session": "Sergi Tasarım Yarışması Jürisi – 9 Temmuz"
    },
    {
        "name": "Prof. Dr. Serkan GÜNEŞ",
        "role": "Öğretim Üyesi / Jüri Üyesi",
        "institution": "Gazi Üniversitesi – Endüstriyel Tasarım Bölümü",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Serkan+G%C3%BCne%C5%9F+Gazi+%C3%9Cniversitesi+tasar%C4%B1m",
        "session": "Sergi Tasarım Yarışması Jürisi – 9 Temmuz"
    },
    {
        "name": "Prof. Dr. Uygar KANLI",
        "role": "Öğretim Üyesi / Jüri Üyesi",
        "institution": "Gazi Üniversitesi – Eğitim Fakültesi",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Uygar+Kanl%C4%B1+Gazi+%C3%9Cniversitesi",
        "session": "Sergi Tasarım Yarışması Jürisi – 9 Temmuz"
    },
    {
        "name": "Prof. Dr. Yasemin ÖZDEM YILMAZ",
        "role": "Öğretim Üyesi / Jüri Üyesi",
        "institution": "Muğla Sıtkı Koçman Üniversitesi – Eğitim Fakültesi, Okul Öncesi Eğitimi ABD",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Yasemin+%C3%96zdem+Y%C4%B1lmaz+Mu%C4%9Fla",
        "session": "Sergi Tasarım Yarışması Jürisi – 9 Temmuz"
    },
    {
        "name": "Dr. Öğr. Üyesi Ali ÇETİNKAYA",
        "role": "Öğretim Üyesi / Jüri Üyesi",
        "institution": "Selçuk Üniversitesi – Mühendislik Fakültesi",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Ali+%C3%87etinkaya+Sel%C3%A7uk+%C3%9Cniversitesi",
        "session": "Sergi Tasarım Yarışması Jürisi – 9 Temmuz"
    },
    {
        "name": "Dr. Şeyma BAYRAK SALANTUR",
        "role": "Jüri Üyesi",
        "institution": "TÜBİTAK – Bilim Merkezleri Müdürlüğü",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=%C5%9Eeyma+Bayrak+Salantur+T%C3%BCb%C4%B0TAK",
        "session": "Sergi Tasarım Yarışması Jürisi – 9 Temmuz"
    },
    {
        "name": "Şermin KORKUSUZ ARSLAN",
        "role": "Jüri Üyesi",
        "institution": "TÜBİTAK – Kitaplar ve Telif Eserler Müdürlüğü",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=%C5%9Eermin+Korkusuz+Arslan+T%C3%BCb%C4%B0TAK",
        "session": "Sergi Tasarım Yarışması Jürisi – 9 Temmuz"
    },
    {
        "name": "Ebru Çınar KARAYEL",
        "role": "Konuşmacı – Eğitim Yönetiminde Yapay Zeka",
        "institution": "LEARNIGMA AI",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Ebru+%C3%87%C4%B1nar+Karayel+LEARNIGMA",
        "session": "Yönetici Oturumu – 14:00-14:45"
    },
    {
        "name": "Prof. Dr. Esin CAN",
        "role": "Konuşmacı – Stratejik Liderlik ve Yönetim Becerileri",
        "institution": "Yıldız Teknik Üniversitesi",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Esin+Can+Y%C4%B1ld%C4%B1z+Teknik+%C3%9Cniversitesi",
        "session": "Yönetici Oturumu – 14:45-15:45"
    },
    {
        "name": "Doç. Dr. Göknur KAPLAN",
        "role": "Konuşmacı – Dijital Yeterlikler / Bilim Merkezi Pedagojisi",
        "institution": "Boğaziçi Üniversitesi – Eğitim Fakültesi Dekanı",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=G%C3%B6knur+Kaplan+Bo%C4%9Fazi%C3%A7i+%C3%9Cniversitesi",
        "session": "Yönetici Oturumu – 16:30-17:30"
    },
    {
        "name": "Mustafa GÜVEN",
        "role": "Kurumsal İletişim ve Tanıtım Müdürü",
        "institution": "TÜBİTAK",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Mustafa+G%C3%BCven+T%C3%BCb%C4%B0TAK+ileti%C5%9Fim",
        "session": "Yönetici Oturumu – 16:30-17:15"
    },
    {
        "name": "Murat DEMİRLİ",
        "role": "Tanıtım ve Destek Hizmetler Müdürü",
        "institution": "TÜBİTAK",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Murat+Demirli+T%C3%BCb%C4%B0TAK",
        "session": "Yönetici Oturumu – 16:30-17:15"
    },
    {
        "name": "Tuva Cihangir ATASEVER",
        "role": "Astronot / Uzay Sistemleri Mühendisi",
        "institution": "Türkiye Uzay Ajansı / University of California Irvine mezunu",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Tuva+Cihangir+Atasever+astronot",
        "session": "Forum Uzay Oturumu – 17:30-18:30"
    },
    {
        "name": "Dr. Burak YAĞLIOĞLU",
        "role": "TÜBİTAK UZAY Başuzman Araştırmacısı / Uzay Mühendisi",
        "institution": "TÜBİTAK UZAY / ODTÜ Havacılık ve Uzay Mühendisliği mezunu",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Burak+Ya%C4%9Fl%C4%B1o%C4%9Flu+T%C3%BCb%C4%B0TAK+UZAY",
        "session": "Forum Uzay Oturumu – 17:30-18:30"
    },
    {
        "name": "Prof. Dr. Alim Rüstem ASLAN",
        "role": "Öğretim Üyesi – Uzay Mühendisliği",
        "institution": "İstanbul Teknik Üniversitesi (İTÜ) – Uzay Mühendisliği Bölümü",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Alim+R%C3%BCstem+Aslan+%C4%B0T%C3%9C",
        "session": "Forum Uzay Oturumu – 17:30-18:30"
    },
    {
        "name": "Prof. Dr. Burak KARABEY",
        "role": "Konuşmacı – Matematik Eğitimi",
        "institution": "Dokuz Eylül Üniversitesi – Özel Eğitim Bölümü (Üstün Yetenekliler Eğitimi ABD)",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Burak+Karabey+Dokuz+Eyl%C3%BCl+%C3%9Cniversitesi",
        "session": "Eğitmen/Öğretmen Oturumu – 14:00"
    },
    {
        "name": "Prof. Dr. Hatice YILDIZ DURAK",
        "role": "Konuşmacı – Teknoloji / Eğitimde Yapay Zeka",
        "institution": "Necmettin Erbakan Üniversitesi – Ereğli Eğitim Fakültesi, Eğitim Bilimleri Bölümü",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Hatice+Y%C4%B1ld%C4%B1z+Durak+Necmettin+Erbakan",
        "session": "Eğitmen/Öğretmen Oturumu – 14:45"
    },
    {
        "name": "Doç. Dr. Engin KARAHAN",
        "role": "Konuşmacı – Doğa Bilimleri / STEM Eğitimi",
        "institution": "Eğitim Fakültesi – Matematik ve Fen Bilimleri Eğitimi; Minnesota Üniversitesi STEM Merkezi",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Engin+Karahan+STEM+e%C4%9Fitim",
        "session": "Eğitmen/Öğretmen Oturumu – 15:45"
    },
    {
        "name": "Prof. Dr. Faruk SOYDUGAN",
        "role": "Astrofizikçi, Bilim İletişimcisi, Yazar",
        "institution": "Çanakkale Onsekiz Mart Üniversitesi – Fizik Bölümü / TÜBİTAK Bilim İletişimi",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Faruk+Soydugan+%C3%87anakkale+Onsekiz+Mart",
        "session": "Eğitmen/Öğretmen Oturumu – 16:30 (Astronomi)"
    },
]

# Table
table = doc.add_table(rows=1, cols=5)
table.style = 'Table Grid'

# Header
hdr = table.rows[0].cells
headers = ['#', 'Ad Soyad', 'Kurum / Pozisyon', 'Oturum', 'LinkedIn']
for i, h in enumerate(headers):
    hdr[i].text = h
    hdr[i].paragraphs[0].runs[0].bold = True

# Set column widths
widths = [Inches(0.3), Inches(1.5), Inches(2.2), Inches(1.8), Inches(2.0)]
for i, width in enumerate(widths):
    for cell in table.columns[i].cells:
        cell.width = width

for idx, s in enumerate(speakers, 1):
    row = table.add_row().cells
    row[0].text = str(idx)
    row[1].text = s['name']
    row[2].text = f"{s['role']}\n{s['institution']}"
    row[3].text = s['session']
    # LinkedIn as hyperlink text
    p = row[4].paragraphs[0]
    run = p.add_run(s['linkedin'])
    run.font.color.rgb = RGBColor(0x1F, 0x77, 0xB4)

doc.save('/home/user/proje/TUBITEM_Konusmacılar.docx')
print("Word belgesi oluşturuldu.")
