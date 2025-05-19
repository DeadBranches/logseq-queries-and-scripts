kit:: `{{ii}}`

- ```javascript
  /**
   * Get the icon associated with the linked reference following the macro.
   *
   * @file nextRefIcon.md
   *
   * @usage Use with a logseq macro. Include the macro before a linked reference
   *        to include an icon from that page.
   *
   *        Optional: Specify the number of spaces to prefix the icon with as
   *        an argument.
   * 1. Create a trigger macro in `config.edn`
   *  :macros {
   *    :ii "[:div.kit.inline { :data-kit nextRefIcon :data-arguments \"$1\"} ]"
   *  }
   * 2. Use the `{{ii}}` macro before any linked reference.
   *  e.g. `{{ii}} funny [[mushrooms]] are here.
   * 3. In the target linked reference, include a tabler icon glyph in the -icon
   * page property.
   *  Example: in page `mushrooms`, the first block contains:
   *    `-icon:: f3f3`
   */
  
  /**
   * These functions are used in the main
   *
   * @namespace HelperFunctions
   */
  /**
   * Recursively creates a DOM element or text node from a format object.
   *
   * @function outputFormatter
   * @namespace HelperFunctions.Transformation
   *
   * @param formatObject {string|object} - The format object to process
   */
  const outputFormatter = (formatObject) => {
    // Case 1: String input
    if (typeof formatObject === "string") {
      return document.createTextNode(formatObject);
    }
  
    // Case 2: Object input
    const element = document.createElement(formatObject.element);
    if (formatObject.classNames) {
      element.classList.add(...formatObject.classNames.split(" "));
    }
    if (!formatObject.content) {
      return element;
    }
  
    // Case 3: String content
    if (typeof formatObject.content === "string") {
      element.innerHTML = formatObject.content;
      return element;
    }
  
    // Case 4: Array content
    if (Array.isArray(formatObject.content)) {
      formatObject.content.forEach((childContent) => {
        const childElement = outputFormatter(childContent);
        element.appendChild(childElement);
      });
      return element;
    }
  
    // Case 5: Object content
    const childElement = outputFormatter(formatObject.content);
    element.appendChild(childElement);
    return element;
  };
  
  /**
   * Generate whitespace by processing a logseq macro argument value.
   *
   * @function generateWhitespace
   * @namespace HelperFunctions.Generation
   *
   * @description Logseq macros passed without arguments result in
   * strings such as $1. Reject those.
   *
   * @param {string} whitespace - The number of spaces to generate
   * @returns {string} - A string of zero or more spaces
   */
  function generateWhitespace(whitespace) {
    // Input validation
    if (typeof whitespace === "string" && whitespace.startsWith("$")) {
      return ""; //
    }
  
    const number = Number(whitespace);
    return Number.isInteger(number) && number > 0 ? "&nbsp;".repeat(number) : "";
  }
  
  /**
   * Get an HTML attribute value from a sibling later in the DOM
   *
   * @function getAttributeValueFromSiblingOfElement
   *
   * @param {HTMLElement} startingElement - The DOM element from which the search begins, ensuring a valid starting point for sibling traversal.
   * @param {string} siblingQuerySelectorPattern - A CSS selector string used to identify the target sibling or one of its descendant elements.
   * @param {string} attributeName - The name of the HTML attribute whose value is to be retrieved from the matching element.
   * @returns {string|null} - The lowercase value of the specified attribute if found; otherwise, null.
   */
  function getAttributeValueFromSiblingOfElement(
    startingElement,
    siblingQuerySelectorPattern,
    attributeName
  ) {
    let currentSiblingElement = startingElement.nextElementSibling;
    let targetAttributeValue = null;
  
    console.group("getAttributeValueFromSiblingOfElement");
    console.log("Starting search from:", startingElement);
    console.log("Looking for:", siblingQuerySelectorPattern);
    console.log("Attribute to extract:", attributeName);
  
    while (currentSiblingElement) {
      console.log("Checking sibling:", currentSiblingElement);
  
      // Case 1: Check if the sibling itself matches
      if (currentSiblingElement.matches(siblingQuerySelectorPattern)) {
        console.log("Direct match found on sibling");
        targetAttributeValue = currentSiblingElement
          .getAttribute(attributeName)
          ?.toLowerCase();
        if (targetAttributeValue) {
          console.log("Found value:", targetAttributeValue);
          break;
        }
      }
  
      // Case 2: Check if any children match
      const matchingElement = currentSiblingElement.querySelector(
        siblingQuerySelectorPattern
      );
      if (matchingElement) {
        console.log("Match found in child:", matchingElement);
        targetAttributeValue = matchingElement
          .getAttribute(attributeName)
          ?.toLowerCase();
        if (targetAttributeValue) {
          console.log("Found value:", targetAttributeValue);
          break;
        }
      }
  
      console.log("No match found, moving to next sibling");
      currentSiblingElement = currentSiblingElement.nextElementSibling;
    }
  
    console.log("Final result:", targetAttributeValue);
    console.groupEnd();
  
    return targetAttributeValue || null;
  }
  
  /**
   * Show a tabler icon for the linked reference in a block following the
   * triggering macro.
   *
   * @function nextRefIcon
   *
   * @async
   * @param {HTMLElement} div - The div element that triggered the macro
   *
   */
  logseq.kits.setStatic(async function nextRefIcon(div) {
    // Inputs
    const leftWhitespace = div.dataset.leftWhitespace;
    const rightWhitespace = div.dataset.rightWhitespace;
    const explicitRef = div.dataset.explicitRef; // new ▸ data-explicit-ref="$3"
  
    // Target element logic ----------------------------------------------
    const startingElement = div.closest("[data-macro-name]");
    const querySelectorPattern = ".page-reference";
    const attributeName = "data-ref";
  
    /**
     * Helper: a macro argument is “real” when it is neither undefined nor the
     * placeholder string produced by Logseq for missing parameters.
     */
    const isSupplied = (arg) => typeof arg === "string" && !arg.startsWith("$");
  
    /* === revised assignment === */
    const nextRefValue = isSupplied(explicitRef)
      ? explicitRef.trim().toLowerCase()
      : getAttributeValueFromSiblingOfElement(
          startingElement,
          querySelectorPattern,
          attributeName
        );
    console.log("nextRef", nextRefValue);
  
    // Data fetching logic
    /**
     * Processes an advanced query using the Logseq datascript query API.
     *
     * @async
     * @function processAdvancedQuery
     *
     * @param {string} queryString - The datascript query string to execute via the Logseq API.
     * @returns {Promise<Array>} - A promise that resolves to an array containing the flattened query results.
     */
    const processAdvancedQuery = async (queryString) => {
      const resultArray = await (async () => {
        const queryResults = await logseq.api
          .datascript_query(queryString)
          ?.flat();
        return queryResults;
      })();
      return await resultArray;
    };
  
    // Function inputs
    const queryStringLibrary = {
      fetchPageIcon: `
        [:find ?icon
        :keys icon
        :where
        [?r :block/name "${nextRefValue}"]
      
        [(identity "0000") ?default-icon]
        (or-join [?r ?default-icon ?icon]
                  (and
                  [?r :block/properties ?props]
                  [(get ?props :-icon) ?icon]
                  [(some? ?icon)])
                  (and
                  ;; :block/properties exists, but :-icon is nil.
                  [?r :block/properties ?props]
                  [(get ?props :-icon :not-found) ?icon-or-not-found]
                  [(= ?icon-or-not-found :not-found)]
                  [(identity ?default-icon) ?icon])
                  (and
                  [(missing? $ ?r :block/properties)]
                  [(identity ?default-icon) ?icon]))
        ]`,
    };
  
    const queryResult = await processAdvancedQuery(
      queryStringLibrary.fetchPageIcon
    );
    console.log("[nextRefIcon] icon:", queryResult[0].icon);
  
    // Output logic
    /**
     * @deprecated 2025-05-19
     * Legacy helper retained solely for reference.
     * Prefer literal objects unless multiple call-sites require the abstraction.
     *
     * Factory function to create a standardized output object for use
     * with outputFormatter.
     *
     * @function legacy.OUTPUT_STRINGS_TEMPLATE
     *
     * @param {string} noResultsString - Content for the "no result" case.
     * @param {string} resultString - Content for the "result" case.
     * @returns {Object} - Object containing the standardized inputs for outputFormatter.
     */
    const legacy = {};
    legacy.OUTPUT_STRINGS_TEMPLATE = (noResultsString, resultString) => ({
      noResults: noResultsString,
      resultString: resultString,
    });
    // eslint-disable-next-line no-unused-vars
    // Intentionally unused until the abstraction is required again.
  
    // Define the actual string values to be used in the output.
    const DEFAULT_NO_RESULTS = "&#x0000;";
    const outputStringValues = {
      noResults: DEFAULT_NO_RESULTS,
      resultString: `${generateWhitespace(leftWhitespace)}&#x${
        queryResult[0].icon
      };${generateWhitespace(rightWhitespace)}`,
    };
  
    /**
     * Format the output text content into an object compatible with outputFormatter.
     *
     * @function formatOutputContent
     *
     * @param {string} textContent - The text content to format.
     * @returns {Object} - The formatted object for output.
     */
    const DEFAULT_ELEMENT = "span";
    const formatOutputContent = (textContent) => ({
      element: DEFAULT_ELEMENT,
      classNames: "bti inline",
      content: textContent,
    });
  
    /**
     * Generate the final output by selecting and formatting content.
     *
     * @function generateOutput
     *
     * @param {Array} queryResult - The result of the query.
     * @param {Object} outputStringsObject - The standardized output strings object.
     * @param {Function} contentFormatterFunction - Function to format the content (default: formatOutputContent).
     * @param {Function} outputFormatFunction - Function to format the final output (default: outputFormatter).
     * @returns {HTMLElement} - The formatted output element.
     */
    const generateOutput = (
      queryResult,
      outputStringsObject,
      contentFormatterFunction = formatOutputContent,
      outputFormatFunction = outputFormatter
    ) => {
      const content =
        queryResult.length === 0
          ? outputStringsObject.noResults
          : outputStringsObject.resultString;
  
      const formattedObject = contentFormatterFunction(content);
      return outputFormatFunction(formattedObject);
    };
  
    const output = generateOutput(
      queryResult,
      outputStringValues,
      formatOutputContent,
      outputFormatter
    );
  
    div.appendChild(output);
  });
  
  ```
	- {{evalparent}}
	-
- This is
