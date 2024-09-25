kit:: futureAppointmentTable
depreciated?:: true
created-on:: [[Thursday, Aug 8th, 2024]]
-icon:: f2da

- ### {{i f6ef}}  depreciation warning
      this block is no longer in use
	- {{i ea0b}} *depreciated on* *[[Sunday, Aug 18th, 2024]]*
- ```javascript
  /// backup 
  logseq.kits.setStatic(async function futureAppointmentTable(div) {
    
    const fromDate = new Date();
    const appointmentsArrayPromise = (async (startDate = fromDate) => {
      // Start counting from startDate date into the future. You probably want
      // to start from today.
      // Logseq's :journal-day uses the format date YYYYMMDD.
      const startFromDateLogseq = ((date = startDate) => {
        const month = (date.getMonth() + 1).toString().padStart(2, "0"),
          day = date.getDate().toString().padStart(2, "0"),
          year = date.getFullYear().toString();
        return [year, month, day].join("");
      })();
  
      const futureActivities = await (async (startDate = startFromDateLogseq) => {
        if (typeof startDate != "string") {
          console.log(          16,
            `function futureActivities: Expected startDate
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
        const flatQueryResults = queryResults?.flat();
        // The date is inside a single-item array.
        const flatFutureAppointmentArray = flatQueryResults.map((appointment) => ({
          ...appointment,
          date: appointment.date[0],
        }));
        return flatFutureAppointmentArray;
      })();
  
      const sortedActivities = ((activities = futureActivities) => {
        if (typeof activities.sort != "function") {
          console.log(
            37,
            `function sortedActivities: Expected futureActivities
                      to be an object, but it was not.`
          );
          return [];
        }
        return [...activities].sort((a, b) => {
          return a.day - b.day;
        });
      })();
  
      const activitiesWithDaysUntil = ((
        activities = sortedActivities,
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
          console.log(daysUntil);
          activity.daysUntil = daysUntil;
        });
        return activities;
      })();
  
      return activitiesWithDaysUntil;
    })();
  
  //   return new Promise(async (resolve) => {
  //     resolve(await appointmentsArrayPromise);
  //   });
  
    result = await appointmentsArrayPromise;
    console.table(result);
  
  const tableHTML = `<table class="compact">
      <thead>
        <tr>
          <th class="days-until">Days<br>Until</th>
          <th>Event</th>
        </tr>
      </thead>
      <tbody>
        ${result.map((appointment) => `
          <tr>
            <td class="days-until" rowspan="2">${appointment.daysUntil}</td>
            <td class="clickable"><a href="${appointment.uuid}">${appointment.properties.event}</a></td>
          </tr>
          <tr>
          <td class="event-info" id="info-${appointment.index}">${appointment.time} with ${appointment.with} on ${appointment.date}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>`;
  
    div.innerHTML = tableHTML;
  });
  ```
	- {{evalparent}}
- {{futureAppointmentTable}}
-
-
-
