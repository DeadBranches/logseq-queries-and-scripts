kit:: shoppingItemCount [prefix] [suffix]

- ```javascript
  /**
   * @file shoppingItemCount.md
   * @author DeadBranch
   * @see {@link https://github.com/DeadBranches/logseq-queries-and-scripts/shoppingItemCount.md|GitHub Repository}
   * @see {@link https://discuss.logseq.com/t/edit-and-run-javascript-code-inside-logseq-itself/20763|Logseq Kits Setup}
   * @description
   * This script provides a dynamic count of active shopping items in your Logseq graph.
   * It helps users track their shopping list by counting TODO items that include a "buy" macro.
   * The script uses Logseq's advanced querying capabilities to find and count relevant blocks.
   * 
   * The function works by querying for blocks with a marker (excluding "DONE") and a "buy" macro.
   * It then displays the count, optionally with a prefix and suffix.
   * 
   * @function shoppingItemCount
   * @param {HTMLElement} div - The container element for displaying the count
   * 
   * @example
   * // To use this kit:
   * // 1. Create a page named "shoppingItemCount" in your Logseq graph
   * // 2. Add the script inside a javascript code block on that page
   * // 3. Add the following macro to your Logseq config.edn file:
   * //    :shoppingItemCount "[:div {:class \"kit inline\" :data-kit \"shoppingItemCount\" :data-prefix \"$1\" :data-suffix \"$2\" } ]"
   * // 4. Use the macro in your graph like this:
   * //    {{shoppingItemCount }} or {{shoppingItemCount "$" " items"}}
   * 
   * // Example of a block that would be counted:
   * // TODO {{buy}} Buy groceries
   * 
   * @returns {void} The function updates the innerHTML of the provided div element
   */
  
  logseq.kits.setStatic(function shoppingItemCount(div){
      const blockId = div.closest(".ls-block").getAttribute("blockid");
      const sanitizeAttribute = value => value.startsWith("$") || value === "''" ? "" : value;
      const prefix = sanitizeAttribute(div.dataset.prefix) ? div.dataset.prefix : '';
      const suffix = sanitizeAttribute(div.dataset.suffix) ? div.dataset.suffix : '';
   
      const queryResults = logseq.api.datascript_query(`
      [:find (count ?b)
      :where
      [?b :block/marker ?marker]
       (not [(contains? #{"DONE"} ?marker)])   
       [?b :block/macros ?m]
       [?m :block/properties ?props]
       [(get ?props :logseq.macro-name) ?macros]
       [(= ?macros "buy")]]]
      ]
      `)?.flat();
    
      // The advanced query returns a list, which is an array in javascript
      const resultCount = queryResults[0] || 0;
      div.innerHTML = `${prefix}${resultCount}${suffix}`;
      
    });
  ```
	- {{evalparent}}
	- {{shoppingItemCount}}
	-
	-
