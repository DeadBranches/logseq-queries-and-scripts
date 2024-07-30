kit:: newKitButton

- ```javascript
  logseq.kits.setStatic(async function newKitButton(div) {
    const DEFAULT_CLASSES = "kit run inline button-style button-shape hover active";
    const ICON_DATA_ATTRIBUTE = "data-button-icon";
    const LABEL_DATA_ATTRIBUTE = "data-button-text";
    const kitPage = div.dataset.kitPage;
  
    const sanitizeAttribute = (value) =>
      value && (value.startsWith("$") || value === "''") ? "" : value;
  
    const classModifiers = sanitizeAttribute(div.dataset.buttonClass);
    let buttonText = sanitizeAttribute(div.dataset.buttonLabel);
  
    const applyStyleFilter = (defaultClasses, customClasses) => {
      const classArray = defaultClasses.split(" ");
      const customClassArray = customClasses.split(" ");
      const additionalClasses = [];
      const appliedStyleFilters = {};
  
      customClassArray.forEach((className) => {
        if (className.startsWith("-")) {
          const classToRemove = className.slice(1);
          const removeIndex = classArray.indexOf(classToRemove);
          if (removeIndex !== -1) classArray.splice(removeIndex, 1);
        } else if (className.startsWith("+")) {
          const [expressionName, argumentValue] = className.slice(1).split(":");
          appliedStyleFilters[expressionName] = argumentValue || true;
        } else {
          additionalClasses.push(className);
        }
      });
  
      return {
        classes: [...classArray, ...additionalClasses].join(" "),
        appliedStyleFilters
      };
    };
  
    const { classes: buttonClassValue, appliedStyleFilters } = 
      classModifiers ? applyStyleFilter(DEFAULT_CLASSES, classModifiers) : { classes: DEFAULT_CLASSES, appliedStyleFilters: {} };
  
    const processLabelForKits = async (label) => {
      const wordArray = label.split(" ");
      const labelPromises = wordArray.map(async (word) => {
        if (!word.startsWith("|") || !word.endsWith("|")) return word;
        const kitFunction = word.slice(1, -1);
        return logseq.kits[kitFunction] ? await logseq.kits[kitFunction]() : word;
      });
  
      return (await Promise.all(labelPromises)).join(" ");
    };
  
    buttonText = await processLabelForKits(buttonText);
  
    const processStyledLabelText = (label, styleFilters) => {
      const words = label.split(' ');
      
      const parsedFilters = Object.entries(styleFilters).reduce((acc, [key, value]) => {
        if (typeof value === 'string') {
          try {
            acc[key] = JSON.parse(value);
          } catch (e) {
            console.error(`Error parsing filter value for ${key}:`, e);
            acc[key] = value; // Use the original value if parsing fails
          }
        } else {
          acc[key] = value;
        }
        return acc;
      }, {});
  
      const processedWords = words.map((word, index) => {
        let processedWord = word;
        
        if (parsedFilters['bold-nth-word']) {
          const boldIndices = Array.isArray(parsedFilters['bold-nth-word']) 
            ? parsedFilters['bold-nth-word'] 
            : [parseInt(parsedFilters['bold-nth-word'])];
          
          if (boldIndices.includes(index + 1)) {
            processedWord = `<span class="bold">${processedWord}</span>`;
          }
        }
        
        // Add more style conditions here as needed
        
        return processedWord;
      });
  
      return processedWords.join(' ');
    };
  
    buttonText = processStyledLabelText(buttonText, appliedStyleFilters);
  
    const buttonTextDataAttribute = buttonText ? `${LABEL_DATA_ATTRIBUTE}="true"` : "";
    const buttonIcon = sanitizeAttribute(div.dataset.buttonIcon);
    const iconGlyphCodes = (glyphs) =>
      glyphs
        .split(" ")
        .map((hexCode) => `&#x${hexCode};`)
        .join(" ");
  
    const iconDataAttribute = buttonIcon && `${ICON_DATA_ATTRIBUTE}="${iconGlyphCodes(buttonIcon)}"`;
  
    const processDataAttributes = (input) => {
      if (!input) return "";
      return input
        .split(' ')
        .filter(pair => pair.includes('='))
        .map(pair => {
          const [key, ...valueParts] = pair.split('=');
          const value = valueParts.join('=').replace(/^['"]|['"]$/g, '');
          return `data-${key}="${value}"`;
        })
        .join(' ');
    };
  
    const kitArguments = sanitizeAttribute(div.dataset.arguments);
    const dataAttributes = processDataAttributes(kitArguments);
  
    div.innerHTML = `<button class="${buttonClassValue}" data-kit='runpage' data-kit-macro="kitButton" data-page-name='${kitPage}' ${iconDataAttribute} ${buttonTextDataAttribute} ${dataAttributes} type="button">${buttonText}</button>`;
  });
  ```
	- {{evalparent}}