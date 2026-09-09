const { tool } = require("@langchain/core/tools");
const { z } = require("zod");

// Common city / country to IANA timezone map
const CITY_TIMEZONE_MAP = {
  // India
  hyderabad: "Asia/Kolkata",
  mumbai: "Asia/Kolkata",
  delhi: "Asia/Kolkata",
  bangalore: "Asia/Kolkata",
  bengaluru: "Asia/Kolkata",
  chennai: "Asia/Kolkata",
  kolkata: "Asia/Kolkata",
  pune: "Asia/Kolkata",
  india: "Asia/Kolkata",
  ist: "Asia/Kolkata",

  // US & Canada
  "new york": "America/New_York",
  nyc: "America/New_York",
  boston: "America/New_York",
  washington: "America/New_York",
  "san francisco": "America/Los_Angeles",
  sf: "America/Los_Angeles",
  "los angeles": "America/Los_Angeles",
  la: "America/Los_Angeles",
  seattle: "America/Los_Angeles",
  chicago: "America/Chicago",
  houston: "America/Chicago",
  austin: "America/Chicago",
  denver: "America/Denver",
  phoenix: "America/Phoenix",
  toronto: "America/Toronto",
  vancouver: "America/Vancouver",
  est: "America/New_York",
  pst: "America/Los_Angeles",
  cst: "America/Chicago",
  mst: "America/Denver",

  // UK & Europe
  london: "Europe/London",
  uk: "Europe/London",
  gmt: "UTC",
  utc: "UTC",
  paris: "Europe/Paris",
  berlin: "Europe/Berlin",
  rome: "Europe/Rome",
  madrid: "Europe/Madrid",
  amsterdam: "Europe/Amsterdam",
  dublin: "Europe/Dublin",
  zurich: "Europe/Zurich",

  // Asia & Middle East
  dubai: "Asia/Dubai",
  uae: "Asia/Dubai",
  tokyo: "Asia/Tokyo",
  japan: "Asia/Tokyo",
  singapore: "Asia/Singapore",
  "hong kong": "Asia/Hong_Kong",
  bangkok: "Asia/Bangkok",
  seoul: "Asia/Seoul",
  shanghai: "Asia/Shanghai",
  beijing: "Asia/Shanghai",
  sydney: "Australia/Sydney",
  melbourne: "Australia/Melbourne",
  auckland: "Pacific/Auckland",
};

/**
 * Get current time, date, and timezone details for a given location or timezone
 * @param {string} locationOrTimezone
 * @returns {object}
 */
function getCurrentDateTime(locationOrTimezone = "UTC") {
  const now = new Date();
  const rawKey = (locationOrTimezone || "UTC").toLowerCase().trim();

  let timeZone = "UTC";

  // Check known cities/aliases
  if (CITY_TIMEZONE_MAP[rawKey]) {
    timeZone = CITY_TIMEZONE_MAP[rawKey];
  } else {
    // Check if partial match exists in keys
    const match = Object.keys(CITY_TIMEZONE_MAP).find((key) =>
      rawKey.includes(key) || key.includes(rawKey)
    );
    if (match) {
      timeZone = CITY_TIMEZONE_MAP[match];
    } else {
      // Try using raw string as IANA timezone (e.g. "Asia/Kolkata", "America/Chicago")
      try {
        Intl.DateTimeFormat(undefined, { timeZone: locationOrTimezone });
        timeZone = locationOrTimezone;
      } catch {
        timeZone = "UTC";
      }
    }
  }

  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
      timeZoneName: "long",
    });

    const formattedParts = formatter.format(now);
    const shortFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZoneName: "short",
    });

    return {
      query: locationOrTimezone,
      timeZone,
      fullDateTime: formattedParts,
      shortTime: shortFormatter.format(now),
      isoUTC: now.toISOString(),
      timestampMs: now.getTime(),
    };
  } catch (err) {
    return {
      query: locationOrTimezone,
      timeZone: "UTC",
      fullDateTime: now.toUTCString(),
      isoUTC: now.toISOString(),
      error: err.message,
    };
  }
}

/**
 * LangChain Tool for current date and time
 */
const dateTimeTool = tool(
  async ({ location }) => {
    try {
      const data = getCurrentDateTime(location);
      return JSON.stringify(data, null, 2);
    } catch (err) {
      return `Error getting date time: ${err.message}`;
    }
  },
  {
    name: "get_current_time",
    description:
      "Get the accurate real-time current time, date, day of week, and timezone for any city, country, or timezone (e.g., 'Hyderabad', 'New York', 'London', 'Tokyo', 'Asia/Kolkata', 'UTC').",
    schema: z.object({
      location: z
        .string()
        .describe("The city, region, country, or timezone name (e.g. 'Hyderabad', 'London', 'America/New_York')"),
    }),
  }
);

module.exports = {
  getCurrentDateTime,
  dateTimeTool,
};
