tags:: page
description:: Cataloguing custom logseq kit functions
alias:: kits
-icon:: ed01

- {{kitButton issues,collapseBlock,ea06,-button-style full-width small-caps}}
	- {{embed ((66ccdccf-f9e2-4028-b867-a7b5406fd634))}}
- {{kitButton ideas,collapseBlock,ea76,-button-style full-width small-caps}}
	- {{embed ((66df909d-79a2-4532-917e-94d3bd8b32a8))}}
- {{kitButton questions,collapseBlock,ea76,-button-style full-width small-caps}}
	- {{embed ((66df90b1-ccba-494b-94c9-76f3194e0963))}}
- # {{i edba}}  Kit templates
  *query-macro*
	- Simple `{{query-macro}}` => `kit`
	  id:: 66f08335-7b60-4abb-9534-43b4733e64a4
		- This kit template performs a query and returns a string. It is invoked from a macro.
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
		   */
		  const createElementFromObject = (formatObject) => {
		    // Case 1: String input
		    if (typeof formatObject === "string") {
		      return document.createTextNode(formatObject);
		    }
		  
		    // Case 2: Object input
		    const element = document.createElement(formatObject.element);
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
		      formatObject.content.forEach(childContent => {
		        const childElement = createElementFromObject(childContent);
		        element.appendChild(childElement);
		      });
		      return element;
		    }
		  
		    // Case 5: Object content
		    const childElement = createElementFromObject(formatObject.content);
		    element.appendChild(childElement);
		    return element;
		  };
		  
		  
		  
		  logseq.kits.setStatic(async function templateSlashCommand(div) {
		    const blockUUID = div.closest(".ls-block").getAttribute("blockid");
		    //const blockId = "66e6f56f-3005-458a-b0cd-65502c9beef1";
		    const block = logseq.api.get_block(blockUUID);
		    const targetBlock = block;
		  
		    
		    /**
		     * Definitions: Strings and format
		     */
		    const MESSAGES = {
		      noResults: "-no template-",
		      resultString: `/${queryResult}`,
		    };
		  
		    const outputFormatter = (message) => ({
		      // Refer to createElementFromObject() docstring for details on how
		      // to structure the message format
		      element: "div",
		      content: {
		        element: "small",
		        content: 
		          {
		            element: "i",
		            content: `${message}`,
		          },
		      },
		    });
		  
		  
		    /**
		     * Advanced query
		     */
		    const advancedQueryPromise = (async () => {
		      const resultArray = await (async () => {
		        const advancedQuery = `
		        [:find ?template-name
		        :where
		        [?b :block/parent ${targetBlock.id}]
		        [?b :block/properties ?props]
		        [(get ?props :template) ?template-name]
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
		  
		  
		    /**
		     * Output logic
		     */
		    const output = () => {
		      if (queryResult.length === 0) {
		        return declarativeOutputFormatter(
		          outputFormatter(MESSAGES.noResults)
		        );
		      }
		      if (queryResult.length > 0) {
		        return declarativeOutputFormatter(
		          outputFormatter(MESSAGES.resultString)
		        );
		  
		      }
		    };
		  
		    div.appendChild(output());
		  });
		  ```
- # {{i eb6b}}  Kits list
	- #+BEGIN_QUERY
	  {:query
	   [:find ?kit-name ?macro ?display-name (distinct ?journal-day) (min ?journal-day)
	    :keys kit-name macro display-name journal-day min-day
	    :where
	    [?b :block/properties ?props]
	    [(get ?props :kit) ?macro]
	    [?b :block/name ?kit-name]
	    [?b :block/original-name ?display-name]
	  
	    ;; Date the kit was made.
	    (or-join [?b ?props ?journal-day]
	  
	             (and
	              ;; There is a block in a journal page referncing the kit
	              [?r :block/refs ?b]
	              [?r :block/page ?rp]
	              [?rp :block/journal-day ?journal-day]
	              [(some? ?journal-day)])
	  
	             (and
	              [(get ?props :created-on) ?created-on]
	              [?cp :block/original-name ?all-page-names]
	              [(contains? ?created-on ?all-page-names)]
	              [?cp :block/journal-day ?journal-day]
	              [(some? ?journal-day)]
	              )
	  
	             )]
	  
	   :result-transform
	   (fn [results]
	       (->> results
	            (sort-by (comp - :min-day)))
	   )
	  
	   :view 
	   (fn [results]
	     (defn create-entry [result]
	       (let [{:keys [kit-name macro display-name journal-days last-day]} result]
	         [:article
	          [:a {:data-ref kit-name
	               :on-click (fn [] (call-api "push_state" "page" {:name kit-name}))}
	           (str display-name)]
	          [:span {:class "smaller italic enclosed"} macro]]))
	     [:div
	      (->> results
	           (map (fn [result]
	                  (create-entry result))))])
	   }
	  #+END_QUERY
