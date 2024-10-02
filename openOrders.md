kit:: openOrders
repository:: DeadBranches/logseq-queries-and-scripts
description:: A replace-macro that returns an integer representing the number of online orders currently awaiting delivery. Used in a block header on the [[shopping]] page.

- ```javascript
  /**
   * @file openOrders.js
   * @author DeadBranch
   * @license GNU Affero General Public License v3 or greater
   * @see {@link https://discuss.logseq.com/t/edit-and-run-javascript-code-inside-logseq-itself/20763|Logseq Kits}
   * @description This Logseq kit function counts and displays the number of open
   * online orders. It helps users quickly see how many online orders are
   * awaiting delivery. The function uses a DataScript query to find blocks
   * tagged with "online order" that have a TODO marker and aren't part of a
   * template.
   *
   * Usage:
   * 1. Create a new page in your Logseq graph named "openOrders".
   * 2. Add this script to that page inside a JavaScript code block.
   * 3. Use the macro in your Logseq blocks as shown in the example.
   *
   * @param {HTMLElement} div - The HTML element where the macro is used.
   *
   * @example
   * // In a Logseq block:
   * Today I have {{openOrderCount}} to process
   * // Output: Today I have 3 orders to process
   *
   * @example
   * // In config.edn, add this macro:
   * :openOrderCount "[:div {:class \"kit inline\" :data-kit \"openOrderCount\" :data-prefix \"$1\" :data-suffix \"$2\" } ]"
   *
   * @requires Logseq Kits must be installed and set up in your Logseq graph.
   * @see {@link https://github.com/DeadBranches/logseq-queries-and-scripts/openOrders.md|Kit Source}
   */
  
  logseq.kits.setStatic(function openOrders(div){
    const blockId = div.closest(".ls-block").getAttribute("blockid");
    const block = logseq.api.get_block(blockId);
    const content = block.content;
  
    const macroStart = content.indexOf("{{" + div.closest(".macro").dataset.macroName);
    const macroEnd = content.indexOf("}}", macroStart) + 2;
  
    const queryResults = logseq.api.datascript_query(`
    [:find (count ?b)
    :where
    [?t :block/name "online order"]
    [?b :block/refs ?t]
    [?b :block/marker ?marker]
    [(contains? #{"TODO"} ?marker)]
              (not 
               [?b :block/parent ?parent]
               [?parent :block/properties ?props]
               [(get ?props :template)]
               )
    ]
    `)?.flat();
  
    
    // The advanced query returns a list, which is an array in javascript
    const numberOfOpenOrders = queryResults[0] || 0;
    console.log(numberOfOpenOrders);
    console.log(div.dataset.format);
    
    
    // The user can request a quantifier be added to the number of open orders
    // by sending 'word' as the first macro argument.
    //
    let wordQuantitySuffix;
    if (div.dataset.format == "word" || div.dataset.format == "words") {
      switch (numberOfOpenOrders) {
        case 1:
          wordQuantitySuffix = "order"
          break;
        default:
          wordQuantitySuffix = "orders"
          break;
      }
    }
    
    if (wordQuantitySuffix) {
      div.innerHTML = `${numberOfOpenOrders} ${wordQuantitySuffix}`;
    }
    if (!wordQuantitySuffix) {
      div.innerHTML = numberOfOpenOrders;
    }
    
  });
  ```
	- {{evalparent}}
- {{openOrders}}
-
-
