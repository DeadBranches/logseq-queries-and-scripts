kit:: `{{templateSlashCommand}}`
created-on:: [[Sunday, Sep 22nd, 2024]]

- ```javascript
  logseq.kits.setStatic(async function templateSlashCommand(div) {
    const blockUUID = div.closest(".ls-block").getAttribute("blockid");
    //const blockId = "66e6f56f-3005-458a-b0cd-65502c9beef1";
    const block = logseq.api.get_block(blockUUID);
    const targetBlock = block;
  
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
  
  
    const MESSAGES = {
      noResults: "-no template-",
      resultString: `/${queryResult}`,
    };
  
    const outputFormatter = (message) => {
      let container = document.createElement("div");
      container.className = "gray inline";
      //let span = document.createElement("span");
      //span.className = "gray";
      let small = document.createElement("small");
      let italic = document.createElement("i");
      italic.innerHTML = message;
      small.appendChild(italic);
      //span.appendChild(small)
      //container.appendChild(span);
      container.appendChild(small)
      return container;
    }
  
    const output = () => {
      let output = document.createElement("div");
      if (queryResult.length === 0) {
        return outputFormatter(MESSAGES.noResults);
      }
      if (queryResult.length > 0) {
        return outputFormatter(MESSAGES.resultString);
      }
      // return output;
    };
  
    div.appendChild(output());
  });
  
  ```
	- {{evalparent}}
- ### Test code
	- case: template is undefined
	  expectged:
		- {{templateSlashCommand}}
	- case: template in child block is defined
	  expected: `[:small [:i "/hi mom"]]`
		- {{templateSlashCommand}}
			- moo
			  template:: hi momm
- # Query development space
	- #+BEGIN_QUERY
	  {:inputs [:current-block]
	  :query
	        [:find ?template-name
	         :in $ ?cb
	        :where
	        [?b :block/parent ?cb]
	        [?b :block/properties ?props]
	        [(get ?props :template) ?template-name]
	        ]
	  }
	  #+END_QUERY
		- moo
		  template:: hi momm
