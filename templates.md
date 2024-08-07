tags:: page
description:: `/template`s with boilerplate for collector blocks, page tags, daily journal, queries

- ## {{i fab5}} block templates
  for repeatable structures that could go anywhere.
	- #### {{I f499}} collector blocks
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
			- *w/ feature goal, scope, result, final code*
			    ![image.png](../assets/image_1719949398805_0.png){:height 178, :width 216}
			- ### {{i-template}} template
			  template:: project, coding iteration
			  template-including-parent:: false
				- ### {{i f6af}} iteration: title of work
					- {{i f51a}} feature goal
						-
					- {{i efb1}} iteration goal (scope)
						-
					- {{i ea99}} external resources
						- `{{chat name,url}}`
					- {{i f082}} workspace
						- *work it!*
					- {{i f35e}} result
						-
					- {{i eb45}} final {{i ea77}} code for this iteration
					    {{code-inside}}
						- ```
						  
						  ```
		- {{i-expecting}} expecting queries
			- {{i }} title
				- **
				- ### {{i-example}} samples
					- [[autism assessment]]
				- ### {{i-template}} template
				  template:: project, expecting section 
				  template-including-parent:: false
					- ## {{i ee21}} Expecting
						- ### {{i ed07}} Take Action
							- #+BEGIN_QUERY
							  {:inputs [:query-page :today]
							  :query
							  [:find (pull ?b [*])
							  :in $ ?current-page ?today
							  :where
							  [?c :block/name ?current-page]
							  [?b :block/page ?c]
							  [?n :block/name "expect"]
							  [?b :block/refs ?n]
							  
							  [?b :block/scheduled ?scheduled-day]
							  [(<= ?scheduled-day ?today)]
							  
							  [?b :block/marker ?marker]
							  [(= ?marker "TODO")]
							  ]
							   :breadcrumb-show? false
							   :children? false
							   :group-by-page? false}
							  #+END_QUERY
						- ### {{i f146}} Anticipating
						  *open-ended*
							- #+BEGIN_QUERY
							  {:inputs [:query-page :today]
							  :query
							  [:find (pull ?b [*])
							  :in $ ?current-page ?today
							  :where
							  [?c :block/name ?current-page]
							  [?b :block/page ?c]
							  [?n :block/name "expect"]
							  [?b :block/refs ?n]
							  
							  (not [?b :block/scheduled _])
							  
							  [?b :block/marker ?marker]
							  [(= ?marker "TODO")]
							  ]
							   :breadcrumb-show? false
							   :children? false
							   :group-by-page? false}
							  #+END_QUERY
						- ### {{i f82c}} Waiting...
						  *until date*
							- #+BEGIN_QUERY
							  {:inputs [:query-page :today]
							  :query
							  [:find (pull ?b [*])
							  :in $ ?current-page ?today
							  :where
							  [?c :block/name ?current-page]
							  [?b :block/page ?c]
							  [?n :block/name "expect"]
							  [?b :block/refs ?n]
							  
							  [?b :block/scheduled ?scheduled-day]
							  [(> ?scheduled-day ?today)]
							  
							  [?b :block/marker ?marker]
							  [(= ?marker "TODO")]
							  ]
							   :breadcrumb-show? false
							   :children? false
							   :group-by-page? false}
							  #+END_QUERY
						- *example usage*
							- TODO **[[EXPECT]]** some things \/schedule
		- *older stuff*
			- ##### project management
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
	- #### Logseq-related
	- {{i f6ef}} depreciate logseq block
		- ![image.png](../assets/image_1719951269675_0.png){:height 76, :width 307}
		- ### {{i-template}} template
		  template:: logseq, depreciate content
		  template-including-parent:: false
			- ### {{i f6ef}}  depreciation warning
			      this block is no longer in use
				- {{i ea0b}} *depreciated on* *<% today %>*
	- {{i-template}} logseq *template page* structure
		- *template & examples headers*
		- ### {{i-template}} template
		  template:: logseq, logseq template template
		  template-including-parent:: false
			- {{i }} title
				- **
				- ### {{i-example}} samples
				- ### {{i-template}} template
				  template :: 
				  template-including-parent :: false
					-
