kit:: kitButton [label] <kit-name> [icon] [positive-class | {-inline | -button-style | -button-shape | -hover | -active}] | [arguments]
description:: kitButton [label] <kit-name> [icon] [positive-class | {-inline | -button-style | -button-shape | -hover | -active}] | [arguments]

- ```javascript
  logseq.kits.setStatic(function kitButton(div) {
    //console.log("kitButton function initiated");
    const buttonBaseClass = "kit run inline button-style button-shape hover active";
    const iconAttributeName = "data-button-icon";
    const labelAttributeName = "data-button-text";
    const argumentsAttributeName = 'data-arguments';
    const kitPage = div.dataset.kitPage;
  
    // Expect null logseq macro arguments to return `$1` or "''", so filter to an empty string
    const sanitizeAttribute = value => value.startsWith("$") || value === "''" ? "" : value;
    /**
     * In some instances we may wish to remove classes from the default list of values.
     * By passing a class name prefixed with a hyphen (e.g. -button-style) to the class
     * argument ($4) the class is removed.
     * 
     * In other situations we may wish to styles the button in a way only possible to
     * implement using javascript. By passing a class name prefixed with a plus sign,
     * (e.g. +bold-first-word) any predefined style features with that name will be 
     * invoked before rendering the button.
     */
    let styleExpressions = {};
    function filterClasses(defaultClasses = buttonBaseClass, sanatizedKitClasses = customClass) {
      const filteredBaseClasses = defaultClasses.split(" ");
      const instanceClassArray = sanatizedKitClasses.split(" ");
      const styleClassNames = [];
      instanceClassArray.forEach(className => {
        if (className.startsWith("-")) {
          let filterClassName = className.slice(1);
          let removeIndex = filteredBaseClasses.indexOf(filterClassName);
          let removedItem = filteredBaseClasses.splice(removeIndex, 1);
          console.log(`Removed ${removedItem} from baseClassArray`);
        }
        else if (className.startsWith("+")) {
          const [expressionName, argumentValue] = className.slice(1).split(":");
          styleExpressions[expressionName] = argumentValue || false;
          console.log(`Added ${expressionName}: ${styleExpressions[expressionName]} to styleExpressions object`);
        }
         else {
          styleClassNames.push(className);
        }
      });
      return [...filteredBaseClasses, ...styleClassNames].join(" ");
    }
    // customClass can be multiple space seperated values.
    const customClass = sanitizeAttribute(div.dataset.buttonClass);
    let buttonClassValue;
    if (customClass === "") {
      buttonClassValue = [buttonBaseClass, ...(customClass ? customClass.split(" ") : [])].join(" ");
    } else {
      buttonClassValue = filterClasses();
    }
  
    const buttonLabel = sanitizeAttribute(div.dataset.buttonLabel);
    if (styleExpressions.hasOwnProperty('bold-nth-word')) {
      // The value can be either false or an integer represeting a word position
      const boldWordIndex = styleExpressions['bold-nth-word'] ? 
        parseInt(styleExpressions['bold-nth-word'])-1 : 0;
      const labelWordArray = buttonLabel.split(" ").map((word, index) => {
        return index === boldWordIndex ? `<span class="bold">${word}</span>` : word
      })
    }
    /**
     * To support icon-only buttons, use a data-attribute indicating the presence of a text
     * label or icon glyph. Thus, whitespace can be intelligently included to pad text and 
     * icon if and only if necessicary.
     */
    const buttonTextDataAttribute = buttonLabel ? `${labelAttributeName}="true"` : "";
    // icon logic
    const buttonIcon = sanitizeAttribute(div.dataset.buttonIcon);
    const iconGlyphCodes = glyphs => glyphs.split(" ").map(hexCode => `&#x${hexCode};`).join(" ");
    const iconDataAttribute = buttonIcon && `${iconAttributeName}="${iconGlyphCodes(buttonIcon)}"`; // && = first falsy or last truthy if all true
    // anything else
    const kitArguments = sanitizeAttribute(div.dataset.arguments);
    const argumentsDataAttribute = kitArguments ? `${argumentsAttributeName}="${kitArguments}"` : "";
  
    div.innerHTML = `<button class="${buttonClassValue}" data-kit='runpage' data-kit-macro="kitButton"
      data-page-name='${kitPage}' ${iconDataAttribute} ${buttonTextDataAttribute} ${argumentsDataAttribute}
      type="button">${buttonLabel}</button>`;
  
  });
  ```
	- {{evalparent}}
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
	  {{kitButton hi,testkit,f3f3,-button-style full-width bold flex-grow-1 +bold-nth-word}}
	- +bold-nth-word:2
	  {{kitButton hi,testkit,f3f3,-button-style full-width bold flex-grow-1 +bold-nth-word:2}}
- Kit and kit arguments tests
	- parent
		- self
		  collapsed:: true
		  {{kitButton label,collapseBlock,'','',['target': 'parent']}}
			- child