kit:: refIcon
-icon:: f7ee

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
  
  logseq.kits.setStatic(async function refIcon(div) {
    const blockUUID = div.closest(".ls-block").getAttribute("blockid");
    //const blockId = "66e6f56f-3005-458a-b0cd-65502c9beef1";
    //const block = logseq.api.get_block(blockUUID);
    //const targetBlock = block;
    // console.group("inputs");
    // console.log("blockUUID:", blockUUID);
    // console.log("blockUUID type:", typeof blockUUID);
    // console.groupEnd;
  
    /**
     * Advanced query
     */
    const advancedQueryPromise = (async () => {
      const resultArray = await (async () => {
        const advancedQuery = `
   [:find ?icon
    :keys icon
    :where
    [?b :block/uuid #uuid "${blockUUID}"]
    [?b :block/refs ?r]
  
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
    const MESSAGES = {
      noResults: "&#x0000;",
      resultString: `&nbsp;&nbsp;&#x${queryResult[0].icon};`,
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
	- {{refIcon}} [[:logseq-ideas-assistant]]
- {{kitButton issues,collapseBlock,ea06,-button-style full-width small-caps}}
	- {{embed ((66ccdccf-f9e2-4028-b867-a7b5406fd634))}}
- {{kitButton ideas,collapseBlock,ea76,-button-style full-width small-caps}}
	- {{embed ((66df909d-79a2-4532-917e-94d3bd8b32a8))}}
- {{kitButton questions,collapseBlock,ea76,-button-style full-width small-caps}}
	- {{embed ((66df90b1-ccba-494b-94c9-76f3194e0963))}}
- # {{i eb6c}} Topics
  *use the \#topics tag to show content here*
	- ### Open topics
		- {{embed ((66e5e078-e59c-4064-91cf-2c3eec36af87))}}
		- {{kitButton export,exportquery,'',squat}}
	- Covered topics
		- {{embed ((66e5e0c4-d1cc-4598-8e00-07f0abad84b0))}}
		- {{kitButton export,exportquery,'',squat}}
- page has an icon
	- test data
		-
		- my uuid: 66f08832-0446-450c-8f23-89366ffe00a9
		  id:: 66f08832-0446-450c-8f23-89366ffe00a9
		  reficon: {{refIcon}} 
		  ref: [Therapy appointment with @Shane WWC](((6707fdd4-3f35-4e71-b362-a298adf916ab)))
		  
		  #+BEGIN_QUERY
		  {:query
		   [:find ?icon
		    :in $ ?b
		    :keys icon
		    :where
		    [?b :block/refs ?r]
		    [?b :block/properties ?block-props]
		  
		    [(identity "0000") ?default-icon]
		    (or-join [?r ?block-props ?default-icon ?icon]
		             ;; Check for icon in primary linked reference
		             (and
		              [?r :block/properties ?props]
		              [(get ?props :-icon) ?icon]
		              [(some? ?icon)])
		             ;; Check for icon in activity reference
		             (and
		              [?r :block/properties ?props]
		              [(get ?props :-icon) ?r-icon]
		              [(nil? ?r-icon)]
		              [(get ?block-props :activity) ?activity]
		              [?a :block/name ?activity]
		              [?a :block/properties ?activity-props]
		              [(get ?activity-props :-icon) ?icon]
		              [(some? ?icon)])
		             ;; Default cases
		             (and
		              [?r :block/properties ?props]
		              [(get ?props :-icon :not-found) ?icon-or-not-found]
		              [(= ?icon-or-not-found :not-found)]
		              [(identity ?default-icon) ?icon])
		             (and
		              [(missing? $ ?r :block/properties)]
		              [(identity ?default-icon) ?icon]))
		    ]
		   
		  :view :pprint
		   }
		  #+END_QUERY
	- query
		- #+BEGIN_QUERY
		  {:query
		   [:find (pull ?b [*]) ?icon
		    :keys block i
		    :where
		    [?b :block/uuid #uuid "66f08832-0446-450c-8f23-89366ffe00a9"]
		    [?b :block/refs ?r]
		  
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
		              [(identity ?default-icon) ?icon]
		              )
		             (and
		              [(missing? $ ?r :block/properties)]
		              [(identity ?default-icon) ?icon])
		              )
		  
		    ]
		   :result-transform
		   (fn [result]
		     (if (empty? result)
		       [[]]))
		  
		   :view
		   (fn [results]
		     (if (= results [[]])
		       "no results"
		       result))
		  
		  }
		  
		  
		  #+END_QUERY
- page does not have an icon
	- test data
	  id:: 66f317b3-65d6-4efd-86d2-e7bffb07bb87
		- my uuid:
		  reficon:
		  ref: [[goals]]
		  
		  
		  #+BEGIN_QUERY
		  {:inputs [:current-block]
		   :query
		   [:find ?icon
		    :in $ ?cb
		    :keys i
		    :where
		    [?cb :block/refs ?r]
		  
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
		   
		   :view :pprint
		    }
		  #+END_QUERY
	- query
		- #+BEGIN_QUERY
		  {:query
		   [:find (pull ?b [*]) ?icon
		    :keys block i
		    :where
		    [?b :block/uuid #uuid "66f08832-0446-450c-8f23-89366ffe00a9"]
		    [?b :block/refs ?r]
		  
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
		   
		   :result-transform
		   (fn [result]
		     (if (empty? result)
		       [[]]))
		  
		   :view
		   (fn [results]
		     (if (= results [[]])
		       "no results"
		       result))
		  }
		  
		  
		  #+END_QUERY
- > that's the issue, we need more NPU developments to achieve such 
  performance; currently a RTX3090 have 284 TOPS at INT8, compared to 16 
  TOPS on the M2 line and 45 - 50 TOPS on the upcoming 8000 APU ryzen cpus
