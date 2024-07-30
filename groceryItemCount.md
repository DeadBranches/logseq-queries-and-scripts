kit:: groceryItemCount [prefix] [suffix]

- ```javascript
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