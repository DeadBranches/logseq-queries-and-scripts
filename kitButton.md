kit:: kitButton

- ```javascript
  logseq.kits.setStatic(function kitButton(div) {
    const blockId = div.closest(".ls-block").getAttribute("blockid");
    const block = logseq.api.get_block(blockId);
    const content = block.content;
  
    const kitPage = div.dataset.kitPage;
    const buttonLabel = div.dataset.buttonLabel;
    const buttonIcon = div.dataset.buttonIcon;
    const buttonClass = div.dataset.buttonClass;
  
    /**
     * Sanitizes an attribute value by removing null or empty values.
     *
     * @param {string} attributeValue - The attribute value to be sanitized.
     * @returns {string} The sanitized attribute value, or an empty string if the input
     * value represents a null or empty value.
     *
     * @description
     * This function converts values indicating null from logseq macros into empty
     * javascript strings. It is designed to be invoked by a logseq macro on an attribute
     * value.
     * 
     * With logseq macros, if an argument to the macro is null then Logseq renders the 
     * null value in HTML in one of two ways:
     * 1. Logseq returns a string like `$n` when an HTML macro argument is null.
     * 2. Logseq returns `''` when a Hiccup macro argument is null.
     * The function checks if the input `attributeValue` contains `$` or `''`, which
     * indicates a null or empty value. If the input value represents a null or empty
     * value, the function returns an empty string;
     * 
     * This function if the input `attributeValue` contains `$` or `''`, which
     * indicates a null or empty value. If the input value represents a null or empty
     * value, the function returns an empty string; otherwise, it returns the original
     * `attributeValue`.
     *
     * @example
     * const validValue = 'example';
     * const sanitizedValue = sanitizeAttribute(validValue); // Returns 'example'
     *
     * const nullValue = '$n';
     * const sanitizedNullValue = sanitizeAttribute(nullValue); // Returns ''
     *
     * const emptyValue = "''";
     * const sanitizedEmptyValue = sanitizeAttribute(emptyValue); // Returns ''
     */
  
    function sanitizeAttribute(attributeValue) {
      return attributeValue.includes("$") || attributeValue.includes("''") ? "" : attributeValue;
    };
  
    /**
     * Converts a space-separated string of Tabler icon hex codes into a space-separated 
     * string of HTML character references.
     *
     * @param {string} glyphCodes A space-separated string of Tabler icon hex codes.
     * @returns {string} A space-separated string of HTML character references 
     *    representing the provided Tabler icon hex codes.
     *
     * @example
     * const iconCodes = "e801 e802 e803";
     * const charRefs = glyphToCharRef(iconCodes);
     * console.log(charRefs); // Output: "&#xe801; &#xe802; &#xe803;"
     */
    function glyphToCharRef(glyphCodes) {
      if (!glyphCodes) { return ""; }
      let glyphs = glyphCodes.split(" ");
      let tablerIcons = glyphs.map(hexCode => "&#x" + hexCode + ";");
      return tablerIcons.join(" ");
    }
  
  
    const iconPadding = " "; // spacing between icon and text
    const buttonBaseClass = "button-style";
    const iconAttributeName = "data-button-icon";
    const textDataAttributeName = "data-button-text";
    let buttonExtraClasses = sanitizeAttribute(div.dataset.buttonClass);
    let buttonText = sanitizeAttribute(div.dataset.buttonLabel);
    const iconGlyphCode = sanitizeAttribute(div.dataset.buttonIcon);
  
  
    /**
     * To support icon-only buttons, use a CSS selector indicating the presence of a text
     * label. Thus, whitespace can be intelligently included to pad text and icon if and
     * only if necessicary
     */
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
  
    /** Since the button element has a single default class and optional additional
     * classes, prevent from including a trailing space when no additional classes are
     * specified.
     */
    let buttonClassValue = buttonExtraClasses
      ? `${buttonBaseClass} ${buttonExtraClasses}`
      : buttonBaseClass;
    div.innerHTML = `<button class="${buttonClassValue}" data-kit='runpage'
      data-page-name='${kitPage}' ${iconDataAttribute} ${buttonTextDataAttribute}
      type="button">${buttonText}</button>`;
  
  });
  
  ```
	- {{evalparent}}
- {{kitButton bitchTits,hi mom,f3f3,long}} {{kitButton bitchTits,hi mom,f3f3,long}}
- {{button lol,f3f3,f3f3}}
- {{kitButton purchases list,blockExpander,ef49,full-width-secret}}
- {{kitButton hi mom,blockExpander,ef49,full-width-secret}}
-
-
-
-