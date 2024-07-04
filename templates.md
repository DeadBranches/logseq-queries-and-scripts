tags:: page
description:: `/template`s with boilerplate for collector blocks, page tags, daily journal, queries

- How to use
  `:template "template page template"`
- ## {{i eb96}} Daily journal
  id:: 6644f008-299c-43c2-9c36-d9ab220bd4f3
  *Used automatically*
	- {{i eaad}} Organization blocks
	  template:: daily journal - organization blocks
	  template-including-parent:: false
		-
	- {{i ec45}} Doing block
	  template:: Daily journal doing-block
	  template-including-parent:: false
		- #### {{i ec45}} **Doing** today
		  id:: 6666f9b1-219c-4c0c-879f-eb0dd5ea687f
		  collapsed:: true
		  {{button do,do,ec45,long}}
		  
		  {{button '',fridge,f1fa}}  {{button '',computer,ea89}}  {{button '',wash,ef48}}
			- {{nested-code-block}}
			  collapsed:: true
				- do:
				  ```js
				  (() => {
				  const content = "";
				  const options = { sibling:false, before:false, focus:true }
				  logseq.api.insert_block(this.target_uuid, content, options);
				  })();
				  ```
				  
				  fridge:
				  ```js
				  (() => {
				  const content = "{{i-fridge}}  ";
				  const options = { sibling:false, before:false, focus:true }
				  logseq.api.insert_block(this.target_uuid, content, options);
				  })();
				  ```
				  
				  computer:
				  ```js
				  (() => {
				  const content = "{{i-computer}} ";
				  const options = { sibling:false, before:false, focus:true }
				  logseq.api.insert_block(this.target_uuid, content, options);
				  })();
				  ```
				  
				  wash:
				  ```js
				  (() => {
				  const content = "{{i-wash}} ";
				  const options = { sibling:false, before:false, focus:true }
				  logseq.api.insert_block(this.target_uuid, content, options);
				  })();
				  ```
	- ####  {{I ec9e}} Journal buddies
	  id:: 662becda-117c-4bed-a4e7-d27b7cd1b6f3
	  Buttons and skincare-routine
		- ##### {{i eafd}}  news
		  collapsed:: true
			- {{embed ((66415d9e-5591-4219-bc68-eb54393bccff))}}
		- Event header for daily journal
		  id:: 65fb3d58-f121-4f03-a702-fbc3e6e5c98c
		  template:: Event header for daily journal
		  template-including-parent:: false
			- ### {{i ec9e}} Journal buddies
				- [:small "daily reminders"]
				  id:: 6666f9b1-6202-4537-aa84-b40852fa720a
					- TODO {{i ef63}} Take medication
					  id:: 65fdfbf2-818e-404e-9d60-7f941f29bf34
					  {{scheduleDateToday collapse}}
				- {{button '',doing,ec45}}  {{button '',organization-blocks,eaad}}
				  collapsed:: true
					- Code Blocks
					  doing:
					  ```js
					  journalHelper(this, 'doingBlocks');
					  ```
					  
					  organization-blocks:
					  ```js
					  journalHelper(this, 'organizationBlocks');
					  ```
				- {{button '',expand-shopping,eb25}}  {{button buy,add-shopping-item,eb0b}}
				  collapsed:: true
					- {{nested-code-block}}
					  collapsed:: true
						- expand-shopping:
						  ```js
						  logseq.api.set_block_collapsed(this.target_uuid, "toggle")
						  ```
						  
						  add-shopping-item:
						  ```js
						  journalHelper(this, 'buy');
						  ```
					- {{embed ((6644ee82-6e4e-4936-af4f-8a47ece6985d))}}
					- {{embed ((667992b3-de9e-4570-86f5-5beffb1686a0))}}
				- {{button '',expand-online-order,eaff}}  {{button order,add-online-order,eb0b}}
				  collapsed:: true
					- {{nested-code-block}}
					  collapsed:: true
						- expand-online-order:
						  ```js
						  logseq.api.set_block_collapsed(this.target_uuid, "toggle")
						  ```
						  
						  add-online-order:
						  ```js
						  journalHelper(this, 'onlineOrder');
						  ```
					- {{embed ((663f79d8-20d7-4027-9ff5-500ae36ff757))}}
					- #### awaiting delivery of {{i eaff}} {{openOrders words}}
					- {{embed ((667992b3-a3a3-4a1e-9b93-71061bc4896c))}}
				- {{button '',expand-groceries,f21c}}  {{button grocery,add-grocery-item,eb0b}}
				  id:: 6649f26f-70ca-4d46-96a8-555f07ae4524
				  collapsed:: true
					- {{nested-code-block}}
					  collapsed:: true
						- expand-groceries:
						  ```js
						  logseq.api.set_block_collapsed(this.target_uuid, "toggle")
						  ```
						  
						  add-grocery-item:
						  ```js
						  journalHelper(this, 'grocery');
						  ```
					- {{embed ((663f8303-7fca-406d-83ed-d93002164105))}}
					- {{embed ((667992b0-0c2b-4343-9c1a-9c7e5e4ada50))}}
					- {{embed ((667992b0-0de4-46c7-a490-296854304e56))}}
				- #### {{button project focus,expand-projects,f00e,full-width-secret}}
				  collapsed:: true
				  {{embed ((664f42a4-40eb-44ba-8e8c-89dba2c17a06))}}
					- {{nested-code-block}}
					  collapsed:: true
						- expand-projects:
						  ```js
						  logseq.api.set_block_collapsed(this.target_uuid, "toggle")
						  ```
					- {{embed ((6654b591-49ea-4d3a-b9d9-1dc4f25bab0c))}}
				- #### {{i ea53}}  upcoming appointment {{nextAppointment}}
				  collapsed:: true
				  {{embed ((664e4055-3b72-4ba1-ac8b-48e34544629c))}}
					- {{embed ((66415ca6-d397-4fc1-97f1-95f7b516e6d1))}}
