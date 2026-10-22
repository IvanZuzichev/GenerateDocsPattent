import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  PageBreak,
  LineRuleType,
} from 'docx';
import { jsPDF } from 'jspdf';

export interface FormData {
  name: string;
  description: string;
  volume: string;
  code: string;
  owner: string;
  os: string;
  resolution: string;
  platform: string;
  language: string;
}

const OWNER = 'Зюзичев Иван Сергеевич';

export async function generateDocuments(data: FormData): Promise<void> {
  const safeName = data.name.replace(/[\\/:*?"<>|]/g, '_').trim() || 'Программа';

  const docxBlob = await generateDocx(data);
  const pdfBlob = generatePdf(data);

  const docxName = `${safeName}.docx`;
  const pdfName = `${safeName}.pdf`;

  if ('showDirectoryPicker' in window) {
    try {
      const dirHandle: any = await (window as any).showDirectoryPicker({
        mode: 'readwrite',
      });
      await saveFile(dirHandle, docxName, docxBlob);
      await saveFile(dirHandle, pdfName, pdfBlob);
      return;
    } catch (err: any) {
      if (err?.name === 'AbortError') return;
    }
  }

  downloadBlob(docxBlob, docxName);
  downloadBlob(pdfBlob, pdfName);
}

async function saveFile(dirHandle: any, filename: string, blob: Blob) {
  const fileHandle = await dirHandle.getFileHandle(filename, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(blob);
  await writable.close();
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function generateDocx(data: FormData): Promise<Blob> {
  const spacing = { line: 360, lineRule: LineRuleType.AUTO };

  const body = (text: string) =>
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing,
      children: [new TextRun({ text, font: 'Times New Roman', size: 28 })],
    });

  const centered = (text: string, bold = false) =>
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing,
      children: [
        new TextRun({ text, font: 'Times New Roman', size: 28, bold }),
      ],
    });

  const codeLine = (line: string) =>
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing,
      children: [
        new TextRun({
          text: line || ' ',
          font: 'Times New Roman',
          size: 28,
        }),
      ],
    });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1134, bottom: 1134, left: 1701, right: 851 },
          },
        },
        children: [
          centered('Реферат'),
          body(`Программа для ЭВМ: «${data.name}»`),
          body(`Правообладатель: ${data.owner || OWNER}`),
          body('Авторов: 1 (один).'),
          body(data.description),
          body(`ОС: ${data.os || 'Windows 7/10/11, Linux, macOS'}.`),
          body(`Разрешение экрана: ${data.resolution || '1024х768 минимум'}.`),
          body(`Базовая платформа: ${data.platform || 'GNU Octave 5.2.0 и выше'}.`),
          body(`Язык программирования: ${data.language || 'JavaScript'}`),
          body(`Объем: ${data.volume} Кб.`),

          new Paragraph({ children: [new PageBreak()] }),

          centered(
            'Идентифицирующие программу для ЭВМ материалы в форме распечатки исходного текста'
          ),
          body(`Программа для ЭВМ: «${data.name}»`),
          body(`Правообладатель: ${data.owner || OWNER}`),
          body('Авторов: 1 (один).'),
          ...data.code.split('\n').map(codeLine),
        ],
      },
    ],
  });

  return Packer.toBlob(doc);
}

function generatePdf(data: FormData): Blob {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginLeft = 30;
  const marginRight = 15;
  const marginTop = 20;
  const bottomMargin = 20;
  const maxWidth = pageWidth - marginLeft - marginRight;
  const lineHeight = 7;

  let y = marginTop;

  doc.setFont('Times', 'normal');
  doc.setFontSize(14);
  doc.setLineHeightFactor(1.5);

  const ensurePage = (need = lineHeight) => {
    if (y + need > pageHeight - bottomMargin) {
      doc.addPage();
      y = marginTop;
    }
  };

  const centered = (text: string, bold = false) => {
    doc.setFont('Times', bold ? 'bold' : 'normal');
    doc.setFontSize(14);
    const lines = doc.splitTextToSize(text, maxWidth);
    for (const line of lines) {
      ensurePage();
      doc.text(line, pageWidth / 2, y, { align: 'center' });
      y += lineHeight;
    }
    doc.setFont('Times', 'normal');
    y += 2;
  };

  const justified = (text: string) => {
    const lines: string[] = doc.splitTextToSize(text, maxWidth);
    for (let i = 0; i < lines.length; i++) {
      ensurePage();
      if (i < lines.length - 1) {
        doc.text(lines[i], marginLeft, y, { align: 'justify', maxWidth });
      } else {
        doc.text(lines[i], marginLeft, y);
      }
      y += lineHeight;
    }
    y += 1;
  };

  centered('Реферат');
  justified(`Программа для ЭВМ: «${data.name}»`);
  justified(`Правообладатель: ${data.owner || OWNER}`);
  justified('Авторов: 1 (один).');
  justified(data.description);
  justified(`ОС: ${data.os || 'Windows 7/10/11, Linux, macOS'}.`);
  justified(`Разрешение экрана: ${data.resolution || '1024х768 минимум'}.`);
  justified(`Базовая платформа: ${data.platform || 'GNU Octave 5.2.0 и выше'}.`);
  justified(`Язык программирования: ${data.language || 'JavaScript'}`);
  justified(`Объем: ${data.volume} Кб.`);

  doc.addPage();
  y = marginTop;

  centered(
    'Идентифицирующие программу для ЭВМ материалы в форме распечатки исходного текста',
    true
  );

  justified(`Программа для ЭВМ: «${data.name}»`);
  justified(`Правообладатель: ${data.owner || OWNER}`);
  justified('Авторов: 1 (один).');

  doc.setFont('Times', 'normal');
  doc.setFontSize(14);
  doc.setLineHeightFactor(1.5);

  for (const line of data.code.split('\n')) {
    ensurePage();
    doc.text(line || ' ', marginLeft, y);
    y += lineHeight;
  }

  return doc.output('blob');
}