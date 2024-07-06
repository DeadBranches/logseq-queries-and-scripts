kit:: kitButton

- ```javascript
  //next ver
  
  logseq.kits.setStatic(function kitButton(div) {
    console.log("kitButton function initiated");
  
    const kitPage = div.dataset.kitPage;
    const buttonLabel = div.dataset.buttonLabel;
    const buttonIcon = div.dataset.buttonIcon;
    const buttonClass = div.dataset.buttonClass;
    console.log(`kitButton data attribute
    kitPage: ${kitPage}
    buttonLabel: ${buttonLabel}
    buttonIcon: ${buttonIcon}
    buttonClass: ${buttonClass}`);
    
  
    function sanitizeAttribute(attributeValue) {
      console.log(`sanitizing attribute value: ${attributeValue}`);
      // Logseq returns a string like "$n" when an HTML macro argument is null.
      // But it returns `''` when a hiccup macro argument is null
      return attributeValue.includes("$") || attributeValue.includes("''") ? "" : attributeValue;
    };
    
    function glyphToCharRef(glyphCodes) {
      // Takes zero to multiple tabler icon hex codes seperated by spaces
      if (!glyphCodes) { return ""; }
      let glyphs = glyphCodes.split(" ");
      let tablerIcons = glyphs.map(hexCode => "&#x" + hexCode + ";");
      return tablerIcons.join(" ");
    }
  
    const iconPadding = " "; // spacing between icon and text
    const buttonBaseClass = "kit run inline button-style";
    const iconAttributeName = "data-button-icon";
    const textDataAttributeName = "data-button-text";
    let buttonExtraClasses = sanitizeAttribute(div.dataset.buttonClass);
    let buttonText = sanitizeAttribute(div.dataset.buttonLabel);
    const iconGlyphCode = sanitizeAttribute(div.dataset.buttonIcon);
  
    // Provides something to use a CSS selector on so that we don't add a space
    // between icon and text if there is no text.
    let buttonTextDataAttribute;
    if (buttonText) {
      buttonTextDataAttribute = `${textDataAttributeName}="true"`;
    } else {
      buttonTextDataAttribute = "";
    }
  
    let iconDataAttribute;
    switch (iconGlyphCode) {
      case "":
        iconDataAttribute = "";
        break;
      default:
        const icons = glyphToCharRef(iconGlyphCode);
        iconDataAttribute = `${iconAttributeName}="${icons}"`;
    }
  
    // button has one class member by default, so add a space if any more are
    // defined in data-dynablock-buttonclass
    let buttonClassValue = buttonExtraClasses
      ? `${buttonBaseClass} ${buttonExtraClasses}`
      : buttonBaseClass;
    div.innerHTML = `<button class="${buttonClassValue}" data-kit='runpage'
      data-page-name='${kitPage}' ${iconDataAttribute} ${buttonTextDataAttribute}
      type="button">${buttonText}</button>`;
  
   console.log("--- End kitButton function execution")
  
  });
  ```
	- {{evalparent}}
- {{kitButton test,testkit,f3f3,long}} {{kitButton test,testkit,f3f3,long}}
- {{button lol,f3f3,f3f3}}
- {{kitButton purchases list,blockExpander,ef49,full-width-secret}}
- {{kitButton hi mom,testkit,ef49,full-width-secret}}
- {{runpage testkit}}
-
-
-