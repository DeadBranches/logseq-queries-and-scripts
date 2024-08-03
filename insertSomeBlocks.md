kit:: insertSomeBlocks
description:: Insert a logseq block and it's children as a target blocks' children [default] or sibling. Example: `{{kitButton blocks,insertSomeBlocks,ea69,'',source='66a2ecd4-644b-47b5-a9b7-cfc4b50f1376' target='66a2f05f-9991-4030-abc1-11d5b3b603c2' options='before: true; sibling: true'}}`

- ```javascript
  /// Insert block backup
  // Usage:
  // {{kitButton blocks,insertSomeBlocks,ea69,'',source='66a2ecd4-644b-47b5-a9b7-cfc4b50f1376' target='66a2f05f-9991-4030-abc1-11d5b3b603c2'}}
  
  logseq.kits.insertSomeBlocks = insertSomeBlocks;
  
  
  function insertSomeBlocks(source, target, options, unless) {
  
      const buttonElement = event.target.closest("button[data-kit]");
      // console.log(buttonElement);
      // console.groupEnd();
  
  
      /**
       * Search for the first block with the given macro name on the same page as destimationId
        */
      async function blockWithMacro(macroName, destinationId) {
          if (macroName === undefined) return false;
          if (destinationId === undefined) {
              console.warn("There is no destinationId");
              throw new Error('destinationId is required');
          }
  
          const eventSourceBlockData = await logseq.api.get_block(destinationId);
          const eventSourcePageId = eventSourceBlockData.page.id;
          const eventSourcePageData = await logseq.api.get_page(eventSourcePageId);
          const macroExistsQuery = `
                          [:find (pull ?b [*])
                          :where
                          [?p :block/name "${eventSourcePageData.name}"]
                          [?b :block/page ?p]
                          
                          [?b :block/macros ?m]
                          [?m :block/properties ?props]
                          [(get ?props :logseq.macro-name) ?macros]
                          [(= ?macros "${macroName}")]
                          ]`;
          return new Promise(async (resolve) => {
              const blockData = await logseq.api.datascript_query(macroExistsQuery)?.flat();
              const result = () => {
                  if (!blockData[0]) {
                      console.log(`Searched for blocks containing the macro {{${macroName}}} but none were found.`);
                      return false;
                  }
                  return blockData[0].uuid;
              };
              resolve(result());
          });
      };
  
      console.group("Argument Object");
      const argumentObject = ((sourceArg = source, targetArg = target, optionsArg = options, unlessArg = unless, element = buttonElement) => {
          // console.group("Inside argumentObject()");
          const triggeringBlockUuid = element.closest(".ls-block").getAttribute("blockid");
  
          const processedTargetUUID = ((el = element, fromArg = targetArg) => {
            if (el.dataset.target) {
                  // Use the user-defined data-attribute based UUID
                  console.log(`el.dataset.target: ${el.dataset.target}`);
                  return el.dataset.target;
              }
              if (fromArg != undefined) {
                  // Use the UUID passed to the kit as an argument
                  console.log(`fromArg not undefined: ${fromArg}`);
                  return fromArg;
              }
  
              console.log("Using UUID from closest element")
              return el.closest(".ls-block").getAttribute("blockid")
          })();
  
          return {
              sourceUuid: sourceArg ? sourceArg : element.dataset.source,
              targetUuid: processedTargetUUID,
              triggeringBlockUuid: element.closest(".ls-block").getAttribute("blockid"),
              optionsString: element.dataset.options ? element.dataset.options : undefined,
              unlessMacro: element.dataset.unlessMacro ? element.dataset.unlessMacro : undefined
          }
      })();
      console.table(argumentObject);
      // console.log(`argumentObject:\n${JSON.stringify(argumentObject, null, 2)}`);
      console.groupEnd();
  
      console.group("Processed Argument Object");
      //     The user can pass a macro name enclosed in single-quotes to use the first
      // block containing that macro as the target
      const processedArgumentObject = async (processedData = argumentObject, triggerElement = buttonElement) => {
          console.table(processedData)
          target = processedData.targetUuid;
          if (target.includes("parent")) {
              const newTarget = triggerElement.parentElement.closest('.ls-block').getAttribute("blockId");
              processedData.targetUuid = newTarget;
              return processedData
          }
          if (target.includes(":")) {
              warn("HEY! THIS TARGET INCLUDES A FUNNY WORD!")
              const macroName = target.replaceAll(":", "");
              const blockWithMacroId = await blockWithMacro(macroName, triggerElement.parentElement.closest('.ls-block').getAttribute("blockId"))
              processedData.targetUuid = blockWithMacroId;
              return processedData;
          }
          return processedData;
      });
      console.log(`processed arg ${await processedArgumentObject}`);
      console.groupEnd();
      return JSON.stringify(processedArgumentObject);
  
  
      /**
       * The main function that inserts the blocks.
       * @param {Object} argument - The argument object containing the source UUID, target UUID, options, and unless macro.
       * @returns {Promise} A promise that resolves when the blocks are inserted.
       */
      const batchInsertPromise = (async (argument = argumentObject, element = buttonElement) => {
  
          /**
           * Get the block data for the source UUID and all its children.
           * @throws {Error} If the source UUID is not provided.
           */
          const blockAndChildren = await (async (blockId = argument.sourceUuid) => {
              if (!blockId) {
                  throw new Error('Source UUID is required');
              }
              const blockData = await logseq.api.get_block(blockId, { includeChildren: true });
              return blockData;
          })();
          // console.log(`blockAndChildren:\n ${JSON.stringify(blockAndChildren,null,2)}`);
  
  
          /**
           * Check if a block with the same macro already exists on the page.
           * @returns {Promise<boolean>} A promise that resolves to true if the macro exists, false otherwise.
           */
  
          const macroExists = await blockWithMacro(argument.unlessMacro, argument.targetUuid);
          if (macroExists) {
              console.warn(`A block with that macro already exists on the page. Not adding any more. ${macroExists}`);
              return;
          }
  
  
          /**
           * Structure the block data for use with the logseq.api.insert_batch_block 
           * function by running a recrusive function on the data tree.
           * @param {Object} blockData - The block data object to be formatted.
           */
          const structuredBlockData = ((blockData = blockAndChildren) => {
              const formatBlockData = (block) => {
                  const formattedBlock = {
                      content: block.content
                  };
  
                  if (block.children && block.children.length > 0) {
                      formattedBlock.children = block.children.map(child => formatBlockData(child));
                  }
                  return formattedBlock;
              };
              return formatBlockData(blockData);
          })();
          // console.log(`structuredBlockData:\n${JSON.stringify(structuredBlockData,null,1)}`);
  
  
          /**
           * Process the options string into an object.
           * Options for the insert_batch_block() function are passed to this script as an
           * object-like string. Convert the string to an actual object.
           * @returns {Object} The processed options object.
           */
          const processedBatchOptions = ((options = argument.optionsString) => {
              if (!options) return { sibling: false, before: false };
              const result = {};
              const keyValuePairs = options.split(';');
              for (let pair of keyValuePairs) {
                  pair = pair.trim();
                  if (!pair) continue;
  
                  const colonIndex = pair.indexOf(':');
                  if (colonIndex === -1) throw new Error(`Invalid pair: ${pair}`);
                  const key = pair.slice(0, colonIndex).trim();
                  const value = pair.slice(colonIndex + 1).trim();
                  // Since the value is a string, convert it into a data type
                  result[key] = ((inputString = value) => {
                      switch (inputString) {
                          case 'true':
                              return true;
                          case 'false':
                              return false;
                          case 'null':
                              return null;
                          case 'undefined':
                              return undefined;
                          case (!isNaN(inputString) && inputString !== ''):
                              return Number(inputString);
                          default:
                              return inputString;
                      }
                  })();
              }
              return result;
          })();
  
          const processedTargetId = argument.targetUuid;
          return insertOperation = (async (source = [structuredBlockData], target = processedTargetId, options = processedBatchOptions) => {
              if (!target) {
                  throw new Error('Target UUID is required');
              }
              await logseq.api.insert_batch_block(
                  target,
                  source,
                  options);
          })();
  
      })();
  
      return new Promise(async (resolve) => {
          await new Promise(resolve => setTimeout(resolve, 400));
          await logseq.api.exit_editing_mode();
          resolve(await batchInsertPromise);
      });
  };
  //await insertSomeBlocks();
  ```
	- {{evalparent}}
