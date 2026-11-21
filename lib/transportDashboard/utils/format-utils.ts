export function formatPhoneNumber(phone: string): string {
  return phone.startsWith('+') ? phone : `+1 ${phone}`;
}

export function formatBusNumber(busNo: string): string {
  return busNo.toUpperCase();
}