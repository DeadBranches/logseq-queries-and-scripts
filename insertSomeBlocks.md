kit:: insertSomeBlocks
description:: Insert a logseq block and it's children as a target blocks' children [default] or sibling. Example: `{{kitButton blocks,insertSomeBlocks,ea69,'',source='66a2ecd4-644b-47b5-a9b7-cfc4b50f1376' target='66a2f05f-9991-4030-abc1-11d5b3b603c2' options='before: true; sibling: true'}}`

- ```javascript
  // Usage:
  // {{kitButton blocks,insertSomeBlocks,ea69,'',source='66a2ecd4-644b-47b5-a9b7-cfc4b50f1376' target='66a2f05f-9991-4030-abc1-11d5b3b603c2'}}
  
  logseq.kits.insertSomeBlocks = insertSomeBlocks;
  
  /**
   * Function to insert a block and all children into a page with various options.
   * Includes:
   *  - Options: Specifiy if target should be child, sibling, come before, or after
   *  - Source: Specify block UUID to fetch that block's data
   *  - UnlessMacro: Only insert the block if a specific macro is absent from the page
   * @param source {string} The UUID of the source block.
   * @param target {string} The UUID of the target block.
   * @param options {string} The options string.
   * @param unless {string} The unless macro.
   *
   */
  function insertSomeBlocks(source, target, options, unless) {
    // console.group('insertSomeBlocks entry');
    // console.log(`insertSomeBlocks argument values`);
    // console.log(`source: ${source}\ntarget ${target}\noptions ${options}\nunless: ${unless}`);
    const buttonElement = event.target.closest("button[data-kit]");
    // console.log(buttonElement);
    // console.groupEnd();
  
    const argumentObject = ((
      sourceArg = source,
      targetArg = target,
      optionsArg = options,
      unlessArg = unless,
      element = buttonElement
    ) => {
      // console.group("Inside argumentObject()");
      const triggeringBlockUuid = element.closest(".ls-block").getAttribute("blockid");
  
      if (triggeringBlockUuid)
        return {
          // The kit has been invoked from a button block & arguments are
          // passed as data atributes
          sourceUuid: element.dataset.source,
  
          // The user may omit the target argument to use the invoking block as the target
          targetUuid: element.dataset.target
            ? element.dataset.target
            : element.closest(".ls-block").getAttribute("blockid"),
  
          triggeringBlockUuid: element.closest(".ls-block").getAttribute("blockid"),
          optionsString: element.dataset.options ? element.dataset.options : undefined,
  
          unlessMacro: element.dataset.unlessMacro
            ? element.dataset.unlessMacro
            : undefined,
        };
  
      // This kit can be invoked from another kit along with arguments
      return {
        sourceUuid: sourceArg,
        targetUuid: targetArg,
        triggeringBlockUuid: undefined,
        optionsString: optionsArg ? optionsArg : undefined,
        unlessMacro: unlessArg ? unlessArg : undefined,
      };
    })();
    // console.log(`argumentObject:\n${JSON.stringify(argumentObject, null, 2)}`);
    // console.groupEnd();
  
    /**
     * The main function that inserts the blocks.
     * @param {Object} argument - The argument object containing the source UUID, target UUID, options, and unless macro.
     * @returns {Promise} A promise that resolves when the blocks are inserted.
     */
    const batchInsertPromise = (async (argument = argumentObject) => {
      /**
       * Get the block data for the source UUID and all its children.
       * @throws {Error} If the source UUID is not provided.
       */
  
      const blockAndChildren = await (async (blockId = argument.sourceUuid) => {
        if (!blockId) {
          throw new Error("Source UUID is required");
        }
  
        const blockData = await logseq.api.get_block(blockId, { includeChildren: true });
        return blockData;
      })();
      // console.log(`blockAndChildren:\n ${JSON.stringify(blockAndChildren,null,2)}`);
  
      /**
       * Check if a block with the same macro already exists on the page.
       * @returns {Promise<boolean>} A promise that resolves to true if the macro exists, false otherwise.
       */
      const macroExists = await (async (
        macroName = argument.unlessMacro,
        eventSourceId = argument.triggeringBlockUuid
      ) => {
        console.group("MacroExists");
  
        if (macroName === undefined) return false;
  
        if (eventSourceId === undefined) {
          console.warn("There is no eventSourceId (triggeringBlockUuid).");
          console.table(argument);
          throw new Error("eventSourceId is required");
        }
  
        const eventSourceBlockData = await logseq.api.get_block(eventSourceId);
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
                  ]
              `;
        // console.log(`Event source id:\n${eventSourceId}`);
        //console.table(eventSourceBlockData);
  
        return new Promise(async (resolve) => {
          const macroBlocks = await logseq.api.datascript_query(macroExistsQuery)?.flat();
  
          const result = () => {
            console.table(macroBlocks);
  
            if (!macroBlocks[0]) {
              console.log(
                `Searched for blocks containing the macro {{${macroName}}} but none were found.`
              );
              return false;
  
            }
            return true;
          };
  
          resolve(result());
        });
      })();
  
      if (macroExists) {
        console.warn(
          "A block with that macro already exists on the page. Not adding any more."
        );
        return;
  
      }
      console.groupEnd();
  
      /**
       * Structure the block data for use with the logseq.api.insert_batch_block
       * function by running a recrusive function on the data tree.
       * @param {Object} blockData - The block data object to be formatted.
       */
      const structuredBlockData = ((blockData = blockAndChildren) => {
  
        const formatBlockData = (block) => {
          const formattedBlock = {
            content: block.content,
          };
  
          if (block.children && block.children.length > 0) {
            formattedBlock.children = block.children.map((child) =>
              formatBlockData(child)
            );
  
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
        const keyValuePairs = options.split(";");
        for (let pair of keyValuePairs) {
          pair = pair.trim();
          if (!pair) continue;
  
          const colonIndex = pair.indexOf(":");
          if (colonIndex === -1) throw new Error(`Invalid pair: ${pair}`);
          const key = pair.slice(0, colonIndex).trim();
          const value = pair.slice(colonIndex + 1).trim();
          // Since the value is a string, convert it into a data type
          result[key] = ((inputString = value) => {
            switch (inputString) {
              case "true":
                return true;
              case "false":
                return false;
              case "null":
                return null;
              case "undefined":
                return undefined;
              case !isNaN(inputString) && inputString !== "":
                return Number(inputString);
              default:
                return inputString;
            }
          })();
        }
        return result;
      })();
  
      return (insertOperation = (async (
        source = [structuredBlockData],
        target = argument.targetUuid,
        options = processedBatchOptions
      ) => {
        if (!target) {
          throw new Error("Target UUID is required");
        }
        await logseq.api.insert_batch_block(target, source, options);
      })());
    })();
  
    return new Promise(async (resolve) => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      await logseq.api.exit_editing_mode();
      resolve(await batchInsertPromise);
    });
  }
  //await insertSomeBlocks();
  
  ```
	- {{evalparent}}
- ```javascript
  ```
	- {{evalparent}}
- {{kitButton as child,insertSomeBlocks,ea69,'',source='66aa4a5f-1a02-4da2-b52f-5f7d6b25cacb' target='66aa4a91-9538-4cc3-9352-7fa54d27cd8a' options='sibling: false; before: false'}} {{kitButton as sibling,insertSomeBlocks,ea69,'',source='66aa4a5f-1a02-4da2-b52f-5f7d6b25cacb' target='66aa4a91-9538-4cc3-9352-7fa54d27cd8a' options='sibling: true; before: false'}}
  {{kitButton child & before,insertSomeBlocks,ea69,'',source='66aa4a5f-1a02-4da2-b52f-5f7d6b25cacb' target='66aa4a91-9538-4cc3-9352-7fa54d27cd8a' options='sibling: false; before: true'}} {{kitButton sibling & before,insertSomeBlocks,ea69,'',source='66aa4a5f-1a02-4da2-b52f-5f7d6b25cacb' target='66aa4a91-9538-4cc3-9352-7fa54d27cd8a' options='sibling: true; before: true'}}
- I am a source block
	- AM A CHILD!@
- parent
	- (before sibling)
	- I am a a target block
		- I am a source block
			- AM A CHILD!@
		- (first child)
		- (second child)
	- (first sibling)
	- (second sib)
- {{kitButton unless-macro,insertSomeBlocks,ea69,'',source='66aab047-cf56-49b4-98e4-43b408d2ce52' target='66aab050-8c4e-48a9-bf18-84f6a5b50b99' options='sibling: false; before: false' unless-macro='doing-holder'}}
	- -source-block-
	  id:: 66aab047-cf56-49b4-98e4-43b408d2ce52
	- target-block {{doing-holder}}
	  id:: 66aab050-8c4e-48a9-bf18-84f6a5b50b99
		- -source-block-
		- -source-block-
		- -source-block-
		- -source-block-
- ```javascript
  await logseq.kits.insertSomeBlocks('66aab047-cf56-49b4-98e4-43b408d2ce52','66aab050-8c4e-48a9-bf18-84f6a5b50b99', {}, "mushroom");
  ```
	- {{evalparent}}
- dest
	- tye
	- ### {{h-admin}} [[admin]]
	  ((662e6daa-e7f1-489f-a8ae-d40add917aa1))
	- ### {{h-resources}} [[resources]]
	  ((662e6757-a3ce-4379-9519-52d6b6133dfb))
	- ### {{h-research}} [[research]]
	  ((662e691a-f289-4178-8828-d8d624de58c5))
	- ### {{h-thoughts}} [[thoughts]]
	  ((662e68bb-da7d-4c47-a248-71f8c4554969))
	- ### {{h-notes}} [[notes]]
	  ((662e67a8-8e34-4a89-b3f9-7d4fa65a47f7))
	- ### {{h-writings}} [[writings]]
	  ((662e696b-3d43-4201-acf5-76879c81cdc6))
	- ### {{h-code}} [[code]]
	  ((66841c96-4f60-4f38-9511-29506db47192))
-
