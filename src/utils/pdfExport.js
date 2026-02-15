import jsPDF from 'jspdf';
import { formatCurrency, formatDate } from './formatters';
import { calcBudgetTotals } from './calculations';

export const exportBudgetPDF = (budget, config) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = 20;

  // Colors
  const primaryColor = [37, 99, 235];
  const darkColor = [30, 41, 59];
  const grayColor = [100, 116, 139];

  // Header bar
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Company name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(config?.companyName || 'ElectriPro', margin, 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const companyInfo = [
    config?.cuit ? `CUIT: ${config.cuit}` : '',
    config?.address || '',
    config?.phone || '',
    config?.email || '',
  ].filter(Boolean).join(' | ');
  doc.text(companyInfo, margin, 30);

  // Budget title
  y = 55;
  doc.setTextColor(...darkColor);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`PRESUPUESTO N° ${String(budget.number).padStart(4, '0')}`, margin, y);

  // Budget meta info
  y += 12;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  doc.text(`Fecha: ${formatDate(budget.date)}`, margin, y);
  doc.text(`Validez: ${budget.validity || '15 días'}`, margin + 60, y);
  doc.text(`Estado: ${budget.status?.toUpperCase() || 'BORRADOR'}`, margin + 120, y);

  // Client info
  y += 14;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y - 5, pageWidth - margin * 2, 28, 2, 2, 'F');

  doc.setTextColor(...darkColor);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('DATOS DEL CLIENTE', margin + 5, y + 2);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...grayColor);
  const client = budget.client || {};
  doc.text(`Cliente: ${client.name || '-'}`, margin + 5, y + 10);
  doc.text(`Dirección: ${client.address || '-'}`, margin + 5, y + 17);
  doc.text(`Tel: ${client.phone || '-'}`, margin + 100, y + 10);
  doc.text(`Email: ${client.email || '-'}`, margin + 100, y + 17);

  // Items table header
  y += 38;
  doc.setFillColor(...primaryColor);
  doc.rect(margin, y, pageWidth - margin * 2, 8, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('CÓD.', margin + 2, y + 5.5);
  doc.text('DESCRIPCIÓN', margin + 22, y + 5.5);
  doc.text('UND', margin + 95, y + 5.5);
  doc.text('CANT.', margin + 110, y + 5.5);
  doc.text('P. UNIT.', margin + 125, y + 5.5);
  doc.text('SUBTOTAL', margin + 148, y + 5.5);

  // Items rows
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkColor);

  const items = budget.items || [];
  items.forEach((item, i) => {
    if (y > 260) {
      doc.addPage();
      y = 20;
    }

    const rowBg = i % 2 === 0 ? [248, 250, 252] : [255, 255, 255];
    doc.setFillColor(...rowBg);
    doc.rect(margin, y, pageWidth - margin * 2, 7, 'F');

    doc.setFontSize(7.5);
    doc.setTextColor(...darkColor);
    doc.text(item.code || '', margin + 2, y + 5);
    doc.text((item.name || '').substring(0, 40), margin + 22, y + 5);
    doc.text(item.unit || '', margin + 95, y + 5);
    doc.text(String(item.qty || 0), margin + 113, y + 5);
    doc.text(formatCurrency(item.unitPrice), margin + 125, y + 5);
    doc.text(formatCurrency((item.qty || 0) * (item.unitPrice || 0)), margin + 148, y + 5);

    y += 7;
  });

  // Totals
  const totals = calcBudgetTotals(items, budget.iva || 21);

  y += 5;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin + 110, y, pageWidth - margin, y);

  y += 8;
  doc.setFontSize(9);
  doc.setTextColor(...grayColor);
  doc.text('Subtotal:', margin + 110, y);
  doc.setTextColor(...darkColor);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(totals.subtotal), margin + 148, y);

  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  doc.text(`IVA (${budget.iva || 21}%):`, margin + 110, y);
  doc.setTextColor(...darkColor);
  doc.text(formatCurrency(totals.iva), margin + 148, y);

  y += 9;
  doc.setFillColor(...primaryColor);
  doc.roundedRect(margin + 105, y - 5, pageWidth - margin - 105 - margin, 12, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL:', margin + 110, y + 3);
  doc.text(formatCurrency(totals.total), margin + 148, y + 3);

  // Notes
  if (budget.notes) {
    y += 22;
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkColor);
    doc.text('NOTAS Y CONDICIONES:', margin, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...grayColor);
    const lines = doc.splitTextToSize(budget.notes, pageWidth - margin * 2);
    doc.text(lines, margin, y);
  }

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
  doc.setFontSize(7);
  doc.setTextColor(...grayColor);
  doc.text(`${config?.companyName || 'ElectriPro'} - Presupuesto generado automáticamente`, margin, footerY);
  doc.text(`Página 1`, pageWidth - margin - 15, footerY);

  // Save
  doc.save(`Presupuesto_${String(budget.number).padStart(4, '0')}_${budget.client?.name || 'cliente'}.pdf`);
};
