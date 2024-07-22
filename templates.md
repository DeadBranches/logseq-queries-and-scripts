tags:: page
description:: `/template`s with boilerplate for collector blocks, page tags, daily journal, queries

- ## {{i fab5}} block templates
  for repeatable structures that could go anywhere.
	- #### {{I f499}} collector blocks
	  collapsed:: true
		- {{i ef11}} Numbered list
			- ### {{i-example}} examples
			- ### {{i-template}} template
			  template:: block, numbered list
			  template-including-parent:: false
				- *list name*
				  {{i ef11}} #list
					- logseq.order-list-type:: number
	- #### {{i ef91}} project management
		- {{i-coding}} coding iteration
		  id:: 66818163-8a53-447b-a959-0ae93dde245f
		  collapsed:: true
			- *w/ feature goal, scope, result, final code*
			  collapsed:: true
			    ![image.png](../assets/image_1719949398805_0.png){:height 178, :width 216}
			- ### {{i-template}} template
			  template:: project, coding iteration
			  template-including-parent:: false
			  collapsed:: true
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
		- {{i f6ef}} depreciate block
		  collapsed:: true
			- ![image.png](../assets/image_1719951269675_0.png){:height 76, :width 307}
			- ### {{i-template}} template
			  template:: project, depreciate block
			  template-including-parent:: false
				- ### {{i f6ef}}  depreciation warning
				  collapsed:: true
				      this block is no longer in use
					- {{i ea0b}} *depreciated on* *<% today %>*
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
	- {{i-conversation}} advanced query conversation
	  collapsed:: true
		- **w/ prompt & response**
		- ### {{i-example}} samples
			- ((6678932d-b247-4894-af50-3c3161cfbec4))
		- ### {{i-template}} template
		  template:: block, advanced query conversation
		  template-including-parent:: false
			- {{chat with,http://}}
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
	- {{i ebba}} agenda event card
	  collapsed:: true
		- *for appointments and events*
		- ### {{i-example}} examples
		- ### {{i-template}} template
		  template:: block, agenda event card
		  template-including-parent:: false
			- event :: 
			  activity :: 
			  with :: 
			  location ::
			  date ::
			  time ::
	- {{i eb25}} online order
	  collapsed:: true
		- ### {{i-template}} template
		  template:: logseq, online order 
		  template-including-parent:: false
			- TODO ^_^
			  {{i eb25}} [[online order]] with **retailer**:
				- {{i ee20}} Est. delivery:
				- {{il ebc4,0000,http://}}
				- {{i eaff}} Date shipped:
				- {{i eb67}} Order number: [\#]()
				- {{i eb6b}} Bill of goods:
				  | Item | Qty |
				  |---|---|
				-
	- {{i-template}} logseq template
		- *template & examples headers*
		- ### {{i-template}} template
		  template:: block, logseq template
		  template-including-parent:: false
			- {{i }} title
				- **
				- ### {{i-example}} samples
				- ### {{i-template}} template
				  collapsed:: true
				  template :: 
				  template-including-parent :: false
					-
- ## {{i ed2b}} page templates
  *w/* common {{i-properties}} property sets & {{i ef94}} block structure
	- #### {{i eb96}} Daily journal
	  id:: 6644f008-299c-43c2-9c36-d9ab220bd4f3
		- {{i eaad}} Organization blocks
		  collapsed:: true
			- ### {{i-example}} samples
			- ### {{i-template}} template
			  template:: logseq, organization blocks
			  template-including-parent:: false
				-
		- {{i ec45}} Doing block
		  collapsed:: true
			- ### {{i-example}} samples
			- ### {{i-template}} template
			  template:: logseq, doing blocks
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
		- {{i eafd}} news
		  collapsed:: true
			- ### {{i-example}} samples
			- ### {{i-template}} template
			  template :: 
			  template-including-parent :: false
				- ##### {{i eafd}}  news
				  collapsed:: true
					- {{embed ((66415d9e-5591-4219-bc68-eb54393bccff))}}
	- {{i f5a5}} location
	  collapsed:: true
		- ### {{i-example}} examples
			- [[.Snowdon Pharmacy]]
		- ### {{i-template}} template
		  template:: page, location
		  template-including-parent:: false
			- ### {{i ea70}} Business Hours
				- *Mon-Fri*: am-pm
				- *Sat*: am-pm
				- *Sun*: **closed**
			- ### {{i eb09}} Contact information
				- *Phone*: () -
				- *Fax*: () -
			- ### {{i ebf2}} Contacts
				- Name, *title*
	- {{i ef14}} food item
	  collapsed:: true
		- *w/ nutritonal fact tool structure*
		- ### {{i-example}} examples
		  collapsed:: true
			- [[oat]]
			- {{i ea9b}}#query-placeholder `:block/name` *:where* `[:block/properties [:tags "food item"]]`
		- ### {{i-template}} template
		  id:: 666f76e0-09c0-4695-b66d-42c727c5a003
		  template:: page, food item
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
	- {{i f4e6}} function documentation
	  collapsed:: true
		- *syntax & examples*
		- ### {{i-example}} examples
		- ### {{i-template}} template
		  template:: page, code function documentation
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
	- {{i ea47}} logseq collector
	  collapsed:: true
		- *:tags "collector"*
		- template:: page, logseq collector
		  template-including-parent:: false
			- tags:: collector
			  description:: 
			  collector:: [[]]
- ---
- {{I ec9e}} Journal buddies
  id:: 662becda-117c-4bed-a4e7-d27b7cd1b6f3
	- ### {{i-template}} template
	  id:: 65fb3d58-f121-4f03-a702-fbc3e6e5c98c
	  template:: Event header for daily journal
	  template-including-parent:: false
		- ### {{journalBuddy}} Journal buddies
			- {{kitButton '',doingWidget,ec45}}  {{kitButton '',journalOrganizationBlocks,eaad}}  {{kitButton '',journalGroceryWidget,eb25 f21c}}  {{button '',add-online-order,eaff}}
				- [:small "daily reminders"]
				  id:: 6666f9b1-6202-4537-aa84-b40852fa720a
					- TODO {{i ef63}} Take medication
					  id:: 65fdfbf2-818e-404e-9d60-7f941f29bf34
					  {{scheduleDateToday collapse}}
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
			- {{i eaff}} {{openOrderCount}}  {{i eb25}} {{groceryItemCount}}  {{i f21c}} {{shoppingItemCount}}
			  collapsed:: true
				- {{kitButton grocery list,collapseBlock,f21c,-button-style full-width}}
				  collapsed:: true
					- {{embed ((6682d241-16ee-4991-bf3f-85c90add7dbd))}}
				- {{kitButton shopping list,collapseBlock,eb25,-button-style full-width}}
				  collapsed:: true
					- {{embed ((6644ee82-6e4e-4936-af4f-8a47ece6985d))}}
					- {{embed ((667992b3-de9e-4570-86f5-5beffb1686a0))}}
			- #### {{kitButton project focus,collapseBlock,f00e,-button-style full-width}}
			  collapsed:: true
			  {{embed ((664f42a4-40eb-44ba-8e8c-89dba2c17a06))}}
				- *projects in the wings*
				  {{embed ((6654b591-49ea-4d3a-b9d9-1dc4f25bab0c))}}
			- #### {{kitButton upcoming appointment |nextAppointment|,collapseBlock,ea53,-button-style full-width}}
			  collapsed:: true
			  {{embed ((664e4055-3b72-4ba1-ac8b-48e34544629c))}}
				- {{embed ((66415ca6-d397-4fc1-97f1-95f7b516e6d1))}}
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
			- /
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
	  Resources (bookmarks)
		- #### Video bookmark
		  
		  template-including-parent\:\: false
			- {{I ed22}} **
			  resource:: video
			  author:: [
			  url::
		- #### Repository bookmark
		  
		  template-including-parent\:\: false
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