kit:: kitButton [label] <kit-name> [icon] [positive-class | {-inline | -button-style | -button-shape | -hover | -active}] | [arguments]
description:: kitButton [label] <kit-name> [icon] [positive-class | {-inline | -button-style | -button-shape | -hover | -active}] | [arguments]

- ```javascript
  function daysUntilNextAppointment() {
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
                  [(get ?props :scheduling "") ?scheduling]
                  (not [(contains? ?scheduling "CANCELED")])
                  
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
  };
  
  logseq.kits.setStatic(async function kitButton(div) {
      (async function () {
        while (typeof logseq.kits !== "object") {
          await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for 100 milliseconds
        }
        console.log("logseq.kits is loaded");
        // The rest of your code will follow naturally here
        // For example:
        // yourFunction();
      })();
    
      (async function () {
        while (typeof logseq.kits.nextAppointment !== "function") {
          await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for 100 milliseconds
        }
        console.log("logseq.kits is loaded");
        // The rest of your code will follow naturally here
        // For example:
        // yourFunction();
      })();
    
      //await ensureKitsLoaded();
    
      //async function kitButton(div) {
      //console.log("kitButton function initiated");
      const DEFAULT_CLASSES = "kit kitbutton inline button-style button-shape hover active";
      const ICON_DATA_ATTRIBUTE = "data-button-icon";
      const LABEL_DATA_ATTRIBUTE = "data-button-text";
      const ARGUMENTS_DATA_ATTRIBUTE = "data-arguments";
      const kitPage = div.dataset.kitPage;
    
      // Expect null logseq macro arguments to return `$1` or "''", so filter to an empty string
      const sanitizeAttribute = (value) =>
        value.startsWith("$") || value === "''" ? "" : value;
    
      const classModifiers = sanitizeAttribute(div.dataset.buttonClass);
      let buttonText = sanitizeAttribute(div.dataset.buttonLabel);
    
      /**
       * In some instances we may wish to remove classes from the default list of values.
       * By passing a class name prefixed with a hyphen (e.g. -button-style) to the class
       * argument ($4) the class is removed.
       *
       * Built-in Style Filters
       * ----------------------
       * Style filters apply a javascript expression to the button label to style it in
       * specific ways. A style filter is enabled by passing the filter name and arguments
       * in as one of the kitButton class arguments ($4)
       *
       * Available filters:
       *  +bold-nth-word:n - Bold a single word (n)
       */
      let appliedStyleFilters = {}; // Object to store style expressions
      function applyStyleFilter(defaultClasses, customClasses) {
        const classArray = defaultClasses.split(" ");
        const customClassArray = customClasses.split(" ");
        const additionalClasses = [];
    
        customClassArray.forEach((className) => {
          if (className.startsWith("-")) {
            let classToRemove = className.slice(1);
            let removeIndex = classArray.indexOf(classToRemove);
            classArray.splice(removeIndex, 1);
          } else if (className.startsWith("+")) {
            const [expressionName, argumentValue] = className.slice(1).split(":");
            appliedStyleFilters[expressionName] = argumentValue || false;
          } else {
            additionalClasses.push(className);
          }
        });
        return [...classArray, ...additionalClasses].join(" ");
      }
    
      // customClass can be multiple space seperated values.
      const buttonClassValue =
        classModifiers === ""
          ? DEFAULT_CLASSES
          : applyStyleFilter(DEFAULT_CLASSES, classModifiers);
    
      /** Process button label text
       * For each word, we might:
       *  bold it (if bold-nth-word is set)
       *  transform it (if the label text contains /|\w+|/)
       */
      const processKitsInLabel = async (label) => {
        const words = label.split(" ");
        const processedWords = await Promise.all(
          words.map(async (word) => {
            if (!word.startsWith("|") && !word.endsWith("|")) {
              return word;
            }
            let kitName = word.slice(1, -1);
            let kitResult;
            switch (kitName) {
              case "nextAppointment":
                kitResult = await daysUntilNextAppointment();
                break;
              default:
                kitResult = word;
                break;
            };
            return kitResult;
          })
        );
        return processedWords.join(" ");
      };
      buttonText = await processKitsInLabel(buttonText);
    
      /* old way of filtering the word label */
      if ("bold-nth-word" in appliedStyleFilters) {
        const boldWordIndex = appliedStyleFilters["bold-nth-word"]
          ? parseInt(appliedStyleFilters["bold-nth-word"]) - 1
          : 0;
    
        labelWordArray = buttonText.split(" ").map((word, index) => {
          return index === boldWordIndex ? `<span class="bold">${word}</span>` : word;
        });
        console.log(JSON.stringify(labelWordArray));
        buttonText = labelWordArray.join(" ");
      }
    
      /**
       * To support icon-only buttons, use a data-attribute indicating the presence of a text
       * label or icon glyph. Thus, whitespace can be intelligently included to pad text and
       * icon if and only if necessicary.
       */
      const buttonTextDataAttribute = buttonText ? `${LABEL_DATA_ATTRIBUTE}="true"` : "";
      const buttonIcon = sanitizeAttribute(div.dataset.buttonIcon);
      const iconGlyphCodes = (glyphs) =>
        glyphs
          .split(" ")
          .map((hexCode) => `&#x${hexCode};`)
          .join(" ");
    
      const iconDataAttribute =
        buttonIcon && `${ICON_DATA_ATTRIBUTE}="${iconGlyphCodes(buttonIcon)}"`; // && = first falsy or last truthy if all true
    
      const processDataAttributes = (input) => {
        if (!input) return "";
        // Allow the user to pass a single attribute, e.g. "mushrooms"
        if (!input.includes("=")) {
          console.log("no input");
          return `data-argument="${input}"`;
        }
        // Expect multiple data attributes to be 1) single quoted, and 2) space-separated.
        // e.g. mushroom='hi' bunny='no', so splitting on "' " results in key-value pairs
        if (!input.includes("' ")) {
          console.log(`Input is set, contains an =, does not contain "' ", therefore
                             this is a single argument. Don't split on "' "`);
          const [key, value] = input.split("=");
          const processedValue = value.replaceAll("'", "");
          return `data-${key}="${processedValue}"`;
        }
    
        return input
          .split("' ")
          .map((pair) => {
            const [key, value] = pair.split("=");
            const processedValue = value.replaceAll("'", "");
            return `data-${key}="${processedValue}"`;
          })
          .join(" ");
      };
    
      const kitArguments = sanitizeAttribute(div.dataset.arguments);
      const dataAttributes = processDataAttributes(kitArguments);
      div.innerHTML = `<button class="${buttonClassValue}" data-kit='runpage' data-kit-macro="kitButton" data-page-name='${kitPage}' ${iconDataAttribute} ${buttonTextDataAttribute} ${dataAttributes} type="button">${buttonText}</button>`;
    
    });
    
    
  ```
	- {{evalparent}}
- # Ideas
	- ```
	  - INPUT
	      - KIT CONFIGURATION
	          - List of data attribute names to include with rendered html
	              - data-button-icon
	              - data-button-text
	          - List of default classes to include with any button's html
	          - Name of the data attribute on the parent `div` element in which I can find the value provided to the various `{{kitButton}}` positional arguments.
	              - DATA ATTRIBUTES
	                  - | positional argument | data attribute |
	                    | $1 | div.dataset.buttonLabel? |
	                    | $2 | div.dataset.kitPage |
	                    | $3 | div.dataset.buttonIcon |
	                    | $4 | div.dataset.buttonClass [:br] rename to classes? |
	                    | $5 | arguments
	  
	      - data attribute sanitization
	  
	      - INPUT PROCESSING
	          - class flags
	              - remove individual classes prefixed with `-` from the default list of class names 
	      - label text
	  ```
- # Changes
	- [[Thursday, Jul 25th, 2024]] Modified kitbutton to accept arguments as $5, but this time instead of just setting them all to data-arguments data attribute, it actually manually sets the data attributes when it is in the format attribute-name='value'.
	  id:: 66a31038-3455-4ded-8d20-89e5e790dc76
		- So, to get the same behaviour as before now I need to do $5 = argument='something'
		- But, now I can pass multiple attributes all at once
- # Tests
	- {{kitButton hi,testkit,hi,+bold-nth-word:3,hi}}
	- {{kitButton hi}}
	-
	- Kit button variations
		- Icon only, full width.
		  *-button-style full-width*
		  {{kitButton '',testkit,ef49,-button-style full-width}}
		- Text only, full width.
		  *-button-style full-width*
		  {{kitButton hi mom,testkit,'',-button-style full-width}}
		- Icon and text, full width.
		  {{kitButton hi mom,testkit,ef49,-button-style full-width}}
		- Long inline buttons
		  {{kitButton kitButton long,testkit,f3f3,long}} {{kitButton text-only,testkit,'',long}}
		- icon only button, inline. 
		  {{kitButton '',testkit,f3f3}}
		- Text and icon buttons, inline.
		  {{kitButton hi,testkit,f3f3}} {{kitButton hi,testkit,f3f3}}
		- Kit button, full-width.
		  {{kitButton hi,testkit,f3f3,full-width}}
		- Kit buttons, inline, full width.
		  {{kitButton hi,testkit,f3f3,full-width}} {{kitButton hi,testkit,f3f3,full-width}}
		- kitbutton, inline button-style button-shape hover active
		  {{kitButton hi,testkit,f3f3}}
		- Control (raw text)
		  {{i f3f3}} hi
		- -button-style
		  {{kitButton hi,testkit,f3f3,-button-style}}
		- -button-style full-width
		  {{kitButton hi,testkit,f3f3,-button-style full-width}}
		- -button-style full-width flex-grow-1
		  {{kitButton hi,testkit,f3f3,-button-style full-width flex-grow-1}}
		- -button-style, flex-grow-1
		  {{kitButton hi,testkit,f3f3,-button-style flex-grow-1}}
		- Inline text and icons, full-width (flex-grow-1 | flex-grow-2)
		  {{kitButton hi,testkit,f3f3,-button-style full-width flex-grow-1}} {{kitButton hi,testkit,f3f3,-button-style full-width flex-grow-2}}
		- Kit button, flex-grow-2 | flex-grow-1
		  {{kitButton hi,testkit,f3f3,-button-style flex-grow-2}} {{kitButton hi,testkit,f3f3,-button-style flex-grow-1}}
		- Kit style expression test
			- +bold-nth-word
			- {{kitButton hi mom,testkit,f3f3,-button-style full-width flex-grow-1 +bold-nth-word}}
			- +bold-nth-word:1
			  {{kitButton hi mom,testkit,f3f3,-button-style full-width flex-grow-1 +bold-nth-word:1}}
			- +bold-nth-word:2
			- #### {{kitButton hi mom,testkit,f3f3,-button-style full-width flex-grow-1 +bold-nth-word:2}}
		- kit label evaluation test
			- {{kitButton Next appointment in |nextAppointment| days,collapseBlock}}
		- kit label + style expression filtering test
			- #### {{kitButton Next appointment in |nextAppointment| days,testkit,f3f3,-button-style full-width flex-grow-1 +bold-nth-word:2}}
		- Kit and kit arguments tests
			- parent
				- self
				  {{kitButton label,collapseBlock,'','',['target': 'parent']}}
					- child
