description:: Tracking online orders and list of items to purchase
repository:: DeadBranches/logseq-queries-and-scripts

- #### Inbox
  collapsed:: true
  Items:
  #+BEGIN_QUERY
  {:query
  [:find (count ?b)
  :in $ ?current-page
  :where
  [?t :block/name "inbox"]
  [?cp :block/name ?current-page]
  [?b :block/refs ?cp]
  [?b :block/refs ?t]
  ]
  :inputs [:query-page]
  }
  #+END_QUERY
	- #+BEGIN_QUERY
	  {:query
	  [:find (pull ?b [*])
	  :in $ ?current-page
	  :where
	  [?t :block/name "inbox"]
	  [?cp :block/name ?current-page]
	  [?b :block/refs ?cp]
	  [?b :block/refs ?t]
	  ]
	  :inputs [:current-page]
	  }
	  #+END_QUERY``
- ## {{i eb25}} in-progress orders
  collapsed:: true
  *awaiting delivery of* {{i eaff}} {{openOrders words}}
	- id:: 667992b3-a3a3-4a1e-9b93-71061bc4896c
	  #+BEGIN_QUERY
	  {:query
	  [:find (pull ?b [*])
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
	   :result-transform 
	    (fn [result]
	      (sort-by 
	        (fn [r] 
	          (let [journal-day (get-in r [:block/page :block/journal-day])
	                created-at (get r :block/created-at)]
	            (- (or journal-day created-at))))
	        result))
	  :collapsed? false
	  :breadcrumb-show? false
	   }
	  #+END_QUERY
- ## {{i fb52}} purchase list
  id:: 662becda-d50f-4dac-9376-05e732cb9430
  *newest first*
	- #### {{i ef40}} items on the list
	  id:: 6644ee82-6e4e-4936-af4f-8a47ece6985d
		- #+BEGIN_QUERY
		  {:inputs ["buy"]
		   :query [:find (pull ?b [*])
		   :in $ ?macro-name %
		  :where
		     [?b :block/marker ?m]
		     (not [(contains? #{"DONE" "CANCELED"} ?m)] )
		     (using-macro ?b ?macro-name)]
		  
		  :rules [
		          [(using-macro ?b ?macro-name)
		           [?b :block/macros ?m]
		           [?m :block/properties ?props]
		           [(get ?props :logseq.macro-name) ?macros]
		           [(= ?macros ?macro-name)]]]
		   
		  :result-transform 
		    (fn [result]
		      (sort-by 
		        (fn [r] 
		          (let [journal-day (get-in r [:block/page :block/journal-day])
		                created-at (get r :block/created-at)]
		            (- (or journal-day created-at))))
		        result))
		   :breadcrumb-show? false
		  }
		  #+END_QUERY
	- #### {{i f5f8}} in my bag...
	  id:: 667992b3-de9e-4570-86f5-5beffb1686a0
		- id:: 667992b3-1d97-4be6-9b4f-1c96137c0bb8
		  #+BEGIN_QUERY
		  {:inputs [:start-of-today-ms "buy"]
		   :query
		   [:find (pull ?b [*])
		    :in $ ?start-of-today ?macro-name  %
		    :where
		    (using-macro ?b ?macro-name)
		    (marked-done-today ?b ?start-of-today)]
		   
		   :rules
		   [[(marked-done-today ?b ?start-of-today)
		     [?b :block/marker ?marker]
		     [(contains? #{"DONE"} ?marker)]
		     [?b :block/updated-at ?update-time]
		     [(< ?start-of-today ?update-time)]]
		  
		    [(using-macro ?b ?macro-name)
		     [?b :block/macros ?m]
		     [?m :block/properties ?props]
		     [(get ?props :logseq.macro-name) ?macros]
		     [(= ?macros ?macro-name)]]]
		  
		   :result-transform
		   (fn [result]
		     (sort-by
		      (fn [r]
		        (let [journal-day (get-in r [:block/page :block/journal-day])
		              created-at (get r :block/created-at)]
		          (- (or journal-day created-at))))
		      result))
		   :breadcrumb-show? false}
		  
		  
		  #+END_QUERY