- ```javascript
  ```
- {{kitButton as child,insertSomeBlocks,ea69,'',source='66aa4a5f-1a02-4da2-b52f-5f7d6b25cacb' target='66aa4a91-9538-4cc3-9352-7fa54d27cd8a' options='sibling: false; before: false'}} {{kitButton as sibling,insertSomeBlocks,ea69,'',source='66aa4a5f-1a02-4da2-b52f-5f7d6b25cacb' target='66aa4a91-9538-4cc3-9352-7fa54d27cd8a' options='sibling: true; before: false'}}
  {{kitButton child & before,insertSomeBlocks,ea69,'',source='66aa4a5f-1a02-4da2-b52f-5f7d6b25cacb' target='66aa4a91-9538-4cc3-9352-7fa54d27cd8a' options='sibling: false; before: true'}} {{kitButton sibling & before,insertSomeBlocks,ea69,'',source='66aa4a5f-1a02-4da2-b52f-5f7d6b25cacb' target='66aa4a91-9538-4cc3-9352-7fa54d27cd8a' options='sibling: true; before: true'}}
- I am a source block
  id:: 66aa4a5f-1a02-4da2-b52f-5f7d6b25cacb
  collapsed:: true
	- AM A CHILD!@
- parent
	- (before sibling)
	- I am a source block
		- AM A CHILD!@
	- I am a source block
		- AM A CHILD!@
	- I am a source block
		- AM A CHILD!@
	- I am a source block
		- AM A CHILD!@
	- I am a a target block
	  id:: 66aa4a91-9538-4cc3-9352-7fa54d27cd8a
		- I am a source block
			- AM A CHILD!@
		- (first child)
		- (second child)
	- (first sibling)
	- (second sib)
- {{kitButton unless doing-holder,insertSomeBlocks,ea69,'',source='66aab047-cf56-49b4-98e4-43b408d2ce52' target='66aab050-8c4e-48a9-bf18-84f6a5b50b99' options='sibling: false; before: false' unless-macro='doing-holder'}}
	- {{kitButton unless doing-holder target:journalBuddy,insertSomeBlocks,ea69,'',source='66aab047-cf56-49b4-98e4-43b408d2ce52' target='parent' options='sibling: false; before: false' unless-macro='doing-holder'}}
	- -source-block-
	  id:: 66aab047-cf56-49b4-98e4-43b408d2ce52
	- target: journalBuddy {{journalBuddy}}
		- child
	- -source-block-
	- target-block
	  id:: 66aab050-8c4e-48a9-bf18-84f6a5b50b99
		- -source-block-
		- -source-block-
		- -source-block-
		- -source-block-
		- -source-block-
		- -source-block-
		- -source-block-
- ```javascript
  await logseq.kits.insertSomeBlocks('66aab047-cf56-49b4-98e4-43b408d2ce52','66aab050-8c4e-48a9-bf18-84f6a5b50b99', {}, "mushroom");
  ```
	- {{evalparent}}
-