- ## {{i fab5}} block templates
  for repeatable structures that could go anywhere.
	- ### {{I f499}} collector blocks
	  collapsed:: true
	  layouts *w/* icons & links
		- #### {{i ef11}} Numbered list
		  collapsed:: true
		  */x list*
			- #### {{i ef11}} Numbered list
			  *->* `x list`
			  {{i ea9b}}#query-placeholder `:template` *from child block*
				- *list name*
				  template:: x list
				  {{i ef11}} #list
					- logseq.order-list-type:: number
	- ### {{i ef91}} project management
	   *namespace* `/project -`
		- #### {{i-coding}} coding iteration
		  id:: 66818163-8a53-447b-a959-0ae93dde245f
		  *w/ feature goal, scope, result, final code*
		    ![image.png](../assets/image_1719949398805_0.png){:height 178, :width 216}
			- ### {{i-template}} template
			  template:: project - coding iteration
			  template-including-parent:: false
				- ### {{i f6af}} iteration: title of work
					- {{i f51a}} feature goal
					  collapsed:: true
						-
					- {{i efb1}} iteration goal (scope)
					  collapsed:: true
						-
					- {{i ea99}} external resources
					  collapsed:: true
						- `{{chat name,url}}`
					- {{i f082}} workspace
					  collapsed:: true
						- *work it!*
					- {{i f35e}} result
					  collapsed:: true
						-
					- {{i eb45}} final {{i ea77}} code for this iteration
					  collapsed:: true
					    {{code-inside}}
						- ```
						  
						  ```
		- #### {{i f6ef}} depreciate block
		  collapsed:: true
		  ![image.png](../assets/image_1719951269675_0.png){:height 76, :width 307}
			- ### {{i-template}} template
			  template:: project - depreciate block
			  template-including-parent:: false
				- ### {{i f6ef}}  depreciation warning
					- {{i ea0b}}  This block was [[archived]] on / today
					- -> See the main project page for all project management activities
		- *older stuff*
		  collapsed:: true
			- ##### project management
			  collapsed:: true
			  Goals, task management
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
			- ##### for pages
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
	- {{i-template}} template page **template starter**
	  collapsed:: true
	  *template & examples headers*
		- ### {{i-template}} template
		  template:: template page template
		  template-including-parent:: false
			- {{i }} title
			  **
				- ### {{i-example}} examples
				- ### {{i-template}} template
				  template :: 
				  template-including-parent :: false
					-
	- {{i-conversation}} llm **advanced query** **conversation**
	  collapsed:: true
	  *w/ prompt & response*
		- ### {{i-template}} template
			- llm advanced-query conversation (Originally used [here](((6678932d-b247-4894-af50-3c3161cfbec4))))
			  template:: llm advanced-query development
			  template-including-parent:: false
				- **Result**: 
				  *
				  *
				  
				  (*sample*):
					- **Prompt** given to claude
						- >
					- **Response**
						- **Result**
							- ```edn
							  
							  ```
						- **Advanced query**
							- ```clojure
							  
							  ```
	- {{i ebba}} agenda **event card**
	  collapsed:: true
	  *for appointments and events*
		- ### {{i-example}} examples
		- ### {{i-template}} template
		  template:: agenda event card - blank
		  template-including-parent:: false
			- event :: 
			  activity :: 
			  with :: 
			  date ::
- ## {{i ed2b}} page templates
  *w/* common {{i-properties}} property sets & {{i ef94}} block structure
	- **food item** page
	  collapsed:: true
	  *w/ nutritonal fact tool structure*
		- ### {{i-example}} examples
			- [[oat]]
			- {{i ea9b}}#query-placeholder `:block/name` *:where* `[:block/properties [:tags "food item"]]`
		- ### {{i-template}} template
		  id:: 666f76e0-09c0-4695-b66d-42c727c5a003
		  template:: food item
		  template-including-parent:: false
		  collapsed:: true
			- tags:: food-item
			- # Nutritional facts
				- ## Vitamins
				  *per 100g portion*
				  {{embed ((666f7733-1891-45d3-8bbb-8f32dd4631e1))}}
				- ### Minerals
				  *per 100g portion*
				  {{embed ((666f7747-d031-4ef7-8a4e-faaadde102c4))}}
			- # Nutritional data
				- ## [[Vitamins]]
					-
				- ## [[Minerals]]
					-
	- **clojureScript function** documentation
	  collapsed:: true
	  *syntax & examples*
		- ### {{i-example}} examples
		- ### {{i-template}} template
		  template:: clojureScript docs
		  template-including-parent:: false
			- *function/macro*
				- [full details >]()
			-
			- ### Syntax
				-
			- ### Details
				-
			- ### Examples
				- ```clojure
				  
				  ```
	- logseq **collector** page 
	  collapsed:: true
	  *:tags "collector"*
		- template:: collector page boilerplate
		  template-including-parent:: false
			- tags:: collector
			  description:: 
			  collector:: [[]]
- ---
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
- ### {{i eeb9}} disused templates
  collapsed:: true
  and template page sections
	- ## {{I ec8f}} Query templates
	  collapsed:: true
	  Query boilerplate
	- ### Ideation
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
			  author:: author
			  url:: url
		- #### Web page bookmark
		  
		  template-including-parent:: false
			- **
			  resource:: web page
			  author:: [[']]
			  url::
	- ### {{i ea88}} Data templates
	  E.g. tabler icon