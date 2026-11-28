function previousDate(isoDate: string): string {
    const [year, month, day] = isoDate.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    date.setUTCDate(date.getUTCDate() - 1);
    return date.toISOString().slice(0, 10);
}
  
export function currentStreak(completeDates: string[], today: string): number {
    const complete = new Set(completeDates);
    let cursor = complete.has(today) ? today : previousDate(today);
    let count = 0;
  
    while (complete.has(cursor)) {
      count += 1;
      cursor = previousDate(cursor);
    }
  
    return count;
}
  
export function localDate(timeZone: string, now = new Date()): string {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(now);
}
  