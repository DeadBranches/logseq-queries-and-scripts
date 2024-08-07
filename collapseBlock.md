kit:: kitButton collapseBlock [collapse?]

- ```javascript
  logseq.kits.collapseBlock = collapseBlock;
  
  async function collapseBlock(el, mode = 'process') {
    const me = event.target.closest('.ls-block');
  
    const blockId = me.closest(".ls-block").getAttribute("blockid");
    const block = logseq.api.get_block(blockId);
    await logseq.api.set_block_collapsed(block.uuid, "toggle");
  
  }
  collapseBlock(null)
  ```
	- {{evalparent}}
- hi mom
	- hi
	  {{kitButton collapse,collapseBlock,'','',parent}}
		- child
			- collapse
		-
-
-
