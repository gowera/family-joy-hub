import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type ChartData = { name: string; value: number }[];

interface SurveySection {
  title: string;
  charts: { title: string; data: ChartData }[];
}

interface SurveyPdfData {
  language: "fr" | "en";
  totalResponses: number;
  childrenCount: number;
  parentCount: number;
  communityCount: number;
  unityFeedbackCount?: number;
  sections: SurveySection[];
}

const PINK = [255, 20, 147] as const;

export const generateSurveyStatsPdf = (data: SurveyPdfData) => {
  const doc = new jsPDF();
  const t = (fr: string, en: string) => data.language === "fr" ? fr : en;
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  const addPageIfNeeded = (needed: number) => {
    if (y + needed > 270) {
      doc.addPage();
      y = 20;
    }
  };

  // Header
  doc.setFontSize(22);
  doc.setTextColor(PINK[0], PINK[1], PINK[2]);
  doc.text("Happiness Comes First", pageWidth / 2, y, { align: "center" });
  y += 10;

  doc.setFontSize(14);
  doc.setTextColor(60, 60, 60);
  doc.text(t("Statistiques des Sondages", "Survey Statistics"), pageWidth / 2, y, { align: "center" });
  y += 8;

  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(`${t("Généré le", "Generated on")} ${new Date().toLocaleDateString(data.language === "fr" ? "fr-FR" : "en-GB")}`, pageWidth / 2, y, { align: "center" });
  y += 12;

  // Summary table
  doc.setDrawColor(PINK[0], PINK[1], PINK[2]);
  doc.setLineWidth(0.5);
  doc.line(14, y, pageWidth - 14, y);
  y += 8;

  autoTable(doc, {
    startY: y,
    head: [[
      t("Total réponses", "Total Responses"),
      "Digital Safety",
      t("Parents", "Parents"),
      t("Communauté", "Community"),
      "Unity Circle",
    ]],
    body: [[
      data.totalResponses.toString(),
      data.childrenCount.toString(),
      data.parentCount.toString(),
      data.communityCount.toString(),
      (data.unityFeedbackCount ?? 0).toString(),
    ]],
    theme: "grid",
    headStyles: { fillColor: [PINK[0], PINK[1], PINK[2]], fontSize: 10 },
    bodyStyles: { halign: "center", fontSize: 11, fontStyle: "bold" },
    margin: { left: 14, right: 14 },
  });

  y = (doc as any).lastAutoTable.finalY + 14;

  // Sections
  data.sections.forEach((section) => {
    addPageIfNeeded(30);
    doc.setFontSize(14);
    doc.setTextColor(PINK[0], PINK[1], PINK[2]);
    doc.text(section.title, 14, y);
    y += 2;
    doc.setDrawColor(PINK[0], PINK[1], PINK[2]);
    doc.setLineWidth(0.3);
    doc.line(14, y, pageWidth - 14, y);
    y += 8;

    section.charts.forEach((chart) => {
      if (chart.data.length === 0) return;

      addPageIfNeeded(20 + chart.data.length * 7);

      const total = chart.data.reduce((s, d) => s + d.value, 0);
      const tableData = chart.data.map(d => [
        d.name,
        d.value.toString(),
        `${((d.value / total) * 100).toFixed(1)}%`,
      ]);

      autoTable(doc, {
        startY: y,
        head: [[chart.title, t("Réponses", "Responses"), "%"]],
        body: tableData,
        theme: "striped",
        headStyles: { fillColor: [80, 80, 80], fontSize: 9 },
        bodyStyles: { fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 90 },
          1: { halign: "center", cellWidth: 30 },
          2: { halign: "center", cellWidth: 30 },
        },
        margin: { left: 14, right: 14 },
      });

      y = (doc as any).lastAutoTable.finalY + 10;
    });
  });

  // Footer on last page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Happiness Comes First SCIO — ${t("Page", "Page")} ${i}/${pageCount}`,
      pageWidth / 2,
      290,
      { align: "center" }
    );
  }

  doc.save(`survey-statistics-${new Date().toISOString().slice(0, 10)}.pdf`);
};
