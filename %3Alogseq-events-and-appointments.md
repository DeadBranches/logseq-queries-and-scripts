tags:: project
-icon:: f830

- [[Friday, Jun 14th, 2024]] Renamed page from `[[logseq-appointments-journal-widget]]` to `[[logseq-events-and-appointments]]` to reflect the fact that the MS-journal, medical appointments, and journal widget are all an overlapping concern.
- {{kitButton issues,collapseBlock,ea06,-button-style full-width small-caps}}
	- {{embed ((66ccdccf-f9e2-4028-b867-a7b5406fd634))}}
- {{kitButton ideas,collapseBlock,ea76,-button-style full-width small-caps}}
	- {{embed ((66df909d-79a2-4532-917e-94d3bd8b32a8))}}
- {{kitButton questions,collapseBlock,ea76,-button-style full-width small-caps}}
	- {{embed ((66df90b1-ccba-494b-94c9-76f3194e0963))}}
- # Status
	- Current code base:
		- ((a0d265c5-7615-4121-b89a-61085e877fea))
- # {{objective}} objectives
	- ### [journal widget]([[:logseq-events-and-appointments/journal-widget]])
		- #### DONE {{i f73a}}  [Next appointment countdown]([[:logseq-events-and-appointments/journal-widget/next-appointment-countdown]]). 
		  id:: 66817c36-1781-4f29-9095-b1268113d128
		  Show days until next appointment.
		- #### DONE [Next appointment feed]([[:logseq-events-and-appointments/journal-widget/next-appointment-feed]]). 
		  id:: 66817c41-f589-4d66-8f65-be55d49e1ea9
		  Display next appointment information at-a-glance.
		- ### DONE [Appointment quick-note]([[:logseq-events-and-appointments/journal-widget/appointment-quick-note]]) links.
		  id:: 66817c6f-8f3e-4f44-9ed3-d54d95b98cc7
		  Click an appointment to add a journal note and reference to journal page.
		- #### TODO {{i fd1e}} [future activity quick-reference]([[:logseq-events-and-appointments/journal-widget/future-activity-quickview]])
		  id:: 6681a908-134d-4fa7-aa61-ecd42788634b
		  Future appointments hidden in a child block.
			- *issue tracker*
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
			- ### design
				- | when | what |
				  | 3 days | [:a {:class "link"} "Cheetos with burritos"] |
			- ### {{i f240}} components
				- [`{{nextAppointment}}`]([[nextAppointment]]) replace-macro
				-
-
-
