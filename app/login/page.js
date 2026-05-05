function formatDate(ts, tz) {
  if (!ts) return "...";
  const d = new Date(ts);
  const myTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const parentTz = tz || profile.parentTimezone || "Asia/Seoul";
  const myTime = d.toLocaleString("en-US", {
    timeZone: myTz,
    month:"short", day:"numeric",
    hour:"2-digit", minute:"2-digit"
  });
  const parentTime = d.toLocaleString("en-US", {
    timeZone: parentTz,
    month:"short", day:"numeric",
    hour:"2-digit", minute:"2-digit"
  });
 return `${myTime} (${profile.myName}) · ${parentTime} (${profile.parentName})`;
}