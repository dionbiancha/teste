import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export const formatCPF = (value: string) => {
  // Remove qualquer caractere que não seja dígito
  const onlyDigits = value.replace(/\D/g, "");
  // Adiciona a formatação: 000.000.000-00
  const formatted = onlyDigits
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return formatted;
};

export const formatZipCode = (value: string) => {
  // Remove qualquer caractere que não seja dígito
  const onlyDigits = value.replace(/\D/g, "");
  // Adiciona a formatação: 00000-000
  const formatted = onlyDigits
    .slice(0, 8)
    .replace(/(\d{5})(\d{1,3})$/, "$1-$2");
  return formatted;
};

export function formatDate(dateString: string): string {
  // Parse the date string to a Date object
  const date = parseISO(dateString);

  // Format the date to "dd 'de' MMMM 'de' yyyy"
  return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
}
