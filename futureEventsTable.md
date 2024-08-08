kit:: futureEventsTable

- ```javascript
  logseq.kits.setStatic(async function futureEventsTable(div) {
    // Start counting from startDate date into the future. You probably want
    // to start from today
    const fromDate = new Date();
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
                  [:find ?date ?day ?content ?props
                  :keys date day content properties
                  :where
                  [?e :block/properties ?props]
                  [(get ?props :event) ?event]
                  [(get ?props :date) ?date] 
                  [?e :block/refs ?refs]
                  [?e :block/content ?content]
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
  
      return futureEventsWithCountdown;
    })();
  
    result = await futureEventsPromise;
  
    const table = document.createElement("table");
    table.className = "compact future-event-table";
  /*
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
  
    const daysUntilHeader = document.createElement("th");
    daysUntilHeader.className = "days-until";
    daysUntilHeader.innerHTML = "Days<br>Until";
  
    const eventHeader = document.createElement("th");
    const eventHeaderSpan = document.createElement("span");
    eventHeaderSpan.className = "mooo";
    eventHeaderSpan.textContent = "Event";
    eventHeaderSpan.addEventListener("click", function (e) {
      e.stopImmediatePropagation();
      e.preventDefault();
      e.stopPropagation();
      console.log("Header clicked");
    });
    eventHeader.appendChild(eventHeaderSpan);
  
    headerRow.appendChild(daysUntilHeader);
    headerRow.appendChild(eventHeader);
    thead.appendChild(headerRow);
    table.appendChild(thead);
  
    const tbody = document.createElement("tbody");
  
    result.forEach((event, index) => {
      const firstRow = document.createElement("tr");
      const secondRow = document.createElement("tr");
  
      const daysUntilCell = document.createElement("td");
      daysUntilCell.rowSpan = 2;
      daysUntilCell.className = "days-until";
      daysUntilCell.textContent = event.daysUntil;
      daysUntilCell.addEventListener("click", function (e) {
        e.stopPropagation();
        console.log("Days until cell clicked");
      });
  
      const eventCell = document.createElement("td");
      eventCell.className = "clickable";
      eventCell.id = `event-table-${index}`;
      const eventLink = document.createElement("a");
      eventLink.href = event.uuid;
      eventLink.textContent = event.properties.event;
      eventCell.appendChild(eventLink);
  
      const infoCell = document.createElement("td");
      infoCell.className = "event-info";
      infoCell.textContent = `${event.date} ${event.time} ${event.with}`;
  
      firstRow.appendChild(daysUntilCell);
      firstRow.appendChild(eventCell);
      secondRow.appendChild(infoCell);
  
      tbody.appendChild(firstRow);
      tbody.appendChild(secondRow);
    });
    */
    
  table.addEventListener("mousedown", function cancel(e){
      e.stopPropagation()
  })
    //table.appendChild(tbody);
  
  
    // //console.table(result);
    // const table = document.createElement("table");
    // table.className = "compact future-event-table";
     table.innerHTML = `
     <thead>
       <tr>
         <th class="days-until">Days<br>Until</th>
         <th><span class="mooo" onclick="headerClicked(event)">Event</th>
       </tr>
     </thead>
     <tbody>
       ${result
         .map(
           (event, index) => `
       <tr>
         <td rowspan="2" class="days-until" onclick="cellClicked(event)">${event.daysUntil}</td>
         <td class="clickable" id="event-table-${index}"><a href="${event.uuid}">${event.properties.event}</a></td>
       </tr>
       <tr>
         <td class="event-info">${event.date} ${event.time} ${event.with}<br></td>
       </tr>`
         )
         .join("")}
     </tbody>`;
      div.appendChild(table);
    
     //div.appendChild(table);
  
    // const parentNode = div.closest(".block-main-container");
  
    // // Maybe if I attach the objects to window?
    // window.futureEventsCallback = (mutationList, observer) => {
    //   mutationList.forEach((mutation) => {
    //     if (mutation.type !== "childList") return;
    //     //console.log("huh?")
    //     mutation.addedNodes.forEach((node) => {
    //       if (!node.className) return;
  
    //       console.log(node.className);
    //       console.log(typeof node.className);
    //       if (node.className.includes("future-event-table")) {
    //         console.log("got-emm");
    //         const cowElement = document.querySelector(".mooo");
    //         cowElement.addEventListener("click", function onClicked(e) {
    //           e.preventDefault();
    //           e.stopPropagation();
    //           console.log("STOPPOPOP.");
    //         });
    //       }
    //     });
    //   });
    // };
    // function stopIt(event) {
    //   console.log("STOPIT CALLED");
    //   event.stopImmediatePropagation();
    //   event.preventDefault();
    //   event.stopPropagation();
    //   console.log(this.className); // logs the className of my_element
    //   console.log(event.currentTarget === this); // logs `true`
    // }
    // if (!window.eventTableObserver) {
    //   window.eventTableObserver = new MutationObserver(futureEventsCallback);
    //   if (parentNode) {
    //     eventTableObserver.observe(parentNode, {
    //       attributes: true,
    //       childList: true,
    //       subtree: true,
    //     });
    //     console.log("Observer started");
    //   } else {
    //     console.log("Target node not found");
    //   }
    // }
  });
  
  ```
	- {{evalparent}}
- <span onClick="{evt => {
      evt.preventDefault();
      onClick && onClick();
    }} {...props}">
      {children}
    </span>
- {{futureEventsTable}}
- \`\`\`javascript
  const targetNode = document.getElementById("event-table-0");
  const config = { attributes: true, childList: true, subtree: true };
  
  // Callback function to execute when mutations are observed
  const callback = (mutationList, observer) => {
    for const mutation of mutationList) {
      console.log(`A mutation has been observed. Mutation type: ${mutation.type}`);
    }
  }
  ```
