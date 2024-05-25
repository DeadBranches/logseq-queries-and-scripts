tags:: page
description:: `/template`s with boilerplate for collector blocks, page tags, daily journal, queries

- ## {{i eb96}} Daily journal
  *Used automatically*
	- ####  {{I ec9e}} Journal buddies
	  id:: 662becda-117c-4bed-a4e7-d27b7cd1b6f3
	  Buttons and skincare-routine
		- Event header for daily journal
		  id:: 65fb3d58-f121-4f03-a702-fbc3e6e5c98c
		  template:: Event header for daily journal
		  template-including-parent:: false
			- ### {{i ec9e}} Journal buddies
				- ##### {{I eabe}}  admin
				  collapsed:: true
					- {{button doing,doing,ec45}}  {{button organize,organization-blocks,eaad}}
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
				- ##### {{i eafd}}  news
				  collapsed:: true
					- {{embed ((66415d9e-5591-4219-bc68-eb54393bccff))}}
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
				- #### {{i f00e}}  project focus
				  collapsed:: true
				  {{embed ((664f42a4-40eb-44ba-8e8c-89dba2c17a06))}}
					- {{embed ((661fffe3-80b2-4405-b2ff-69e062815534))}}
					- {{embed ((66284c88-09a4-4a61-a3bb-7aeb67dd85e4))}}
				- #### {{i ea53}}  upcoming appointment
				  collapsed:: true
				  {{embed ((664e4055-3b72-4ba1-ac8b-48e34544629c))}}
					- {{embed ((66415ca6-d397-4fc1-97f1-95f7b516e6d1))}}
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
	- ## {{I ec8f}} Query templates
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