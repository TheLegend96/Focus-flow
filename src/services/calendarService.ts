import { CalendarEvent } from '../types';

export const calendarService = {
  // Parse standard iCal (.ics) text format
  parseICalFeed(icalText: string): CalendarEvent[] {
    const events: CalendarEvent[] = [];
    const lines = icalText.split(/\r\n|\n|\r/);
    let inEvent = false;
    let summary = '';
    let dtstart = '';
    let dtend = '';
    let uid = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith('BEGIN:VEVENT')) {
        inEvent = true;
        summary = '';
        dtstart = '';
        dtend = '';
        uid = '';
      } else if (line.startsWith('END:VEVENT')) {
        inEvent = false;
        if (summary) {
          const startDate = this.parseICalDate(dtstart);
          const endDate = this.parseICalDate(dtend);
          const durationMins =
            startDate && endDate
              ? Math.max(15, Math.round((endDate.getTime() - startDate.getTime()) / 60000))
              : 25;

          const isFocus = /focus|deep|work|study|code|design|write|ideation/i.test(summary);

          events.push({
            id: uid || `evt-${Math.random().toString(36).substring(7)}`,
            title: summary,
            startTime: startDate ? startDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : 'Scheduled',
            durationMinutes: durationMins,
            isFocusBlock: isFocus,
          });
        }
      } else if (inEvent) {
        if (line.startsWith('SUMMARY:')) {
          summary = line.substring(8);
        } else if (line.startsWith('DTSTART')) {
          const val = line.split(':')[1] || '';
          dtstart = val;
        } else if (line.startsWith('DTEND')) {
          const val = line.split(':')[1] || '';
          dtend = val;
        } else if (line.startsWith('UID:')) {
          uid = line.substring(4);
        }
      }
    }

    return events;
  },

  parseICalDate(icalDateStr: string): Date | null {
    if (!icalDateStr) return null;
    // e.g. 20261020T170000Z
    const match = icalDateStr.match(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/);
    if (!match) return null;
    return new Date(
      Date.UTC(
        parseInt(match[1], 10),
        parseInt(match[2], 10) - 1,
        parseInt(match[3], 10),
        parseInt(match[4], 10),
        parseInt(match[5], 10),
        parseInt(match[6], 10)
      )
    );
  },

  // Fetch from user's iCal URL via proxy or direct CORS
  async fetchICalEvents(url: string): Promise<CalendarEvent[]> {
    try {
      // Use AllOrigins or CORS proxy if needed, or direct
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const res = await fetch(proxyUrl);
      const json = await res.json();
      if (json.contents) {
        return this.parseICalFeed(json.contents);
      }
      return [];
    } catch (err) {
      console.warn('Failed to fetch iCal feed:', err);
      return [];
    }
  },
};
