kit:: nextAppointment
repository:: DeadBranches/logseq-queries-and-scripts

- ```javascript
  logseq.kits.setStatic(function nextAppointment(div){
      const blockId = div.closest(".ls-block").getAttribute("blockid");
      const block = logseq.api.get_block(blockId);
      const content = block.content;
  
      const macroStart = content.indexOf("{{" + div.closest(".macro").dataset.macroName);
      const macroEnd = content.indexOf("}}", macroStart) + 2;
  
  function daysBetween(firstDate, secondDate) {
    const date1 = new Date(firstDate.slice(0, 4), firstDate.slice(4, 6) - 1, firstDate.slice(6, 8));
    const date2 = new Date(secondDate.slice(0, 4), secondDate.slice(4, 6) - 1, secondDate.slice(6, 8));
    const diffInMs = Math.abs(date2 - date1);
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    return diffInDays;
  }
  
  function formatDate(date) {
    const d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();
  
    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('');
  }
  
    const today = formatDate(new Date());
    
  const queryResults = logseq.api.datascript_query(`
   [:find (min ?day) ?date ?day ?content ?props
   :keys min-day date day content properties
    :where
    [?e :block/properties ?props]
    [(get ?props :event) ?event]
    [(get ?props :date) ?date]
    [?e :block/refs ?refs]
    [?e :block/content ?content]
    [?refs :block/journal-day ?day]
    [(>= ?day ${today})]
  ]
  `)?.flat();
  
  // Assuming the query returns an array of results, we take the first result
  const firstResult = queryResults?.[0];
  
  // Extract the min-day and today values
  const minDay = firstResult?.['min-day'];
  //const today = firstResult?.['today'];
  
      const days = daysBetween(String(minDay), String(today));
    //return `Days between today and the next appointment: ${days}`;
  // Check if both minDay and today are available
  if (minDay && today) {
    const days = daysBetween(String(minDay), String(today));
    if (days == 1) { daysWord = "day"}
    	else { daysWord = "days "}
     div.innerHTML = `in ${days} ${daysWord}`;
  } else {
  div.innerHTML = 'No upcoming appointments found.';
  }
    
    // Calculate the number of days until the next appointment
   /* if (minDay) {
      const daysUntilNextAppointment = daysBetween(String(minDay), today);
      // Update the macro div to show the number of days until the next appointment
      div.innerHTML = `Days until next appointment: ${daysUntilNextAppointment}`;
    } else {
      div.innerHTML = 'No upcoming appointments found.';
    }*/
  });
  ```
- {{tk}}
  id:: 66662ffd-b21a-49d1-a203-db8437a639d8
- #+BEGIN_QUERY
  {:query
  [:find (pull ?b [*])
  :where
  [?b :block/uuid #uuid "((66662ffd-b21a-49d1-a203-db8437a639d8))"]
  ]
  }
  #+END_QUERY