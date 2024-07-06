kit:: kitButton

- ```javascript
  //next ver
  
  logseq.kits.setStatic(function kitButton(div) {
    console.log("kitButton function initiated");
  
    /**
    * With logseq macros, if an argument to the macro is null then Logseq renders the 
    * null value in HTML in one of two ways:
    * 1. Logseq returns a string like `$n` when an HTML macro argument is null.
    * 2. Logseq returns `''` when a Hiccup macro argument is null.
    * The function checks if the input `attributeValue` contains `$` or `''`, which
    * indicates a null or empty value. If the input value represents a null or empty
    * value, the function returns an empty string;
  
    function sanitizeAttribute(attributeValue) {
      return attributeValue.includes("$") || attributeValue.includes("''") ? "" : attributeValue;
    };
    */
  
    /** Convert a space-separated string of Tabler icon hex codes into a space-separated 
     * string of HTML character references.
     * @param {string} glyphCodes A space-separated string of Tabler icon hex codes.
     */
    function glyphToCharRef(glyphCodes) {
      // Takes zero to multiple tabler icon hex codes seperated by spaces
      if (!glyphCodes) { return ""; }
      let glyphs = glyphCodes.split(" ");
      let tablerIcons = glyphs.map(hexCode => "&#x" + hexCode + ";");
      return tablerIcons.join(" ");
    }
  
  
    const buttonBaseClass = "kit run inline button-style";
    const iconAttributeName = "data-button-icon";
    const textDataAttributeName = "data-button-text";
    const kitPage = div.dataset.kitPage;
    
    const sanitizeAttribute = value => value.startsWith("$") || value === "''" ? "" : value;
    const buttonClass = sanitizeAttribute(div.dataset.buttonClass);
    const buttonLabel = sanitizeAttribute(div.dataset.buttonLabel);
    const buttonIcon = sanitizeAttribute(div.dataset.buttonIcon);
  
    console.log(`kitButton data attribute
      kitPage: ${kitPage}
      textDataAttributeName: ${textDataAttributeName}
      iconGlyphCode: ${buttonIcon}
      buttonExtraClasses: ${buttonClass}`);
  
    /**
     * To support icon-only buttons, use a CSS selector indicating the presence of a text
     * label or icon glyph. Thus, whitespace can be intelligently included to pad text and 
     * icon if and only if necessicary.
     */
    const buttonTextDataAttribute = buttonLabel ? `${textDataAttributeName}="true"` : "";
    const iconDataAttribute = buttonIcon && `${iconAttributeName}="${glyphToCharRef(buttonIcon)}"`
  
  
    // button has one class member by default, so add a space if any more are
    // defined in data-dynablock-buttonclass
    let buttonClassValue = buttonClass
      ? `${buttonBaseClass} ${buttonClass}`
      : buttonBaseClass;
    div.innerHTML = `<button class="${buttonClassValue}" data-kit='runpage'
      data-page-name='${kitPage}' ${iconDataAttribute} ${buttonTextDataAttribute}
      type="button">${buttonLabel}</button>`;
  
   console.log("--- End kitButton function execution")
  
  });
  ```
	- {{evalparent}}
- Kit button variations
	- Full width secret. Icon only.
	  {{kitButton '',blockExpander,ef49,full-width-secret}}
	- Full width secret. Text only
	  {{kitButton hi mom,testkit,'',full-width-secret}}
	- Full width secret. Icon and text
	  {{kitButton hi mom,testkit,ef49,full-width-secret}}
	- {{kitButton kitButton long,testkit,f3f3,long}} {{kitButton text-only,testkit}}
	- icon only, inline. {{kitButton '',testkit,f3f3}}
-
-