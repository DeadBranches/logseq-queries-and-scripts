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
    const customClass = sanitizeAttribute(div.dataset.buttonClass);
    // customClass can be multiple space seperated values.
    /**
     * In some instances we may wish to remove classes from the default list of values.
     * By passing a class name prefixed with a hyphen (e.g. -button-style) to the class
     * argument ($4) the class is removed.
     */
    function filterClasses(defaultClasses = buttonBaseClass, sanatizedKitClasses = customClass) {
      const defaultClassArray = defaultClasses.split(" ");
      const instanceClassArray = sanatizedKitClasses.split(" ");
      const styleClassNames = [];
      instanceClassArray.forEach(className => {
        if (className.startsWith("-")) {
          let filterClassName = className.slice(1);
          let removeIndex = defaultClassArray.indexOf(filterClassName);
          let removedItem = defaultClassArray.splice(removeIndex, 1);
          console.log(`Removed ${removedItem} from baseClassArray`);
        } else {
          styleClassNames.push(className);
        }
      });
      return [...defaultClassArray, ...styleClassNames].join(" ");
    }
    let buttonClassValue;
    if (customClass === "") {
      buttonClassValue = [buttonBaseClass, ...(customClass ? customClass.split(" ") : [])].join(" ");
    } else {
      buttonClassValue = filterClasses();
    }
  
    /**
     * To support icon-only buttons, use a CSS selector indicating the presence of a text
     * label or icon glyph. Thus, whitespace can be intelligently included to pad text and 
     * icon if and only if necessicary.
     */
    const buttonLabel = sanitizeAttribute(div.dataset.buttonLabel);
    const buttonTextDataAttribute = buttonLabel ? `${labelAttributeName}="true"` : "";
    // icon logic
    const buttonIcon = sanitizeAttribute(div.dataset.buttonIcon);
    const iconGlyphCodes = glyphs => glyphs.split(" ").map(hexCode => `&#x${hexCode};`).join(" ");
    const iconDataAttribute = buttonIcon && `${iconAttributeName}="${iconGlyphCodes(buttonIcon)}"`;
    // anything else
    const kitArguments = sanitizeAttribute(div.dataset.arguments);
    const argumentsDataAttribute = kitArguments ? `${argumentsAttributeName}='${kitArguments}'` : "";
  
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
-
- Kit and kit arguments tests
	- parent
		- self
		  {{kitButton label,collapseBlock,'','',parent}}
			- child