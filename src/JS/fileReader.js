import mammoth from 'mammoth';
import * as XLSX from 'xlsx';

export async function readDocx(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    return new Promise(resolve => {
        reader.onload = async (e) => {
            const arrayBuffer = e.target.result;
            const { value: html } = await mammoth.convertToHtml({ arrayBuffer });
            resolve(html);  // Возвращаем HTML
        };

        reader.readAsArrayBuffer(file);
    });
}
export async function readXlsx(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    return new Promise(resolve => {
        reader.onload = (e) => {
            const arrayBuffer = e.target.result;
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];

            let html = XLSX.utils.sheet_to_html(worksheet);


            // Парсим HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            //Убираем все атрибуты у тегов
            doc.querySelectorAll('*').forEach( element => {
                Array.from(element.attributes).forEach( attr => element.removeAttribute(attr.name));
            });

            // Возвращаем HTML как строку без атрибутов
            resolve(doc.body.innerHTML);
        };

        reader.readAsArrayBuffer(file);
    });
}
