tags:: page
description:: `/template`s with boilerplate for collector blocks, page tags, daily journal, queries

- ## {{i fab5}} block templates
  for repeatable structures that could go anywhere.
	- #### {{i ef91}} project management
	  id:: 66b0fc6d-037d-4651-b081-f021d3ef06fa
		- {{i f3f3}} issue/idea helpers
			- ### {{i-example}} samples
			- ### {{i-template}} template
			  template:: block - idea helper 
			  template-including-parent:: false
				- {{kitButton issues,collapseBlock,ea06,-button-style full-width small-caps}}
					- {{embed ((66ccdccf-f9e2-4028-b867-a7b5406fd634))}}
				- {{kitButton ideas,collapseBlock,ea76,-button-style full-width small-caps}}
					- {{embed ((66df909d-79a2-4532-917e-94d3bd8b32a8))}}
				- {{kitButton questions,collapseBlock,ea76,-button-style full-width small-caps}}
					- {{embed ((66df90b1-ccba-494b-94c9-76f3194e0963))}}
			- backup
				- #+BEGIN_QUERY
				  {:inputs [:query-page "idea"]
				   :query
				   [:find ?uuid ?content ?idea-type ?marker (pull ?r [*]) 
				    :keys uuid content idea-type idea-state block-content
				    :in $ ?current-page ?idea-type
				    :where
				    [?p :block/name ?current-page]
				    [?r :block/refs ?p]
				  
				    (or-join [?r ?marker]
				     (and 
				      [?r :block/marker ?marker])
				     (and 
				      [(missing? $ ?r :block/marker)]
				      [(identity "UNINITIALIZED") ?marker]))
				    ;;(not [?r :block/marker ?marker])
				  
				    [?r :block/macros ?m]
				    [?m :block/properties ?props]
				    [(get ?props :logseq.macro-name) ?macros]
				    [(= ?macros ?idea-type)]
				  
				    ;; info we want, now that we have a match
				    [?r :block/uuid ?uuid]
				    [?r :block/content ?content]]
				  
				   :result-transform
				   (letfn 
				    [(first-line [block-content]
				      (first (clojure.string/split-lines block-content)))
				     
				     (strip-idea-type [line idea-type]
				      (clojure.string/replace
				       line
				       (re-pattern (str "(?:TODO\\s|DONE\\s)?{{" idea-type "}}\\s"))
				       ""))
				     
				     (format-idea-state [block-marker]
				      (case block-marker
				        "UNINITIALIZED" "new"
				        "TODO" "open"
				        "DONE" "realized"))
				     
				     (structure-result [result]
				      (let [content (get-in result [:content])
				            block-uuid (get-in result [:uuid])
				            idea-type (get-in result [:idea-type])
				            idea-state (get-in result [:idea-state])]
				        {:block/content content
				         :uuid block-uuid
				         :idea-type idea-type
				         :idea-state (format-idea-state idea-state)
				         :display-text (strip-idea-type 
				                        (first-line content)
				                        idea-type)}))] 
				  
				    (fn [results]
				      (->> results
				           (map structure-result)
				           (group-by :idea-state)
				           (into (sorted-map)))))
				     
				   
				   :view
				   (letfn
				    [(make-link [text destination]
				      [:a {:on-click
				           (fn []
				             (call-api "push_state"
				                       "page"
				                       {:name destination}))}
				       text])
				  
				  (make-icon-link [text destination]
				                      [:a (merge
				                          {:class "ti"}
				                           
				  
				                           {:on-click
				                            (fn []
				                              (call-api "push_state"
				                                        "page"
				                                        {:name destination}))
				                            })
				                       text])
				  
				     (make-marker-box [uuid state content]
				      [:input
				       {:type "checkbox"
				        ;; checked attribute takes a boolean value
				        :checked (= state "realized")
				        :on-click
				        (fn []
				          (call-api
				           "update_block"
				           uuid
				           (str (if (= state "realized")
				                  "TODO"
				                  "DONE")
				                " "
				                (clojure.string/replace
				                 content
				                 (re-pattern "(TODO|DONE)\\s")
				                 ""))))}])
				  
				     (make-initialization-link [uuid content macro-name]
				      [:button 
				       {:on-click
				        (fn []
				          (call-api "update_block"
				                    uuid
				                    (clojure.string/replace
				                     content
				                     (re-pattern (str "{{" macro-name "}}\\s"))
				                     (str "TODO {{" macro-name "}} "))))}
				       "initialize"])]
				  
				    (fn [results]
				      (for [[state items] results]
				        (let [idea-type (-> items
				                            first :idea-type)]
				          [:div
				           [:table {:class "future-event-table stop-click compact"}
				            [:caption state " " idea-type "s"]
				            [:thead [:tr
				                     [:th {:width "80"} "Status"] [:th idea-type] [:th]]]
				            [:tbody
				             (for [result items]
				               [:tr
				                [:td.touch-screen (case (get-in result [:idea-state])
				                       "new" (make-initialization-link
				                              (get-in result [:uuid])
				                              (get-in result [:block/content])
				                              idea-type)
				                       "open" (make-marker-box
				                               (get-in result [:uuid])
				                               (get-in result [:idea-state])
				                               (get-in result [:block/content]))
				                       "realized" (make-marker-box
				                                   (get-in result [:uuid])
				                                   (get-in result [:idea-state])
				                                   (get-in result [:block/content]))
				                       "other")]
				                [:td (get-in result [:display-text]) ]
				                [:td.touch-screen (make-icon-link
				                      "\uea99"
				                      (get-in result [:uuid]))]
				                
				                ])]]]))))} 
				  
				  #+END_QUERY
				  {{idea-identifier}}
		- {{i ee21}} expecting *<something>*
			- ### {{i-example}} samples
				- [[~autism assessment]]
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
		- [:small "older stuff"]
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
	- {{i ebba}} appointment agenda card
		- *for appointments and events*
		- ### {{i-example}} examples
		- ### {{i-template}} template
		  template:: block, appointment/activity/event agenda card
		  template-including-parent:: false
			- event :: 
			  activity :: 
			  with :: 
			  location ::
			  date ::
			  time ::
			  scheduling ::
			  related ::
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
	- [:small "specialist stuff"]
		- #### {{I f499}} collector blocks
			- {{i ef11}} Numbered list
				- ### {{i-example}} examples
				- ### {{i-template}} template
				  template:: block, numbered list
				  template-including-parent:: false
					- *list name*
					  {{i ef11}} #list
						- logseq.order-list-type:: number
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
		- {{i eafd}} news
			- ### {{i-example}} samples
			- ### {{i-template}} template
			  template :: 
			  template-including-parent :: false
				- ##### {{i eafd}}  news
					- {{embed ((66415d9e-5591-4219-bc68-eb54393bccff))}}
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
	- {{i fea0}} full :with page
		- *Use on any :with linked reference*
		- ### {{i-example}} samples
		- ### {{i-template}} template
		  template:: page, :with - common template collection 
		  template-including-parent:: false
			-
			- \/template page, calendar event summary
			- \/template page, topics
	- {{i fec4}} topics of discussion
		- *Often used on :with pages*
		- ### {{i-example}} samples
		- ### {{i-template}} template
		  template:: page, :with - topics of discussion 
		  template-including-parent:: false
			- # {{i eb6c}} Topics
			  *use the \#topics tag to show content here*
				- ### Open topics
					- {{embed ((66e5e078-e59c-4064-91cf-2c3eec36af87))}}
					- {{kitButton export,exportquery,'',squat}}
				- Covered topics
					- {{embed ((66e5e0c4-d1cc-4598-8e00-07f0abad84b0))}}
					- {{kitButton export,exportquery,'',squat}}
	- {{i fd1f}} appointment summary
		- *Use on :with pages*
		- ### {{i-example}} samples
			- [[@Dr Teplitsky]]
		- ### {{i-template}} template
		  template:: page, :with - calendar event summary
		  template-including-parent:: false
			- # {{i f621}} appointment summary
				- ## {{i fad2}} future appointments
					- {{embed }}
					  id:: 66e5dda7-4ff1-47a8-aab5-059310859898
					- {{embed ((66e5dcc2-148a-4f77-88fc-bad898a3fdde))}}
				- ## {{i f824}} previous appointments
					- {{embed ((66e5dcb2-1960-4c28-9fe3-45371b023f0e))}}
					- {{embed ((66e5dcbc-31a8-4e66-a0b3-2b393d3b4919))}}
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
		  template:: page, contacts - location
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
	- {{i }} organization
		- **
		- ### {{i-example}} samples
		- ### {{i-template}} template
		  template:: page, contacts - organization
		  template-including-parent :: false
			- # {{i ea4f}} organization
			  details
				- words
			- # {{i ebf6}} location
			  *places to go*
				- **Place name**
				  Some words
					- {{i eae0}} St. Michael's Hospital
					  30 Bond Street, Toronto, ON
					- {{i eae7}} directions
						- Follow the blue line to the Cardinal Carter wing
						  (north or south)
			- # {{i eb4d}} contacts
			  *its who you know*
				- **Margot Boucher**
				  Research Coordinator I, Multiple Sclerosis Research Program
					- {{i-phone}}  416.360.4000 x41750
					- {{i-email}}  [Margot.Boucher@unityhealth.to](mailto:Margot.Boucher@unityhealth.to)
	- [:small "disused templates"]
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
	- {{i ec45}}  doing container
	  id:: 66994976-991f-4e60-9c59-52c7fc8f4241
		- ### {{i eac9}} component
		  id:: 66b0ead7-2d9d-4e05-a21e-da5d98e1d9b8
			- {{kitButton Doing today,testkit,ec45,-button-style small-caps full-width flex-grow-1 +bold-nth-word:1}}
			  id:: 66aaac57-179b-457a-8b06-3814ddbaa12b
			  {{kitButton do,insertListItem,ec45,long dark-gray gray-border,template='do'}}
			  
			  {{kitButton '',insertListItem,f1fa,dark-gray gray-border,template='doKitchen'}}  {{kitButton '',insertListItem,ea89,dark-gray gray-border,template='doOffice'}}  {{kitButton '',insertListItem,ef48,dark-gray gray-border,template='doBathroom'}}
			  {{doing-holder}}
	- {{i eaad}}  organization blocks
		- ### {{i eac9}} component
		  id:: 66b0ead7-67ee-44fd-a324-bd5dd7602f39
			- ### {{h-admin}} [[admin]]
			  ((662e6daa-e7f1-489f-a8ae-d40add917aa1))
			- ### {{h-resources}} [[resources]]
			  ((662e6757-a3ce-4379-9519-52d6b6133dfb))
			- ### {{h-research}} [[research]]
			  ((662e691a-f289-4178-8828-d8d624de58c5))
			- ### {{h-thoughts}} [[thoughts]]
			  ((662e68bb-da7d-4c47-a248-71f8c4554969))
			- ### {{h-notes}} [[notes]]
			  ((662e67a8-8e34-4a89-b3f9-7d4fa65a47f7))
			- ### {{h-writings}} [[writings]]
			  ((662e696b-3d43-4201-acf5-76879c81cdc6))
			- ### {{h-code}} [[code]]
			  ((66841c96-4f60-4f38-9511-29506db47192))
	- {{i ef49}}  purchase holder
		- ### {{i eac9}} component
		  id:: 66b0ed6f-714f-4e1f-9d4c-85cf15341259
			- {{kitButton purchase list,collapseBlock,ef49,-button-style small-caps full-width +bold-nth-word}}
			  id:: 66b0edf9-37ba-4756-8421-c60cbd44b334
			  {{kitButton '',insertListItem,eb0b eb25,squat dark-gray gray-border,template='shopping'}}   {{kitButton '',insertListItem,eb0b f21c,squat dark-gray gray-border,template='grocery'}}
			  {{purchase-holder}}
	- ## {{i ec9e}} Journal buddies component
	  id:: 662becda-117c-4bed-a4e7-d27b7cd1b6f3
	  {{i ea06}} *this block must remain open.*
		- ### {{i-template}} template B
		  template:: logseq, daily journal
		  template-including-parent:: false
			- {{kitButton grocery list,collapseBlock,f21c,-button-style full-width small-caps}}
				- {{embed ((6682d241-16ee-4991-bf3f-85c90add7dbd))}}
				- {{kitButton show previous purchases,collapseBlock,'',-button-style full-width}}
					- {{embed ((66c12458-4744-4f60-bc2b-8396c7bd3819))}}
			- {{kitButton shopping list,collapseBlock,eb25,-button-style full-width small-caps}}
				- {{embed ((6644ee82-6e4e-4936-af4f-8a47ece6985d))}}
			- {{kitButton '',doingWidget,ec45,squat half-long dark-gray gray-border}}  {{kitButton '',journalOrganizationBlocks,eaad,squat half-long dark-gray gray-border}}  {{kitButton '',purchaseHolderComponent,eb25 f21c,squat half-long dark-gray gray-border}}
			- {{kitButton project focus,collapseBlock,ee1d,-button-style full-width small-caps}}
			  {{embed ((664f42a4-40eb-44ba-8e8c-89dba2c17a06))}}
				- [:span {:class "small-caps"} "project queue"]
				  {{embed ((6654b591-49ea-4d3a-b9d9-1dc4f25bab0c))}}
				- {{kitButton completed projects,collapseBlock,ee1d,-button-style full-width small-caps}}
					- [:span {:class "small-caps"} "fin!"]
					  {{embed ((66e5f125-a19b-444b-ba8c-733711e2cd0f))}}
			- {{kitButton next appointment: |nextAppointment| days,collapseBlock,ea53,-button-style full-width small-caps}}
			  {{embed ((664e4055-3b72-4ba1-ac8b-48e34544629c))}}
			  {{journal-container-insertion-point}}
				- {{futureEventsTable}}
		- ### {{i-template}} template A
		  id:: 65fb3d58-f121-4f03-a702-fbc3e6e5c98c
		  template:: logseq, daily journal pre-2024.8
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
				- #### {{kitButton next appointment in |nextAppointment| days,collapseBlock,ea53,-button-style full-width}}
				  {{embed ((664e4055-3b72-4ba1-ac8b-48e34544629c))}}
					- {{futureEventsTable}}
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
