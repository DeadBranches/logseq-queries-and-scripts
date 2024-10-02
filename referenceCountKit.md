kit:: referenceCountKit

- ```javascript
  /**
   * @file referenceCountKit.md
   * @requires logseq-kits
   * @see {@link https://discuss.logseq.com/t/edit-and-run-javascript-code-inside-logseq-itself/20763|Logseq Kits Setup}
   *
   * @description
   * This script defines a Logseq kit function that displays the number of references to a block
   * across the entire graph, excluding references on the current page.
   *
   * @function referenceCountKit
   * @async
   * @param {HTMLElement} div - The container element where the reference count will be displayed.
   *
   * @usage
   * 1. Create a new page in your Logseq graph named "referenceCountKit".
   * 2. Add this script to the page inside a JavaScript code block.
   * 3. In your Logseq config.edn file, add the following macro under the :macros key:
   *    :referenceCountKit "[:div {:class \"kit inline\" :data-kit \"referenceCountKit\" } ]"
   * 4. Use the macro in your Logseq pages to display reference counts.
   *
   * @example
   * {{referenceCountKit}}
   *
   * @returns {Promise<void>} - The function doesn't return a value, but appends the result to the provided div.
   *
   * @throws {Error} Throws an error if the block cannot be retrieved or if the query fails.
   *
   * @note This kit uses Logseq's DataScript query to find references. It excludes references on the current page.
   *
   * @todo Consider adding error handling for cases where the API calls might fail.
   * @todo Explore options for customizing the output message or styling.
   */
  
  logseq.kits.setStatic(async function referenceCountKit(div) {
    const blockId = div.closest(".ls-block").getAttribute("blockid");
    const block = logseq.api.get_block(blockId);
  
    // logic to specify parent
    const targetBlock = block;
  
    const referenceCountPromise = (async () => {
      const resultArray = await (async () => {
        const advancedQuery = `
        [:find ?b
        :where
  
        [${targetBlock.id} :block/refs ?ability-limitation]
        [?b :block/refs ?ability-limitation]
  
        ;; Exclude current page from results
        [?b :block/page ?ref-page]
        [(not= ?ref-page ${targetBlock.page})] 
        ]`;
  
        const queryResults = await logseq.api.datascript_query(advancedQuery)?.flat();
        return queryResults;
      })();
  
      const results = await resultArray;
      if (!results) return 0;
      return results.length - 1;
    })();
  
    const result = await referenceCountPromise;
  
    const MESSAGES = {
      noResults: "",
      seeReferences: `see ${result} references ->`,
    };
  
    const output = (resultCount = result) => {
      let output = document.createElement("div");
      if (resultCount === 0) {
        output.innerHTML = MESSAGES.noResults;
      }
      if (resultCount > 0) {
        let small = document.createElement("small");
        let italic = document.createElement("i");
        italic.innerHTML = MESSAGES.seeReferences;
        small.appendChild(italic);
        output.appendChild(small);
      }
      return output;
    };
  
    div.appendChild(output(result));
  });
  
  ```
	- {{evalparent}}
	  id:: 66e74f3f-f3e3-4b30-86c9-e7427e90f45f
	-
-
