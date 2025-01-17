kit:: futureEventsTable
created-on:: [[Saturday, Aug 10th, 2024]]
-icon:: fd2f

- ```javascript
  /** 
   *
   * @file futureEventsTable.md
   * @description
   * This script generates a table of future events. It displays  event names, their dates, and the number of days until they occur.
   *
   * First, future events are fetched, sorted chronologically, and the time until each event, is calculated. The result is presented in an interactive table.
   *
   * Event details are initially collapsed, and are revealed via a disclosure icon click.
   * A note with a linked reference to the activity card is added to the current day journal page upon clicking the event name.
   * The external link icon clicked  redirects to the original activity card in-graph.
   *
   * @requires logseq-kits
   * @see {@link https://discuss.logseq.com/t/edit-and-run-javascript-code-inside-logseq-itself/20763|Logseq Kits Installation}
   *
   * @usage
   * To use this script:
   * 1. Create a page named "futureEventsTable" in your Logseq graph
   * 2. Add the script inside a JavaScript markdown code block on that page
   * 3. Add the following macro to your Logseq config.edn file:
   *   :futureEventsTable ":futureEventsTable "[:div {:class \"kit inline\" :data-kit \"futureEventsTable\" } ]"
   * 4. Use the macro {{futureEventsTable}} where you want the table to appear
   *
   * @returns {void} This function doesn't return a value but modifies the DOM by appending a table to the provided div.
   *
   */
  
  /** Constant definitions
   *
   * In-graph filter chip definitions
   *  - The filter chips appearing beneath the event table are retrieved from a
   *  page property value in your graph.
   *  - Define the page name and property key below.
   *  Usage:
   *    - Put the activity names you want in chips in kebab-case formatted
   *      block property in DATA_PAGE_NAME. in JSON array format.
   *      E.g:
   *        page: data
   *        - future-events-activity-chips:: ["button", "mushroom face"]
   *
   *  DATA_PAGE_NAME (str):
   *  FUTURE_EVENTS_ACTIVITY_CHIPS_BLOCK_PROPERTY (str):
   */
  const DATA_PAGE_NAME = "data";
  const FUTURE_EVENTS_ACTIVITY_CHIPS_BLOCK_PROPERTY = "futureEventsActivityChips"; // Use camel case here.
  
  
  /**
   * Helper functions
   */
  function applyProcessingFunctions(
    itemArray,
    transformerFunctions,
    [outputFormatterConfig]
  ) {
    // Ensure transformerFunctions is an array
    const transformers = Array.isArray(transformerFunctions[0])
      ? transformerFunctions
      : [transformerFunctions];
  
    // Process each item in the array through all transformers
    const transformedItemsArray = itemArray.map((item) => {
      // Apply each transformer function in sequence to the current item
      return transformers.reduce((processedItem, [transformFn, config]) => {
        return transformFn(config, processedItem);
      }, item);
    });
  
    const formattedOutput = ({ separator } = outputFormatterConfig) =>
      transformedItemsArray.join(separator);
  
    return formattedOutput();
  }
  
  function addPrefixToStringTransformerFn({ prefixString, separator }, baseString) {
    return prefixString.concat(separator, baseString);
  }
  function replaceCharacterTransformerFn({ match, replacement }, baseString) {
    return baseString.replaceAll(match, replacement);
  }
  
  /**
   * @function convertDays
   * @description Convert days to a human-readable format.
   * Less than 2 months: return days
   * 3 years or more: round to nearest year
   * 1-3 years: round to nearest half year
   * 4+ months: round to nearest month
   * 2-4 months: round to nearest half month
   * @param {number} days
   * @returns {string} Human-readable string representing the number of days
   *
   * @example
   * convertDays(30);
   */
  const convertDays = days => {
    const DAYS_IN_MONTH = 30.44; // Average days in a month
    const DAYS_IN_YEAR = 365.25; // Account for leap years
    const months = days / DAYS_IN_MONTH;
    const years = days / DAYS_IN_YEAR;
  
    if (months < 2) return `${days}`;
    if (years >= 3) return `${Math.round(years)} y`;
    if (years >= 1) {
      const roundedYears = Math.round(years * 2) / 2;
      return `${roundedYears} y`;
    }
  
    if (months >= 4) {
      return `${Math.round(months)} m`;
    }
  
    const roundedMonths = Math.round(months * 2) / 2;
    return `${roundedMonths} m`;
  };
  
  /**
   * @function futureEventsTable
   * @param {HTMLElement} div - The DOM element where the future events table will be inserted.
   */
  logseq.kits.setStatic(async function futureEventsTable(div) {
    // Start counting from startDate date into the future. You probably want
    // to start from today
    
  
    async function getJournalUUIDForElement(triggerElement, logLevel = "quiet") {
      // Constants
      const journalRootIdentifier = '.journal-item';
      const journalDateIdentifier = '.journal-title h1';
  
      // Helper functions
      function log(content, verbosity = logLevel) {
  
        if (verbosity == "quiet") { return }
  
        console.group("getJournalUUIDForElement");
        let messagePrefix = '';
        if (verbosity == "error") { messagePrefix = "[error]: "; }
        console.log(messagePrefix + content);
        console.groupEnd();
      }
  
      // Initial sanity check
      if (!triggerElement) { return null; }
      
      // Main logic
      const journalRoot = triggerElement.closest(journalRootIdentifier);
      if (!journalRoot) { log("Not a journal page."); return null; }
  
      const pageDate = journalRoot.querySelector(journalDateIdentifier);
      if (!pageDate) { 
        log("Can't find page date when page date was expected. Check to see if the element selectors have changed.", "error"); 
        return;
      }
  
      const pageUUID = await logseq.api.get_page(pageDate.textContent).uuid;
      return pageUUID;
    }
    const elementJournalUUID = await getJournalUUIDForElement(div);
  
    //[?a :block/name ?activity-page]
    //[(contains? ?activity ?activity-page)]
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() + 1); // Don't show events for today
    const futureEventsPromise = (async (startDate = fromDate) => {
      // Logseq's :journal-day uses the format date YYYYMMDD.
      const logseqStartDate = ((date = startDate) => {
        const month = (date.getMonth() + 1).toString().padStart(2, "0"),
          day = date.getDate().toString().padStart(2, "0"),
          year = date.getFullYear().toString();
        return [year, month, day].join("");
      })();
  
      const futureEventsArray = await (async (startDate = logseqStartDate) => {
        if (typeof startDate != "string") {
          console.log(
            17,
            `function futureEventsArray: Expected startDate
                            to be a string, but it was not.`
          );
        }
        const advancedQuery = `
    [:find ?date ?day ?content ?props ?uuid (distinct ?icon)
    :keys date day content properties uuid icon
    :where
    [?e :block/properties ?props]
    [(get ?props :event) ?event]
    [(get ?props :date) ?date]
    [(get ?props :activity) ?activity]
      [(get ?props :scheduling "") ?scheduling]
      (not [(contains? ?scheduling "CANCELED")])
    [?e :block/refs ?refs]
    [?e :block/content ?content]
    [?e :block/uuid ?uuid]
    [?refs :block/journal-day ?day]
    [(>= ?day ${startDate})] 
    
    [?a :block/name ?activity-page]
    [(contains? ?activity ?activity-page)]
    (or-join [?a ?icon]
             (and
              [?a :block/properties ?activity-props]
              [(get ?activity-props :-icon) ?icon]
              [(some? ?icon)]) ;; :-icon exists and is not nil
             (and
              [?a :block/properties ?activity-props]
              [(get ?activity-props :-icon :not-found) ?icon-or-not-found]
              [(= ?icon-or-not-found :not-found)] ;; :block/properties, but nil icon
              [(identity "0000") ?icon])
             (and ;; no block properties
              [(missing? $ ?a :block/properties)] ;; no :bp
              [(identity "0000") ?icon]))
    ]     
          `;
  
        const queryResults = await logseq.api.datascript_query(advancedQuery);
        console.table(queryResults, "queryResults");
        //const flatQueryResults = queryResults?.flat();
        // The expected format for the :date property is that it includes a single
        // linked reference. Logseq returns that as a single-item array.
        const flatFutureEventsArray = queryResults?.flat().map((appointment) => ({
          ...appointment,
          date: appointment.date[0],
        }));
        return flatFutureEventsArray;
      })();
  
      const chronologicalEvents = ((activities = futureEventsArray) => {
        if (typeof activities.sort != "function") {
          console.log(
            46,
            `function chronologicalEvents: Expected futureEventsArray
                            to be an object, but it was not.`
          );
          return [];
        }
        return [...activities].sort((a, b) => {
          return a.day - b.day;
        });
      })();
  
      console.table(chronologicalEvents, "chronologicalEvents");
  
      const futureEventsWithCountdown = ((
        activities = chronologicalEvents,
        earlierDate = startDate
      ) => {
        if (activities.length == 0) return -1; // No future activiuties
        activities.forEach((activity) => {
          const nextActivityDay = activity.day.toString();
          const year = parseInt(nextActivityDay.slice(0, 4), 10);
          const month = parseInt(nextActivityDay.slice(4, 6), 10) - 1; // Adjust for zero-indexed months
          const day = parseInt(nextActivityDay.slice(6, 8), 10);
          const nextActivityDate = new Date(year, month, day);
  
          const daysUntil = Math.ceil(
            (nextActivityDate - earlierDate) / (1000 * 60 * 60 * 24)
          );
          //console.log(daysUntil);
          activity.daysUntil = daysUntil + 1;
        });
        return activities;
      })();
  
      //console.table(futureEventsWithCountdown);
      return futureEventsWithCountdown;
    })();
  
    result = await futureEventsPromise;
  
    async function toJournalPageUUID(date = new Date()) {
      // TODO: This is going to work for my journal format, but no one elses. See if I can
      // get the journal format from the config file, then convert using built-ins
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
  
      const dayName = days[date.getDay()];
      const monthName = months[date.getMonth()];
      const day = date.getDate();
      const year = date.getFullYear();
  
      const daySuffix = (day) => {
        if (day > 3 && day < 21) return "th"; // special case for 11th-13th
        switch (day % 10) {
          case 1:
            return "st";
          case 2:
            return "nd";
          case 3:
            return "rd";
          default:
            return "th";
        }
      };
  
      const journalDate = `${dayName}, ${monthName} ${day}${daySuffix(day)}, ${year}`;
      console.info(
        `[toJournalPageUUID]: Fetching UUID for journal page with name "${journalDate}"`
      );
  
      const journalUUID = (async (date = journalDate) => {
        const page = await logseq.api.get_page(date);
        console.assert(
          typeof page == "object",
          "[toJournalPageUUID()]: Expected page to be an object but it was not"
        );
        console.assert(
          typeof page?.uuid == "string",
          "[toJournalPageUUID()]: Expected page.uuid to be a string but it was not"
        );
  
        return page?.uuid || null;
      })();
  
      return journalUUID;
    }
  
  
    const todaysJournalUUID = await toJournalPageUUID(new Date());
  
    // Doesn't work because it doesn't deal with ordinals
    // const preferredDateformat = logseq.api.get_user_configs().preferredDateFormat;
    // const myFormattedDate = new simpleDateFormat(preferredDateformat);
    // const todaysJournalUUID = await logseq.api.get_page(myFormattedDate.format())?.uuid;
  
    const table = document.createElement("table");
    table.className = "future-event-table";
    table.setAttribute(
      "x-data",
      `{
        hiddenActivities: $persist([]),
        toggleActivity(activity) {
          if (this.hiddenActivities.includes(activity)) {
            this.hiddenActivities = this.hiddenActivities.filter(a => a !== activity);  
          } else {
           this.hiddenActivities.push(activity);
          }
         },
         isHidden(activity) {
          return this.hiddenActivities.includes(activity); 
          }
        }`
    );
    // const activities = ["anticipated", "medical procedure", "appointment", "medication"];
    const activitiesString = await logseq.api.get_page(DATA_PAGE_NAME).properties[
      FUTURE_EVENTS_ACTIVITY_CHIPS_BLOCK_PROPERTY
    ];
    const activityChips = JSON.parse(activitiesString);
  
    // const chipsList = activities
    const chipsList = activityChips
      .map(
        (activity) => `
        <md-filter-chip
          label="${activity}"
          x-on:click="toggleActivity('${activity}')"
          :selected="!isHidden('${activity}')"
          ></md-filter-chip>
        `
      )
      .join("");
    table.innerHTML = `
    <caption> 
      <md-chip-set>
        ${chipsList}
      </md-chip-set>
    </caption>
  
    <thead>
      <tr>
          <th class="days-until">In</th>
          <th>Event</th>
          <th class="disclosure"></th>
      </tr>
    </thead>
    <tbody>
      ${result
        .map((event, index) => {
          /**
           * Event Time and Participant Formatting
           * Processes event timing and participant details into human-readable format
           */
          const eventTime = () => {
            const time = event.properties.time;
            if (time) return "@ " + time;
            return "";
          };
  
          const withWho = () => {
            const withWho = event.properties.with;
            if (withWho) return "w/ " + withWho;
            return "";
          };
  
          /**
           * Transform Configuration Settings
           * Defines configuration objects for string transformations and formatting
           */
          const activityPrefixTransformerConfig = {
            prefixString: "activityName",
            separator: "-",
          };
          const spaceToDashTransformerConfig = {
            match: " ",
            replacement: "-",
          };
          const joinWithSpacesFormatterConfig = {
            separator: " ",
          };
  
          /**
           * Activity Class Name Generation
           * Applies transformation functions to create CSS class names from activity properties
           */
          const activityClassList = applyProcessingFunctions(
            event.properties.activity,
            [
              [addPrefixToStringTransformerFn, activityPrefixTransformerConfig],
              [replaceCharacterTransformerFn, spaceToDashTransformerConfig],
            ],
            [joinWithSpacesFormatterConfig]
          );
  
          /**
           * Activity Array Serialization
           * Converts activity array into properly escaped string representation
           */
          function buildActivityArrayString(activities) {
            // Escape single and wrap in single quotes to accommodate events
            // with spaces in them.
            return `[${activities
              .map((activity) => `'${activity.replace(/'/g, "\\'")}'`)
              .join(", ")}]`;
          }
  
          return `
          <tr class="${activityClassList}" x-show="!hiddenActivities.some(activity => ${buildActivityArrayString(
            event.properties.activity
          )}.includes(activity))">
              <td rowspan="2" class="days-until"
                  >${convertDays(event.daysUntil)}</td>
              <td class="touch-screen"><a onclick="logseq.api.append_block_in_page('${elementJournalUUID ? elementJournalUUID : todaysJournalUUID}', '{{i-note}}\u0020\\n{{i-event}} [${
            event.properties.event
          }](((${event.uuid})))')"
                      ><span class="icon space-after quarter-bigger">&#x${event.icon[0]};</span> ${event.properties.event}</a></td>
              <td class="touch-screen ti disclosure" style="text-align: right"><a onclick="document.getElementById('event-info-${
                event.uuid
              }').classList.toggle('closed');">&#xea5f;  </a></td>
          </tr>
          <tr x-show="!hiddenActivities.some(activity => ${buildActivityArrayString(
            event.properties.activity
          )}.includes(activity))">
              <td colspan="2" class="closed event-info" id="event-info-${event.uuid}" 
                  ><div class="quick-view-container">${[
                    eventTime(),
                    withWho(),
                    "on",
                    event.date,
                  ].join(
                    " "
                  )}</span><span class="trailing-slot touch-screen-fit bti"><a onclick="logseq.api.push_state('page', { name: '${
            event.uuid
          }' })">&#xea99;</a></span></div></td>
          </tr>`;
        })
        .join("")}
    </tbody>`;
  
    table.addEventListener("mousedown", function cancel(e) {
      e.stopPropagation();
    });
  
    div.appendChild(table);
  });
  
  ```
	- **Re-evaluate kit**
	  {{evalparent}}
- {{kitButton issues,collapseBlock,ea06,-button-style full-width small-caps}}
	- {{embed ((66ccdccf-f9e2-4028-b867-a7b5406fd634))}}
- {{kitButton ideas,collapseBlock,ea76,-button-style full-width small-caps}}
	- {{embed ((66df909d-79a2-4532-917e-94d3bd8b32a8))}}
- {{kitButton questions,collapseBlock,ea76,-button-style full-width small-caps}}
	- {{embed ((66df90b1-ccba-494b-94c9-76f3194e0963))}}
- # Documentation
  id:: 66b750b0-17c1-4fa1-be49-6445f5617ebd
- ### Usage
	- `{{futureEventsTable}}`
-
	- {{futureEventsTable}}
- ```javascript
  const convertDays = days => {
    const DAYS_IN_MONTH = 30.44; // Average days in a month
    const DAYS_IN_YEAR = 365.25; // Account for leap years
    const months = days / DAYS_IN_MONTH;
    const years = days / DAYS_IN_YEAR;
  
    // Less than 2 months: return days
    if (months < 2) return `${days}`;
  
    // 3 years or more: round to nearest year
    if (years >= 3) return `${Math.round(years)} y`;
  
    // 1-3 years: round to nearest half year
    if (years >= 1) {
      const roundedYears = Math.round(years * 2) / 2;
      return `${roundedYears} y`;
    }
  
    // 4+ months: round to nearest month
    if (months >= 4) {
      return `${Math.round(months)} m`;
    }
  
    // 2-4 months: round to nearest half month
    const roundedMonths = Math.round(months * 2) / 2;
    return `${roundedMonths} m`;
  };
  console.log(convertDays(15), "15");      // "15"
  console.log(convertDays(45), "45");      // "45"
  console.log(convertDays(68), "68 = 2 m");      // "2 m"
  console.log(convertDays(69), "69 = 2.5 m");      // "2.5 m"
  console.log(convertDays(75), "2.5 m");      // "2.5 m"
  console.log(convertDays(100), "3.5 m");     // "3.5 m"
  console.log(convertDays(150), "5 m");     // "5 m"
  console.log(convertDays(365), "1 y");     // "1 y"
  console.log(convertDays(550), "1.5 y");     // "1.5 y"
  console.log(convertDays(1095), "3 y");    // "3 y"
  console.log(convertDays(1460), "4 y");    // "4 y"
  ```
	- {{evalparent}}
