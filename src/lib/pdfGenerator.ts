import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format, differenceInYears } from 'date-fns';

interface Child {
  id: string;
  full_name: string;
  date_of_birth: string;
  allergies: string | null;
  medical_conditions: string | null;
  medication: string | null;
  special_needs: string | null;
  photo_consent: boolean;
  parents?: {
    full_name: string;
    email: string;
    phone: string;
    address: string | null;
    emergency_contact: string | null;
    emergency_phone: string | null;
  };
}

interface Enrollment {
  id: string;
  start_date: string;
  end_date: string | null;
  status: string;
  days_attending: string[] | null;
  children?: { full_name: string };
  programs?: { name: string };
}

const calculateAge = (dateOfBirth: string) => {
  return differenceInYears(new Date(), new Date(dateOfBirth));
};

const addHeader = (doc: jsPDF, title: string) => {
  // Header background
  doc.setFillColor(253, 242, 248);
  doc.rect(0, 0, 210, 40, 'F');
  
  // Heart icon and title
  doc.setTextColor(219, 39, 119);
  doc.setFontSize(20);
  doc.text('❤ Happiness Comes First', 105, 18, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text('Where Everyone Belongs', 105, 26, { align: 'center' });
  
  // Title
  doc.setFontSize(16);
  doc.setTextColor(219, 39, 119);
  doc.text(title, 105, 50, { align: 'center' });
  
  // Date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Généré le ${format(new Date(), 'dd/MM/yyyy à HH:mm')}`, 105, 58, { align: 'center' });
};

const addFooter = (doc: jsPDF) => {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} sur ${pageCount} - Happiness Comes First - Document confidentiel`,
      105,
      290,
      { align: 'center' }
    );
  }
};

export const generateChildrenListPDF = (children: Child[]) => {
  const doc = new jsPDF();
  
  addHeader(doc, 'Liste des Enfants Inscrits');
  
  const tableData = children.map((child, i) => [
    (i + 1).toString(),
    child.full_name,
    `${calculateAge(child.date_of_birth)} ans`,
    child.parents?.full_name || '-',
    `${child.parents?.email || ''}\n${child.parents?.phone || ''}`,
    child.photo_consent ? 'Oui' : 'Non',
  ]);
  
  autoTable(doc, {
    startY: 65,
    head: [['#', 'Nom', 'Âge', 'Parent', 'Contact', 'Photo']],
    body: tableData,
    headStyles: {
      fillColor: [253, 242, 248],
      textColor: [219, 39, 119],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [249, 249, 249],
    },
    styles: {
      fontSize: 9,
      cellPadding: 4,
    },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 35 },
      2: { cellWidth: 15 },
      3: { cellWidth: 35 },
      4: { cellWidth: 50 },
      5: { cellWidth: 15 },
    },
  });
  
  addFooter(doc);
  doc.save('liste-enfants.pdf');
};

export const generateContractPDF = (child: Child) => {
  const doc = new jsPDF();
  
  addHeader(doc, "CONTRAT D'INSCRIPTION");
  
  let y = 70;
  
  // Child Info Section
  doc.setFillColor(253, 242, 248);
  doc.roundedRect(15, y, 180, 35, 3, 3, 'F');
  
  doc.setFontSize(12);
  doc.setTextColor(219, 39, 119);
  doc.text("Informations de l'Enfant", 20, y + 10);
  
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  doc.text(`Nom complet: ${child.full_name}`, 20, y + 20);
  doc.text(`Date de naissance: ${format(new Date(child.date_of_birth), 'dd/MM/yyyy')}`, 20, y + 27);
  doc.text(`Âge: ${calculateAge(child.date_of_birth)} ans`, 120, y + 27);
  
  y += 45;
  
  // Parent Info Section
  doc.setFillColor(253, 242, 248);
  doc.roundedRect(15, y, 180, 45, 3, 3, 'F');
  
  doc.setFontSize(12);
  doc.setTextColor(219, 39, 119);
  doc.text('Informations du Parent/Tuteur', 20, y + 10);
  
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  doc.text(`Nom: ${child.parents?.full_name || '-'}`, 20, y + 20);
  doc.text(`Email: ${child.parents?.email || '-'}`, 20, y + 27);
  doc.text(`Téléphone: ${child.parents?.phone || '-'}`, 120, y + 27);
  doc.text(`Adresse: ${child.parents?.address || '-'}`, 20, y + 34);
  doc.text(`Contact d'urgence: ${child.parents?.emergency_contact || '-'} - ${child.parents?.emergency_phone || '-'}`, 20, y + 41);
  
  y += 55;
  
  // Medical Info Section
  doc.setFillColor(253, 242, 248);
  doc.roundedRect(15, y, 180, 40, 3, 3, 'F');
  
  doc.setFontSize(12);
  doc.setTextColor(219, 39, 119);
  doc.text('Informations Médicales', 20, y + 10);
  
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  doc.text(`Allergies: ${child.allergies || 'Aucune signalée'}`, 20, y + 20);
  doc.text(`Conditions médicales: ${child.medical_conditions || 'Aucune signalée'}`, 20, y + 27);
  doc.text(`Médicaments: ${child.medication || 'Aucun'}`, 20, y + 34);
  
  y += 50;
  
  // Consent Section
  doc.setFillColor(253, 242, 248);
  doc.roundedRect(15, y, 180, 20, 3, 3, 'F');
  
  doc.setFontSize(12);
  doc.setTextColor(219, 39, 119);
  doc.text('Consentements', 20, y + 10);
  
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  doc.text(`Consentement Photo/Vidéo: ${child.photo_consent ? '✓ Accordé' : '✗ Non accordé'}`, 20, y + 17);
  
  y += 30;
  
  // Signature Area
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  doc.text('Signature du Parent/Tuteur:', 20, y + 10);
  doc.line(20, y + 25, 90, y + 25);
  doc.text('Date: _______________', 20, y + 35);
  
  doc.text('Pour Happiness Comes First:', 120, y + 10);
  doc.line(120, y + 25, 190, y + 25);
  doc.text('Date: _______________', 120, y + 35);
  
  addFooter(doc);
  doc.save(`contrat-${child.full_name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
};

export const generateImpactReportPDF = (children: Child[], enrollments: Enrollment[]) => {
  const doc = new jsPDF();
  
  addHeader(doc, 'Summer Kids Hub - Impact Report');
  
  let y = 65;
  
  // Stats boxes
  const stats = [
    { label: 'Children Registered', value: children.length.toString() },
    { label: 'Families Supported', value: new Set(children.map(c => c.parents?.full_name)).size.toString() },
    { label: 'Active Enrollments', value: enrollments.filter(e => e.status === 'active').length.toString() },
    { label: 'Satisfaction Rate', value: '100%' },
  ];
  
  const boxWidth = 42;
  const boxGap = 5;
  let boxX = 15;
  
  stats.forEach((stat) => {
    doc.setFillColor(253, 242, 248);
    doc.roundedRect(boxX, y, boxWidth, 30, 3, 3, 'F');
    
    doc.setFontSize(18);
    doc.setTextColor(219, 39, 119);
    doc.text(stat.value, boxX + boxWidth / 2, y + 14, { align: 'center' });
    
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(stat.label, boxX + boxWidth / 2, y + 24, { align: 'center' });
    
    boxX += boxWidth + boxGap;
  });
  
  y += 45;
  
  // Parent Feedback
  doc.setFontSize(12);
  doc.setTextColor(219, 39, 119);
  doc.text('👨‍👩‍👧 Parent Feedback', 15, y);
  
  y += 8;
  const quotes = [
    '"My child looked forward to every session. The activities were inclusive, well organised, and made my child feel confident and happy."',
    '"As a parent, I felt reassured knowing my child was in a safe, caring, and structured environment."',
  ];
  
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  quotes.forEach((quote) => {
    doc.setFillColor(245, 245, 245);
    const lines = doc.splitTextToSize(quote, 170);
    const height = lines.length * 5 + 6;
    doc.roundedRect(15, y, 180, height, 2, 2, 'F');
    doc.text(lines, 20, y + 6);
    y += height + 5;
  });
  
  y += 10;
  
  // Children's Feedback
  doc.setFontSize(12);
  doc.setTextColor(219, 39, 119);
  doc.text("🧒 Children's Feedback", 15, y);
  
  y += 8;
  doc.setFillColor(253, 242, 248);
  doc.roundedRect(15, y, 180, 35, 3, 3, 'F');
  
  const childQuotes = [
    '❤ "I liked the games and playing with new friends."',
    '❤ "The music and movement were my favourite parts."',
    '❤ "I felt happy coming here every day."',
    '❤ "I liked that everyone was kind and helped each other."',
  ];
  
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  childQuotes.forEach((quote, i) => {
    doc.text(quote, 20, y + 8 + i * 8);
  });
  
  y += 45;
  
  // Impact Statement
  doc.setFontSize(12);
  doc.setTextColor(219, 39, 119);
  doc.text('Overall Impact Statement', 15, y);
  
  y += 8;
  doc.setFillColor(253, 242, 248);
  doc.roundedRect(15, y, 180, 40, 3, 3, 'F');
  
  const impactText = 'The Happiness Comes First Summer Kids Hub successfully supported children and families during the school holidays by providing a safe, inclusive, and joyful environment. The programme promoted wellbeing, physical activity, creativity, and social connection.';
  
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  const impactLines = doc.splitTextToSize(impactText, 170);
  doc.text(impactLines, 20, y + 8);
  
  addFooter(doc);
  doc.save('impact-report.pdf');
};

export const generateAttendancePDF = (
  programName: string,
  date: string,
  attendanceData: { name: string; present: boolean }[]
) => {
  const doc = new jsPDF();
  
  addHeader(doc, `Feuille de Présence - ${programName}`);
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Date: ${format(new Date(date), 'dd/MM/yyyy')}`, 105, 62, { align: 'center' });
  
  const tableData = attendanceData.map((item, i) => [
    (i + 1).toString(),
    item.name,
    item.present ? '✓ Présent' : '✗ Absent',
  ]);
  
  autoTable(doc, {
    startY: 70,
    head: [['#', 'Nom de l\'enfant', 'Présence']],
    body: tableData,
    headStyles: {
      fillColor: [253, 242, 248],
      textColor: [219, 39, 119],
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 11,
    },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 100 },
      2: { cellWidth: 45, halign: 'center' },
    },
    didParseCell: (data) => {
      if (data.column.index === 2 && data.section === 'body') {
        const isPresent = data.cell.raw?.toString().includes('Présent');
        data.cell.styles.textColor = isPresent ? [22, 163, 74] : [220, 38, 38];
      }
    },
  });
  
  // Summary
  const presentCount = attendanceData.filter(a => a.present).length;
  const absentCount = attendanceData.length - presentCount;
  
  const finalY = (doc as any).lastAutoTable.finalY + 20;
  
  doc.setFillColor(253, 242, 248);
  doc.roundedRect(15, finalY, 180, 25, 3, 3, 'F');
  
  doc.setFontSize(11);
  doc.setTextColor(50, 50, 50);
  doc.text(`Total inscrits: ${attendanceData.length}`, 25, finalY + 10);
  doc.text(`Présents: ${presentCount}`, 80, finalY + 10);
  doc.text(`Absents: ${absentCount}`, 130, finalY + 10);
  doc.text(`Taux: ${Math.round((presentCount / attendanceData.length) * 100)}%`, 170, finalY + 10);
  
  addFooter(doc);
  doc.save(`presence-${date}.pdf`);
};
