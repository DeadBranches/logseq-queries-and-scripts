tags:: project
description:: Converting code-button blocks to logseq kits `{{evalpage}}` buttons
-icon:: ec9e

- # {{i f51a}} goal
	- A journal buddy-widget that works properly
- # {{i eb4e}} objectives
	- ### A beautiful clutter-free graph using compartmentalized components
		- Buttons spawn list-item containers
		- Shopping list references accessable through containers
		- Blocks use a unified design language.
			- Collapsable components use a full-width button
	- ### Better components
		- DONE **Purchase list container.** Holds grocery and buy TODO blocks.
		  id:: 668bf89f-7c48-4138-9e39-411860b130f8
			- **Better groceries**. Groceries are put inside a block automatically
			  id:: f5f080d5-8575-43cb-b040-65ae30bb99c4
				- {{embed ((66749df5-5c2a-4990-a677-70e0e9fbfdf6))}}
		- DONE **Kits javascript**. 
		  No more nested code blocks
		- DONE **Unified design**.
		  Full-width buttons for unveiling hidden information
			- e.g. appointments, grocery, orders, buy, etc
		- DONE **Automated daily reminders**. 
		  Daily reminders that self-collapse upon evaluation
		- DONE **Appointment helper**, show next appointments at a glance. Click appoinment to add a note. Block hides future appointment list
		- DONE **Organization blocks**. That appear below the journal buddy when invoked
		  id:: 66897945-7f07-4e76-8574-fd8d6fb4d9d5
