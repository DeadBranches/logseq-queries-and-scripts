kit:: kitButton

- ```javascript
  //next ver
  
  logseq.kits.setStatic(function kitButton(div) {
      console.log("kitButton function initiated");
    
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
      
      // Logseq macro arguments if null may return `$1` or "''"
      const sanitizeAttribute = value => value.startsWith("$") || value === "''" ? "" : value;
      const buttonClass = sanitizeAttribute(div.dataset.buttonClass);
      const buttonLabel = sanitizeAttribute(div.dataset.buttonLabel);
      const buttonIcon = sanitizeAttribute(div.dataset.buttonIcon);
    
      const buttonClassValue = [buttonBaseClass, ...(buttonClass ? buttonClass.split(" ") : [])].join(" ");
      /**
       * To support icon-only buttons, use a CSS selector indicating the presence of a text
       * label or icon glyph. Thus, whitespace can be intelligently included to pad text and 
       * icon if and only if necessicary.
       */
      const buttonTextDataAttribute = buttonLabel ? `${textDataAttributeName}="true"` : "";
      const iconDataAttribute = buttonIcon && `${iconAttributeName}="${glyphToCharRef(buttonIcon)}"`
      
      
    console.log(`kitButton data attribute
        kitPage: ${kitPage}
        textDataAttributeName: ${textDataAttributeName}
        iconGlyphCode: ${buttonIcon}
        buttonExtraClasses: ${buttonClass}`);
    
      div.innerHTML = `<button class="${buttonClassValue}" data-kit='runpage'
        data-page-name='${kitPage}' ${iconDataAttribute} ${buttonTextDataAttribute}
        type="button">${buttonLabel}</button>`;
    
     console.log("--- End kitButton function execution")
    
    });
  ```
	- {{evalparent}}
- Kit button variations
	- Full width secret. Icon only.
	  {{kitButton '',testkit,ef49,full-width-secret}}
	- Full width secret. Text only
	  {{kitButton hi mom,testkit,'',full-width-secret}}
	- Full width secret. Icon and text
	  {{kitButton hi mom,testkit,ef49,full-width-secret}}
	- {{kitButton kitButton long,testkit,f3f3,long}} {{kitButton text-only,testkit}}
	- icon only, inline. {{kitButton '',testkit,f3f3}}
-
-