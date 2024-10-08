kit:: nextAppointment
repository:: DeadBranches/logseq-queries-and-scripts
description:: Replace-macro that returns the number of days until the next appointment.
created-on:: [[Wednesday, Jun 26th, 2024]]

- ```javascript
  logseq.kits.nextAppointment = nextAppointment;
  
  //logseq.kits.setStatic(function nextAppointment(div) {
  async function nextAppointment(div) {
  /**
     * @returns {number} 
     * -1 if there is no future appointments, 
     * 0 if the next appointment is today, 
     * int the number of days until the next appointment if it's in the future
     */
  
  
    /**
     * Helper functions
     */
    function debugMsg(items, dataAttribute = div.dataset.debug) {
      // An empty first argument to a logseq macro is passed as "$1"
      if (dataAttribute == "$1") {
        return;
      }
      for (let i = 0; i < items.length; i++) {
        console.log(`${items[i]}`);
      }
    }
  
    function toLogseqJournalDate(date) {
      // Logseq's :block/journal-date format is YYYYMMDD
      const d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
      return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('');
    }
  
    /**
     * Query for appointments using logseq api
     */
    const todaysJournalDate = toLogseqJournalDate(new Date());
    const futureAppointmentArray = await logseq.api.datascript_query(`
      [:find (min ?day) ?date ?day ?content ?props
      :keys min-day date day content properties
      :where
        [?e :block/properties ?props]
        [(get ?props :event) ?event]
        [(get ?props :date) ?date]
        [?e :block/refs ?refs]
        [?e :block/content ?content]
        [?refs :block/journal-day ?day]
        [(>= ?day ${todaysJournalDate})]
      ]
      `);
    const flatFutureAppointmentArray = futureAppointmentArray.map(appointment => ({
      ...appointment,
      date: appointment.date[0]
    }));
    //console.table(flatFutureAppointmentArray);
    const futureAppointments = futureAppointmentArray?.flat();
    //console.table(futureAppointments);
  
  
    // Return early if there are no appointments
    if (futureAppointments.length === 0) {
      let appointmentResultType = -1;
      if (div) {
        // if div is set, the kit is being evaluated from the {{nextAppointment}} macro
        div.innerHTML = 'No upcoming appointments found.';
      }
      return appointmentResultType;
    }
  
  
    /**
     * Sorts an array of appointment objects by their 'day' property in ascending order.
     * @param {Array<{day: number}>} appointments - The array of appointment objects to sort.
     * @returns {Array<{day: number}>} A new sorted array of appointment objects.
     * @throws {Error} If the input is not an array or if any item doesn't have a 'day' property.
     */
    function sortAppointmentsChronologically(appointments) {
      if (!Array.isArray(appointments)) {
        throw new Error('Input must be an array');
      }
  
      return [...appointments].sort((a, b) => {
        if (typeof a.day !== 'number' || typeof b.day !== 'number') {
          throw new Error('Each item in the array must have a numeric "day" property');
        }
        return a.day - b.day;
      });
    }
  
    /**
     * Retrieves the date of the next appointment from an array of future appointments.
     * @param {Array<{day: number}>} futureAppointments - The array of future appointment objects.
     * @param {Function} sortingFunction - The function used to sort the appointments.
     * @returns {number} The date of the next appointment in :block/journal-date format (YYYYMMDD).
     * @throws {Error} If the input is not an array or if any item doesn't have a 'day' property.
     */
    function getNextAppointmentJournalDate(futureAppointments, sortingFunction) {
      if (!Array.isArray(futureAppointments)) {
        throw new Error('Input must be an array');
      }
  
      if (futureAppointments.length === 1) {
        if (typeof futureAppointments[0].day !== 'number') {
          throw new Error('Each item in the array must have a numeric "day" property');
        }
        return futureAppointments[0].day;
      }
  
      const sortedAppointments = sortingFunction(futureAppointments);
      return sortedAppointments[0].day;
    }
  
  
    /**
     * Calculates the number of days between two dates in Logseq journal format (YYYYMMDD).
     * @param {string} laterDate - The earlier date in YYYYMMDD format.
     * @param {string} earlierDate - The later date in YYYYMMDD format.
     * @returns {number} The number of days between the two dates.
     * @throws {Error} If either date is not in the correct format or if the end date is earlier than the start date.
     */
    const daysBetweenJournalDates = (laterDate, earlierDate) => {
      const convertToDate = (date) => {
        if (!/^\d{8}$/.test(date)) {
          throw new Error(`Invalid date format: ${date}. Expected YYYYMMDD.`);
        }
  
        const dateString = String(date); // .split() expects a string, but dateOfNextAppointment may be a number
        const year = parseInt(dateString.slice(0, 4), 10);
        const month = parseInt(dateString.slice(4, 6), 10) - 1; // Adjust for zero-indexed months
        const day = parseInt(dateString.slice(6, 8), 10);
        return new Date(year, month, day);
      };
  
      const dateSpanEnd = convertToDate(laterDate);
      const dateSpanStart = convertToDate(earlierDate);
      const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
      return Math.ceil((dateSpanEnd - dateSpanStart) / MILLISECONDS_PER_DAY);
    };
  
  
    const dateOfNextAppointment = getNextAppointmentJournalDate(futureAppointments, sortAppointmentsChronologically);
    const daysUntilNextAppointment = daysBetweenJournalDates(dateOfNextAppointment, todaysJournalDate);
  
    console.log(`
      todaysJournalDate (${typeof (todaysJournalDate)}): ${todaysJournalDate}\n
      dateofNextAppointment (${typeof (dateOfNextAppointment)}): ${dateOfNextAppointment}
      daysUntilNextAppointment (${typeof (daysUntilNextAppointment)}): ${daysUntilNextAppointment}`);
  
  
    if (div) {
      // Set the macro text
      div.innerHTML = `in ${daysUntilNextAppointment} days`;
    }
  
    return daysUntilNextAppointment;
  };
  
  //return "hi";
  //console.log("outside nextAppointment kit function");
  ```
	- {{evalparent}}
	  id:: 66662ffd-b21a-49d1-a203-db8437a639d8
- {{nextAppointment debug}}`
	- > ```
	  function getNextAppointment() {
	    const nextValue = logseq.kits.nextAppointment();
	    return nextValue;
	  }
	  const returnValue = getNextAppointment();
	  console.log(returnValue);
	  return returnValue;
	  ```
		- {{evalparent}}
-
-
-
-
-
