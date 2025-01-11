- ```javascript
  /**
   * description
   *
   * @file nextRefIcon.md
   *
   * @usage Use with a logseq macro
   *  :refIcon "[:div.kit.inline { :data-kit refIcon :data-arguments \"$1\"} ]"
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
   * @param whitespace {string} - The number of spaces to generate
   * @returns {string} - A string of zero or more spaces
   */
  function generateWhitespace(whitespace) {
    // Input validation
    if (typeof whitespace === "string" && whitespace.startsWith("$")) {
      return ""; // Reject strings like '$1'
    }
  
    const number = Number(whitespace); // Convert to number
    return Number.isInteger(number) && number > 0 ? "&nbsp;".repeat(number) : "";
  }
  
  /**
   *
   * @param startingElement
   * @param siblingQuerySelectorPattern
   * @param attributeName
   * @returns
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
        targetAttributeValue = matchingElement.getAttribute(attributeName)?.toLowerCase();
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
   * @param div {HTMLElement} - The div element that triggered the macro
   *
   */
  logseq.kits.setStatic(async function nextRefIcon(div) {
    /**
     * Inputs
     */
    const leftWhitespace = div.dataset.leftWhitespace;
    const rightWhitespace = div.dataset.rightWhitespace;
  
    /**
     * Target element logic
     */
    const startingElement = div.closest("[data-macro-name]");
    console.log("startingElement", startingElement);
    const querySelectorPattern = ".page-reference";
    const attributeName = "data-ref";
    const nextRefValue = getAttributeValueFromSiblingOfElement(
      startingElement,
      querySelectorPattern,
      attributeName
    );
    console.log("nextRef", nextRefValue);
  
    /**
     * Data fetching logic
     */
    // Helper functions
    const processAdvancedQuery = async (queryString) => {
      const resultArray = await (async () => {
        const queryResults = await logseq.api.datascript_query(queryString)?.flat();
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
  
    const queryResult = await processAdvancedQuery(queryStringLibrary.fetchPageIcon);
    console.log("[nextRefIcon] icon:", queryResult[0].icon);
  
    /**
     * Output logic
     */
    /**
     * Factory function to create a standardized output object for use
     * with outputFormatter.
     *
     * @param {string} noResultsString - Content for the "no result" case.
     * @param {string} resultString - Content for the "result" case.
     * @returns {Object} - Object containing the standardized inputs for outputFormatter.
     */
    const OUTPUT_STRINGS_TEMPLATE = (noResultsString, resultString) => ({
      noResults: noResultsString,
      resultString: resultString,
    });
  
    /**
     * Define the actual string values to be used in the output.
     */
    const DEFAULT_NO_RESULTS = "&#x0000;";
    const outputStringValues = {
      noResults: DEFAULT_NO_RESULTS, // Default content for "no results"
      resultString: `${generateWhitespace(leftWhitespace)}&#x${
        queryResult[0].icon
      };${generateWhitespace(rightWhitespace)}`,
    };
  
    /**
     * Format the output text content into an object compatible with outputFormatter.
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
  
      // Format and return the output
      const formattedObject = contentFormatterFunction(content);
      return outputFormatFunction(formattedObject);
    };
  
    // Generate the DOM output
    const output = generateOutput(
      queryResult,
      outputStringValues,
      formatOutputContent,
      outputFormatter
    );
    // Append the generated output to the DOM
    div.appendChild(output);
  });
  
  ```
	- {{evalparent}}
	-
- This is