- # Documentation
	- ## {{i eac9}} ui components
		- ### {{i ec9e}} **Journal buddies** component
		  id:: 6691330c-322f-4eb8-b311-e508d156b1fc
			- {{kitButton issue tracker,collapseBlock,ea76,-button-style full-width small-caps}}
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
			- *documentation*
				- in-graph location & address
					- {{i-file}} *templates* / {{I eb96}} *Daily Journal* / {{i ec9e}} *Journal buddies* / {{i-template}} *[template](((669bc80f-ccbb-4be3-8144-ad79decd7ee9)))*
					- `669bc80f-ccbb-4be3-8144-ad79decd7ee9`
			- {{i eac9}} component preview (*live embed*)
			    {{i ea06}} *the following block* ***must*** *remain open*
				- {{embed ((669bc80f-ccbb-4be3-8144-ad79decd7ee9))}}
			- workspace
				- {{kitButton '',doingWidget,ec45}}  {{kitButton '',journalOrganizationBlocks,eaad}}  {{kitButton '',journalGroceryWidget,eb25 f21c}}  {{button '',add-online-order,eaff}}
				  id:: 66913332-10d5-4554-a4ea-70380475cd0d
					- {{i eaff}} (6) {{i eb25}} (8) {{i f21c}} (3)
						- #### {{kitButton project focus,collapseBlock,f00e,-button-style full-width}}
						  {{embed ((664f42a4-40eb-44ba-8e8c-89dba2c17a06))}}
						- {{i eaff}} Online orders
						- {{i eb25}} Shopping list
						- {{kitButton grocery list,collapseBlock,f21c,-button-style full-width}}
							- {{embed ((6682d241-16ee-4991-bf3f-85c90add7dbd))}}
			- [:small "past versions ->"]
				- journal buddy template v1
					- ### {{journalBuddy}} Journal buddies
						- [:small "daily reminders"]
							- DONE {{i ef63}} Take medication
							  SCHEDULED: <2024-07-07 Sun>
						- {{button '',doing,ec45}}  {{kitButton '',journalOrganizationBlocks,eaad}}  {{kitButton '',journalGroceryWidget,eb25 f21c}}
							- Code Blocks
							  doing:
							  ```js
							  journalHelper(this, 'doingBlocks');
							  ```
							  
							  organization-blocks:
							  ```js
							  journalHelper(this, 'organizationBlocks');
							  ```
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
							- #### awaiting delivery of {{i eaff}} {{openOrders words}}
							- {{embed ((667992b3-a3a3-4a1e-9b93-71061bc4896c))}}
						- {{kitButton goods to purchase...,collapseBlock,f622 eb25,-button-style full-width smol-text}}
							- {{embed ((6644ee82-6e4e-4936-af4f-8a47ece6985d))}}
							- {{embed ((667992b3-de9e-4570-86f5-5beffb1686a0))}}
						- {{kitButton groceries I need...,collapseBlock,f622 f21c,-button-style full-width smol-text}}
							- {{embed ((667992b0-0c2b-4343-9c1a-9c7e5e4ada50))}}
							- {{embed ((667992b0-0de4-46c7-a490-296854304e56))}}
								- {{embed ((663f8303-7fca-406d-83ed-d93002164105))}}
						- ##### {{kitButton  project focus,collapseBlock,f622 f00e,-button-style full-width}}
						  {{embed ((664f42a4-40eb-44ba-8e8c-89dba2c17a06))}}
							- {{embed ((6654b591-49ea-4d3a-b9d9-1dc4f25bab0c))}}
						- #### {{i ea53}}  upcoming appointment {{nextAppointment}}
						  {{embed ((664e4055-3b72-4ba1-ac8b-48e34544629c))}}
							- {{embed ((66415ca6-d397-4fc1-97f1-95f7b516e6d1))}}
		- ### {{i ec45}} **doing** container component
		  id:: 668d8204-e490-4d23-8d14-1c8f167c9edb
			- {{kitButton issue tracker,collapseBlock,ea76,-button-style full-width small-caps}}
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
			- *documentation*
				- in-graph location & address
					- {{i-file}} *templates* / {{I eb96}} *Daily Journal* / {{i ec45}} *doing container* / {{i eac9}} *[component](((66b0ead7-2d9d-4e05-a21e-da5d98e1d9b8)))*
					- `66aaac57-179b-457a-8b06-3814ddbaa12b`
				- component role
					- ##### spawned by
						- {{i ec9e}} journal buddies -> \{\{ kitButton\([[doingWidget]]) }}
					- ##### uses
						- [:small "{{ kitButton"]\([[insertListItem]]) [:small "}}"]
			- {{i eac9}} Component preview *(live embed)*
				- ### {{i ea06}} *do not modify*
				  {{i ea06}} this component may not appear correctly in preview
				- {{embed ((66b0ead7-2d9d-4e05-a21e-da5d98e1d9b8))}}
		- ### {{i eaad}} **organization blocks** component
			- {{kitButton issue tracker,collapseBlock,ea76,-button-style full-width small-caps}}
			- *documentation*
				- in-graph location & address
					- {{i-file}} *templates* / {{I eb96}} *Daily Journal* / {{i eaad}} *organization blocks* / {{i eac9}} *[component](((66b0ead7-67ee-44fd-a324-bd5dd7602f39)))*
				- component role
					- ##### spawned by
						- {{i ec9e}} journal buddies -> \{\{ kitButton\([[journalOrganizationBlocks]]) }}
		- ### {{i eb25}}{{i f21c}} {{i ef49}}  **purchase holder** component
		  id:: 668bfa16-f000-4381-80b7-155ed5ebe7f1
			- {{kitButton issue tracker,collapseBlock,ea76,-button-style full-width small-caps}}
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
					- {{kitButton export content,exportquery}}
			- *documentation*
				- in-graph location & address
					- {{i-file}} *templates* / {{I eb96}} *Daily Journal* / {{i ef49}} *Purchase holder component* / {{i eac9}} *[component](((66b0ed6f-714f-4e1f-9d4c-85cf15341259)))*
					- `66b0edf9-37ba-4756-8421-c60cbd44b334`
				- component role
					- ##### spawned by
						- {{i ec9e}} journal buddies -> [:small "{{ kitButton"]\([[purchaseHolderComponent]]) [:small "}}"]
					- ##### uses
						- [:small "{{ kitButton"]\([[insertListItem]]) [:small "}}"]
					- ##### formerly
						- [[journalGroceryWidget]]
			- {{i eac9}} Component preview *(live embed)*
				- ### {{i ea06}} *do not modify*
				  {{i ea06}} this component may not appear correctly in preview
				- {{embed ((66b0ed6f-714f-4e1f-9d4c-85cf15341259))}}
				  id:: 668d8204-6acc-4734-8754-d2da142826c0
	- ## {{i f240}} code components
		- ### {{i fc2b}} logseq [[kits]]
			- #### Core components
				- ### {{i efe6}} [[kitButton]]
				  id:: 668d8204-07f5-4ec2-8ff8-9e9a534637b2
					- {{kitButton issue tracker,collapseBlock,ea76,-button-style full-width small-caps}}
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
					- #### Related
						- [[newKitButton]]
				- ### {{i f4a2}} [[collapseBlock]]
					- *issue tracker*
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
			- #### Data components
				- ~~[`{{nextAppointment}}`]([[nextAppointment]])~~ -> [[daysUntilNextAppointment]]
					- *issue tracker*
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
				- [[openOrderCount]]
					- *issue tracker*
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
				- [[groceryItemCount]]
					- *issue tracker*
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
				- [[shoppingItemCount]]
					- *issue tracker*
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
			- #### Button components
				- #### component/list holders
				  *hold buttons and nest list items as children*
				  *added to journal page as needed*
					- *kit* [[purchaseHolderComponent]]
					  [:small "formerly journalGroceryWidget"]
						- {{kitButton trackers,collapseBlock,ea76,-button-style full-width small-caps}}
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
						- [[deploys]]
							- ((668bfa16-f000-4381-80b7-155ed5ebe7f1))
					- [[doingWidget]]
						- {{kitButton trackers,collapseBlock,ea76,-button-style full-width small-caps}}
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
						- [[deploys]]
							- ((668d8204-e490-4d23-8d14-1c8f167c9edb))
				- [[journalOrganizationBlocks]]
					- *issue tracker*
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
					- *rename to spawnOrganizationBlocks?*
			- #### Common kits
				- [[insertListItem]] kit
				  id:: 669a7ff5-4511-438d-8d76-02b1d2cab0c7
				  *adds a list-item to a holder
					- *issue tracker*
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
					- Inserts items under doing/purchase holders.
				-
				- [[insertSomeBlocks]] kit
		- ### {{i f4e1}} advanced queries
			- **Appointments**
				- [Next appointment quick-view](((664e4055-3b72-4ba1-ac8b-48e34544629c)))
				  id:: 668d8204-82c8-4e21-8c7a-7083a5a97c13
				- [Upcoming appointments list](((66415ca6-d397-4fc1-97f1-95f7b516e6d1)))
				  id:: 668d8204-4201-437e-ad5d-571339e373ec
			- **Projects**
				- [Project focus quick-view](((664f42a4-40eb-44ba-8e8c-89dba2c17a06)))
				  id:: 668d8204-ac77-4a87-8601-2065579ba06e
				- [Upcoming projects list](((6654b591-49ea-4d3a-b9d9-1dc4f25bab0c)))
				  id:: 668d8204-64cc-4868-9242-7dd18403afdd
- # Resources
	- ((6675f549-9ddf-4287-be21-038387f41e78))
	- ((6675f599-ee16-4bee-978c-28586936ec8a))
