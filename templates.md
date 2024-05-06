tags:: page
description:: `/template`s with boilerplate for collector blocks, page tags, daily journal, queries

- ## {{i eb96}} Daily journal
  *Used automatically*
	- ####  {{I ec9e}} Journal buddies
	  id:: 662becda-117c-4bed-a4e7-d27b7cd1b6f3
	  collapsed:: true
	  Buttons and skincare-routine
		- Event header for daily journal
		  id:: 65fb3d58-f121-4f03-a702-fbc3e6e5c98c
		  template:: Event header for daily journal
		  template-including-parent:: false
			- ### {{I ec9e}} [Journal buddies](logseq://graph/main?block-id=662becda-117c-4bed-a4e7-d27b7cd1b6f3)
				- {{i ea4b}} projects
				  collapsed:: true
					- {{embed ((661fffe3-80b2-4405-b2ff-69e062815534))}}
					- {{embed ((66284c88-09a4-4a61-a3bb-7aeb67dd85e4))}}
				- ##### {{I eabe}} admin
					- {{button doing,doing,ec45}}  {{button organize,organization-blocks,eaad}}
					  collapsed:: true
						- Code Blocks
						  doing:
						  ```js
						  const journal_block_uuid = getParentUUID(getParentUUID(this.target_uuid));
						  const new_uuid = crypto.randomUUID();
						  const new_block_content = `{{i ec45}} **Doing** today`;
						  const options = { sibling:true, before:false, focus:false, customUUID:new_uuid }
						  logseq.api.insert_block(journal_block_uuid, new_block_content, options);
						  
						  // construct doing block child button
						  const button_block_content = "{{button do,do}}";
						  const button_block_uuid = crypto.randomUUID();
						  const button_block_options = { focus:false, customUUID:button_block_uuid, properties:{ collapsed: true } }
						  logseq.api.insert_block(new_uuid, button_block_content, button_block_options)
						  
						  const codeblock_content = `Code block
						  do:
						  \`\`\`js
						  const content = "";
						  const options = { sibling:true, before:false, focus:true }
						  logseq.api.insert_block(this.target_uuid, content, options);
						  console.log('lol');
						  \`\`\``;
						  const codeblock_uuid = crypto.randomUUID();
						  const codeblock_options = { focus:false, customUUID:codeblock_uuid }
						  logseq.api.insert_block(button_block_uuid, codeblock_content, codeblock_options);
						  ```
						  
						  organization-blocks:
						  ```js
						  const block_content = [
						    "### {{h-notes}} [[notes]]\n((662e67a8-8e34-4a89-b3f9-7d4fa65a47f7))",
						    "### {{h-research}} [[research]]\n((662e691a-f289-4178-8828-d8d624de58c5))",
						    "### {{h-writings}} [[writings]]\n((662e696b-3d43-4201-acf5-76879c81cdc6))",
						    "### {{h-thoughts}} [[thoughts]]\n((662e68bb-da7d-4c47-a248-71f8c4554969))",
						    "### {{h-admin}} [[admin]]\n((662e6daa-e7f1-489f-a8ae-d40add917aa1))",
						    "### {{h-resources}} [[resources]]\n((662e6757-a3ce-4379-9519-52d6b6133dfb))"
						  ];
						  const buttonBlock = logseq.api.get_block(this.target_uuid);
						  const pageId = buttonBlock.page.id;
						  const page = logseq.api.get_page(pageId);
						  
						  block_content.forEach(async function(content) {
						    await logseq.api.insert_block(page.name, content);
						  });
						  logseq.api.exit_editing_mode();
						  ```
					- news!!!
					  collapsed:: true
					  #+BEGIN_QUERY
					  {:title "Block Data for ID 12294"
					   :query [:find (pull ?b [*])
					           :in $ ?macro
					           :where
					   [?m :block/properties ?props]
					   [(get ?props :logseq.macro-name) ?macros]
					  [(= ?macros ?macro)]
					  [?b :block/macros ?m]
					          ]
					   :inputs ["news"]
					   :result-transform (fn [result] result)
					   :breadcrumb-show? false
					   :children? false
					   :group-by-page? false}
					  #+END_QUERY
				- {{button buy,buy,eb25}}  {{button grocery,grocery,f21c}}  {{button order,order,eaff}}
				  collapsed:: true
					- buy:
					  ```js
					  var new_block_content = `TODO {{buy}} 
					  goods-category:: [[]]`;
					  append_block_and_edit(this, "page", new_block_content);
					  ```
					  
					  grocery:
					  ```js
					  var new_block_content = `TODO {{grocery}}
					  goods-category:: [[food]]`;
					  append_block_and_edit(this, "page", new_block_content);
					  ```
					  
					  doing:
					  ```js
					  const journal_block_uuid = getParentUUID(this.target_uuid);
					  const new_uuid = crypto.randomUUID();
					  const new_block_content = `{{i ec45}} **Doing** today`;
					  const options = { sibling:true, before:false, focus:false, customUUID:new_uuid }
					  logseq.api.insert_block(journal_block_uuid, new_block_content, options);
					  
					  // construct doing block child button
					  const button_block_content = "{{button do,do}}";
					  const button_block_uuid = crypto.randomUUID();
					  const button_block_options = { focus:false, customUUID:button_block_uuid, properties:{ collapsed: true } }
					  logseq.api.insert_block(new_uuid, button_block_content, button_block_options)
					  
					  const codeblock_content = `Code block
					  do:
					  \`\`\`js
					  const content = "";
					  const options = { sibling:true, before:false, focus:true }
					  logseq.api.insert_block(this.target_uuid, content, options);
					  console.log('lol');
					  \`\`\``;
					  const codeblock_uuid = crypto.randomUUID();
					  const codeblock_options = { focus:false, customUUID:codeblock_uuid }
					  logseq.api.insert_block(button_block_uuid, codeblock_content, codeblock_options);
					  ```
					  
					  order:
					  ```js
					  const templateName = "online order";
					  
					  const thisBlock = logseq.api.get_block(this.uuid);
					  const thisPage = logseq.api.get_page(thisBlock.page.id);
					  
					  const blockTree = logseq.api.get_page_blocks_tree(thisPage.uuid);
					  
					  const lastBlockInPage = blockTree[blockTree.length - 1];
					  
					  logseq.api.insert_template(lastBlockInPage.uuid, templateName);
					  console.log("last block in page: " + JSON.stringify(lastBlockInPage));
					  //var insertedBlockUUID = targetBlock.children[0][1];
					  console.log(JSON.stringify(templateBlockUUID));
					  ```
				- #+BEGIN_QUERY
				  
				  {
				    :query [:find (pull ?b [*])
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
				  :result-transform (fn [result]
				                      (let [heading-pattern (re-pattern "^(TODO\\s+)")
				                            macro-pattern (re-pattern "\\{\\{[iI] ([a-fA-F0-9]{4})\\}\\}")
				                            replace-macro (fn [macro-match]
				                                            (str "&#x" (second macro-match) ";"))
				                            first-lines (map (fn [r]
				                                               (let [content (get-in r [:block/content])
				                                                     first-newline (str/index-of content "\n")
				                                                     line (if first-newline
				                                                            (subs content 0 first-newline)
				                                                            content)             
				                                                     line-without-heading (clojure.string/replace line heading-pattern "")
				                                                     line-with-glyphs (clojure.string/replace line-without-heading macro-pattern replace-macro)]
				                                                 {:text line-with-glyphs
				                                                  }))
				                                             result)]
				                        first-lines))
				   :view (fn [items]
				  [:div {:class "journal-quickview"}
				    [:div {:class "jq-icon-container"}
				      [:a {:class "jq-icon-link" :href "#/page/shopping"} "\ueaff"]
				  [:span {:class "jq-label"} "deliveries"]
				  ]
				    [:div {:class "jq-data"}
				      
				      [:span {:class "jq-items"} (interpose ", " (for [{:keys [text]} items] text))]]]
				   )
				  }
				  #+END_QUERY
				- #+BEGIN_QUERY
				  {
				    :query [:find (pull ?b [*])
				            :where
				  		[?b :block/marker ?m]
				    (not [(contains? #{"DONE" "CANCELED"} ?m)] )
				    (property ?b :goods-category "food")
				    ]
				  :result-transform (fn [result]
				                      (let [heading-pattern (re-pattern "^(TODO\\s\\{\\{grocery\\}\\}\\s+)")
				                            macro-pattern (re-pattern "\\{\\{[iI] ([a-fA-F0-9]{4})\\}\\}")
				                            replace-macro (fn [macro-match]
				                                            (str "&#x" (second macro-match) ";"))
				                            first-lines (map (fn [r]
				                                               (let [content (get-in r [:block/content])
				                                                     first-newline (str/index-of content "\n")
				                                                     line (if first-newline
				                                                            (subs content 0 first-newline)
				                                                            content)             
				                                                     line-without-heading (clojure.string/replace line heading-pattern "")
				                                                     line-with-glyphs (clojure.string/replace line-without-heading macro-pattern replace-macro)]
				                                                 {:text line-with-glyphs
				                                                  }))
				                                             result)]
				                        first-lines))
				  :view (fn [items]
				  [:div {:class "journal-quickview"}
				   [:div {:class "jq-icon-container"}
				    [:a {:class "jq-icon-link" :href "#/page/grocery%20list"} "\uf21c"]
				    [:span {:class "jq-label"} "grocery"]
				  ]
				   [:div {:class "jq-data"}
				    [:span {:class "jq-items"} (interpose ", " (for [{:keys [text]} items] text))]]]
				  )
				  }
				  #+END_QUERY
			- TODO {{i ef63}} Take medication
			  id:: 65fdfbf2-818e-404e-9d60-7f941f29bf34
			  {{schedule-date-today}}
- ## {{I f499}} collector blocks
  Templatea to get things started
	- #### {{i ef11}} Numbered list
	  collapsed:: true
	  *->* `x list`
	  {{i ea9b}}#query-placeholder `:template` *from child block*
		- *list name*
		  template:: x list
		  {{i ef11}} #list
			- logseq.order-list-type:: number
- ## {{I f1e5}} :properties sets
  For pages, collections, etc
	- #### Collector page boilerplate
	  collapsed:: true
	  -> `tags:: collector `
		- template:: collector page boilerplate
		  template-including-parent:: false
			- tags:: collector
			  description:: 
			  collector:: [[]]
- ## {{I ec8f}} Query templates
  Query boilerplate
	- #### Advanced query boilerplate
	  collapsed:: true
	  to start any query
		- template:: advanced query bootstrap
		  template-including-parent:: false
		  #+BEGIN_QUERY
		  {
		   :title [:h2 ""] ; Title for query
		   :query [
		           :in $ ?input
		           :find (pull ?b [*])
		           :where
		           	[? : ?]
		           ]
		   :breadcrumb-show?
		   :inputs ["<input>"]
		  }
		  #+END_QUERY
- ---
- Else
	- {{embed ((66046249-db4c-4206-b001-691fad2bd2e2))}}
- ### {{i ef91}} Project Management
  collapsed:: true
  Dynamic goals and tasks
	- ### project management
	  collapsed:: true
	  mockup
		- ### Project goals
			- TODO One
			  id:: 65ff0036-59cf-40a6-b461-3d3e5f73f9eb
			- TODO Two
			  id:: 65ff003b-d777-4c98-b18c-66a963b8be43
			- TODO Three
		- ### Task management
			- ### Goal ((65ff0036-59cf-40a6-b461-3d3e5f73f9eb))
				- TODO Task a
				- TODO Task b
				- TODO Task c
			- ### Goal ((65ff003b-d777-4c98-b18c-66a963b8be43))
				- TODO Task 60% a
				- TODO Task 60% b
				- TODO Task 60% c
	- ### for pages
	  see implemented example: ((65bcf5d6-660a-4dff-b086-d5cb795540c7))
		- #### current template
		  template:: project management - goals and tasks
		  template-including-parent:: false
			- ## [[Goals]]
				- TODO This is a goal
				  id:: 65fb267e-8199-4ada-95e3-2232fa2d2190
				  **tip** reference me
					- #+BEGIN_QUERY
					  {:query
					  [:find (pull ?c [*])
					  ;:keys tasks
					  :in $ ?current-page
					  :where
					  [?e :block/name ?current-page]
					  [?t :block/name "tasks"]
					  [?b :block/refs ?t]
					  [?b :block/page ?e]
					  (?c :block/parent ?b)
					  [?c :block/marker ?marker]
					  [(= "TODO" ?marker)]
					  [?c :block/content ?tasks]
					  ]
					  
					  :result-transform (fn [r] (map (fn [m] (assoc m :block/collapsed? true)) r))
					  :breadcrumb-show? false
					  :inputs [:current-page]
					  }
					  #+END_QUERY
			- ## [[Tasks]]
				- TODO This is a task
					- I like mushrooms
				- TODO This is another task
				- lol
				-
		- #### current template notes
			- ref to: ((65fb267e-8199-4ada-95e3-2232fa2d2190))
			-
- ### {{i ea88}} Data templates
  collapsed:: true
  E.g. tabler icon
	- {{embed ((65da2d57-3c21-41da-ae79-ebfc60db759f))}}
- ---
- daily journal template
  template:: daily-journal
  template-including-parent:: false
	- TODO {{i ef63}} Take vitamins
	  {{schedule-date-today}}
- ### {{i eb8e}} Lost templates
  query:: ((65ff0dba-73e5-4e18-b24d-e3647f09eb31))
  collapsed:: true
  Templates located on other pages
	- #+BEGIN_QUERY
	  {:query
	   [:find (pull ?b [*])
	    :in $ ?current-page ?property-name
	    :where
	    [?b :block/properties ?prop]
	    [(get ?prop ?property-name)]
	    [?b :block/page ?p]
	    [?p :block/name ?page-name]
	    [(not= ?current-page ?page-name)]
	    ]
	   ;; Change :template to what ever property you desire to find located
	   ;; On pages other than the current one.
	   :inputs [:current-page :template]
	   }
	  #+END_QUERY
- #### old
  collapsed:: true
	- ### Ideation
	  collapsed:: true
	  Ideas, thoughs, and more
		- ### Problem solving
			- #### Pros and cons
				- ##### Pros
				  *
				- ##### Cons
				  *
		- ### Experiments
		  collapsed:: true
			-
				- Title
				  variable::
				  values::
				  outcome:: prefer
					- ###  Conclusions
						-
					- ### Method
						- #### Generation Parameters
							- **Subject A**
								- #+BEGIN_VERSE
								  
								  #+END_VERSE
							- **Subject B**
								- #+BEGIN_VERSE
								  
								  #+END_VERSE
					- ### Results
						- **Subject A image**
							- s
						- **Subject B image**
							-
					- ### Discussion
						- **Subject A**
							-
						- **Subject B**
							-
	- ### Saving
	  collapsed:: true
	  Resources (bookmarks)
		- #### Video bookmark
		  
		  template-including-parent:: false
			- {{I ed22}} **
			  resource:: video
			  author:: [
			  url::
		- #### Repository bookmark
		  
		  template-including-parent:: false
			- **
			  resource:: repository
			  author:: [[']]
			  url::
		- #### Web page bookmark
		  
		  template-including-parent:: false
			- **
			  resource:: web page
			  author:: [[']]
			  url::