- ## {{i ed2b}} page templates
  *w/* common {{i-properties}} property sets & {{i ef94}} block structure
	- {{i ef91}} project page
	  id:: 0698280a-d53c-457e-81a1-03b231ac6d11
		- stuff
		  id:: 66a318c6-0bcc-4420-96c1-433bc497d1e8
			- ### Objective
			  id:: 66a318cd-614c-4660-86f6-52df9cc218b6
				- {{kitButton idea helper,collapseBlock,ea76,-button-style full-width small-caps}}
					- #+BEGIN_QUERY
					  {:inputs [:parent-block "idea"]
					   :query
					   [:find (pull ?r [*]) ?uuid ?content ?first-line ?marker
					    :keys issue uuid content first-line state
					    :in $ ?parent-block ?macro-name
					    :where
					    ;[?component-block :block/left ?parent-block]
					    ;[?r :block/refs ?component-block]
					   [?parent-block :block/parent ?objective]
					    ;[?component-block :block/parent ?parent]
					  [?r :block/refs ?objective]
					  
					    [?r :block/marker ?marker]
					    (not [(contains? #{"DONE"} ?marker)])
					  
					    [?r :block/macros ?m]
					    [?m :block/properties ?props]
					    [(get ?props :logseq.macro-name) ?macros]
					    [(= ?macros ?macro-name)]
					  
					    ;; info we want, now that we have a match
					    [?r :block/uuid ?uuid]
					  
					    [?r :block/content ?content]
					    [(re-pattern "(?<=^(?:TODO|DONE) {{idea}} ).*") ?first-line-pattern]
					    [(re-find ?first-line-pattern ?content) ?first-line]
					  
					    ;[?r :block/page ?p]
					    ;[?p :block/journal-day ?date]
					  ]
					  
					   :view (letfn [(make-link [text destination]
					                            [:a {:on-click 
					                                 (fn [] 
					                                   (call-api "push_state" "page" {:name destination}))
					                                 } text])
					                 (make-marker-box [uuid marker content]
					                                  [:input
					                                   {:type "checkbox"
					                                    ;; checked attribute takes a boolean value
					                                    :checked (= marker "DONE")
					                                    :on-click
					                                    (fn []
					                                      (call-api "update_block" uuid
					                                                (str
					                                                 (if (= marker "DONE")
					                                                   "TODO"
					                                                   "DONE")
					                                                 " "
					                                                 (clojure.string/replace
					                                                  content
					                                                  (re-pattern "(TODO|DONE)\\s")
					                                                  ""))))}])
					                 ]
					          
					          (fn [results]
					           [:div
					            [:table {:class "future-appointments"}
					             [:thead
					              [:tr
					               [:th {:width "80"} "Status"]
					               [:th "Open Ideas"]]]
					             [:tbody
					              (for [result results]
					                [:tr
					                 [:td
					                  (make-marker-box 
					                   (get-in result [:uuid]) 
					                   (get-in result [:state]) 
					                   (get-in result [:content])) 
					                  ]
					                 [:td 
					                  (make-link 
					                   (get-in result [:first-line]) 
					                   (get-in result [:uuid]))
					                  ]
					                 
					  
					                 ])]]]
					            )
					           
					           
					           )
					   }
					  #+END_QUERY
					  {{open-idea-tracker}}
					- id:: 66a318f7-d5ee-42d4-9368-9a847c9cc3d1
					  #+BEGIN_QUERY
					  {:inputs [:parent-block "idea"]
					   :query
					   [:find (pull ?r [*]) ?uuid ?content ?first-line ?marker
					    :keys issue uuid content first-line state
					    :in $ ?parent-block ?macro-name
					    :where
					    ;[?component-block :block/left ?parent-block]
					    ;[?r :block/refs ?component-block]
					   [?parent-block :block/parent ?objective]
					    ;[?component-block :block/parent ?parent]
					  [?r :block/refs ?objective]
					  
					    [?r :block/marker ?marker]
					    (not [(contains? #{"TODO"} ?marker)])
					  
					    [?r :block/macros ?m]
					    [?m :block/properties ?props]
					    [(get ?props :logseq.macro-name) ?macros]
					    [(= ?macros ?macro-name)]
					  
					    ;; info we want, now that we have a match
					    [?r :block/uuid ?uuid]
					  
					    [?r :block/content ?content]
					    [(re-pattern "(?<=^(?:TODO|DONE) {{idea}} ).*") ?first-line-pattern]
					    [(re-find ?first-line-pattern ?content) ?first-line]
					  
					    ;[?r :block/page ?p]
					    ;[?p :block/journal-day ?date]
					  ]
					  
					   :view (letfn [(make-link [text destination]
					                            [:a {:on-click 
					                                 (fn [] 
					                                   (call-api "push_state" "page" {:name destination}))
					                                 } text])
					                 (make-marker-box [uuid marker content]
					                                  [:input
					                                   {:type "checkbox"
					                                    ;; checked attribute takes a boolean value
					                                    :checked (= marker "DONE")
					                                    :on-click
					                                    (fn []
					                                      (call-api "update_block" uuid
					                                                (str
					                                                 (if (= marker "DONE")
					                                                   "TODO"
					                                                   "DONE")
					                                                 " "
					                                                 (clojure.string/replace
					                                                  content
					                                                  (re-pattern "(TODO|DONE)\\s")
					                                                  ""))))}])
					                 ]
					          
					          (fn [results]
					           [:div
					            [:table {:class "future-appointments"}
					             [:thead
					              [:tr
					               [:th {:width "80"} "Status"]
					               [:th "Open Ideas"]]]
					             [:tbody
					              (for [result results]
					                [:tr
					                 [:td
					                  (make-marker-box 
					                   (get-in result [:uuid]) 
					                   (get-in result [:state]) 
					                   (get-in result [:content])) 
					                  ]
					                 [:td 
					                  (make-link 
					                   (get-in result [:first-line]) 
					                   (get-in result [:uuid]))
					                  ]
					                 
					  
					                 ])]]]
					            )
					           
					           
					           )
					   }
					  #+END_QUERY
					  {{realized-idea-tracker}}
		- ### {{i-example}} samples
		- ### {{i-template}} template
		  template:: page, project 
		  template-including-parent:: false
			- / template expecting
			- # {{i f51a}} Goal
				- TODO something
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
					  :inputs [:query-page]
					  }
					  #+END_QUERY
			- # {{i eb4e}} Objectives
			  id:: 66a10d0e-f742-419e-872f-1f44f8b60e4d
			         {{kitButton objective,insertSomeBlocks,ea69,'',source='66a318cd-614c-4660-86f6-52df9cc218b6'}}
				- ### Objective
					- {{kitButton idea helper,collapseBlock,ea76,-button-style full-width small-caps}}
						- #+BEGIN_QUERY
						  {:inputs [:parent-block "idea"]
						  :query
						  [:find (pull ?r [*]) ?uuid ?content ?first-line ?marker
						  :keys issue uuid content first-line state
						  :in $ ?parent-block ?macro-name
						  :where
						  ;[?component-block :block/left ?parent-block]
						  ;[?r :block/refs ?component-block]
						  [?parent-block :block/parent ?objective]
						  ;[?component-block :block/parent ?parent]
						  [?r :block/refs ?objective]
						  
						  [?r :block/marker ?marker]
						  (not [(contains? #{"DONE"} ?marker)])
						  
						  [?r :block/macros ?m]
						  [?m :block/properties ?props]
						  [(get ?props :logseq.macro-name) ?macros]
						  [(= ?macros ?macro-name)]
						  
						  ;; info we want, now that we have a match
						  [?r :block/uuid ?uuid]
						  
						  [?r :block/content ?content]
						  [(re-pattern "(?<=^(?:TODO|DONE) {{idea}} ).*") ?first-line-pattern]
						  [(re-find ?first-line-pattern ?content) ?first-line]
						  
						  ;[?r :block/page ?p]
						  ;[?p :block/journal-day ?date]
						  ]
						  
						  :view (letfn [(make-link [text destination]
						                          [:a {:on-click 
						                               (fn [] 
						                                 (call-api "push_state" "page" {:name destination}))
						                               } text])
						               (make-marker-box [uuid marker content]
						                                [:input
						                                 {:type "checkbox"
						                                  ;; checked attribute takes a boolean value
						                                  :checked (= marker "DONE")
						                                  :on-click
						                                  (fn []
						                                    (call-api "update_block" uuid
						                                              (str
						                                               (if (= marker "DONE")
						                                                 "TODO"
						                                                 "DONE")
						                                               " "
						                                               (clojure.string/replace
						                                                content
						                                                (re-pattern "(TODO|DONE)\\s")
						                                                ""))))}])
						               ]
						        
						        (fn [results]
						         [:div
						          [:table {:class "future-appointments"}
						           [:thead
						            [:tr
						             [:th {:width "80"} "Status"]
						             [:th "Open Ideas"]]]
						           [:tbody
						            (for [result results]
						              [:tr
						               [:td
						                (make-marker-box 
						                 (get-in result [:uuid]) 
						                 (get-in result [:state]) 
						                 (get-in result [:content])) 
						                ]
						               [:td 
						                (make-link 
						                 (get-in result [:first-line]) 
						                 (get-in result [:uuid]))
						                ]
						               
						  
						               ])]]]
						          )
						         
						         
						         )
						  }
						  #+END_QUERY
						  {{open-idea-tracker}}
						- #+BEGIN_QUERY
						  {:inputs [:parent-block "idea"]
						  :query
						  [:find (pull ?r [*]) ?uuid ?content ?first-line ?marker
						  :keys issue uuid content first-line state
						  :in $ ?parent-block ?macro-name
						  :where
						  ;[?component-block :block/left ?parent-block]
						  ;[?r :block/refs ?component-block]
						  [?parent-block :block/parent ?objective]
						  ;[?component-block :block/parent ?parent]
						  [?r :block/refs ?objective]
						  
						  [?r :block/marker ?marker]
						  (not [(contains? #{"TODO"} ?marker)])
						  
						  [?r :block/macros ?m]
						  [?m :block/properties ?props]
						  [(get ?props :logseq.macro-name) ?macros]
						  [(= ?macros ?macro-name)]
						  
						  ;; info we want, now that we have a match
						  [?r :block/uuid ?uuid]
						  
						  [?r :block/content ?content]
						  [(re-pattern "(?<=^(?:TODO|DONE) {{idea}} ).*") ?first-line-pattern]
						  [(re-find ?first-line-pattern ?content) ?first-line]
						  
						  ;[?r :block/page ?p]
						  ;[?p :block/journal-day ?date]
						  ]
						  
						  :view (letfn [(make-link [text destination]
						                          [:a {:on-click 
						                               (fn [] 
						                                 (call-api "push_state" "page" {:name destination}))
						                               } text])
						               (make-marker-box [uuid marker content]
						                                [:input
						                                 {:type "checkbox"
						                                  ;; checked attribute takes a boolean value
						                                  :checked (= marker "DONE")
						                                  :on-click
						                                  (fn []
						                                    (call-api "update_block" uuid
						                                              (str
						                                               (if (= marker "DONE")
						                                                 "TODO"
						                                                 "DONE")
						                                               " "
						                                               (clojure.string/replace
						                                                content
						                                                (re-pattern "(TODO|DONE)\\s")
						                                                ""))))}])
						               ]
						        
						        (fn [results]
						         [:div
						          [:table {:class "future-appointments"}
						           [:thead
						            [:tr
						             [:th {:width "80"} "Status"]
						             [:th "Open Ideas"]]]
						           [:tbody
						            (for [result results]
						              [:tr
						               [:td
						                (make-marker-box 
						                 (get-in result [:uuid]) 
						                 (get-in result [:state]) 
						                 (get-in result [:content])) 
						                ]
						               [:td 
						                (make-link 
						                 (get-in result [:first-line]) 
						                 (get-in result [:uuid]))
						                ]
						               
						  
						               ])]]]
						          )
						         
						         
						         )
						  }
						  #+END_QUERY
						  {{realized-idea-tracker}}
			- # {{i f012}} Documentation
				- ## {{i eac9}} ui components
					- ### {{i ed6a}} component name
						- **Issue Tracker**
							- #+BEGIN_QUERY
							  {:inputs [:parent-block "issue"]
							   :query
							   [:find (pull ?r [*]) ?uuid ?content ?first-line ?marker
							    :keys issue uuid content first-line state
							    :in $ ?parent-block ?macro-name
							    :where
							    [?parent-block :block/left ?component-block]
							    [?r :block/refs ?component-block]
							  
							    [?r :block/marker ?marker]
							    ;(not [(contains? #{"DONE"} ?marker)])
							  
							    [?r :block/macros ?m]
							    [?m :block/properties ?props]
							    [(get ?props :logseq.macro-name) ?macros]
							    [(= ?macros ?macro-name)]
							  
							    ;; info we want, now that we have a match
							    [?r :block/uuid ?uuid]
							  
							    [?r :block/content ?content]
							    [(re-pattern "(?<=^(?:TODO|DONE) {{issue}} ).*") ?first-line-pattern]
							    [(re-find ?first-line-pattern ?content) ?first-line]
							  
							    ;[?r :block/page ?p]
							    ;[?p :block/journal-day ?date]
							  ]
							  
							   :view (letfn [(make-link [text destination]
							                            [:a {:on-click 
							                                 (fn [] 
							                                   (call-api "push_state" "page" {:name destination}))
							                                 } text])
							                 (make-marker-box [uuid marker content]
							                                  [:input
							                                   {:type "checkbox"
							                                    ;; checked attribute takes a boolean value
							                                    :checked (= marker "DONE")
							                                    :on-click
							                                    (fn []
							                                      (call-api "update_block" uuid
							                                                (str
							                                                 (if (= marker "DONE")
							                                                   "TODO"
							                                                   "DONE")
							                                                 " "
							                                                 (clojure.string/replace
							                                                  content
							                                                  (re-pattern "(TODO|DONE)\\s")
							                                                  ""))))}])
							                 ]
							          
							          (fn [results]
							           [:div
							            [:table {:class "future-appointments"}
							             [:thead
							              [:tr
							               [:th {:width "80"} "Status"]
							               [:th "Issue"]]]
							             [:tbody
							              (for [result results]
							                [:tr
							                 [:td
							                  (make-marker-box 
							                   (get-in result [:uuid]) 
							                   (get-in result [:state]) 
							                   (get-in result [:content])) 
							                  ]
							                 [:td 
							                  (make-link 
							                   (get-in result [:first-line]) 
							                   (get-in result [:uuid]))
							                  ]
							                 
							  
							                 ])]]]
							            )
							           
							           
							           )
							   }
							  #+END_QUERY
				- ## {{i f240}} code components
					- ### {{i fc2b}} Logseq kits
						- `[[page-name]]`
							- Issue Tracker
								- #+BEGIN_QUERY
								  {:inputs [:parent-block "issue"]
								   :query
								   [:find (pull ?r [*]) ?uuid ?content ?first-line ?marker
								    :keys issue uuid content first-line state
								    :in $ ?parent-block ?macro-name
								    :where
								    [?parent-block :block/left ?component-block]
								  [?component-block :block/refs ?kit-page] ;; kit page
								    [?r :block/refs ?kit-page]
								  
								    [?r :block/marker ?marker]
								    ;(not [(contains? #{"DONE"} ?marker)])
								  
								    [?r :block/macros ?m]
								    [?m :block/properties ?props]
								    [(get ?props :logseq.macro-name) ?macros]
								    [(= ?macros ?macro-name)]
								  
								    ;; info we want, now that we have a match
								    [?r :block/uuid ?uuid]
								  
								    [?r :block/content ?content]
								    [(re-pattern "(?<=^(?:TODO|DONE) {{issue}} ).*") ?first-line-pattern]
								    [(re-find ?first-line-pattern ?content) ?first-line]
								  
								    ;[?r :block/page ?p]
								    ;[?p :block/journal-day ?date]
								  ]
								  
								   :view (letfn [(make-link [text destination]
								                            [:a {:on-click 
								                                 (fn [] 
								                                   (call-api "push_state" "page" {:name destination}))
								                                 } text])
								                 (make-marker-box [uuid marker content]
								                                  [:input
								                                   {:type "checkbox"
								                                    ;; checked attribute takes a boolean value
								                                    :checked (= marker "DONE")
								                                    :on-click
								                                    (fn []
								                                      (call-api "update_block" uuid
								                                                (str
								                                                 (if (= marker "DONE")
								                                                   "TODO"
								                                                   "DONE")
								                                                 " "
								                                                 (clojure.string/replace
								                                                  content
								                                                  (re-pattern "(TODO|DONE)\\s")
								                                                  ""))))}])
								                 ]
								          
								          (fn [results]
								           [:div
								            [:table {:class "future-appointments"}
								             [:thead
								              [:tr
								               [:th {:width "80"} "Status"]
								               [:th "Issue"]]]
								             [:tbody
								              (for [result results]
								                [:tr
								                 [:td
								                  (make-marker-box 
								                   (get-in result [:uuid]) 
								                   (get-in result [:state]) 
								                   (get-in result [:content])) 
								                  ]
								                 [:td 
								                  (make-link 
								                   (get-in result [:first-line]) 
								                   (get-in result [:uuid]))
								                  ]
								                 
								  
								                 ])]]]
								            )
								           
								           
								           )
								   }
								  #+END_QUERY
					- ### {{i f4e1}} advanced queries
	- {{i f5a5}} location
		- ### {{i-example}} examples
			- [[.Snowdon Pharmacy]]
		- ### {{i-template}} template
		  template:: page, location
		  template-including-parent:: false
			- ### {{i ea70}} Business Hours
				- *Mon-Fri*: am-pm
				- *Sat*: am-pm
				- *Sun*: **closed**
			- ### {{i ea4f}} [[Location]]
				- 123 Fake St
				  Unit B
				  Toronto, ON
			- ### {{i f021}} Contact Information
				- {{phone}} () -
				- {{fax}} () -
			- ### {{i ebf2}} Contacts
				- Name, *title*
	- {{i ef14}} food item
		- *w/ nutritonal fact tool structure*
		- ### {{i-example}} examples
			- [[oat]]
			- {{i ea9b}}#query-placeholder `:block/name` *:where* `[:block/properties [:tags "food item"]]`
		- ### {{i-template}} template
		  id:: 666f76e0-09c0-4695-b66d-42c727c5a003
		  template:: page, food item
		  template-including-parent:: false
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
		- *syntax & examples*
		- ### {{i-example}} examples
		- ### {{i-template}} template
		  template:: page, code function documentation
		  template-including-parent:: false
			- *function*
			- *macro*
			- [ClojureScript documentation >]()
			- ### Syntax
				-
			- ### Details
				-
			- ### Examples
				-
			- ### See Also
				-
	- {{i ea47}} logseq collector
		- *:tags "collector"*
		- template:: page, logseq collector
		  template-including-parent:: false
			- tags:: collector
			  description:: 
			  collector:: [[]]
- ---
- # {{i eb96}} Daily journal
  id:: 6644f008-299c-43c2-9c36-d9ab220bd4f3
  *components and templates*
	- {{i ec45}} doing container
	  id:: 66994976-991f-4e60-9c59-52c7fc8f4241
		- ### {{i eac9}} component
		  id:: 66b0ead7-2d9d-4e05-a21e-da5d98e1d9b8
			- #### {{kitButton Doing today,testkit,ec45,-button-style full-width flex-grow-1 +bold-nth-word:1}}
			  id:: 66aaac57-179b-457a-8b06-3814ddbaa12b
			  {{kitButton do,insertListItem,ec45,long,template='do'}}
			  
			  {{kitButton '',insertListItem,f1fa,'',template='doKitchen'}}  {{kitButton '',insertListItem,ea89,'',template='doOffice'}}  {{kitButton '',insertListItem,ef48,'',template='doBathroom'}}
			  {{doing-holder}}
	- {{i eaad}} organization blocks
		- ### {{i eac9}} component
		  id:: 66b0ead7-67ee-44fd-a324-bd5dd7602f39
			-
	- {{i eb25}}{{i f21c}} {{i ef49}}  purchase holder
		- ### {{i eac9}} component
		  id:: 66b0ed6f-714f-4e1f-9d4c-85cf15341259
			- #### {{kitButton purchase list,collapseBlock,ef49,-button-style full-width +bold-nth-word}}
			  id:: 66b0edf9-37ba-4756-8421-c60cbd44b334
			  {{kitButton '',insertListItem,eb0b eb25,squat,grocery}}   {{kitButton '',insertListItem,eb0b f21c,squat,shopping}}
			    {{purchase-holder}}
	- {{i eafd}} news
		- ### {{i-example}} samples
		- ### {{i-template}} template
		  template :: 
		  template-including-parent :: false
			- ##### {{i eafd}}  news
				- {{embed ((66415d9e-5591-4219-bc68-eb54393bccff))}}
	- ## {{i ec9e}} Journal buddies component
	  id:: 662becda-117c-4bed-a4e7-d27b7cd1b6f3
	  {{i ea06}} *this block must remain open.*
		- ### {{i-template}} template
		  id:: 65fb3d58-f121-4f03-a702-fbc3e6e5c98c
		  template:: Event header for daily journal
		  template-including-parent:: false
			- ### {{journalBuddy}} Journal buddies
			  id:: 669bc80f-ccbb-4be3-8144-ad79decd7ee9
				- {{kitButton '',doingWidget,ec45}}  {{kitButton '',journalOrganizationBlocks,eaad}}  {{kitButton '',purchaseHolderComponent,eb25 f21c}}
				  id:: 669bc80f-624e-4027-86e9-f87c4002b885
					- [:small "daily reminders"]
					  id:: 6666f9b1-6202-4537-aa84-b40852fa720a
						- TODO {{i ef63}} Take medication
						  id:: 65fdfbf2-818e-404e-9d60-7f941f29bf34
						  {{scheduleDateToday collapse}}
				- {{i eaff}} {{openOrderCount}}  {{i eb25}}  {{shoppingItemCount}} {{i f21c}} {{groceryItemCount}}
					- {{kitButton grocery list,collapseBlock,f21c,-button-style full-width}}
						- {{embed ((6682d241-16ee-4991-bf3f-85c90add7dbd))}}
					- {{kitButton shopping list,collapseBlock,eb25,-button-style full-width}}
						- {{embed ((6644ee82-6e4e-4936-af4f-8a47ece6985d))}}
						- {{embed ((667992b3-de9e-4570-86f5-5beffb1686a0))}}
				- #### {{kitButton project focus,collapseBlock,f00e,-button-style full-width}}
				  {{embed ((664f42a4-40eb-44ba-8e8c-89dba2c17a06))}}
					- *projects in the wings*
					  {{embed ((6654b591-49ea-4d3a-b9d9-1dc4f25bab0c))}}
				- #### {{kitButton upcoming appointment in |nextAppointment| day,collapseBlock,ea53,-button-style full-width}}
				  {{embed ((664e4055-3b72-4ba1-ac8b-48e34544629c))}}
					- {{futureAppointmentTable}}
						- {{embed ((66415ca6-d397-4fc1-97f1-95f7b516e6d1))}}
		- Templates temporarily excluded
			- #### awaiting delivery of {{i eaff}} {{openOrders words}}
			- {{button '',expand-online-order,eaff}}  {{button order,add-online-order,eb0b}}
			- {{nested-code-block}}
				- expand-online-order:
				  ```js
				  logseq.api.set_block_collapsed(this.target_uuid, "toggle")
				  ```
				  
				  add-online-order:
				  ```js
				  journalHelper(this, 'onlineOrder');
				  ```
			- {{embed ((663f79d8-20d7-4027-9ff5-500ae36ff757))}}
			- {{embed ((667992b3-a3a3-4a1e-9b93-71061bc4896c))}}
- ---
- ### {{i eb8e}} Lost templates
  query:: ((65ff0dba-73e5-4e18-b24d-e3647f09eb31))
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
  and template page sections
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
