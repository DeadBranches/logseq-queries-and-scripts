kit:: futureEventsTable
created-on:: [[Saturday, Aug 10th, 2024]]

- ```javascript
  /**
   * @file futureEventsTable.md
   * @description 
   * This script generates a comprehensive table of future events in Logseq, providing users with a clear visualization of upcoming activities. It offers a quick overview of events, their dates, and the number of days until they occur, enhancing planning and time management within Logseq.
   * 
   * The script fetches future events from Logseq's database, sorts them chronologically, calculates the time until each event, and presents the information in an interactive HTML table. Users can easily add notes about events to their current journal page and view additional event details through a collapsible interface.
   * 
   * @function futureEventsTable
   * @param {HTMLElement} div - The DOM element where the future events table will be inserted.
   * 
   * @requires logseq-kits
   * @see {@link https://discuss.logseq.com/t/edit-and-run-javascript-code-inside-logseq-itself/20763|Logseq Kits Installation}
   * 
   * @example
   * // To use this script:
   * // 1. Create a page named "futureEventsTable" in your Logseq graph
   * // 2. Add the script inside a JavaScript markdown code block on that page
   * // 3. Add the following macro to your Logseq config.edn file:
   * // :futureEventsTable ":futureEventsTable "[:div {:class \"kit inline\" :data-kit \"futureEventsTable\" } ]"
   * // 4. Use the macro {{futureEventsTable}} where you want the table to appear
   * 
   * @returns {void} This function doesn't return a value but modifies the DOM by appending a table to the provided div.
   */
  
  
  logseq.kits.setStatic(async function futureEventsTable(div) {
    // Start counting from startDate date into the future. You probably want
    // to start from today
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() +1); // Don't show events for today
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
  [:find ?date ?day ?content ?props ?uuid
  :keys date day content properties uuid
  :where
  [?e :block/properties ?props]
  [(get ?props :event) ?event]
  [(get ?props :date) ?date]
    [(get ?props :scheduling "") ?scheduling]
    (not [(contains? ?scheduling "CANCELED")])
  [?e :block/refs ?refs]
  [?e :block/content ?content]
  [?e :block/uuid ?uuid]
  [?refs :block/journal-day ?day]
  [(>= ?day ${startDate})] ]     
        `;
  
        const queryResults = await logseq.api.datascript_query(advancedQuery);
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
        'Sunday', 'Monday', 
        'Tuesday', 'Wednesday', 
        'Thursday', 'Friday',
        'Saturday'
      ];
      const months = [
        'Jan', 'Feb', 'Mar', 
        'Apr', 'May', 'Jun', 
        'Jul', 'Aug', 'Sep', 
        'Oct', 'Nov', 'Dec'];
  
      const dayName = days[date.getDay()];
      const monthName = months[date.getMonth()];
      const day = date.getDate();
      const year = date.getFullYear();
    
      const daySuffix = (day) => {
          if (day > 3 && day < 21) return 'th'; // special case for 11th-13th
          switch (day % 10) {
              case 1: return 'st';
              case 2: return 'nd';
              case 3: return 'rd';
              default: return 'th';
          }
      };
    
      const journalDate = `${dayName}, ${monthName} ${day}${daySuffix(day)}, ${year}`;
      console.info(`[toJournalPageUUID]: Fetching UUID for journal page with name "${journalDate}"`);
      
      const journalUUID = (async (date = journalDate) => {
        const page = await logseq.api.get_page(date);
        console.assert(typeof page == "object", "[toJournalPageUUID()]: Expected page to be an object but it was not");
        console.assert(typeof page?.uuid == "string", "[toJournalPageUUID()]: Expected page.uuid to be a string but it was not");
  
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
    table.innerHTML = `<thead>
          <tr>
              <th class="days-until">In<br><small>days</small></th>
              <th>Event</th>
              <th class="disclosure"></th>
          </tr>
      </thead>
      <tbody>
          ${result
            .map(
              (event, index) => {
                // Since the first event is already displayed in the upcoming events
                // journal widget, don't repeat it in the table. (nevermind)
                // if (event.day === result[0].day) return ''; 
                return `
              <tr>
                  <td rowspan="2" class="days-until"
                      >${event.daysUntil}</td>
                  <td class="touch-screen"><a onclick="logseq.api.append_block_in_page('${todaysJournalUUID}', '{{i-note}}\u0020\\n{{i-event}} [${event.properties.event}](((${event.uuid})))')"
                          >${event.properties.event}</a></td>
                  <td class="touch-screen ti disclosure" style="text-align: right"><a onclick="document.getElementById('event-info-${event.uuid}').classList.toggle('closed');">&#xea5f;  </a></td>
              </tr>
              <tr>
                  <td colspan="2" class="closed event-info" id="event-info-${event.uuid}" 
                      ><div class="quick-view-container"><span class="content-slot">@ ${event.properties.time} w/ ${event.properties.with} on ${event.date}</span><span class="trailing-slot touch-screen-fit bti"><a onclick="logseq.api.push_state('page', { name: '${event.uuid}' })">&#xea99;</a></span></div></td>
              </tr>`}
            )
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
- # Documentation
  id:: 66b750b0-17c1-4fa1-be49-6445f5617ebd
- ### Usage
	- `{{futureEventsTable}}`
-
	- {{futureEventsTable}}
- TODO
-
-
