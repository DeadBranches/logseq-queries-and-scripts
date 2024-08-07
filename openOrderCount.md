kit:: openOrderCount [prefix] [suffix]
details:: Show the number of open orders. Prefix and suffix are optional, e.g. `{{openOrderCount (,)}}`.

- ```javascript
  logseq.kits.setStatic(function openOrderCount(div){
      const blockId = div.closest(".ls-block").getAttribute("blockid");
      const sanitizeAttribute = value => value.startsWith("$") || value === "''" ? "" : value;
      const prefix = sanitizeAttribute(div.dataset.prefix) ? div.dataset.prefix : '';
      const suffix = sanitizeAttribute(div.dataset.suffix) ? div.dataset.suffix : '';
      
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
      const resultCount = queryResults[0] || 0;
      div.innerHTML = `${prefix}${resultCount}${suffix}`;
      
    });
  
  ```
	- {{evalparent}}
- Tests
	- {{openOrderCount}}
	-
- # Changelog
-
