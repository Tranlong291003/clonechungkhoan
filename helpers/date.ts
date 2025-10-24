export type DateInput = Date | string | number | undefined;

function toDate(input: DateInput): Date {
  if (input instanceof Date) return input;
  if (typeof input === "string" || typeof input === "number")
    return new Date(input);
  return new Date();
}

// Returns day of month (1..31)
export function getDay(input?: DateInput): number {
  return toDate(input).getDate();
}

// Returns month number (1..12)
export function getMonth(input?: DateInput): number {
  return toDate(input).getMonth() + 1;
}

// Returns localized day name (default Vietnamese, long form)
export function getDayName(
  input?: DateInput,
  locale: string = "vi-VN",
  style: "long" | "short" | "narrow" = "long"
): string {
  const date = toDate(input);
  return new Intl.DateTimeFormat(locale, { weekday: style }).format(date);
}

// Simple formatter: dd/MM/yyyy
export function formatDateDDMMYYYY(input?: DateInput): string {
  const d = toDate(input);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

// Formatter: "20 tháng 10"
export function formatNgayThang(input?: DateInput): string {
  return `${getDay(input)} tháng ${getMonth(input)}`;
}

export default {
  getDay,
  getMonth,
  getDayName,
  formatDateDDMMYYYY,
  formatNgayThang,
};
