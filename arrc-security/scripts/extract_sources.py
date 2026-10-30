from pathlib import Path
import zipfile
import xml.etree.ElementTree as ET
import importlib.util
import sys

downloads = Path.home() / 'Downloads'
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / '.tools' / 'python'))
output = Path(__file__).resolve().parents[1] / 'docs' / 'source-extracts'
output.mkdir(parents=True, exist_ok=True)
files = ['ARRCSS.pdf', 'ARRC  COMPANY PROFILE.pdf', 'final company browser.docx', 'CORPORATE COMPANY PROFILE revised ms.docx']
for name in files:
    path = downloads / name
    if path.suffix == '.docx':
        with zipfile.ZipFile(path) as archive:
            root = ET.fromstring(archive.read('word/document.xml'))
            ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            paragraphs = [''.join(t.text or '' for t in p.findall('.//w:t', ns)) for p in root.findall('.//w:p', ns)]
            content = '\n'.join(p for p in paragraphs if p.strip())
    elif importlib.util.find_spec('pypdf'):
        from pypdf import PdfReader
        content = '\n\n'.join(f'PAGE {i+1}\n{p.extract_text()}' for i, p in enumerate(PdfReader(path).pages))
    elif importlib.util.find_spec('fitz'):
        import fitz
        with fitz.open(path) as document:
            content = '\n\n'.join(f'PAGE {i+1}\n{p.get_text()}' for i, p in enumerate(document))
    else:
        print(f'PDF extractor unavailable: {name}')
        continue
    (output / (path.stem + '.txt')).write_text(content, encoding='utf-8')
    print(f'{name}: {len(content)} characters extracted')
