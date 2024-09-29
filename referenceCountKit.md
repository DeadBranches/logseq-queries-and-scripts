kit:: referenceCountKit

- ```javascript
  logseq.kits.setStatic(async function referenceCountKit(div) {
    const blockId = div.closest(".ls-block").getAttribute("blockid");
  
    //const blockId = "66e6f56f-3005-458a-b0cd-65502c9beef1";
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
      //return await resultArray;
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
