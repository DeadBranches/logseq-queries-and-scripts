kit:: daysUntilNextAppointment
description:: replacement for nextAppointment. Can be called from `logseq.kits.daysUntilNextAppointment`

- ```javascript
  logseq.kits.setStatic(function daysUntilNextAppointment() {
  
      const todaysDate = new Date();
      const appointmentsArrayPromise = (async (startDate = todaysDate) => {
  
          // Start counting from startDate date into the future. You probably want 
          // to start from today.
          // Logseq's :journal-day uses the format date YYYYMMDD.
          const startFromDateLogseq = ((date = startDate) => {
              const month = (date.getMonth() + 1).toString()
                  .padStart(2, '0'),
                  day = date.getDate().toString()
                      .padStart(2, '0'),
                  year = date.getFullYear().toString();
              return [year, month, day].join('');
          })();
  
          const futureActivities = await (async (startDate = startFromDateLogseq) => {
              if (typeof startDate != 'string') {
                  console.log(16, `function futureActivities: Expected startDate
                      to be a string, but it was not.`);
              };
              const advancedQuery = `
                  [:find (min ?day) ?date ?day ?content ?props
                  :keys min-day date day content properties
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
              return queryResults?.flat();
          })();
  
          const sortedActivities = ((activities = futureActivities) => {
              if (typeof activities.sort != 'function') {
                  console.log(37, `function sortedActivities: Expected futureActivities
                      to be an object, but it was not.`);
                  return [];
              }
              return [...activities].sort((a, b) => {
                  return a.day - b.day;
              });
          })();
  
          return daysUntilNextActivity = ((
              activities = sortedActivities,
              earlierDate = startDate) => {
              if (activities.length == 0) {
                  return -1; // No future activities.
              }
  
              const nextActivityDay = activities[0].day.toString();
              const year = parseInt(nextActivityDay.slice(0, 4), 10);
              const month = parseInt(nextActivityDay.slice(4, 6), 10) - 1; // Adjust for zero-indexed months
              const day = parseInt(nextActivityDay.slice(6, 8), 10);
              const nextActivityDate = new Date(year, month, day);
  
              return Math.ceil((nextActivityDate - earlierDate) / (1000 * 60 * 60 * 24));
          })();
  
          //return daysUntilNextActivity;
      })();
  
      return new Promise(async (resolve) => {
          resolve(await appointmentsArrayPromise);
      })
      //return JSON.stringify();
  });
  ```
	- {{evalparent}}
-
