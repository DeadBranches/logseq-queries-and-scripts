kit:: kitButton

- ```javascript
  logseq.kits.setStatic(function kitButton(div) {
      //console.log("kitButton function initiated");
      const buttonBaseClass = "kit run inline button-style";
      const iconAttributeName = "data-button-icon";
      const labelAttributeName = "data-button-text";
      const kitPage = div.dataset.kitPage;
      
      // Expect null logseq macro arguments to return `$1` or "''", so filter to an empty string
      const sanitizeAttribute = value => value.startsWith("$") || value === "''" ? "" : value;
      const customClass = sanitizeAttribute(div.dataset.buttonClass);
      // customClass can be multiple space seperated values.
      const buttonClassValue = [buttonBaseClass, ...(customClass ? customClass.split(" ") : [])].join(" ");
  
      /**
       * To support icon-only buttons, use a CSS selector indicating the presence of a text
       * label or icon glyph. Thus, whitespace can be intelligently included to pad text and 
       * icon if and only if necessicary.
       */
      const buttonLabel = sanitizeAttribute(div.dataset.buttonLabel);
      const buttonTextDataAttribute = buttonLabel ? `${labelAttributeName}="true"` : "";
  
      const buttonIcon = sanitizeAttribute(div.dataset.buttonIcon);
      const iconGlyphCodes = glyphs => glyphs.split(" ").map(hexCode => `&#x${hexCode};`).join(" ");
      const iconDataAttribute = buttonIcon && `${iconAttributeName}="${iconGlyphCodes(buttonIcon)}"`;
      
      div.innerHTML = `<button class="${buttonClassValue}" data-kit='runpage'
        data-page-name='${kitPage}' ${iconDataAttribute} ${buttonTextDataAttribute}
        type="button">${buttonLabel}</button>`;
      
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
-