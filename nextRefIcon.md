- ```javascript
  /**
   * Recursively creates a DOM element or text node from a format object.
   *
   * @param {(string|Object)} formatObject - The format object or string to convert.
   * @param {string} formatObject.element - The HTML tag name for the element.
   * @param {(string|Array|Object)} [formatObject.content] - The content of the element.
   * @returns {(Node|Element)} A DOM node or element.
   *
   * @example
   * // Returns a text node
   * createElementFromObject("Hello");
   *
   * @example
   * // Returns <div><small><i>Hello</i><b>World</b></small></div>
   * createElementFromObject({
   *   element: "div",
   *   content: {
   *     element: "small",
   *     content: [
   *       { element: "i", content: "Hello" },
   *       { element: "b", content: "World" }
   *     ]
   *   }
   * });
   *
   * @usage
   * Use with a logseq macro
   *  :refIcon "[:div.kit.inline { :data-kit refIcon :data-arguments \"$1\"} ]"
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
  
  logseq.kits.setStatic(async function nextRefIcon(div) {
    const blockUUID = div.closest(".ls-block").getAttribute("blockid");
    //const blockId = "66e6f56f-3005-458a-b0cd-65502c9beef1";
    //const block = logseq.api.get_block(blockUUID);
    //const targetBlock = block;
    console.group("inputs");
    console.log("div:", div);
    // console.log("blockUUID:", blockUUID);
    // console.log("blockUUID type:", typeof blockUUID);
    console.groupEnd;
   
    const macro = div.closest("[data-macro-name]")
    const nextRef = macro.nextElementSibling;
    const nextRefValue = nextRef.getAttribute("data-ref").toLowerCase()
    console.log("nextRef", nextRef);
  
  
    const leftWhitespace = div.dataset.leftWhitespace;
    const rightWhitespace = div.dataset.rightWhitespace;
  
    /**
     * Advanced query
     */
    const advancedQueryPromise = (async () => {
      const resultArray = await (async () => {
        const advancedQuery = `
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
    ]
        `;
  
        const queryResults = await logseq.api.datascript_query(advancedQuery)?.flat();
        return queryResults;
      })();
  
      return await resultArray;
    })();
  
    const queryResult = await advancedQueryPromise;
    // console.group("Query results");
    // console.table(queryResult);
    // console.log("result array length:", queryResult.length)
    // console.groupEnd;
    // return;
  
    console.log("icon:", queryResult[0].icon);
    /**
     * Definitions: Strings and format
     */
    function generateWhitespace(whitespace) {
      // Ensure whitespace is a valid number and doesn't start with $
      if (typeof whitespace === 'string' && whitespace.startsWith('$')) {
        return ''; // Reject strings like '$1'
      }
  
      const number = Number(whitespace); // Convert to number
      return Number.isInteger(number) && number > 0
        ? '&nbsp;'.repeat(number)
        : '';
    }
    const MESSAGES = {
      noResults: "&#x0000;",
      resultString: `${generateWhitespace(leftWhitespace)}&#x${queryResult[0].icon};${generateWhitespace(rightWhitespace)}`,
    };
    const outputFormat = (message) => ({
      // Refer to createElementFromObject() docstring for details on how
      // to structure the message format
      element: "span",
      classNames: "bti inline",
      content: `${message}`,
    });
  
    /**
     * Output logic
     */
    const output = () => {
      if (queryResult.length === 0) {
        return outputFormatter(outputFormat(MESSAGES.noResults));
      }
      if (queryResult.length > 0) {
        return outputFormatter(outputFormat(MESSAGES.resultString));
      }
    };
    div.appendChild(output());
  });
  
  ```
	- {{evalparent}}
	-
-
