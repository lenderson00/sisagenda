import type { AppointmentWithRelations } from "@/app/fornecedor/(main)/page";
import type { User } from "@prisma/client";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportAppointmentsToPDF(
  appointments: AppointmentWithRelations[],
  user: User,
) {
  const doc = new jsPDF();

  doc.text("Agendamentos", 14, 16);

  const tableColumn = [
    "Ordem de Compra",
    "OM",
    "Tipo de Entrega",
    "Data",
    "Status",
  ];

  const tableRows: any[][] = [];

  for (const appointment of appointments) {
    const appointmentData = [
      appointment.ordemDeCompra,
      appointment.organizationId,
      appointment.deliveryType.name,
      new Date(appointment.date).toLocaleDateString(),
      appointment.status,
    ];
    tableRows.push(appointmentData);
  }

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 20,
  });

  doc.save("agendamentos.pdf");
}
