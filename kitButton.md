kit:: kitButton

- ```javascript
  logseq.kits.setStatic(function kitButton(div) {
    const blockId = div.closest(".ls-block").getAttribute("blockid");
    const block = logseq.api.get_block(blockId);
    const content = block.content;
  
    const macroStart = content.indexOf("{{" + div.closest(".macro").dataset.macroName);
    const macroEnd = content.indexOf("}}", macroStart) + 2;
  
    const kitPage = div.dataset.kitPage;
    const buttonLabel = div.dataset.buttonLabel;
    const buttonIcon = div.dataset.buttonIcon;
    const buttonClass = div.dataset.buttonClass;
    console.log(`Kit Page: ${kitPage}`);
    console.log(`Button Label: ${buttonLabel}`);
    console.log(`Button Icon: ${buttonIcon}`);
    console.log(`Button Class: ${buttonClass}`);
    
  
    function sanitizeAttribute(attributeValue) {
      console.log(attributeValue);
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
    //const buttonBaseClass = "kit run inline button-style";
    const buttonBaseClass = "button-style";
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
  
  
    // console.log(macroStart);
    // console.log(macroEnd);
  
    // div.innerHTML = `
    //   <button class='kit run button-style inline' data-kit='runpage' data-page-name='${kitPage}' data-dynablock-codeblocklabel='$2' data-dynablock-buttonicon='&#x$3'> $2</button>`;
  
  });
  
  ```
	- {{evalparent}}
- {{kitButton bitchTits,hi mom,f3f3,long}} {{kitButton bitchTits,hi mom,f3f3,long}}
- {{button lol,f3f3,f3f3}}
-
-
-
-