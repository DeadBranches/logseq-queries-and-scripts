kit:: futureEventsTable

- ```javascript
  logseq.kits.setStatic(async function futureEventsTable(div) {
    // Start counting from startDate date into the future. You probably want
    // to start from today
    const fromDate = new Date();
    const futureEventsPromise = (async (startDate = fromDate) => {
  
      // Logseq's :journal-day uses the format date YYYYMMDD.
      const toLogseqDate = (date = startDate) => {
        const month = (date.getMonth() + 1).toString().padStart(2, "0"),
          day = date.getDate().toString().padStart(2, "0"),
          year = date.getFullYear().toString();
        return [year, month, day].join("");
      };
  
      const logseqStartDate = toLogseqDate(date = startDate);
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
                      [?e :block/refs ?refs]
                      [?e :block/content ?content]
                      [?e :block/uuid ?uuid]
                      [?refs :block/journal-day ?day]
                      [(>= ?day ${startDate})]
                      ]`;
  
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
          activity.daysUntil = daysUntil;
        });
        return activities;
      })();
  
      //console.table(futureEventsWithCountdown);
      return futureEventsWithCountdown;
    })();
  
    result = await futureEventsPromise;
  
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
              (event, index) => `
              <tr>
                  <td rowspan="2" class="days-until"
                      >${event.daysUntil}</td>
                  <td class="touch-screen"><a onclick="document.getElementById('event-info-${event.uuid}').classList.toggle('closed');"
                          >${event.properties.event}</a></td>
                          <td class="touch-screen ti disclosure"><a onclick="document.getElementById('event-info-${event.uuid}').classList.toggle('closed');">&#xea5f;</a></td>
              </tr>
              <tr>
                  <td colspan="2" class="event-info closed" id="event-info-${event.uuid}"
                      >${event.date} with ${event.properties.with} at ${event.properties.time}</td>
              </tr>`
            )
            .join("")}
      </tbody>`;
  
    table.addEventListener("mousedown", function cancel(e) {
      e.stopPropagation();
    });
  
    div.appendChild(table);
  });
  ```
	- {{evalparent}}
- id:: 66b750b0-17c1-4fa1-be49-6445f5617ebd
- {{futureEventsTable}}
	-
- ```shell
  const targetNode = document.getElementById("event-table-0");
  const config = { attributes: true, childList: true, subtree: true };
  
  // Callback function to execute when mutations are observed
  const callback = (mutationList, observer) => {
    for const mutation of mutationList) {
      console.log(`A mutation has been observed. Mutation type: ${mutation.type}`);
    }
  }
  ```
- [[hi]]
- ```shell
  // ONE TIME MY CODE WAS THIS
  const parentNode = div.closest(".block-main-container");
    // // Maybe if I attach the objects to window?
    window.futureEventsCallback = (mutationList, observer) => {
      mutationList.forEach((mutation) => {
        if (mutation.type !== "childList") return;
        //console.log("huh?")
        mutation.addedNodes.forEach((node) => {
          if (!node.className) return;
  
          console.log(node.className);
          console.log(typeof node.className);
          if (node.className.includes("future-event-table")) {
            console.log("got-emm");
            const cowElement = document.querySelector(".mooo");
            cowElement.addEventListener("click", function onClicked(e) {
              e.preventDefault();
              e.stopPropagation();
              console.log("STOPPOPOP.");
            });
          }
        });
      });
    };
    function stopIt(event) {
      console.log("STOPIT CALLED");
      event.stopImmediatePropagation();
      event.preventDefault();
      event.stopPropagation();
      console.log(this.className); // logs the className of my_element
      console.log(event.currentTarget === this); // logs `true`
    }
    if (!window.eventTableObserver) {
      window.eventTableObserver = new MutationObserver(futureEventsCallback);
      if (parentNode) {
        eventTableObserver.observe(parentNode, {
          attributes: true,
          childList: true,
          subtree: true,
        });
        console.log("Observer started");
      } else {
        console.log("Target node not found");
      }
    }
  ```
