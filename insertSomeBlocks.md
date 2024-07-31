kit:: insertSomeBlocks
description:: Insert a logseq block and it's children as a target blocks' children [default] or sibling. Example: `{{kitButton blocks,insertSomeBlocks,ea69,'',source='66a2ecd4-644b-47b5-a9b7-cfc4b50f1376' target='66a2f05f-9991-4030-abc1-11d5b3b603c2'}}`

- ```javascript
  //fix
  
  // Usage:
  // {{kitButton blocks,insertSomeBlocks,ea69,'',source='66a2ecd4-644b-47b5-a9b7-cfc4b50f1376' target='66a2f05f-9991-4030-abc1-11d5b3b603c2'}}
  //fix
  
  // Usage:
  // {{kitButton blocks,insertSomeBlocks,ea69,'',source='66a2ecd4-644b-47b5-a9b7-cfc4b50f1376' target='66a2f05f-9991-4030-abc1-11d5b3b603c2'}}
  
  logseq.kits.insertSomeBlocks = insertSomeBlocks;
  
  function insertSomeBlocks() {
      const element = event.target.closest("button[data-kit]");
  
      const batchInsertPromise = (async (div = element) => {
          //** Argument processing */
          // The user can omit the `target` argument to use the button block as the target.
          const targetUuid = div.dataset.target ? div.dataset.target
              : div
                  .closest(".ls-block")
                  .getAttribute("blockid");
          const sourceUuid = div.dataset.source;
          const optionsString = div.dataset.options
  
  
          const blockAndChildren = await (async (blockId = sourceUuid) => {
              const blockData = await logseq.api.get_block(blockId, { includeChildren: true });
              return blockData;
          })();
  
  
          const structuredBlockData = ((blockData = blockAndChildren) => {
              // Structure the block data for use with the logseq.api.insert_batch_block function
              // by running a recrusive function on the data tree.
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
  
          // const insertFormattedBlocks = await (async (sourceBlocks = formattedBlockData, destination = ))
          /** Options for the insert_batch_block() function are passed to this script as an
           * object-like string. Convert the string to an actual object.
           */
          const processedBatchOptions = ((options = optionsString) => {
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
  
          return insertOperation = (async (source = [structuredBlockData], target = targetUuid, options = processedBatchOptions) => {
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
  await insertSomeBlocks();
  ```
	- {{evalparent}}
- ```javascript
  ```
	- {{evalparent}}
- {{kitButton as child,insertSomeBlocks,ea69,'',source='66aa4a5f-1a02-4da2-b52f-5f7d6b25cacb' target='66aa4a91-9538-4cc3-9352-7fa54d27cd8a' options='sibling: false; before: false'}} {{kitButton as sibling,insertSomeBlocks,ea69,'',source='66aa4a5f-1a02-4da2-b52f-5f7d6b25cacb' target='66aa4a91-9538-4cc3-9352-7fa54d27cd8a' options='sibling: true; before: false'}}
  {{kitButton child & before,insertSomeBlocks,ea69,'',source='66aa4a5f-1a02-4da2-b52f-5f7d6b25cacb' target='66aa4a91-9538-4cc3-9352-7fa54d27cd8a' options='sibling: false; before: true'}} {{kitButton sibling & before,insertSomeBlocks,ea69,'',source='66aa4a5f-1a02-4da2-b52f-5f7d6b25cacb' target='66aa4a91-9538-4cc3-9352-7fa54d27cd8a' options='sibling: true; before: true'}}
- I am a source block
  id:: 66aa4a5f-1a02-4da2-b52f-5f7d6b25cacb
  collapsed:: true
	- AM A CHILD!@
- parent
	- (before sibling)
	- I am a a target block
	  id:: 66aa4a91-9538-4cc3-9352-7fa54d27cd8a
		- (first child)
		- (second child)
	- (first sibling)
	- (second sib)