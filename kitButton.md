kit:: kitButton [label] <kit-name> [icon] [positive-class | {-inline | -button-style | -button-shape | -hover | -active}] | [arguments]
description:: kitButton [label] <kit-name> [icon] [positive-class | {-inline | -button-style | -button-shape | -hover | -active}] | [arguments]

- ```javascript
  
  //logseq.kits.kitButton = kitButton;
  
  logseq.kits.setStatic(async function kitButton(div) {
  //async function kitButton(div) {
  //console.log("kitButton function initiated");
    const DEFAULT_CLASSES = "kit run inline button-style button-shape hover active";
    const ICON_DATA_ATTRIBUTE = "data-button-icon";
    const LABEL_DATA_ATTRIBUTE = "data-button-text";
    const ARGUMENTS_DATA_ATTRIBUTE = 'data-arguments';
    const kitPage = div.dataset.kitPage;
  
    // Expect null logseq macro arguments to return `$1` or "''", so filter to an empty string
    const sanitizeAttribute = value => value.startsWith("$") || value === "''" ? "" : value;
  
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
    function applyStyleFilter(defaultClasses = DEFAULT_CLASSES, customClasses = classModifiers) {
      const classArray = defaultClasses.split(" ");
      const customClassArray = customClasses.split(" ");
      const additionalClasses = [];
  
      customClassArray.forEach(className => {
        if (className.startsWith("-")) {
          let classToRemove = className.slice(1);
          let removeIndex = classArray.indexOf(classToRemove);
          classArray.splice(removeIndex, 1);
        }
        else if (className.startsWith("+")) {
          const [expressionName, argumentValue] = className.slice(1).split(":");
          appliedStyleFilters[expressionName] = argumentValue || false;
          console.log(`Added ${expressionName}: ${appliedStyleFilters[expressionName]} to styleExpressions object`);
        }
        else {
          additionalClasses.push(className);
        }
      });
      return [...classArray, ...additionalClasses].join(" ");
    }
  
    // customClass can be multiple space seperated values.
    let buttonClassValue;
    if (classModifiers === "") {
      buttonClassValue = DEFAULT_CLASSES;
    } else {
      buttonClassValue = applyStyleFilter();
    }
  
    /** Process button label text
     * For each word, we might:
     *  bold it (if bold-nth-word is set)
     *  transform it (if the label text contains /|\w+|/)
     */
    const processKitsInLabel = async (label) => {
      const words = label.split(" ");
      const processedWords = await Promise.all(words.map(async (word) => {
        if (!word.startsWith("|") && !word.endsWith("|")) {
          return word;
        }
        let kitName = word.slice(1, -1);
        const result = await logseq.kits[kitName]();
        return result.toString();
      }));
      return processedWords.join(" ");
    };
    buttonText = await processKitsInLabel(buttonText);
  
    /* old way of filtering the word label */
    if ('bold-nth-word' in appliedStyleFilters) {
      const boldWordIndex = appliedStyleFilters['bold-nth-word'] ?
        parseInt(appliedStyleFilters['bold-nth-word']) - 1 : 0;
      labelWordArray = buttonText.split(" ").map((word, index) => {
        return index === boldWordIndex ? `<span class="bold">${word}</span>` : word;
      });
      console.log(JSON.stringify(labelWordArray));
      buttonText = labelWordArray.join(" ");
    }
   
  
    // Add the code block here
    console.log('buttonLabel after processing:', JSON.stringify(buttonText));
    console.log('labelWordArray:', labelWordArray);
    /**
     * To support icon-only buttons, use a data-attribute indicating the presence of a text
     * label or icon glyph. Thus, whitespace can be intelligently included to pad text and 
     * icon if and only if necessicary.
     */
    const buttonTextDataAttribute = buttonText ? `${LABEL_DATA_ATTRIBUTE}="true"` : "";
    // icon logic
    const buttonIcon = sanitizeAttribute(div.dataset.buttonIcon);
    const iconGlyphCodes = glyphs => glyphs.split(" ").map(hexCode => `&#x${hexCode};`).join(" ");
    const iconDataAttribute = buttonIcon && `${ICON_DATA_ATTRIBUTE}="${iconGlyphCodes(buttonIcon)}"`; // && = first falsy or last truthy if all true
    // anything else
    const kitArguments = sanitizeAttribute(div.dataset.arguments);
    const argumentsDataAttribute = kitArguments ? `${ARGUMENTS_DATA_ATTRIBUTE}="${kitArguments}"` : "";
  
    div.innerHTML = `<button class="${buttonClassValue}" data-kit='runpage' data-kit-macro="kitButton"
      data-page-name='${kitPage}' ${iconDataAttribute} ${buttonTextDataAttribute} ${argumentsDataAttribute}
      type="button">${buttonText}</button>`;
  
  //};
  });
  ```
	- {{evalparent}}
-
	-
	-
	- {{evalparent}}
	- {{}}
	-
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
	- Text and icon, full-width, flex-grow-1
	  {{kitButton hi,testkit,f3f3,-button-style full-width flex-grow-1}}
	- Text and icon, flex-grow-1
	  {{kitButton hi,testkit,f3f3,-button-style flex-grow-1}}
	- Inline text and icons, full-width (flex-grow-1 | flex-grow-2)
	  {{kitButton hi,testkit,f3f3,-button-style full-width flex-grow-1}} {{kitButton hi,testkit,f3f3,-button-style full-width flex-grow-2}}
	- Kit button, flex-grow-2 | flex-grow-1
	  {{kitButton hi,testkit,f3f3,-button-style flex-grow-2}} {{kitButton hi,testkit,f3f3,-button-style flex-grow-1}}
	- Just text
	  {{i f3f3}} hi
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
			  collapsed:: true
			  {{kitButton label,collapseBlock,'','',['target': 'parent']}}
				- child