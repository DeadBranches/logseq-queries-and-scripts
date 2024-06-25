tags:: page
description:: `/template`s with boilerplate for collector blocks, page tags, daily journal, queries

- ## {{i eb96}} Daily journal
  id:: 6644f008-299c-43c2-9c36-d9ab220bd4f3
  *Used automatically*
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
					  {{scheduleDateToday}}
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
- ## {{I f499}} collector blocks
  collapsed:: true
  Templates to get things started
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
- ## For pages
  collapsed:: true
	- ### Food items
	  template:: food item
	  template-including-parent:: false
	  id:: 666f76e0-09c0-4695-b66d-42c727c5a003
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
	- ### clojureScript documentation
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
- ---
- Else
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
	-
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