description:: JavaScript button library
tags:: page
-icon:: eb04
repository:: DeadBranches/logseq-queries-and-scripts

- #### {{i-inbox}} Logseq inbox
  id:: 660c8b4b-be82-4019-943b-dfabdb2c7161
- ## Idea trackers
	- {{kitButton issues,collapseBlock,ea06,-button-style full-width small-caps}}
		- {{embed ((66ccdccf-f9e2-4028-b867-a7b5406fd634))}}
	- {{kitButton ideas,collapseBlock,ea76,-button-style full-width small-caps}}
		- {{embed ((66df909d-79a2-4532-917e-94d3bd8b32a8))}}
	- {{kitButton questions,collapseBlock,ea76,-button-style full-width small-caps}}
		- {{embed ((66df90b1-ccba-494b-94c9-76f3194e0963))}}
- ## Useful things
	- Logseq config.edn template -> {{i-github}} [logseq/logseq](https://github.com/logseq/logseq/blob/4374741afd9add1716da62b3bf6466cffa5be082/src/resources/templates/config.edn#L4)
		- My local version last drawn from commit [`26d255d`](https://github.com/logseq/logseq/commit/26d255d0b1a065fa66c135b0fbe4d7270b55e1b5)
	- [[logseq-source]]
- ## Things I built
	- #### Insert batch blocks from UUID
		- See page [[journalOrganizationBlocks]]
		- ```js
		  /**
		     * SOURCE_UUID: uuid
		     *  The UUID of the block that contains the content to insert
		     * INSERTION_IDENTIFIER: str
		     *  The logseq macro name that identifies the relative insertion point of the source
		     *  content in the destination page.
		     */
		    const SOURCE_UUID = "66b0ead7-67ee-44fd-a324-bd5dd7602f39";
		    const INSERTION_IDENTIFIER = "journal-container-insertion-point"; // macro name
		  
		    /**
		     * BATCH_INSERT_OPTIONS
		     *  Options to pass to logseq api call insert_batch_block
		     * STRUCTURE_BLOCK_OPTIONS
		     *  Object with options for what to include from the source block.
		     *  - parent: boolean
		     *      Exclude or include the parent block
		     */
		    const BATCH_INSERT_OPTIONS = { before: false, sibling: true };
		    const STRUCTURE_BLOCK_OPTIONS = { parent: false };
		  
		  
		    /**
		     * Insertion location
		     */
		    const me = event.target.closest(".ls-block");
		    const journalRoot = me.closest(".journal-item.content");
		  
		    const targetBlockUUID = journalRoot
		      .querySelector(`[data-macro-name="${INSERTION_IDENTIFIER}"]`)
		      .closest(".ls-block")
		      .getAttribute("blockId");
		  
		  
		    /**
		     * Insert batch blocks
		     *
		     * structuredBlockData() works to reformat the results of get_block() into
		     *  { content: '' } objects, which is the format insert_batch_block() expects.
		     */
		    const blockAndChildren = await (async (blockId = SOURCE_UUID) => {
		      if (!blockId) {
		        throw new Error("Source UUID is required");
		      }
		  
		      const blockData = await logseq.api.get_block(
		        blockId,
		        { includeChildren: true });
		      return blockData;
		    })();
		  
		    const structuredBlockData = ((
		      blockData = blockAndChildren,
		      options = STRUCTURE_BLOCK_OPTIONS
		    ) => {
		      const formatBlockData = (block) => {
		        const formattedBlock = {
		          content: block.content,
		        };
		  
		        if (block.children && block.children.length > 0) {
		          formattedBlock.children = block.children
		            .map((child) => formatBlockData(child));
		        }
		        return formattedBlock;
		      };
		  
		      if (options.parent) return formatBlockData(blockData);
		      if (!options.parent) return formatBlockData(blockData).children;
		    })();
		  
		  
		    try {
		      const insertedBlocks = await logseq.api.insert_batch_block(
		        targetBlockUUID,
		        structuredBlockData,
		        BATCH_INSERT_OPTIONS
		      );
		  
		      await new Promise((resolve) => setTimeout(resolve, 400));
		      await logseq.api.exit_editing_mode();
		  
		      console.log("Exited editing mode successfully");
		    } catch (error) {
		      console.log(
		        `Inserting blocks via \`insert_batch_block()\` failed.\ntargetBlockUUID: ${targetBlockUUID}\n${error}`
		      );
		      return null;
		    }
		  }
		  ```
	- ### {{i fa1e}} Logseq clickable tables
	  Prevent clicks from entering edit mode
		- {{i f313}} *Created,* [Friday, Aug 9th, 2024](((66b64953-d2cf-40c8-a6b0-287d4e947659)))
		- {{i ee1d}} *Project,* [[:logseq-clickable-tables]]
		- {{i-github}} *Initial commit,* [`7969123`](https://github.com/deadbranch-configuration/logseq-conf/commit/79691236568efd4e266cf35ed545f7cf3b98baad)
		- {{i eac6}}  Info ->
			- {{embed ((66b64953-d2cf-40c8-a6b0-287d4e947659))}}
	- {{i-icon}} Logseq tabler icons
	  id:: 66acd8ef-ed7b-4ad2-9b62-491833497415
		-
	- ### {{i ea06}} Idea helper
	  Issue/idea/question tracker
		- {{i f313}} *Initiated,* [July 3rd, 2024](((66a015d2-1f08-4b33-bcba-84207b76eeda)))
		- {{i ee1d}} *Project,* [[:logseq-ideas-assistant]]
		- {{i eac6}}  Info ->
			- {{embed ((66a015d2-1f08-4b33-bcba-84207b76eeda))}}
		- Related
			- Advanced query concept snippet: ((66a05e34-42c8-4cf7-8b0b-27cb0943d9ac))
	- #### {{i-rocket}} Dynamic do icon color
	  id:: 66437a69-136d-4497-939e-417a30549cd0
	  Colors a rocket icon in different ways depending on the marker block status
	  `custom.css`
		- ![image.png](../assets/image_1715698586106_0.png){:height 88, :width 263}
	- ### {{i ef0c}} nested code button blocks
	  id:: 663a5760-c71b-451f-82f5-8bc5d2e6538a
	  Hide a code block in a code button's *first child's first child* by using the `{{nested-code-block}}` macro
	- ### {{i ebcc}} code-inside macro
	  id:: 6633bac5-c14b-42f9-addb-301f036b3a14
	  ![image.png](../assets/image_1714666556422_0.png)
		- `{{code-inside}}`
	- #### {{i ebcd}} inline span for hiccups
	  id:: 6633ba16-d333-4dc6-b5c9-90fa2edd278d
	  Add `{:class "inline"}`to any hiccup to make inline
		- Made to enable icons beside a span with different font styles in the `{{code-inside}}` macro
		- Original css:
		  ```css
		  /* Inline span */
		  /* Makes hiccup spans inline with other things around them. */
		  div.hiccup_html:has(span.inline) {
		    display: inline-block;
		  }
		  ```
	- ### {{i ec36}} Journal quick-view
	  id:: 662cf12c-9daa-49bc-be99-1aa91bece6cb
	  ![image.png](../assets/image_1714221417848_0.png)
	- ### {{i ebcc}} Youtube icon-link generator
	  id:: 661fd703-8f9c-4e25-84f8-5f27171a8dde
	  *kit*: Gets the title from a youtube link via `{{yt url}}}`
		- Uses kits: [[youtubeIconLinker]]
	- #### {{i ebcc}} appointment header macro
	  id:: 6617fa76-02fe-4af6-9291-e2c531e0ea9e
	  `{{h-appointment}}` *adds appointment header*
		- {{embed ((6617fa07-211b-4e83-a0da-92fc7a052062))}}
	- #### {{i f4f9}} appointment command
	  `/appointment` *inserts an appointment header and properties*
		- {{embed ((6617fb78-4812-437e-a756-0f141ba062fd))}}
	- #### {{i f61a}} schedule-date-today replacement macro
	  id:: 6612c8d2-e36d-472e-a510-de50978ae6a3
	  Today's date in `SCHEDULED:` format
		- Uses ((6612c2d3-809e-46f8-836c-ad132a528707))
		- Implementation:
		  {{embed ((65fdfbf2-818e-404e-9d60-7f941f29bf34))}}
		- `custom.edn`
		  ```edn
		  :macros {
		         :schedule-date-today "<div class='kit' data-kit='expandmacro'>||scheduled today||</div>"
		           }
		  ```
		- {{embed [[scheduleDateToday]] }}
	- #### icon links
	  id:: 6612cf52-7324-492d-9c8f-f78061e1e841
		- ```css
		  div[data-macro-name="il" i] {
		    display: inline;
		  }
		  div.raw_html:has(a[data-icon-before]){
		    display: inline;
		  }
		  a[class~="tag"]:is([data-icon-before])::before {
		    font-size: 16px;
		    font-family: 'tabler-icons';
		    content: attr(data-icon-before);
		    color: var(--ls-link-text-color);
		    -webkit-font-smoothing: antialiased;
		  }
		  ```
	- #### hidden properties
	  id:: 6612cfab-c66a-4e7f-a04b-0c08e002a9d7
		- `custom.css`
		  ```css
		  /**   Hidden properties              */
		  div.block-properties.rounded:has(+ div.block-body div.is-paragraph div[data-macro-name="grocery"]) {
		    display: none;
		  }
		  ```
- ## {{i ef0c}} JavaScript functions
  For logseq
	- ### toLogseqJournalDate( date ) -> int
		- ```javascript
		  function toLogseqJournalDate(date) {
		    // Logseq's :block/journal-date format is YYYYMMDD
		    const d = new Date(date),
		          month = '' + (d.getMonth() + 1),
		          day = '' + d.getDate(),
		          year = d.getFullYear();
		    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('');
		  }
		  // Example usage
		  const todaysJournalDate = toLogseqJournalDate(new Date());
		  console.log(todaysJournalDate);
		  ```
	- ### daysBetween( str, str ) -> *int*
	  `daysBetween(firstDate, SecondDate`
	  Returns the number of days between two dates formatted as *YYYYMMDDD*
		- {{embed ((6666f998-c9a0-4940-8720-00350e7049b0))}}
	- ### show( *str* ) -> *None*
	  `show(inputText)`
	  Logs the input to the console, formatting it if it's an object.
		- **Parameters**:
			- `input`: The data to be logged. Can be any type.
		- **Returns**: Nothing. Outputs to the console.
	- ### copy_to_clipboard( *str* ) -> *None*
	  `copy_to_clipboard(value)`
	  Copies the provided value to the clipboard.
		- **Parameters**:
			- `value`: The string to be copied to the clipboard.
		- **Returns**: Nothing. The value is copied to the user's clipboard.
	- ### getParentUUID( *str* ) -> *str*
	  `getParentUUID(targetUUID)`
	  Retrieves the UUID for the parent block with child having *targetUUID*
		- **Parameters**:
			- `targetUUID`: The UUID of the target block.
		- **Returns:** *string*. The UUID of the parent block as a string.
	- ### getPageUuid( *obj* ) -> *str*
	  `getPageUuid(this)`
	  Return the UUID of the current page.
		- **Parameters**:
			- `this`: Literal *this*
		- **Returns**:
			- The UUID of the page the block is on.
	- ### insertTemplate( *str*, *str*, *obj* ) -> *Promise*
	  `insertTemplate(templateName, targetUUID, options)`
	  Inserts a template as the first child of the target block and optionally moves it based on provided options.
		- **Parameters**:
			- `templateName`: The name of the template to insert.
			- `targetUUID`: The UUID of the target block where the template will be inserted.
			- `options`: An object with options for moving the block (same as `move_block`).
		- **Returns**: The UUID of the newly inserted template block if options are not provided. Otherwise, no return value.
	- ### append_block_and_edit( obj, str, str )
	  `append_block_and_edit(caller, where, what)`
	  Appends a block to a specified location in Logseq.
		- **Function arguments**
		  | parameter | description |
		  | --- | --- |
		  | *caller* | The block object from which the function is called. [:br]*Example*:  this |
		  | *where * | A string specifying where to append the block [:br]*Example*:  "page" |
		  | *what* | The content to be appended as a new block |
		- **Returns**
		  Nothing. This function performs an action without returning a value.
- ## {{i ed37}} Button block library
  Javascript code implementing button features
	- **copy code fence content** from button's **second child**
		- {{button copy,copy_second_sibling,ea6f,long squat}}
		  template:\: tool, copy second sibling code block content button
			- ### {{i f6ef}}  depreciation warning
			      this block is no longer in use
				- {{i ea0b}} *depreciated on* *[[Monday, Jul 22nd, 2024]]*
			- {{nested-code-block}}
				- copy_second_sibling:
				  ```js
				  const second_child = logseq.api.get_next_sibling_block(this.nestedMacroUuid);
				  const pattern = new RegExp("```(?:[a-zA-Z\\d_-]*)*\\n(.+?)\\n```", "usgm");
				  const match = pattern.exec(second_child.content);
				  const clipboard = `${match[1]}\n\n[source](((${second_child.uuid})))`;
				  navigator.clipboard.writeText(clipboard);
				  ```
			- ```
			  I am copied
			  ```
	- **copy query data** to clipboard
	  id:: 660cbb59-8f06-43c6-b600-f4adb08758b5
	- **block spy** for logseq data
	  id:: 66046249-db4c-4206-b001-691fad2bd2e2
		- #### Tool: Logseq block spy
			- {{button spy,spy,''}}
			  template:: tool, return element data as JSON
				- blocks
				  spy:
				  ```js
				  let parent = logseq.api.get_block(getParentUUID(this.target_uuid));
				  copy_to_clipboard(JSON.stringify(parent,null,2));
				  
				  ```
	- **get parent uuid** from button block
		- ```js
		  let button_block = logseq.api.get_block(this.target_uuid);
		  let parent_block_id = button_block.parent.id;
		  let parent_block = logseq.api.get_block(parent_block_id);
		  let parent_block_uuid = parent_block_data.uuid;
		  
		  console.log(`Parent block uuid: ${parent_block_uuid}`);
		  ```
	- **insert block** as *sibling below* button
		- ```js
		  const block_content = ``;
		  
		  const options = { sibling:true, before:false, focus:false }
		  logseq.api.insert_block(this.target_uuid, block_content, options);
		  ```
	- **append** block to **end of page**
		- ```js
		  const buttonBlock = logseq.api.get_block(this.target_uuid);
		  const pageId = buttonBlock.page.id;
		  const page = logseq.api.get_page(pageId);
		  //console.log(page)
		  logseq.api.insert_block(page.name, "hi");
		  ```
	- **insert template** as *sibling below* button
		- ```js
		  let template_name = "buttoner - new logseq api reference";
		  
		  async function insertTemplate(target_uuid, template_name) {
		      // Insert template as first child to parent of button block
		      await logseq.api.insert_template(target_uuid, template_name);
		  }
		  
		  let button_block_uuid = this.target_uuid;
		  let button_block = logseq.api.get_block(button_block_uuid);
		  let parent_block_id = button_block.parent.id;
		  let parent_block = logseq.api.get_block(parent_block_id);
		  let parent_block_uuid = parent_block.uuid;
		  
		  insertTemplate(parent_block_uuid, template_name);
		  let updatedParentBlock = logseq.api.get_block(parent_block_uuid);
		  let first_child_uuid = updatedParentBlock.children[0][1];
		  
		  // Move newly inserted template to be underneath (a sibling of) button_block
		  let options = { before: false, children: false }
		  logseq.api.move_block(first_child_uuid, button_block_uuid, options);
		  ```
		- /pro
		- Think about this issue at length. Try to make some mistakes that beginners would make, and then offer corrections from the perspective of an expert. Reserve your final contributions until the end of the conversation, and throughout your reply use a process where you propose an idea, test the idea in writing, and then come to some conclusions. For example:
		  > My goal is to write a javascript hello world. So, I think one possible best way to do this is with a print statement. A print statement would look like `print("Hello world');`. However, now that I think about it, print() is not syntactically correct javascript. So, perhaps using console.log() would work better. Such an approach could look like: `console.log('hello world');`. Now that I've reviewed the two previous methods for writing a hello world statement my conclusion is that the second option (`console.log('hello world');`) is the best approach. So, I will now write a more in-depth hello-world statement using the aformentioned best approach ...
- ## {{i efc5}} JavaScript API ref
  id:: 65f5d381-8e00-4e19-bdbf-95727eb6a07e
  Logseq JavaScript API functions
	- {{button add ref,insert_template,ea69}}
		- insert_template:
		  ```js
		  let templateName = "buttoner - new logseq api reference";
		  
		  // Insert template as first sibling to parent of button block
		  let options = { before: false, children: false }
		  insertTemplate(templateName, this.target_uuid, options);
		  ```
	- {{button insert block,implementation_code,eb92,long}}  `insert_block(this.uuid, block_content)`
		- implementation_code:
		  ```js
		  let api_implementation = `
		  let target_uuid = "";
		  let block_content = "";
		  
		  logseq.api.insert_template(target_uuid, block_content);
		  `;
		  
		  copy_to_clipboard(api_implementation.trim());
		  ```
	- {{button insert template,implementation_code,eb39,long}}  `insert_template(target_uuid, template_name)`
		- implementation_code:
		  ```js
		  let api_implementation = `
		  let target_uuid = "";
		  let template_name = "";
		  
		  logseq.api.insert_template(target_uuid, template_name);
		  `;
		  
		  copy_to_clipboard(api_implementation.trim());
		  ```
-
- ### Things from other users
	- #### File explorer
	  {{i eb54}} [File Explorer from within Logseq](https://discuss.logseq.com/t/file-explorer-from-within-logseq/21703)
		- ### Introduction
			- This is:
			- a safe subset of [File management from within Logseq, proof-of-concept 159](https://discuss.logseq.com/t/file-management-from-within-logseq-proof-of-concept/21388)
				- it doesn’t depend on it
				- the unsecure now builds on top of the safe
			- to either:
				- use as it is for:
					- exploring folder hierarchies
					- opening files or folders in external applications
				- build custom functionality on top of it
					- this is the real feature, not to replace other explorers
		- ### Current Features
			- Use a simple **macro** to turn any block into a node **about** your file system, e.g.:
				- `{{foldername C:/pathto/parentfolder}}`
				- Such blocks can be safely:
					- deleted:
						- no changes to the file system
					- moved:
						- position is irrelevant
					- copied:
						- no changes to the file system
						- each copy is **independent**
			- **Hover** to show the available buttons.
				- Here only one and only for folders, but custom buttons are supported.
			- Simple `click` on the name of an entry to ask the operating system to **open** that folder or file.
			- Simple `click` on button `Read` to see if that path currently exists in the file system.
			- `Alt + click` on button `Read` to **auto-generate blocks** in a hierarchy that matches the one currently on the drive.
				- This may take some **time** for big trees.
					- Try first with a small one.
				- Repeat to **refresh**:
					- The blocks are **not synced** with the file system.
					- Any outdated blocks get **deleted**.
						- **Copies** don’t get affected.
							- Can use this feature for **comparisons**.
			- **Expand** a folder-block to show its contents.
				- **Nested** blocks don’t get affected by expanding/collapsing.
					- They maintain their values since the last `Read` of any of their ancestor blocks.
			- **Zoom** on a block to focus as usually.
			  
			  ---
		- ### Code
			- At the end of file `preload.js`, normally inside `...\Logseq\app-0.9.18\resources\app\js`:
			  
			  ```
			  contextBridge.exposeInMainWorld('getfs', ()=>({
			  access: fs.access,
			  readdir: fs.readdir,
			  readdirSync: fs.readdirSync
			  }))
			  ```
				- This needs to be **re-added** after every **update** of Logseq.
			- Inside file `config.edn`, inside `macros{}`:
			  
			  ```
			  :filename "<div class='kit filesystem' data-kit='filesystem' data-type='file' data-name='$1'></div>"
			  :foldername "<div class='kit filesystem' data-kit='filesystem' data-type='folder' data-name='$1'></div>"
			  ```
			- Inside file `custom.css`:
			  
			  ```
			  button.filesystem {
			  font-size: 12px;
			  line-height: 14px;
			  margin: 0px 8px 0px 8px;
			  padding: 2px 4px 2px 4px;
			  }
			  button.filesystem.read {
			  background: #ff9900;
			  }
			  div.block-content button.filesystem {
			    visibility: hidden;
			  }
			  div.block-content:hover button.filesystem {
			    visibility: visible;
			  }
			  a.external-link.file-link {
			    border-bottom-style: none;
			  }
			  ```
			- The code below requires having [kits  13](https://discuss.logseq.com/t/edit-and-run-javascript-code-inside-logseq-itself/20763) inside file `custom.js` .
			- Inside page `FileSystem` in Logseq, put the following code in a javascript code-block:
			- ```
			  const LS = logseq.api
			  const Module = logseq.Module
			  const Kits = Module.Kits
			  - function statusMsg(status, msg){
			    Module.Msg.ofStatus(msg, status)
			  }
			  const error = statusMsg.bind(null, "error")
			  const info = statusMsg.bind(null, "info")
			  const success = statusMsg.bind(null, "success")
			   const fs = window.getfs && getfs()
			  if (!fs) return error("missing fs")
			  - const Block = (Module.Block || Module.setChild("Block"))
			  .setStatic(function forEachChild(block, cb){
			    block.children.find( (arr)=>{
			        const child = LS.get_block(arr[1])
			        if (child) return cb(child)
			    })
			  })
			  .setStatic(function parentOf(block){
			    return LS.get_block(block.parent.id)
			  })
			  
			   const FS = Module.setChild("FileSystem")
			  .setStatic(function appendButtonsForBlock(div, block){
			    const blockId = block.uuid
			    if (block.properties.foldername) div.append(
			        FS.button("Read", FS.onReadClicked, blockId)
			    )
			  })
			  .setStatic(function button(name, handler, arg){
			    const btn = Kits.createElementOfClass("button", "filesystem", name)
			    btn.classList.add(name.toLowerCase().replaceAll(" ", "-"))
			    Kits.addClickEventToButton(handler.bind(null, arg), btn)
			    return btn
			  })
			  .setStatic(function deleteMissingBlockChildren(block, cb){
			    const rest = []
			    var rem = 0
			    Block.forEachChild(block, (child)=>{
			        rem += 1
			        fs.access(FS.fullPathOfBlock(child), (err)=>{
			            if (err) {
			                LS.remove_block(child.uuid)
			                console.log("DELETED BLOCK: " + FS.nameOfBlock(child))
			            } else {
			                rest.push(child)
			            }
			            if (!--rem) cb(rest)
			        })
			    })
			    if (!rem) cb(rest)
			  })
			  .setStatic(function fullPathOfBlock(block){
			    const name = FS.nameOfBlock(block)
			    return (!name) ? "" : FS.pathOfBlock(Block.parentOf(block)) + name
			  })
			  .setStatic(function iconForBlock(block){
			    const props = block.properties
			    return (props.foldername) ? "&#xeaad" : FS.iconForFilename(props.filename)
			  })
			  .setStatic(function iconForFilename(filename){
			    return "&#xeaa2"
			  })
			  .setStatic(function insertChildBlock(parentBlock, path, name){
			    const property = FS.isFolder(path + "/" + name) ? "foldername" : "filename"
			    const nameblock = {properties: {[property]: name}}
			  
			  var found
			    Block.forEachChild(parentBlock, (sibling)=>{
			        if (FS.nameCompare(sibling, nameblock) > -1) return found = sibling
			    })
			    if (found && !FS.nameCompare(found, nameblock)) return found.uuid
			  
			  const customUUID = LS.new_block_uuid()
			    const properties = {[property]: name}
			    const options = {customUUID, properties}
			    if (found) {
			        options.before = true
			        options.sibling = true
			    }
			    const content = "{{" + property + " " + name + "}}"
			    const uuid = (found || parentBlock).uuid
			    LS.insert_block(uuid, content, options)
			  })
			  .setStatic(function isFolder(path){
			    try { fs.readdirSync(path) }
			    catch { return false }
			    return true
			  })
			  .setStatic(function nameCompare(a, b){
			    const aprops = a.properties
			    const bprops = b.properties
			  - const aname = aprops.filename
			    const bname = bprops.filename
			    if (aname && !bname) return 1
			    if (!aname && bname) return -1
			  - const prop = (aname) ? "filename" : "foldername"
			    return aprops[prop].toLowerCase().localeCompare(bprops[prop].toLowerCase())
			  })
			  .setStatic(function nameOfBlock(block){
			    const properties = block.properties
			    return properties.foldername || properties.filename
			  })
			  .setStatic(function nameOfErr(err){
			  return err.message.slice(0, err.message.indexOf(":"))
			  })
			  .setStatic(function onReadClicked(blockId, e){
			    const block = LS.get_block(blockId)
			    fs.access(FS.fullPathOfBlock(block), (err)=>{
			        if (err) return info("doesn't exist")
			  
			  if (e.altKey) FS.updateTreeBlock(block)
			        else info("Alt to read")
			    })
			  })
			  .setStatic(function onTreeBlockUpdated(spanIcon, iconHtml, res){
			    spanIcon.innerHTML = iconHtml
			    if (res === "done") success("done")
			    else error(res)
			  })
			  .setStatic(function pathOfBlock(block){
			    const foldername = block && block.properties.foldername
			    return (!foldername) ? "" : pathOfBlock(Block.parentOf(block)) + foldername + "/"
			  })
			  .setStatic(function sortBlocks(blocks){
			    blocks.sort(FS.nameCompare)
			  
			  var previous
			    const options = {sibling: true}
			    blocks.forEach( (block)=>{
			        if (previous) {
			            LS.move_block(block.uuid, previous.uuid, options)
			        }
			        previous = block
			    })
			  })
			  .setStatic(function updateChildren(parentBlock, cb){
			    var rem = 0
			    Block.forEachChild(parentBlock, (child)=>{
			        if (!child.properties.foldername) return;
			  - rem += 1
			        FS.updateFolderBlock(child, ()=>{ if (!--rem) cb("done") } )
			    })
			    if (!rem) cb("done")
			  })
			  .setStatic(function updateDiv(div, blockId){
			    const divParent = div.closest(".block-content")
			    divParent.querySelector(".block-content-inner").remove()
			    const divProps = divParent.querySelector(".block-properties div")
			  
			  const block = LS.get_block(blockId)
			    const spanIcon = Kits.createElementOfClass("span", "ti")
			    spanIcon.innerHTML = FS.iconForBlock(block)
			  
			  const link = Kits.createElementOfClass("a", "external-link", FS.nameOfBlock(block))
			    link.href = "file:///" + FS.fullPathOfBlock(block)
			    link.target = '_blank'
			    link.classList.add("file-link")
			  - divProps.firstChild.remove()
			    divProps.firstChild.remove()
			    divProps.firstChild.remove()
			    divProps.prepend(spanIcon, " ", link)
			    FS.appendButtonsForBlock(divProps, block)
			  })
			  .setStatic(function updateFolderBlock(block, cb){
			    const path = FS.fullPathOfBlock(block)
			    const uuidParent = block.uuid
			    fs.readdir(path, (err, names)=>{
			        if (err) return cb(FS.nameOfErr(err) + ": " + path)
			  
			  FS.deleteMissingBlockChildren(block, (rest)=>{
			            if (!names.length) return cb("done");
			  
			  if (rest.length) FS.sortBlocks(rest)
			            names.forEach( (name)=>{
			                FS.insertChildBlock(block, path, name)
			                block = LS.get_block(uuidParent)
			            })
			            if (!rest.length) LS.set_block_collapsed(uuidParent, true)
			  - FS.updateChildren(block, cb)
			        })
			    })
			  })
			  .setStatic(function updateTreeBlock(block){
			    const selector = "div.ls-block [blockid='" + block.uuid + "'] .ti"
			    const spanIcon = document.querySelector(selector)
			    const cb = FS.onTreeBlockUpdated.bind(null, spanIcon, spanIcon.innerHTML)
			    spanIcon.innerHTML = "&#xeaae"
			    FS.updateFolderBlock(block, cb)
			  })
			  
			  logseq.kits.setStatic(function filesystem(div){
			    const type = div.dataset.type
			    const name = div.dataset.name
			    const blockId = div.closest(".ls-block").getAttribute("blockid")
			    LS.upsert_block_property(blockId, type + "name", name)
			    setTimeout(FS.updateDiv, 0, div, blockId) // wait UI
			  })
			  
			  FS.fs = fs
			  ```
	- #### Pages tagged auto-hide
	  {{il eb54,collapse the list of pages tagged with by default,https://discuss.logseq.com/t/collapse-the-list-of-pages-tagged-with-x-by-default/28698/2}}
		- > Is there a way to hide the list of of pages which are tagged with a page property, ie the ‘Pages tagged with X’ list? I’m trying to set up course pages in Logseq for my uni notes. I have a page where all the courses are combined, let’s call it ‘All courses’. On that page, there is the list of "Pages tagged with “All courses”. Those would be the courses (pages): Test course 1, Test course 2. I want to collapse that list, because I can just use page references to create a list which I can access and manipulate more easily than that list of page properties (see screenshot
		- custom.js
		  
		  ```js
		  const taggedpages = document.getElementsByClassName("page-tags");
		  const taggedpagesObserver = new MutationObserver(function onMutated(){
		      Array.prototype.map.call(taggedpages, (div)=>{
		          if (div.dataset.initialized) return
		  
		          const classList = div.querySelector(".content .initial").classList
		          classList.remove("initial")
		          classList.add("hidden")
		  
		          div.dataset.initialized = "true"
		      })
		  });
		  taggedpagesObserver.observe(document.getElementById("app-container"), {
		      childList: true, subtree: true
		  });
		  ```
	- #### Labels macro
	  {{il eb54,status labels macro,https://discuss.logseq.com/t/macros-and-commands-lets-share/9565/4?u=deadbranch}}
		- > I am brand new to macro and commands. But I really wanted status labels and this post helped me achieve that.
		  > ```
		  {{pill grey,inactive}} {{pill blue,info}} {{pill green,success}} {{pill yellow,warning}} {{pill red,important}}
		  ```
		  > ![image](https://discuss.logseq.com/uploads/default/original/2X/5/558ad21c31d9b4d20636e92aaf09f0f97981dcaf.png)
		  >
		  > **config.edn**
		  > ```
		  :macros {
		     "pill" "<span class=\"pill pill-$1\">$2</span>"
		  }
		  :commands [
		    ["pill-red" [[:editor/input "{{pill red,}}" {:backward-pos 2}]]]
		    ["pill-yellow" [[:editor/input "{{pill yellow,}}" {:backward-pos 2}]]]
		    ["pill-blue" [[:editor/input "{{pill blue,}}" {:backward-pos 2}]]]
		    ["pill-green" [[:editor/input "{{pill green,}}" {:backward-pos 2}]]]
		    ["pill-grey" [[:editor/input "{{pill grey,}}" {:backward-pos 2}]]]
		  ]
		  ```
		  >
		  > **custom.css**
		  > ```
		  html[data-theme=dark] {
		  --red: #cb4b16;
		  --orange: #ffb86c;
		  --yellow: #b58902;
		  --blue:#656aa4;
		  --green: #219d85;
		  --grey: #586e75;
		  }
		  >
		  span.pill {
		  border-radius: var(--ls-border-radius-low);
		  background-color: var(--ls-page-inline-code-bg-color);
		  border: 1px solid;
		  padding-left: 0.3em;
		  padding-right: 0.3em;
		  }
		  span.pill-red {
		  border-color: var(--red);
		  color: var(--red);
		  }
		  span.pill-yellow {
		  border-color: var(--yellow);
		  color: var(--yellow);
		  }
		  span.pill-blue {
		  border-color: var(--blue);
		  color: var(--blue);
		  }
		  span.pill-green {
		  border-color: var(--green);
		  color: var(--green);
		  }
		  span.pill-grey {
		  border-color: var(--grey);
		  color: var(--grey);
		  }
		  span.inline div {
		  display:inline;
		  }
		  ```
		  >
		  > **Note:** The last rule for `span.inline div` is because Logseq will wrap the macros in divs that are blocks, otherwise forcing each label onto a new line.
	- #### Logseq kits
	  id:: 6612c2d3-809e-46f8-836c-ad132a528707
	  {{il eb54,Edit and run javascript code inside Logseq itself,https://discuss.logseq.com/t/edit-and-run-javascript-code-inside-logseq-itself/20763}}
		- #+BEGIN_QUOTE
		   The theoretical background and discussion is [here](https://discuss.logseq.com/t/logseq-for-code-management/20743).
		   A specific implementation and its discussion is below.
		   It supports other languages as well. Please visit their threads for directions:
		  
		   [python](https://discuss.logseq.com/t/edit-and-run-python-code-inside-logseq-itself/20829)
		   [R](https://discuss.logseq.com/t/edit-and-run-r-code-inside-logseq-itself/20878)
		  
		  **Is this for you?**
		  
		      Do you want a Jupyter-like experience?
		      Do you need extra functionality but are tired of searching:
		          for the proper plugin
		              and waiting for its author to make changes?
		          which plugin breaks something?
		      Have you messed with file `custom.js`?
		          Tired of restarting after every change?
		          `custom.js` getting too big?
		      Initial loading of Logseq too slow?
		      Wished to:
		          be in control of code loading?
		              load code only when actually needed?
		              control the loading order?
		          develop for Logseq from within Logseq itself?
		          comment on code with Logseq notes?
		  
		  **Introducing kits**
		  
		  - Define a few buttons in file config.edn, inside macros{}:
		  ```edn
		  :evalpage "<button class='kit eval' data-kit='evalpage'>► Evaluate code of open code-blocks</button>"
		  :evalparent "<button class='kit eval' data-kit='evalparent'>► Evaluate code of parent block</button>"
		  :runpage "<button class='kit run' data-kit='runpage' data-page-name='$1'>► Run code of page $1</button>"
		  :togglemsg "<button class='kit' data-kit='togglemsg'>► Toggle messages</button>"
		  ```
		  
		  - Define a few css rules in file `custom.css`:
		  ```css
		  button.kit {
		    background: var(--ls-tertiary-background-color);
		    padding: 2px 4px 2px 4px;
		  }
		  button.out {
		    background: var(--ls-tertiary-background-color);
		    display: inline-table;
		    line-height: 12px;
		    margin: 0px 3px 0px 3px;
		    padding: 2px;
		  }
		  div.out button.out {
		      visibility: hidden;
		  }
		  div.out:hover button.out {
		      visibility: visible;
		  }
		  div.out {
		    font-size: 14px;
		  }
		  span.out {
		    display: inline-table;
		    font-size: 14px;
		    padding: 2px;
		    white-space: pre-wrap;
		  }
		  ```
		  #+END_QUOTE
		- #+BEGIN_QUOTE
		  Put the following code in file `custom.js` (create inside folder logseq if missing):
		  ```js
		  const AsyncFunction = async function(){}.constructor;
		  function Concept(_key){
		      return {_key, __proto__: Concept.prototype};
		  }
		  Concept.prototype.setChild = Concept.setChild = function setChild(name){
		      const child = Concept(name);
		      this[name] = child;
		      return child;
		  }
		  Concept.prototype.setStatic = function setStatic(func){
		      this[func.name] = func;
		      return this;
		  }
		  
		  const Language = logseq.Language = Concept.setChild("Language");
		  const Module = logseq.Module = Concept.setChild("Module");
		  
		  const Kits = Module.setChild("Kits")
		  .setStatic(function addClickEventToButton(handler, button){
		      button.addEventListener("click", function onClicked(e){
		          e.preventDefault();
		          e.stopPropagation();
		          handler(e);
		      });
		  })
		  .setStatic(function createElementOfClass(tag, className, ...children){
		      const elem = document.createElement(tag);
		      elem.classList.add(className);
		      elem.append(...children);
		      return elem;
		  })
		  .setStatic(function evalDiv(div){
		      const blockId = div && div.getAttribute("blockid");
		      const block = logseq.api.get_block(blockId);
		      const divRow = Kits.onParentEvalStarted(div);
		      Kits.runRoot(block).then(Kits.onParentEvalFinished.bind(null, divRow));
		  })
		  .setStatic(function getKitByName(name){
		      var handler = kits[name];
		      if (typeof handler === "function") return Promise.resolve(handler);
		  
		      return Kits.runPageByName(name).then( ()=>kits[name] );
		  })
		  .setStatic(function loadDependencies(dependencies){
		      const langs = Object.values(dependencies);
		      if (langs.length < 1) return;
		  
		      return Promise.all(langs.map( (lang)=>lang.load() ))
		          .then( ()=>(new Promise( (resolve)=>setTimeout(resolve, 1000) )) );
		  })
		  .setStatic(function onLoadFailed(module, er){
		      Msg.ofStatus("could not load " + module, "error");
		      throw(er);
		  })
		  .setStatic(function onObserverFinished(nofFound, missing){
		      if (nofFound) Msg.info("handled " + nofFound + " macro(s)");
		      if (missing.length > 1) Msg.warning(missing.join("\n"));
		  })
		  .setStatic(function onParentEvalFinished(divRow, res){
		      if (typeof res === "string" && res.slice(0, 10) === "data:image") {
		          const img = Kits.createElementOfClass("img", "out");
		          img.setAttribute("src", res);
		          res = img;
		      }
		  
		      divRow.lastChild.remove();
		      divRow.lastChild.after("=>", Kits.createElementOfClass("span", "out", res));
		  })
		  .setStatic(function onParentEvalStarted(container){
		      const btnRemove = Kits.createElementOfClass("button", "out", "X");
		      const divRow = Kits.createElementOfClass("div", "out", btnRemove, "...running...");
		  
		      const wrapper = container.getElementsByClassName("block-content-wrapper")[0];
		      wrapper.append(divRow);
		  
		      Kits.addClickEventToButton(Kits.onRemoveClicked.bind(null, wrapper), btnRemove);
		      return divRow;
		  })
		  .setStatic(function onRemoveClicked(wrapper, e){
		      if (!e.ctrlKey) return e.target.parentElement.remove();
		      if (!e.shiftKey) {
		          return Kits.removeElems(wrapper.querySelectorAll("div.out"));
		      }
		  
		      const divs = document.querySelectorAll("div.ls-block div[data-lang]");
		      Array.prototype.forEach.call(divs, (div)=>{
		          const container = div.closest("div.ls-block");
		          Kits.removeElems(container.querySelectorAll("div.out"));
		      });
		  })
		  .setStatic(function onRootRunFailed(er){
		      Msg.error("run failed");
		      throw(er);
		  })
		  .setStatic(function onRootRunFinished(nofCodeblocks, res){
		      Msg.success("ran " + nofCodeblocks + " codeblock(s)");
		      return res;
		  })
		  .setStatic(function removeElems(elems){
		      Array.prototype.forEach.call(elems, (elem)=>elem.remove() );
		  })
		  .setStatic(function runRoot(root){
		      var begin;
		      const dependencies = {};
		      var prom = new Promise( (resolve)=>begin=resolve )
		          .then(Kits.loadDependencies.bind(null, dependencies));
		  
		      var nofCodeblocks = 0;
		      const blocks = (root.children) ? [root] : logseq.api.get_page_blocks_tree(root.name);
		      blocks.forEach(Kits.traverseBlocksTree, (block)=>{
		          const content = block.content;
		          const codeStart = content.indexOf("```") + 3;
		          if (codeStart < 3) return;
		  
		          const langEnd = content.search(/\w\W/);
		          const strLang = content.slice(codeStart, langEnd + 1);
		          var lang = logseq.Language[strLang];
		          if (!lang) return;
		  
		          if (!lang.eval) dependencies[lang._key] = lang;
		          const lineEnd = content.indexOf("\n", codeStart);
		          const codeEnd = content.indexOf("```", lineEnd);
		          if (codeEnd < 0) return;
		  
		          nofCodeblocks += 1;
		          const code = content.slice(lineEnd, codeEnd);
		          prom = prom.then( ()=>lang.eval(code) );
		      });
		  
		      begin();
		      return prom
		          .then(Kits.onRootRunFinished.bind(null, nofCodeblocks))
		          .catch(Kits.onRootRunFailed);
		  })
		  .setStatic(function runPageByName(pageName){
		      var page = logseq.api.get_page(pageName);
		      if (page) return Kits.runRoot(page);
		  
		      Msg.warning("page not found");
		      return Promise.resolve();
		  })
		  .setStatic(function traverseBlocksTree(block){
		      if (Array.isArray(block)) return;
		  
		      this(block);
		      block.children.forEach(traverseBlocksTree, this);
		  });
		  
		  const Msg = Module.setChild("Msg")
		  .setStatic(function cond(status, msg){
		      if (Msg.state === "on") Msg.ofStatus(msg, status);
		  });
		  Msg.error = Msg.cond.bind(null, "error");
		  Msg.info = Msg.cond.bind(null, "info");
		  Msg.success = Msg.cond.bind(null, "success");
		  Msg.warning = Msg.cond.bind(null, "warning");
		  Msg.ofStatus = logseq.api.show_msg;
		  Msg.state = "off";
		  
		  const JS = Language.setChild("javascript")
		  .setStatic(function eval(code){
		      return AsyncFunction(code)();
		  });
		  
		  const Python = Language.setChild("python")
		  .setStatic(function load(uri){
		      Msg.ofStatus("Preparing python...", "info");
		      return import(uri || Python.pyodideUri)
		          .then(Python.onLoaderFetched)
		          .then(Python.onPyodideLoaded)
		          .catch(Python.onFail);
		  })
		  .setStatic(function onLoaderFetched(loader){
		      return loader.loadPyodide();
		  })
		  .setStatic(function onPyodideLoaded(Pyodide){
		      Python.Pyodide = Pyodide;
		      Python.eval = Pyodide.runPythonAsync.bind(Pyodide);
		      Msg.ofStatus("Python ready", "success");
		  });
		  Python.onFail = Kits.onLoadFailed.bind(null, "pyodide");
		  Python.pyodideUri = "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.mjs";
		  
		  const R = Language.setChild("r")
		  .setStatic(function load(uri){
		      Msg.ofStatus("Preparing R...", "info");
		      return import(uri || R.webrUri)
		          .then(R.onModuleFetched)
		          .then(R.onWebrLoaded)
		          .catch(R.onFail);
		  })
		  .setStatic(function onModuleFetched(module){
		      R.module = module;
		      const webR = new module.WebR();
		      return webR.init().then( ()=>webR );
		  })
		  .setStatic(function arrayFromRes(res){
		      if (res.toArray) return res.toArray().then(arrayFromRes);
		      if (!Array.isArray(res)) return Promise.resolve(res);
		      return Promise.all(res.map(arrayFromRes));
		  })
		  .setStatic(function onWebrLoaded(Webr){
		      R.Webr = Webr;
		      R.eval = function(code){
		          return Webr.evalR(code).then(R.arrayFromRes);
		      }
		      Msg.ofStatus("R ready", "success");
		  });
		  R.onFail = Kits.onLoadFailed.bind(null, "webr");
		  R.webrUri = "https://webr.r-wasm.org/latest/webr.mjs";
		  
		  const kits = logseq.kits = Concept.setChild("kits")
		  kits.evalpage = Kits.addClickEventToButton.bind(null, function onEvalPageClicked(e){
		      document.querySelectorAll("div.ls-block div[data-lang]").forEach( (div)=>{
		          Kits.evalDiv(div.closest("div.ls-block"));
		      });
		  });
		  kits.evalparent = Kits.addClickEventToButton.bind(null, function onEvalParentClicked(e){
		      const child = e.target.closest("div.ls-block");
		      Kits.evalDiv(child.parentElement.closest("div.ls-block"));
		  });
		  kits.runpage = Kits.addClickEventToButton.bind(null, function onRunPageClicked(e){
		      var pageName = e.target.dataset.pageName || "";
		      if (pageName === "current page") {
		          const page = logseq.api.get_current_page();
		          if (page) pageName = page.name;
		      }
		      Kits.runPageByName(pageName);
		  });
		  kits.togglemsg = Kits.addClickEventToButton.bind(null, function onToggleMsgClicked(e){
		      Msg.state = (Msg.state === "on") ? "off" : "on";
		      Msg.ofStatus("Messages " + Msg.state, "success");
		  });
		  
		  const kitelems = document.getElementsByClassName("kit");
		  const kitsObserver = new MutationObserver(function onMutated(){
		      var nofFound = 0;
		      const missing = ["Missing kit(s): "];
		  
		      const proms = Array.prototype.map.call(kitelems, (elem)=>{
		          const data = elem.dataset;
		          const status = data.kitStatus;
		          if (status === "handled") return;
		  
		          if (data.pageName === "$1") {
		              data.pageName = "current page";
		              elem.textContent = elem.textContent.replace("page $1", "current page");
		          }
		  
		          data.kitStatus = "handled";
		          const kitName = data.kit;
		          return Kits.getKitByName(kitName).then( (handler)=>{
		                  if (typeof handler !== "function") {
		                      missing.push(kitName);
		                      return;
		                  }
		  
		                  handler(elem);
		                  nofFound += 1;
		              });
		      });
		  
		      Promise.all(proms).then( ()=>{
		          Kits.onObserverFinished(nofFound, missing);
		      });
		  });
		  kitsObserver.observe(document.getElementById("app-container"), {
		      attributes: true,
		      subtree: true,
		      attributeFilter: ["class"]
		  });
		  Msg.ofStatus("kits ok", "success");
		  ```
		  
		  
		      This sets a single `MutationObserver` for all your needs.
		          No need to edit this file again.
		      Restart Logseq and accept running `custom.js`.
		          Before continuing, ensure that you get a success message “kits ok”:
		  
		  Put the rest of your code directly in Logseq:
		  
		      Turn any block into code editor with `/code block` and then javascript (or python, r etc.) Either:
		          put some quick code in a temporary place
		          use one page per module
		      No need to restart again (unless for cleaning the memory).
		      Run your code either:
		          one block at a time
		              Add a child-block.
		              Type `{{evalparent}}` to get a button for running the parent’s code and showing its result.
		  
		              The results:
		                  are not saved anywhere
		                  are lost when moving away
		                  can be selected and copied
		                  can be removed by:
		                      click on the X-button (appears on hover) for a single one.
		                      `Ctrl + click` for all the results of a code-block.
		                      `Ctrl + Shift + click` for every result everywhere.
		              If a result is a base-64 string starting with data:image, it is rendered as an image.
		      one page at a time
		          Type `{{runpage}}` to get a button for running all code in the current page (of the main pane).
		              from top to bottom:
		                  ignoring any content outside code-blocks of supported languages
		                  auto-awaiting each code-block before moving to the next one
		              Some other page can be specified by its name, e.g. `{{runpage mypage}}`
		          Type `{{evalpage}}` to get a button for running all visible code-blocks in parallel and showing their results.
		  
		  Type `{{togglemsg}}` to get a button for toggling helpful (but tiring) messages.
		  Have your code run when needed from anywhere in Logseq:
		  
		      Inside your code, register the entry function of each module with `logseq.kits.mypage =` the function.
		          mypage should be the actual name of the module’s page
		      Define your own macros (like the predefined above) by adding to their attributes:
		          `class='kit'`
		         `data-kit='mypage'` 
		      The system will:
		          run once the page’s code, if needed
		          call the entry function once for each macro, passing it the macro’s element
		              The macro can provide arguments to the element, read from your code with `.dataset` or `.getAttribute`
		  #+END_QUOTE
	- #### Logseq code buttons
	  id:: 6612c529-4236-427f-8021-772cd7757bed
	  {{il eb54,Code buttons - simple way to execute JavaScript inside Markdown codeblock,https://discuss.logseq.com/t/code-buttons-simple-way-to-execute-javascript-inside-markdown-codeblock/21035}}
		- #+BEGIN_QUOTE
		  The topic about interactive programming  and mini apps inside Logseq seems super exciting nowadays.
		  
		  Here is a quick way to  execute JavaScript code, which is located inside Markdown codeblocks.
		  
		  Thanks to [@mentaloid](https://discuss.logseq.com/u/mentaloid) for work and inspiration in [Edit and run javascript code inside Logseq itself](https://discuss.logseq.com/t/edit-and-run-javascript-code-inside-logseq-itself/20763).
		   My requirements are a bit simpler - just execute that code block with a
		   button. If you are seeking for Jupyter-like notebook experience and/or 
		  more programming languages support, above topic might be better suited! 
		  Go credit him as well, if you like the overall topic.
		  
		  Specific goals:
		  vanilla Logseq - no plugin
		  performance  - no need to watch DOM with `MutationObserver`
		  convention-driven: Place code block as first child block under code button
		  encapsulation: based on official [Web components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) standard, mini app in Logseq
		  
		  **[Getting started](https://discuss.logseq.com/t/code-buttons-simple-way-to-execute-javascript-inside-markdown-codeblock/21035#getting-started-1)**
		  
		  1. Put code for the `CodeButton` web component (Attachment 1) in `custom.js`. Then create a macro for ease of use:
		  
		  
		  1. Put code for the `CodeButton` web component (Attachment 1) in `custom.js`. Then create a macro for ease of use:
		  
		  ```
		  :macros {
		            :button "<div is='code-button' name=$1 class=$2></div>"
		            }
		  ```
		  
		  1a. Restart.
		  
		  2. Write in a block content `{{button Click}}`.
		  
		  3. Create child block with content
		  
		  ```js
		  logseq.api.show_msg("Hello world", "info");
		  ```
		  
		  4. Get greeting like in above picture.
		  
		  **[More examples](https://discuss.logseq.com/t/code-buttons-simple-way-to-execute-javascript-inside-markdown-codeblock/21035#more-examples-2)** 
		  
		  ```
		  // Insert childblock (current block ID of codeblock available via this.uuid)
		  // this.target_uuid has ID of block containing the button.
		  // this.ev is the fired click event.
		  logseq.api.insert_block(this.uuid, "new kid on the block")
		  
		  // simple query
		  const results = logseq.api.q("[[MyPage]]");
		  console.log(results);
		  
		  // advanced query
		  const results = logseq.api.datascript_query(`[
		  :find (pull ?b[*]) 
		  :where 
		  [?p :block/name "mypage"]
		  [?b :block/refs ?p]]`);
		  console.log(results);
		  ```
		  
		  Invoking the macro with `quiet`
		  
		  ```
		  {{button "Simple query",quiet}}
		  ```
		  
		  will suppress code execution popup.
		  
		  [Notes](https://discuss.logseq.com/t/code-buttons-simple-way-to-execute-javascript-inside-markdown-codeblock/21035#notes-3)**
		  
		  To save you an app crash with `logseq.api.show_msg` ![:slight_smile:](https://discuss.logseq.com/images/emoji/twitter/slight_smile.png?v=12) : Don’t feed it with complex objects. Use `console.log` or write blocks instead. In other words: e.g. no ~~`logseq.api.show_msg(this.ev, "info");`~~.
		  
		  TODO: Post about web components in Logseq as mini app, current limitations in Logseq
		  #+END_QUOTE**
		- #### Attachment 1
		  ```js
		  class CodeButton extends HTMLDivElement {
		    constructor() {
		      super();
		      const style = document.createElement("style");
		      style.textContent = `
		        button.button-style {
		            display: inline-block;
		            outline: none;
		            cursor: pointer;
		            padding: 0 10px;
		            background-color: #fff;
		            border-radius: 0.25rem;
		            border: 1px solid #0070d2;
		            color: #0070d2;
		            font-size: 13px;
		            line-height: 30px;
		            font-weight: 400;
		            text-align: center;
		  	  user-select: none;
		        }
		        
		        button.button-style::before {
		            content: "➤ ";
		        }
		        
		        button.button-style:hover {
		            background-color: #f4f6f9; 
		        }`;
		  
		      this.appendChild(style);
		      this.insertAdjacentHTML(
		        "beforeend",
		        `<button class="button-style">${this.getAttribute("name") || "Click"}</button>`,
		      );
		    }
		  
		    code_from_childblock(ele) {
		      const ele_block_uuid = ele
		        .closest("[id^='block-content-'][blockid]")
		        ?.getAttribute("blockid");
		      if (!ele_block_uuid) return;
		  
		      // Convention: Codeblock is first child of button block.
		      const first_child_block_uuid =
		        logseq.api.get_block(ele_block_uuid)?.children?.[0]?.[1];
		      if (!first_child_block_uuid) return;
		  
		      const content = logseq.api.get_block(first_child_block_uuid)?.content;
		      if (!content) return;
		  
		      const regex =
		        /(?<![\r\n])^```(?:javascript|js)\n(.*)\n```(?=[\r\n]?$(?![\r\n]))/msu;
		      const code = content.match(regex)?.[1];
		      if (!code) return;
		  
		      return {
		        target_uuid: ele_block_uuid,
		        uuid: first_child_block_uuid,
		        code,
		      };
		    }
		  
		    handleClick(ev) {
		      const AsyncFunction = async function () {}.constructor;
		      const { code, ...rest } = this.code_from_childblock(ev.target) ?? {};
		      if (!code) {
		        logseq.api.show_msg("No code block found", "error", { timeout: 5000 });
		        return;
		      }
		      try {
		        AsyncFunction('"use strict";' + code).call({ ev, ...rest });
		        if (!this.classList.contains("quiet"))
		          logseq.api.show_msg("Executed code", "success", { timeout: 2000 });
		      } catch (er) {
		        logseq.api.show_msg(`Code error: ${er.message}`, "error", {
		          timeout: 5000,
		        });
		        throw er;
		      }
		    }
		  
		    connectedCallback() {
		      this.querySelector("button").addEventListener(
		        "click",
		        this.handleClick.bind(this),
		      );
		    }
		  }
		  
		  customElements.define("code-button", CodeButton, { extends: "div" });
		  ```
	- #### Self-replacing macros
	  *implemented at* [[scheduleDateToday]] *via*  `logseq.kits.setStatic(function expandmacro(div)` 
	  {{il eb54,Make custom macros that replace themselves with their value on first run,https://discuss.logseq.com/t/make-custom-macros-that-replace-themselves-with-their-value-on-first-run/20967}}
		- Create a relatively simple kit like this:
		  
		  Add [kits](https://discuss.logseq.com/t/edit-and-run-javascript-code-inside-logseq-itself/20763) to file `custom.js` if not already there.
		  Pick names:
			- a name for the kit
				- in this example `expandmacro`
			- a name for each special macro (i.e. a macro that runs only the first time)
				- in this example `mymacro`
		- Use carefully the picked names to define each special macro inside `macros{}` of file `config.edn`
			- wrap the normal output of each macro within the div of the kit
			- in this example:
			  
			  ```
			  :mymacro "<div class='kit' data-kit='expandmacro'>use $1 here</div>"
			  ```
		- Create a page with the kit’s name
			- in this example `ExpandMacro`
		- Put inside a javascript code-block with this code:
		  
		  ```
		  logseq.kits.setStatic(function expandmacro(div){
		    const blockId = div.closest(".ls-block").getAttribute("blockid");
		    const content = logseq.api.get_block(blockId).content;
		    const macroStart = content.indexOf("{{" + div.closest(".macro").dataset.macroName);
		    const macroEnd = content.indexOf("}}", macroStart) + 2;
		    logseq.api.update_block(blockId, content.slice(0, macroStart) + div.innerHTML + content.slice(macroEnd));
		  });
		  ```
		  
		  Now whenever typing a special macro (e.g.: `{{mymacro something}}` ), it should get replaced (e.g. with `use something here` ).
		  
		  Consider posting here your case of using this functionality, to inspire other users.
	- #### Childless block embeds
	  {{il eb54,Embed blocks without their children,https://discuss.logseq.com/t/embed-blocks-without-their-children/21713}}
		- Preparation:
			- Add a macro inside file `config.edn` , inside `macros{}` :
			  
			  ```
			  :childlessembed "<div class='kit embed-block color-level' data-kit='childlessembed' data-uuid='$1'>$1</div>"
			  ```
			- The code below requires having [kits](https://discuss.logseq.com/t/edit-and-run-javascript-code-inside-logseq-itself/20763) inside file `custom.js` . #kits
			- Inside page `ChildlessEmbed` in Logseq, put the following code in a javascript code-block:
			  
			  ```
			  logseq.kits.setStatic(function childlessembed(div){
			   const id = div.dataset.uuid
			   if (id !== "$1") {
			       const content = logseq.api.get_block(id.slice(2, -2)).content
			       div.innerHTML = content.replace(/\n?.*[:][:].*\n?/g, "\n").trim()
			       return
			   }
			  
			   div.closest("span.inline").querySelectorAll(".block-children-container")
			   .forEach( (child)=>{child.style.display = 'none'} )
			   div.remove()
			  })
			  ```
		- Usage:
			- Embed a block like usually.
				- e.g.`{{embed ((uuid))}}`
			- Use the macro in one of two ways:
				- To keep the **static** content only:
					- Rename `embed` with your macro.
						- e.g.`{{childlessembed ((uuid))}}`
					- This should maintain the static content, **skipping** the children.
				- To keep **all** the content:
					- Add your macro somewhere in the block.
						- e.g. `{{embed ((uuid))}}{{childlessembed}}`
					- This should simply **hide** the children.
	- #### Properties that generate explicit hierarchies
	  id:: 662ba9dc-01e8-4db6-a469-1171e82f912e
	  {{il eb54,Generate explicit hierarchy out of properties,https://discuss.logseq.com/t/generate-explicit-hierarchy-out-of-properties/}}
		- ## Introduction
			- **Hierarchies** in Logseq have been a hot topic (e.g. [here 47](https://discuss.logseq.com/t/would-a-rich-commitment-to-hierarchies-and-classification-be-an-anathema-to-logseq-culture/8327)).
				- This is also the case for **namespaces**, as they have been used to model hierarchies (e.g. [here 26](https://discuss.logseq.com/t/the-most-legit-use-of-namespaces/17685)).
			- **Properties** is the obvious alternative in modeling hierarchies, however they have been missing a proper visualization.
				- There are various **feature requests** on the matter (e.g. [this 12](https://discuss.logseq.com/t/specify-and-display-relations-between-pages-tags/9005)).
			- In the present post I put together some **custom code** to that direction.
				- It works, but is **experimental**.
				- It follows some **conventions** that may differ from your approach.
				- **Feedback** is welcome.
		- ## Random example
			- Consider a graph under construction that models human relationships (one page per human), by using two **complimentary properties** `parent` and `children`:
			- ```md
			  boy1.md
			    parent:: [[man1]]
			  boy2.md
			    parent:: [[man2]]
			  girl1.md
			    parent:: [[man2]]
			  girl2.md
			    parent:: [[man1]]
			  grandmother1.md
			    children:: [[man1]], [[woman1]]
			  grandmother2.md
			    children:: [[man2]], [[woman2]]
			  man1.md
			    parent:: [[grandfather1]]
			  man2.md
			    parent:: [[grandfather2]]
			  woman1.md
			    parent:: [[grandfather1]]
			    children:: [[boy2]], [[girl1]]
			  woman2.md
			    parent:: [[grandfather2]]
			    children:: [[boy1]], [[girl2]]
			  ```
			- Depending on the nature of the property, there are two different **perspectives**:
				- parent **to** child
				- child **from** parent
			- Usually only one of two complimentary properties is used, but here both are used for **comparison**. To get the resulting tree, can use a respective **macro** (preferably on the right sidebar):
			- ```md
			  {{pagetree to, children}}
			  {{pagetree from, parent}}
			  ```
			- The result looks like this:
				- ![image.png](../assets/image_1714137830898_0.png)
		- ## Science Articles example
			- This is based on [@gax](https://discuss.logseq.com/u/gax)’s illustration [here 15](https://discuss.logseq.com/t/create-multiple-levels-of-hierarchy-with-property-chains-similar-to-breadcrumbs-in-obsidian/12264/15).
			- ```md
			  FEM.md
			    broader:: [[Numerics]]
			  Mechanics.md
			    broader:: [[Physics]]
			  Numerics.md
			    broader:: [[Math]]
			  SomeArticle.md
			    This is an article about #Physics
			  SomeArticle2.md
			    This is an article about #TensionSims
			  TensionSims.md
			    broader:: [[Tension]], [[FEM]]
			  Tension.md
			    broader:: [[Mechanics]]
			  ```
			- To get the resulting tree, can use this **macro** (preferably on the right sidebar):
			  ```
			  {{pagetree from, broader, is, refs}}
			  ```
			- This example uses a **second pair** of `verb, property`, which:
			- attaches on each node a special node with its direct children (if any) per the passed pair
			- accepts built-in values `has` and `is`
				- `has` behaves like `to`
				- `is` behaves like `from`
				- The combination `is, refs` receives special treatment, as instead of a property’s values it looks for **references**.
			- ![image.png](../assets/image_1714137963895_0.png)
		- ## Current Features
			- Siblings are sorted **alphabetically**.
			- Click to **open** the respective page.
				- These are **custom links**, not like Logseq’s.
			- **Collapse** / **Expand** any node.
				- `+` / `-` when **hovering**
			- Prevent too big or **circular** models from getting out of control.
				- Can be **customized** by setting:
					- `PageTree.max.depth`
					- `PageTree.max.siblings`
			- A child with **multiple parents** appears multiple times in the tree.
			- If the tree’s block is not touched, it **doesn’t auto-update** its contents when the model gets updated.
				- To update, just click in and out.
		- ## Code
		- Inside file `config.edn`, inside `macros{}`:
		  
		  ```
		  :pagetree "<div class='kit pagetree' data-kit='pagetree' data-node-prep='$1' data-node-prop='$2' data-leaf-prep='$3' data-leaf-prop='$4'>pagetree</div>"
		  ```
		- Inside file `custom.css`:
		  
		  ```
		  .pagetree .tree-button {
		    visibility: hidden;
		  }
		  .pagetree:hover .tree-button {
		    visibility: visible;
		  }
		  .pagetree-node {
		  margin-left: 16px;
		  }
		  .tree-button {
		  width: 16px;
		  }
		  ```
		- This code requires having [kits 40](https://discuss.logseq.com/t/edit-and-run-javascript-code-inside-logseq-itself/20763) inside file `custom.js`.
			- If you prefer putting the whole code inside `custom.js`, you have to either:
				- remove all mentions to `logseq.kits`
				- create it yourself with `logseq.kits = {};`
		- Inside page `PageTree` in Logseq, put the following code in a single javascript code-block, or broken into multiple ones (could 
		  use the section comments):
		- ```
		  // PageTree
		  
		  PageTree = logseq.kits.PageTree = {
		    children: { queries: {}, titles: {} },
		    max: {},
		    roots: { queries: {}, titles: {} }
		  };
		  
		  PageTree.configFromDiv = function configFromDiv(div){
		    const nodeprop = div.dataset.nodeProp;
		    if (!nodeprop) return;
		  
		    delete div.dataset.nodeProp;
		  
		    const leafprep = div.dataset.leafPrep;
		    const leafprop = div.dataset.leafProp;
		    const leafconfig = {
		        prep: (leafprep !== "$3") && leafprep,
		        prop: (leafprop !== "$4") && leafprop,
		        not: leafprop === "refs" && leafprep === "is" && nodeprop
		    };
		  
		    const nodeconfig = {
		        prep: div.dataset.nodePrep,
		        prop: nodeprop
		    };
		    return {leaf: leafconfig, node: nodeconfig};
		  }
		  logseq.kits.pagetree = function PageTreeHandler(div){
		    const config = PageTree.configFromDiv(div);
		    if (!config) return;
		  
		    const nodeconfig = config.node;
		    const pgRoots = PageTree.roots;
		    div.textContent = pgRoots.getTitle(nodeconfig);
		    const roots = pgRoots.get(nodeconfig);
		  
		    const nofRoots = roots.length;
		    const buttonHandler = nofRoots && function(e){
		        e.preventDefault();
		        e.stopPropagation();
		        PageTree.toggleChildren(button);
		    }
		    const button = PageTree.button((nofRoots) ? "-" : "Ø", buttonHandler);
		    div.prepend(button);
		  
		    PageTree.filler(config, div, roots, PageTree.max.depth);
		  }
		  
		  // Elements
		  
		  PageTree.link = function pageLink(name, originalName){
		    const a = document.createElement("a");
		    a.classList.add("page-ref");
		    a.href = "#/page/" + encodeURIComponent(name);
		    a.textContent = originalName;
		    return a;
		  }
		  
		  PageTree.button = function treeButton(textContent, clickHandler){
		    const button = document.createElement("button");
		    button.classList.add("tree-button");
		    button.textContent = textContent;
		    if (clickHandler) button.addEventListener("click", clickHandler);
		    return button;
		  }
		  
		  PageTree.toggleChildren = function toggleChildren(button){
		    const isExpanded = (button.textContent === "-");
		    button.textContent = (isExpanded) ? "+" : "-";
		  
		    const newStyle = (isExpanded) ? "none" : "block";
		    Array.prototype.forEach.call(button.parentElement.children, (child)=>{
		        if (child.className === "pagetree-node") child.style.setProperty("display", newStyle);
		    });
		  }
		  
		  PageTree.node = function treeNode(button, link){
		    const div = document.createElement("div");
		    div.classList.add("pagetree-node");
		    div.append(button, link);
		    return div;
		  }
		  
		  // Fillers
		  
		  PageTree.fillMore = function fillMoreChildDivs(config, divParent, children, items, child, isItemsNode, depth){
		    if (items.length) PageTree.filler(config, divParent, [{items, page: child}], depth);
		    PageTree.filler(config, divParent, children, (isItemsNode) ? -1 : depth);
		  }
		  
		  PageTree.filler = function fillChildDivs(config, divParent, children, depth){
		    children.forEach( (child)=>{
		        const page = child.page;
		        const isItemsNode = (page) ? true : false;
		        const childName = (isItemsNode) ? page["original-name"] : child["original-name"];
		        const leafconfig = config.leaf;
		  
		        const getChildren = PageTree.children.get;
		        const items = (leafconfig.prop && !isItemsNode && depth > 0) ? getChildren(leafconfig, childName) : [];
		        const nofItems = items.length;
		        const children = (depth < 0) ? [] : (isItemsNode) ? child.items : getChildren(config.node, childName);
		        const nofChildren = children.length + (nofItems ? 1 : 0);
		  
		        const newDepth = depth - 1;
		        const small = (newDepth > 0 && nofChildren <= PageTree.max.siblings);
		  
		        const buttonText = (nofChildren) ? ((small) ? "-" : "...") : " ";
		        const buttonHandler = nofChildren && function(e){
		            e.preventDefault();
		            e.stopPropagation();
		  
		            if (button.textContent === "...") PageTree.fillMore(config, divChild, children, items, child, isItemsNode, PageTree.max.depth);
		            PageTree.toggleChildren(button);
		        };
		        const button = PageTree.button(buttonText, buttonHandler);
		  
		        const link = (isItemsNode) ? PageTree.children.getTitle(leafconfig) : PageTree.link(child.name, childName);
		        const divChild = PageTree.node(button, link);
		        if (nofChildren && small) PageTree.fillMore(config, divChild, children, items, child, isItemsNode, newDepth);
		        divParent.append(divChild);
		    });
		  }
		  
		  // Getters
		  
		  PageTree.getData = function getData(query, ...inputs){
		    const res = logseq.api.datascript_query(query, ...inputs);
		    return res.flat().sort( (a, b)=>{ return a.name.localeCompare(b.name) } );
		  }
		  
		  PageTree.children.get = function getChildren(config, parent){
		    const query = PageTree.children.queries[(config.not) ? "refs" : config.prep];
		    return PageTree.getData(query, ":" + (config.not || config.prop), `"${parent.toLowerCase()}"`);
		  }
		  PageTree.children.getTitle = function getTitle(config){
		    const prep = (config.not) ? "refs" : config.prep;
		    return PageTree.children.titles[prep].replace("leafprop", config.prop);
		  }
		  
		  PageTree.roots.get = function getRoots(config){
		    const query = PageTree.roots.queries[config.prep];
		    return PageTree.getData(query, ":" + config.prop);
		  }
		  PageTree.roots.getTitle = function getTitle(config){
		    return PageTree.roots.titles[config.prep].replace("nodeprop", config.prop);
		  }
		  
		  // Queries
		  
		  PageTree.children.queries.refs = `[
		    :find (pull ?Child [*])
		    :in $ ?prop ?Parent-name
		    :where
		        [?child :block/page ?Child]
		        [?child :block/refs ?Parent]
		        [?Parent :block/name ?Parent-name]
		        [?Parent :block/original-name ?Parent-original-name]
		        (not 
		            [?child :block/properties ?child-props]
		            [(get ?child-props ?prop) ?child-from]
		            [(contains? ?child-from ?Parent-original-name)]
		        )
		  ]`;
		  PageTree.children.queries.from = `[
		    :find (pull ?Child [*])
		    :in $ ?prop ?Parent-name
		    :where
		        [?child :block/page ?Child]
		        [?child :block/properties ?child-props]
		        [(get ?child-props ?prop) ?child-from]
		        [?Parent :block/name ?Parent-name]
		        [?Parent :block/original-name ?Parent-original-name]
		        [(contains? ?child-from ?Parent-original-name)]
		  ]`;
		  PageTree.children.queries.to = `[
		    :find (pull ?Child [*])
		    :in $ ?prop ?Parent-name
		    :where
		        [?Parent :block/name ?Parent-name]
		        [?parent :block/page ?Parent]
		        [?parent :block/properties ?parent-props]
		        [(get ?parent-props ?prop) ?parent-to]
		        [?Child :block/original-name ?Child-original-name]
		        [(contains? ?parent-to ?Child-original-name)]
		  ]`;
		  PageTree.children.queries.has = PageTree.children.queries.to;
		  PageTree.children.queries.is = PageTree.children.queries.from;
		  
		  PageTree.roots.queries.from = `[
		    :find (pull ?Root [*])
		    :in $ ?prop
		    :where
		        [?child :block/properties ?child-props]
		        [(get ?child-props ?prop) ?child-from]
		        [?Root :block/original-name ?Root-original-name]
		        [(contains? ?child-from ?Root-original-name)]
		        (not
		            [?root :block/page ?Root]
		            [?root :block/properties ?root-props]
		            [(get ?root-props ?prop) ?root-from]
		        )
		  ]`;
		  PageTree.roots.queries.to = `[
		    :find (pull ?Root [*])
		    :in $ ?prop
		    :where
		        [?root :block/page ?Root]
		        [?root :block/properties ?root-props]
		        [(get ?root-props ?prop) ?root-to]
		        (not 
		            [?parent :block/properties ?parent-props]
		            [(get ?parent-props ?prop) ?parent-to]
		            [?Root :block/original-name ?Root-original-name]
		            [(contains? ?parent-to ?Root-original-name)]
		        )
		  ]`;
		  
		  // Settings
		  
		  PageTree.max.depth = 16;
		  PageTree.max.siblings = 16;
		  
		  PageTree.roots.titles.from = "Tree from nodeprop:"
		  PageTree.roots.titles.to = "Tree to nodeprop:"
		  PageTree.children.titles.is = "is in leafprop of:"
		  PageTree.children.titles.has = "has leafprop:"
		  PageTree.children.titles.refs = "is referred by:"
		  ```
		- For example, I have created a page that looks like this:
		- ![image.png](../assets/image_1714138084908_0.png)
		- The provided button is not needed to be pressed, unless changes are made to the code.
		- This full page could be distributed or reused by other graphs as a single `PageTree.md` file (currently one copy per graph).1
	- #### In-block variables from properties
	  {{il eb02,Inline properties and reuse of property values, basic implementation,https://discuss.logseq.com/t/inline-properties-and-reuse-of-property-values-basic-implementation/23363/1}}
		- #+BEGIN_QUOTE
		  * **Inspiration**
		  * [Syntax for inline properties:: ](https://discuss.logseq.com/t/syntax-for-inline-properties/10031)
		  * [Create Properties from inline text as I type and make them available as variables inside the block ](https://discuss.logseq.com/t/create-properties-from-inline-text-as-i-type-and-make-them-available-as-variables-inside-the-block/20765)
		  * This is a **basic** implementation, so none of the above feature requests is properly satisfied.
		    * Many edge cases are not covered, use it only for the covered ones.
		  * **Usage**
		  * This uses a **macro** with the following syntax: `{{p property, value}}`
		    * Should not use **comma** (`,`) anywhere else.
		      * Though generally the **comma** can be **omitted**: `{{p property value}}`
		    * **Omitting** the value **reuses** the existing one: `{{p property}}`
		  * Typing something **like** this (check customization below):
		  
		  ```
		  {{p title "The Gray Picture"}} is a {{p type phenomenon}} discovered by {{p scientist [[Person1]]}}, {{p scientist [[Person2]]}} and {{p scientist [[Person3]]}}. {{p title}} is very rare.
		  ```
		  
		  ![83f214f4887be333226ff883847c26bb30bedd83.png](../assets/83f214f4887be333226ff883847c26bb30bedd83_1715431014562_0.png) 
		  
		  Should produce this:
		  
		  ![22b0d29a2a395f2732403eb1a19ac45eb4279cf1.png](../assets/22b0d29a2a395f2732403eb1a19ac45eb4279cf1_1715431032537_0.png)
		  
		  Notice the last macro `{{p title}}` , which **reuses** the earlier value.
		  * **Preparation**
		  * Add a macro inside file `config.edn` , inside `macros{}` :
		  
		  ```
		  :p "<span class='kit' data-kit='inlineprop' data-prop='$1' data-val='$2'>$1:: $2</span>"
		  ```
		  
		  * The code below requires having [kits ](https://discuss.logseq.com/t/edit-and-run-javascript-code-inside-logseq-itself/20763) inside file `custom.js` .
		  * Inside page `InlineProp` in Logseq, put the following code in a javascript code-block:
		  
		  ```
		  logseq.kits.setStatic(function inlineprop(span){
		      const dataset = span.dataset
		      var propname = dataset.prop
		      if (propname === "$1") propname = ""
		      var val = dataset.val
		      var noVal = (val === "$2")
		  
		      const blockId = span.closest(".ls-block").getAttribute("blockid")
		      const block = logseq.api.get_block(blockId)
		      const props = block.propertiesTextValues
		      var old = (props && props[propname])
		  
		      if (noVal && old === undefined) {
		          const index = propname.indexOf(" ")
		          if (index > -1) {
		              val = propname.slice(index + 1)
		              noVal = (val === "")
		  ```
		  #+END_QUOTE
	- #### Gallery view for images on current page
	  {{il eb02,Gallery view for query results,https://discuss.logseq.com/t/gallery-view-for-query-results/13432}}
		- Also see my tests with this feature here: ((66a02337-cdd7-4894-a427-f5fd766ec3fd))
	-
- ### Logseq [[Issues]]
  Things that bug me about logseq
	- ### [[Android]] UX
		- #### Navigation
			- ~~**Accessing search**~~. I cannot figure out how to quickly access the search feature.
				- After lowering the keyboard, the bottom  nav bar is missing.
				  content:: details
				- Tap an empty space in the top bar to reatore the bottom nav bar, which includes the search icon. This action also lowers the keyboard. #resolution
				  content:: resolution
		- #### Keyboard
			- Keyboard will not open when at the bottom of a page. #bug
				- Steps to reproduce
				- 1. Enter a page with enough text to scroll the screen once.
				- 2. With key board closed, scroll to the bottom of the page
				- 3. Click inside a block with text at the very bottom of the page. You're clicking on text that the keyboard would normally cover when opened
				- 4. The keyboard opens and closes.
		- #### Input
			- How the fuck do I enter a [[new line]] without creating a new block? ([[line break]]) #question
	- ### Structure / organization / input
		- if I just input my information into journals, I know it will appear in the references on a page.
		  
		  But, how do I organize and sort for display the information when it's all as linked references?
		- And, if I start to use a page as a place to store sorted information, how do I deal with all the linked references?
- ### {{i eb39}} templates
  Used in this page
	- for ((65f5d381-8e00-4e19-bdbf-95727eb6a07e))
	  template\:\: buttoner - new logseq api reference
	  template-including-parent\:\: false
		- ### {{i f6ef}}  depreciation warning
		      this block is no longer in use
			- {{i ea0b}} *depreciated on* *[[Wednesday, Jul 17th, 2024]]*
		- {{button xxx,implementation_code,ea6f,long}}  `xxx`
			- implementation_code:
			  ```js
			  let api_implementation = `
			  
			  `;
			  
			  copy_to_clipboard(api_implementation.trim());
			  ```
