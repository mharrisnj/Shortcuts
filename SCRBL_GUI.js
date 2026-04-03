// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: teal; icon-glyph: magic;
// Shows reminders that are due for today in a table.
let cal = await Calendar.defaultForReminders();
let reminders = await Reminder.allDueToday([cal]);
reminders.sort((a, b) => {
  return a.dueDate > b.dueDate;
 }