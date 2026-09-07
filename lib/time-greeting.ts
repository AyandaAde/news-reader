export function getTimeOfDayGreeting(date = new Date()) {
  const hour = date.getHours();

  if (hour >= 5 && hour < 12) {
    return "Good Morning";
  }

  if (hour >= 12 && hour < 17) {
    return "Good Afternoon";
  }

  return "Good Evening";
}

export function getFirstName(name: string) {
  return name.trim().split(/\s+/)[0] ?? name.trim();
}

export function formatTimeGreeting(name?: string | null, date = new Date()) {
  const greeting = getTimeOfDayGreeting(date);
  const trimmed = name?.trim();

  if (!trimmed) {
    return greeting;
  }

  return `${greeting}, ${getFirstName(trimmed)}`;
}
