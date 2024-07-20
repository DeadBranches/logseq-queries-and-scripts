kit:: kitButton collapseBlock [collapse?]

- ```javascript
  logseq.kits.collapseBlock = collapseBlock;
  
  async function collapseBlock(el, mode = 'process') {
  	const me = event.target.closest('.ls-block');
    /*
    const meButton = event.target
    const kitArguments = meButton.dataset.arguments;
    const meDiv = meButton.closest('.ls-block')
    console.log(kitArguments);
    return null;
    */
    
    /*
    logseq.kits.setStatic(function kitButton(div) {
    //console.log("kitButton function initiated");
    const buttonBaseClass = "kit run inline button-style button-shape hover active";
    const iconAttributeName = "data-button-icon";
    const labelAttributeName = "data-button-text";
    const argumentsAttributeName = 'data-arguments';
    const kitPage = div.dataset.kitPage;
    */
    
    
  
    
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