kit:: groceryItemCount [prefix] [suffix]

- ```javascript
  /**
   * @file groceryItemCount.js
   * @summary This script counts the number of grocery items in the Logseq graph
   *          that are not marked as DONE and displays the count in a specified
   *          block.
   * @description This script is used to count the number of grocery items in the
   *               Logseq graph that are not marked as DONE. The script must be
   *               added to a page in the Logseq graph named [[groceryItemCount]].
   *               In the new kits page, the script must be added inside a
   *               JavaScript markdown code block. The script queries the Logseq
   *               graph for blocks with the macro name "grocery" and counts the
   *               number of such blocks that are not marked as DONE. The count is
   *               then displayed in the specified block with optional prefix and
   *               suffix.
   * @author DeadBranch
   * @license GNU Affero General Public License v3 or greater
   * @example
   * // Add the following macro to the :macros key of the logseq `config.edn` file:
   * :groceryItemCount "[:div {:class \"kit inline\" :data-kit \"groceryItemCount\"
   *                           :data-prefix \"$1\" :data-suffix \"$2\" } ]"
   * @example
   * // Sample Logseq graph block:
   * TODO Buy milk
   * grocery:: {{grocery}}
   * @param {HTMLDivElement} div - The div element where the count will be displayed.
   */
  logseq.kits.setStatic(function groceryItemCount(div){
   
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
     [(= ?macros "grocery")]]]
    ]
    `)?.flat();
  
    // The advanced query returns a list, which is an array in javascript
    const resultCount = queryResults[0] || 0;
    div.innerHTML = `${prefix}${resultCount}${suffix}`;
   
  });
  ```
	- {{evalparent}}
	- Count only: {{groceryItemCount (,)}}
	- Prefix w/ null suffix: {{groceryItemCount (}}
	- Empty prefix and suffix: {{groceryItemCount '',)}}
	- Prefix and suffix: {{groceryItemCount (,)}}
	- inline counts {{groceryItemCount (,)}} {{groceryItemCount (,)}}
	- (25)
- T
-
