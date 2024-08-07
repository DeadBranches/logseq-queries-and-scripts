tags:: kit

-
- ```javascript
  logseq.kits.setStatic(function md-button(div){
  const blockId = div.closest(".ls-block").getAttribute("blockid");
  const block = logseq.api.get_block(blockId);
  const content = block.content;
  - const macroStart = content.indexOf("{{" + div.closest(".macro").dataset.macroName);
  const macroEnd = content.indexOf("}}", macroStart) + 2;
  
  const html = String.raw;
  const button = html`
  <md-icon-button class="settings-icon">
                          <md-icon>&#xea69;</md-icon> <!-- This should be an 'add' icon -->
                      </md-icon-button>
  `;
  
  div.innerHTML = `${button}`;
  
  });
  ```
	- {{evalparent}}
	- {{evalpage md-button}}
- {{md-button}}
-
