kit:: openOrders
repository:: DeadBranches/logseq-queries-and-scripts
description:: A replace-macro that returns an integer representing the number of online orders currently awaiting delivery. Used in a block header on the [[shopping]] page.

- ```javascript
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
-