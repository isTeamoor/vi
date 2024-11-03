import mammoth from 'mammoth';



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