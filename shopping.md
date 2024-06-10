description:: Integrate products into the larger system by indicating `:product-type` or `:goods-category` specifier properties.

- #### Inbox
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
  :inputs [:current-page]
  }
  #+END_QUERY
	- collapsed:: true
	  #+BEGIN_QUERY
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
	  #+END_QUERY
	-
- ## {{i eaff}} open orders
  *from online*
	- #+BEGIN_QUERY
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
- ## buy
  id:: 662becda-d50f-4dac-9376-05e732cb9430
  *newest first*
	- id:: 6644ee82-6e4e-4936-af4f-8a47ece6985d
	  #+BEGIN_QUERY
	  {
	   :query [:find (pull ?b [*])
	    :where
	     [?b :block/marker ?m]
	     (not [(contains? #{"DONE" "CANCELED"} ?m)] )
	    [?b :block/properties ?prop]
	    [(contains? ?prop :goods-category)]
	    (not (property ?b :goods-category "food"))
	   ]
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
-
- [ + add item ]
  collapsed:: true
  List
  #+BEGIN_QUERY
  {:title [:h4 "🎯 Deze week"]
   :query [:find (pull ?b [*])
    :where
     ; Add the criteria for which ?b you want to find here. I've added all tasks as an example.
     [?b :block/marker ?m]
     (not [(contains? #{"DONE" "CANCELED"} ?m)] )
     [?t :block/name "buy"]
     [?b :block/refs ?t]
     (not (property ?b :goods-category "food"))
   ]
   :result-transform (fn [result] 
     (sort-by ; Any sort field here.
       (juxt ; sort by multiple fields
         (fn [r] (get r :block/created-at 99999999)) ; sort field 1, if no value use 99999999
         
         (fn [r] (update r :block/content) ) ; sort field 4
       
     
        result)
     )
   )
   :breadcrumb-show? false
  }
  #+END_QUERY
- [ + add item ]
  collapsed:: true
  List
  #+BEGIN_QUERY
  {:title [:h4 "🎯 Deze week"]
   :query [:find (pull ?b [*])
    :where
     ; Add the criteria for which ?b you want to find here. I've added all tasks as an example.
     [?b :block/marker ?m]
     (not [(contains? #{"DONE" "CANCELED"} ?m)] )
     [?t :block/name "buy"]
     [?b :block/refs ?t]
   ]
   :result-transform (fn [result] 
     (sort-by ; Any sort field here.
       (juxt ; sort by multiple fields
         (fn [r] (get r :block/created-at 99999999)) ; sort field 1, if no value use 99999999
         
         (fn [r] (get r :block/content)) ; sort field 4
       )
       (map (fn [m] ; make a new map based on the query result
         (update m :block/properties ; update the block properties
           (fn [u] (assoc u :scheduled (get-in m [:block/scheduled] "-") :deadline (get-in m [:block/deadline] "-") ) ) ; associate the scheduled and deadline attribute values, if no value use -
         )
       ) result)
     )
   )
   :breadcrumb-show? false
  }
  #+END_QUERY
- **Mandolin**
	- Benriner no. 95