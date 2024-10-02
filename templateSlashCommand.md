kit:: `{{templateSlashCommand}}`
created-on:: [[Sunday, Sep 22nd, 2024]]

- ```javascript
  /**
   * @file templateSlashCommand.md
   * @description A Logseq kit script that displays the template name associated with a block.
   * 
   * @requires logseq
   * @requires logseq-kits
   * 
   * @function templateSlashCommand
   * @async
   * @param {HTMLElement} div - The div element where the output will be appended.
   * 
   * @description This function performs the following tasks:
   * 1. Retrieves the UUID of the closest block to the input div.
   * 2. Fetches the block data using the Logseq API.
   * 3. Executes an advanced Datalog query to find the template name associated with the block.
   * 4. Formats and displays the result (template name or a default message) inline with the block.
   * 
   * @query The Datalog query used:
   * [:find ?template-name
   *  :where
   *  [?b :block/parent ${targetBlock.id}]
   *  [?b :block/properties ?props]
   *  [(get ?props :template) ?template-name]]
   * 
   * @output The function appends a div element to the input div with the following possible contents:
   * - If a template is found: "/<template-name>"
   * - If no template is found: "-no template-"
   * 
   * 
   * @usage This script should be added to a Logseq page named "templateSlashCommand".
   * The script must be placed inside a JavaScript markdown code block on this page.
   * 
   * @macro To use this kit, add the following macro to the :macros key in Logseq's config.edn file:
   * :templateSlashCommand "[:div.kit.inline { :data-kit templateSlashCommand :data-arguments \"$1\"} ]"
   * 
   * @example
   * // In a Logseq block:
   * {{templateSlashCommand}}
   * 
   * @returns {void} This function doesn't return a value, it modifies the DOM directly.
   * 
   * @throws Will throw an error if the Logseq API calls fail or if the DOM manipulation encounters issues.
   * 
   * @author DeadBranch
   * @version 1.0.0
   * @date Sunday, Sep 22nd, 2024
   */
  
  logseq.kits.setStatic(async function templateSlashCommand(div) {
    const blockUUID = div.closest(".ls-block").getAttribute("blockid");
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
  
    const MESSAGES = {
      noResults: "-no template-",
      resultString: `/${queryResult}`,
    };
  
    const outputFormatter = (message) => {
      let container = document.createElement("div");
      container.className = "gray inline";
      let small = document.createElement("small");
      let italic = document.createElement("i");
      italic.innerHTML = message;
      small.appendChild(italic);
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
