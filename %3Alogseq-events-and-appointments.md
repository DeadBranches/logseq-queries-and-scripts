tags:: project
-icon:: f830

- [[Friday, Jun 14th, 2024]] Renamed page from `[[logseq-appointments-journal-widget]]` to `[[logseq-events-and-appointments]]` to reflect the fact that the MS-journal, medical appointments, and journal widget are all an overlapping concern.
- {{kitButton issue tracker,collapseBlock,ea06,-button-style full-width small-caps}}
	- #+BEGIN_QUERY
	  {:inputs [:query-page "issue"]
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
	           [:table {:class "future-event-table stop-click"}
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
- {{kitButton idea helper,collapseBlock,ea76,-button-style full-width small-caps}}
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
	           [:table {:class "future-event-table stop-click"}
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
- old issue/idea stuff
	- {{kitButton true idea helper,collapseBlock,ea76,-button-style full-width small-caps}}
		- pp-1
		  #+BEGIN_QUERY
		  {:inputs [:query-page "issue"]
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
		           [:table {:class "future-appointments compact"}
		            [:caption state " " idea-type "s"]
		            [:thead [:tr
		                     [:th {:width "80"} "Status"] [:th idea-type]]]
		            [:tbody
		             (for [result items]
		               [:tr
		                [:td (case (get-in result [:idea-state])
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
		                [:td (make-link
		                      (get-in result [:display-text]) ;;(convert-bold )
		                      (get-in result [:uuid]))]])]]]))))} 
		  
		  #+END_QUERY
	- {{kitButton idea helper,collapseBlock,ea76,-button-style full-width small-caps}}
		- #+BEGIN_QUERY
		  {:inputs [:query-page "idea"]
		   :query
		   [:find (pull ?r [*]) ?uuid ?content ?first-line ?macro-name
		    :keys issue uuid content first-line macro-name
		    :in $ ?current-page ?macro-name
		    :where
		    [?p :block/name ?current-page]
		    [?r :block/refs ?p]
		  
		    ;;[?r :block/marker ?marker]
		    ;;(not [(contains? #{"DONE"} ?marker)])
		  
		    [?r :block/macros ?m]
		    [?m :block/properties ?props]
		    [(get ?props :logseq.macro-name) ?macros]
		    [(= ?macros ?macro-name)]
		  
		    ;; info we want, now that we have a match
		    [?r :block/uuid ?uuid]
		  
		    [?r :block/content ?content]
		    [(str "(?<=^{{" ?macro-name "}} ).*") ?pattern-string]
		   [(re-pattern ?pattern-string) ?first-line-pattern]
		   [(re-find ?first-line-pattern ?content) ?first-line]
		  
		    ;;[?r :block/page ?p]
		    ;;[?p :block/journal-day ?date]
		  ]
		  
		   :view (letfn 
		          [(make-link [text destination]
		             [:a {:on-click 
		               (fn [] (call-api "push_state" "page" {:name destination}))
		              } text])
		  
		           (make-marker-box [uuid content]
		             [:button {:on-click
		               (fn [] (call-api "update_block" uuid
		                        (str (clojure.string/replace content
		   (re-pattern "{{idea}}\\s") "TODO {{idea}} "))
		                      ))} 
		              "initialize" ])
		          ]
		          
		          (fn [results] [:div
		            [:table {:class "future-appointments"}
		  [:caption "Uninitialized " (-> results first :macro-name)]
		             [:thead [:tr
		               [:th {:width "80"} "Status"] [:th (-> results first :macro-name)]]]
		             [:tbody (for [result results] [:tr 
		               [:td (make-marker-box 
		                   (get-in result [:uuid]) (get-in result [:content]))]
		                 [:td (make-link 
		                   (get-in result [:first-line]) (get-in result [:uuid]))
		                  ]
		                 ])]
		             ]]
		            ) 
		           )
		   }
		  #+END_QUERY
		  {{untracked-idea-identifier}}
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
		  {{open-idea-identifier}}
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
		  {{realized-idea-identifier}}
		-
	- {{kitButton issue tracker,collapseBlock,ea76,-button-style full-width small-caps}}
		- [[Monday, Aug 26th, 2024]]
			- **NOTE:** The current best version is the last entry in this series.
			- *Code to keep workbook*
				- **Identifying uninitialized blocks**
					- `(not [?r :block/marker ?marker])`
						- source:  ((66cc842e-8e44-476f-8be9-06c3901c705f))
				- **:result-transform structure**
					- uses threading.
					- Source: ((66cc9a90-01d1-4f7d-9fb7-f67b4b3e8c2f))
			- ~~Current good working version~~
			  logseq.order-list-type:: number
				- #+BEGIN_QUERY
				  {:inputs [:query-page "idea"]
				   :query
				   [:find (pull ?r [*]) ?uuid ?content ?first-line ?idea-type
				    :keys issue uuid content first-line idea-type
				    :in $ ?current-page ?idea-type
				    :where
				    [?p :block/name ?current-page]
				    [?r :block/refs ?p]
				  
				    ;;[?r :block/marker ?marker]
				    ;;(not [(contains? #{"DONE"} ?marker)])
				    
				    [?r :block/macros ?m]
				    [?m :block/properties ?props]
				    [(get ?props :logseq.macro-name) ?macros]
				    [(= ?macros ?idea-type)]
				  
				    ;; info we want, now that we have a match
				    [?r :block/uuid ?uuid]
				  
				    [?r :block/content ?content]
				    [(str "(?<=^{{" ?idea-type "}} ).*") ?pattern-string]
				    [(re-pattern ?pattern-string) ?first-line-pattern]
				    [(re-find ?first-line-pattern ?content) ?first-line]]
				  
				    ;;[?r :block/page ?p]
				    ;;[?p :block/journal-day ?date]
				    
				  
				   :view (letfn
				          [(make-link [text destination]
				                      [:a {:on-click
				                          (fn [] (call-api "push_state" "page" {:name destination}))} text])
				           (make-marker-box [uuid content]
				                            [:button {:on-click
				                                      (fn [] (call-api "update_block" uuid
				                                                       (str (clojure.string/replace content
				                                                                                    (re-pattern "{{idea}}\\s") "TODO {{idea}} "))))}
				                             "initialize"])]
				  
				          (fn [results] [:div
				                         [:table {:class "future-appointments"}
				                          [:caption "Uninitialized " (-> results first :idea-type)]
				                          [:thead [:tr
				                                   [:th {:width "80"} "Status"] [:th (-> results first :idea-type)]]]
				                          [:tbody (for [result results] [:tr
				                                                         [:td (make-marker-box
				                                                               (get-in result [:uuid]) (get-in result [:content]))]
				                                                         [:td (make-link
				                                                               (get-in result [:first-line]) (get-in result [:uuid]))]])]]]))}
				  
				  #+END_QUERY
				  {{unrealized-idea-identifier}}
			- Exploration: Why are the expressions to identify blocks without a *:block/marker* commented out?
			  logseq.order-list-type:: number
			  id:: 66cc842e-8e44-476f-8be9-06c3901c705f
			  [:small [:code ";;[?r :block/marker ?marker]"][:br]
			  [:code ";;(not [(contains? #{"DONE"} ?marker)])"]]
			  [:br]
			  **Answer:** I'm not sure
			  
			  **Exploration result:** Keep the following code to identify uninitialized idea-types:
			  [:small [:code "(not [?r :block/marker ?marker])"]]
				- Test 1: uncommenting top. Result: no matched result
				  ![image.png](../assets/image_1724679306301_0.png){:height 29, :width 126}
					- ```
					  #+BEGIN_QUERY
					  {:inputs [:query-page "idea"]
					   :query
					   [:find (pull ?r [*]) ?uuid ?content ?first-line ?idea-type
					    :keys issue uuid content first-line idea-type
					    :in $ ?current-page ?idea-type
					    :where
					    [?p :block/name ?current-page]
					    [?r :block/refs ?p]
					  
					    [?r :block/marker ?marker]
					    (not [(contains? #{"DONE"} ?marker)])
					    
					    [?r :block/macros ?m]
					    [?m :block/properties ?props]
					    [(get ?props :logseq.macro-name) ?macros]
					    [(= ?macros ?idea-type)]
					  
					    ;; info we want, now that we have a match
					    [?r :block/uuid ?uuid]
					  
					    [?r :block/content ?content]
					    [(str "(?<=^{{" ?idea-type "}} ).*") ?pattern-string]
					    [(re-pattern ?pattern-string) ?first-line-pattern]
					    [(re-find ?first-line-pattern ?content) ?first-line]]
					  
					    ;;[?r :block/page ?p]
					    ;;[?p :block/journal-day ?date]
					    
					  
					   :view (letfn
					          [(make-link [text destination]
					                      [:a {:on-click
					                          (fn [] (call-api "push_state" "page" {:name destination}))} text])
					           (make-marker-box [uuid content]
					                            [:button {:on-click
					                                      (fn [] (call-api "update_block" uuid
					                                                       (str (clojure.string/replace content
					                                                                                    (re-pattern "{{idea}}\\s") "TODO {{idea}} "))))}
					                             "initialize"])]
					  
					          (fn [results] [:div
					                         [:table {:class "future-appointments"}
					                          [:caption "Uninitialized " (-> results first :idea-type)]
					                          [:thead [:tr
					                                   [:th {:width "80"} "Status"] [:th (-> results first :idea-type)]]]
					                          [:tbody (for [result results] [:tr
					                                                         [:td (make-marker-box
					                                                               (get-in result [:uuid]) (get-in result [:content]))]
					                                                         [:td (make-link
					                                                               (get-in result [:first-line]) (get-in result [:uuid]))]])]]]))}
					  
					  #+END_QUERY
					  ```
				- Current best code taken from: ((66cc8727-5f14-42cb-9777-6c0acc73d50f))
			- Taking aall the pps together an dthe current good.
			  logseq.order-list-type:: number
				- #+BEGIN_QUERY
				  
				  
				  {:inputs [:query-page "issue"]
				   :query
				   [:find (pull ?r [*]) ?uuid ?content ?idea-type
				    :keys issue uuid content idea-type
				    :in $ ?current-page ?idea-type
				    :where
				    [?p :block/name ?current-page]
				    [?r :block/refs ?p]
				  
				    (not [?r :block/marker ?marker])
				  
				    [?r :block/macros ?m]
				    [?m :block/properties ?props]
				    [(get ?props :logseq.macro-name) ?macros]
				    [(= ?macros ?idea-type)]
				  
				    ;; info we want, now that we have a match
				    [?r :block/uuid ?uuid]
				    [?r :block/content ?content]]
				  
				  
				  
				   :result-transform (letfn
				                      [(make-link [text destination]
				                          [:a {:on-click
				                               (fn [] (call-api "push_state" "page" {:name destination}))} text])
				                       
				                       (make-marker-box [uuid content]
				                          [:button {:on-click
				                                    (fn [] (call-api "update_block" uuid
				                                             (str (clojure.string/replace content
				                                                    (re-pattern "{{idea}}\\s") "TODO {{idea}} "))))}
				                           "initialize"])
				  
				                       (first-line [block-content]
				                          (first (clojure.string/split-lines block-content)))
				                       
				                       (format-result [result]
				                          (let [content (get-in result [:content])
				                                uuid (get-in result [:uuid])
				                                idea-type (get-in result [:idea-type])
				                                first-line (first-line content)]
				                            
				                            {:content content
				                             :uuid uuid
				                             :idea-type idea-type
				                             :first-line first-line}))]
				                       
				                      
				                      (fn [results]
				                        (->> results
				                             (map format-result))))
				   :view :pprint}
				   
				   
				  #+END_QUERY
			- Now trying to strip `{{issue}}` from :first-line and include it as :display-text
			  logseq.order-list-type:: number
				- pp-1
				  #+BEGIN_QUERY
				  
				  
				  {:inputs [:query-page "issue"]
				   :query
				   [:find (pull ?r [*]) ?uuid ?content ?idea-type
				    :keys issue uuid content idea-type
				    :in $ ?current-page ?idea-type
				    :where
				    [?p :block/name ?current-page]
				    [?r :block/refs ?p]
				  
				    (not [?r :block/marker ?marker])
				  
				    [?r :block/macros ?m]
				    [?m :block/properties ?props]
				    [(get ?props :logseq.macro-name) ?macros]
				    [(= ?macros ?idea-type)]
				  
				    ;; info we want, now that we have a match
				    [?r :block/uuid ?uuid]
				    [?r :block/content ?content]]
				  
				  
				  
				   :result-transform (letfn
				                      [(make-link [text destination]
				                          [:a {:on-click
				                               (fn [] (call-api "push_state" "page" {:name destination}))} text])
				                       
				                       (make-marker-box [uuid content]
				                          [:button {:on-click
				                                    (fn [] (call-api "update_block" uuid
				                                             (str (clojure.string/replace content
				                                                    (re-pattern "{{idea}}\\s") "TODO {{idea}} "))))}
				                           "initialize"])
				  
				                       (first-line [block-content]
				                          (first (clojure.string/split-lines block-content)))
				                       
				                       (strip-idea-type [line idea-type]
				                                        (clojure.string/replace line (re-pattern (str "{{" idea-type "}}\\s")) ""))
				                       
				                       (format-result [result]
				                          (let [content (get-in result [:content])
				                                uuid (get-in result [:uuid])
				                                idea-type (get-in result [:idea-type])
				                                first-line (first-line content)
				                                display-text (strip-idea-type first-line idea-type)]
				                            
				                            {:content content
				                             :uuid uuid
				                             :idea-type idea-type
				                             :first-line first-line
				                             :display-text display-text
				                             }))]
				                       
				                      
				                      (fn [results]
				                        (->> results
				                             (map format-result))))
				   :view :pprint}
				   
				   
				  #+END_QUERY
			- Now adding the *:view* function from v1.3, including make-initialization-link, to the above. (see 			((66ae563f-5c0e-43dd-a3f0-a23a7549641f)))
			  logseq.order-list-type:: number
				- pp-1
				  #+BEGIN_QUERY
				  {:inputs [:query-page "issue"]
				   :query
				   [:find ?uuid ?content ?idea-type (pull ?r [*]) 
				    :keys uuid content idea-type block-content
				    :in $ ?current-page ?idea-type
				    :where
				    [?p :block/name ?current-page]
				    [?r :block/refs ?p]
				  
				    (not [?r :block/marker ?marker])
				  
				    [?r :block/macros ?m]
				    [?m :block/properties ?props]
				    [(get ?props :logseq.macro-name) ?macros]
				    [(= ?macros ?idea-type)]
				  
				    ;; info we want, now that we have a match
				    [?r :block/uuid ?uuid]
				    [?r :block/content ?content]]
				  
				  
				  
				   :result-transform
				   (letfn [(first-line [block-content]
				                       (first (clojure.string/split-lines block-content)))
				  
				           (strip-idea-type [line idea-type]
				                            (clojure.string/replace line (re-pattern (str "{{" idea-type "}}\\s")) ""))] 
				     (fn [results]
				       (map (fn [result]
				              (let [content (get-in result [:content])
				                    block-uuid (get-in result [:uuid])
				                    idea-type (get-in result [:idea-type])]
				                {:block/content content
				                 :uuid block-uuid
				                 :idea-type idea-type
				                 :display-text (strip-idea-type (first-line content)
				                                                idea-type)}
				                ))
				            results)))
				       
				  
				   
				   :view
				   (letfn
				    [(make-link [text destination]
				       [:a {:on-click
				            (fn []
				              (call-api "push_state"
				                        "page"
				                        {:name destination}))}
				        text])
				  
				     (make-marker-box [uuid content]
				       [:button {:on-click
				                 (fn []
				                   (call-api "update_block"
				                             uuid
				                             (str (clojure.string/replace
				                                   content
				                                   (re-pattern "{{idea}}\\s")
				                                   "TODO {{idea}} "))))}
				        "initialize"])
				  
				     (make-initialization-link [uuid content macro-name]
				       [:button {:on-click
				                 (fn []
				                   (call-api "update_block"
				                             uuid
				                             (clojure.string/replace
				                              content
				                              (re-pattern (str "{{" macro-name "}}\\s"))
				                              (str "TODO {{" macro-name "}} "))))}
				        "initialize"])]
				  
				     (fn [results]
				       (let [idea-type (-> results
				                           first :idea-type)]
				         [:div
				          [:table {:class "future-appointments"}
				           [:caption "Uninitialized " idea-type "s"]
				           [:thead [:tr
				                    [:th {:width "80"} "Status"] [:th idea-type]]]
				           [:tbody (for [result results] [:tr
				                                          [:td (make-initialization-link
				                                                (get-in result [:uuid])
				                                                (get-in result [:block/content])
				                                                idea-type)]
				                                          [:td (make-link
				                                                (get-in result [:display-text]) ;;(convert-bold )
				                                                (get-in result [:uuid]))]
				                                          ])]
				           ]]))
				     )}
				   
				   
				  #+END_QUERY
			- now trying to expand it to combine initialize, open, and closed.
			  logseq.order-list-type:: number
			  Starting by getting block/marker as idea-state
				- logseq.order-list-type:: number
				  #+BEGIN_QUERY
				  {:inputs [:query-page "issue"]
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
				   (letfn [(first-line [block-content]
				                       (first (clojure.string/split-lines block-content)))
				  
				           (strip-idea-type [line idea-type]
				                            (clojure.string/replace line (re-pattern (str "(?:TODO\\s|DONE\\s)?{{" idea-type "}}\\s")) ""))
				  
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
				                                       :display-text (strip-idea-type (first-line content)
				                                                                      idea-type)}))] 
				  
				     (fn [results]
				       (->> results
				            (map structure-result)
				  (group-by :idea-state)
				            ))
				    ;;  (fn [results]
				    ;;    (map (fn [result]
				    ;;           (let [content (get-in result [:content])
				    ;;                 block-uuid (get-in result [:uuid])
				    ;;                 idea-type (get-in result [:idea-type])
				    ;;                 idea-state (get-in result [:idea-state])]
				    ;;             {:block/content content
				    ;;              :uuid block-uuid
				    ;;              :idea-type idea-type
				    ;;              :idea-state (format-idea-state idea-state)
				    ;;              :display-text (strip-idea-type (first-line content)
				    ;;                                             idea-type)}
				    ;;             ))
				    ;;         results))
				     
				     )
				  :view :pprint
				  }
				  #+END_QUERY
			- Trying to loop over them now
			  logseq.order-list-type:: number
				- pp-1
				  logseq.order-list-type:: number
				  #+BEGIN_QUERY
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
				   (letfn [(first-line [block-content]
				                       (first (clojure.string/split-lines block-content)))
				  
				           (strip-idea-type [line idea-type]
				                            (clojure.string/replace line (re-pattern (str "(?:TODO\\s|DONE\\s)?{{" idea-type "}}\\s")) ""))
				  
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
				                                :display-text (strip-idea-type (first-line content)
				                                                               idea-type)}))] 
				  
				     (fn [results]
				       (->> results
				            (map structure-result)
				            (group-by :idea-state)
				            ))
				     
				     )
				       
				  
				   
				   :view
				   (letfn
				    [(make-link [text destination]
				                [:a {:on-click
				                     (fn []
				                       (call-api "push_state"
				                                 "page"
				                                 {:name destination}))}
				                 text])
				  
				     (make-marker-box [uuid state content]
				                      [:input
				                       {:type "checkbox"
				                                    ;; checked attribute takes a boolean value
				                        :checked (= state "realized")
				                        :on-click
				                        (fn []
				                          (call-api "update_block" uuid
				                                    (str
				                                     (if (= state "realized")
				                                       "TODO"
				                                       "DONE")
				                                     " "
				                                     (clojure.string/replace
				                                      content
				                                      (re-pattern "(TODO|DONE)\\s")
				                                      ""))))}])
				  
				     (make-initialization-link [uuid content macro-name]
				                               [:button {:on-click
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
				            [:table {:class "future-appointments"}
				             [:caption state " " idea-type "s"]
				             [:thead [:tr
				                      [:th {:width "80"} "Status"] [:th idea-type]]]
				             [:tbody 
				              (for [result items]
				                [:tr
				                 [:td (case (get-in result [:idea-state])
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
				                 [:td (make-link
				                       (get-in result [:display-text]) ;;(convert-bold )
				                       (get-in result [:uuid]))]])]]])) 
				         )
				     )
				     
				     }
				                                             
				   
				  #+END_QUERY
				- pp-1
				  #+BEGIN_QUERY
				  {:inputs [:query-page "issue"]
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
				   (letfn [(first-line [block-content]
				                       (first (clojure.string/split-lines block-content)))
				  
				           (strip-idea-type [line idea-type]
				                            (clojure.string/replace line (re-pattern (str "(?:TODO\\s|DONE\\s)?{{" idea-type "}}\\s")) ""))
				  
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
				                                :display-text (strip-idea-type (first-line content)
				                                                               idea-type)}))] 
				  
				     (fn [results]
				       (->> results
				            (map structure-result)
				            (group-by :idea-state)
				            ))
				     
				     )
				       
				  
				   
				   :view
				   (letfn
				    [(make-link [text destination]
				       [:a {:on-click
				            (fn []
				              (call-api "push_state"
				                        "page"
				                        {:name destination}))}
				        text])
				  
				     (make-marker-box [uuid content]
				       [:button {:on-click
				                 (fn []
				                   (call-api "update_block"
				                             uuid
				                             (str (clojure.string/replace
				                                   content
				                                   (re-pattern "{{idea}}\\s")
				                                   "TODO {{idea}} "))))}
				        "initialize"])
				  
				     (make-initialization-link [uuid content macro-name]
				       [:button {:on-click
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
				            [:table {:class "future-appointments"}
				             [:caption state " " idea-type "s"]
				             [:thead [:tr
				                      [:th {:width "80"} "Status"] [:th idea-type]]]
				             [:tbody (for [result items] [:tr
				                                            [:td (make-initialization-link
				                                                  (get-in result [:uuid])
				                                                  (get-in result [:block/content])
				                                                  idea-type)]
				                                            [:td (make-link
				                                                  (get-in result [:display-text]) ;;(convert-bold )
				                                                  (get-in result [:uuid]))]])]]])) 
				         )
				     )}
				   
				   
				  #+END_QUERY
			- Trying to make the right clicker
			  logseq.order-list-type:: number
				- pp-1
				  logseq.order-list-type:: number
				  #+BEGIN_QUERY
				  {:inputs [:query-page "issue"]
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
				           [:table {:class "future-appointments"}
				            [:caption state " " idea-type "s"]
				            [:thead [:tr
				                     [:th {:width "80"} "Status"] [:th idea-type]]]
				            [:tbody
				             (for [result items]
				               [:tr
				                [:td (case (get-in result [:idea-state])
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
				                [:td (make-link
				                      (get-in result [:display-text]) ;;(convert-bold )
				                      (get-in result [:uuid]))]])]]]))))} 
				  
				  #+END_QUERY
			- for ideas?
			  logseq.order-list-type:: number
				- pp-1
				  logseq.order-list-type:: number
				  #+BEGIN_QUERY
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
				   (letfn [(first-line [block-content]
				                       (first (clojure.string/split-lines block-content)))
				  
				           (strip-idea-type [line idea-type]
				                            (clojure.string/replace line (re-pattern (str "(?:TODO\\s|DONE\\s)?{{" idea-type "}}\\s")) ""))
				  
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
				                                :display-text (strip-idea-type (first-line content)
				                                                               idea-type)}))] 
				  
				     (fn [results]
				       (->> results
				            (map structure-result)
				            (group-by :idea-state)
				            ))
				     
				     )
				       
				  
				   
				   :view
				   (letfn
				    [(make-link [text destination]
				                [:a {:on-click
				                     (fn []
				                       (call-api "push_state"
				                                 "page"
				                                 {:name destination}))}
				                 text])
				  
				     (make-marker-box [uuid state content]
				                      [:input
				                       {:type "checkbox"
				                                    ;; checked attribute takes a boolean value
				                        :checked (= state "realized")
				                        :on-click
				                        (fn []
				                          (call-api "update_block" uuid
				                                    (str
				                                     (if (= state "realized")
				                                       "TODO"
				                                       "DONE")
				                                     " "
				                                     (clojure.string/replace
				                                      content
				                                      (re-pattern "(TODO|DONE)\\s")
				                                      ""))))}])
				  
				     (make-initialization-link [uuid content macro-name]
				                               [:button {:on-click
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
				            [:table {:class "future-appointments"}
				             [:caption state " " idea-type "s"]
				             [:thead [:tr
				                      [:th {:width "80"} "Status"] [:th idea-type]]]
				             [:tbody 
				              (for [result items]
				                [:tr
				                 [:td (case (get-in result [:idea-state])
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
				                 [:td (make-link
				                       (get-in result [:display-text]) ;;(convert-bold )
				                       (get-in result [:uuid]))]])]]])) 
				         )
				     )
				     
				     }
				                                             
				   
				  #+END_QUERY
				- logseq.order-list-type:: number
				- logseq.order-list-type:: number
			- Processing markdown
			  logseq.order-list-type:: number
				- pp-1
				  #+BEGIN_QUERY
				  {:inputs [:query-page "issue"]
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
				       "initialize"])
				     
				     (convert-bold [text]
				                   [:span
				                    [:strong text]
				  
				                    ;; (clojure.string/replace
				                    ;; text
				                    ;; (re-pattern "\\*\\*(.*?)\\*\\*")
				                    ;; (fn [[_ text]] 
				                    ;;   [:strong (str text)]) 
				                    ;; )
				                    ])
				     ]
				  
				    (fn [results]
				      (for [[state items] results]
				        (let [idea-type (-> items
				                            first :idea-type)]
				          [:div
				           [:table {:class "future-appointments compact"}
				            [:caption state " " idea-type "s"]
				            [:thead [:tr
				                     [:th {:width "80"} "Status"] [:th idea-type]]]
				            [:tbody
				             (for [result items]
				               [:tr
				                [:td (case (get-in result [:idea-state])
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
				                [:td (convert-bold 
				                      (get-in result [:display-text])
				                      )
				                      ]])]]])))
				                      )} 
				  
				  #+END_QUERY
			- pp-1
			  logseq.order-list-type:: number
			  #+BEGIN_QUERY
			  {:inputs [:query-page "issue"]
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
			       "initialize"])
			     
			     (convert-bold [text]
			                   [:span
			                    [:strong text]
			  
			                    ;; (clojure.string/replace
			                    ;; text
			                    ;; (re-pattern "\\*\\*(.*?)\\*\\*")
			                    ;; (fn [[_ text]] 
			                    ;;   [:strong (str text)]) 
			                    ;; )
			                    ])
			     ]
			  
			    (fn [results]
			      (for [[state items] results]
			        (let [idea-type (-> items
			                            first :idea-type)]
			          [:div
			           [:table {:class "future-appointments compact"}
			            [:caption state " " idea-type "s"]
			            [:thead [:tr
			                     [:th {:width "80"} "Status"] [:th idea-type]]]
			            [:tbody
			             (for [result items]
			               [:tr
			                [:td (case (get-in result [:idea-state])
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
			                [:td (convert-bold 
			                      (get-in result [:display-text])
			                      )
			                      ]])]]])))
			                      )} 
			  
			  #+END_QUERY
				- pp-1
				  logseq.order-list-type:: number
				- pp-1
				  logseq.order-list-type:: number
				  #+BEGIN_QUERY
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
				   (letfn [(first-line [block-content]
				                       (first (clojure.string/split-lines block-content)))
				  
				           (strip-idea-type [line idea-type]
				                            (clojure.string/replace line (re-pattern (str "(?:TODO\\s|DONE\\s)?{{" idea-type "}}\\s")) ""))
				  
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
				                                :display-text (strip-idea-type (first-line content)
				                                                               idea-type)}))] 
				  
				     (fn [results]
				       (->> results
				            (map structure-result)
				            (group-by :idea-state)
				            ))
				     
				     )
				       
				  
				   
				   :view
				   (letfn
				    [(make-link [text destination]
				                [:a {:on-click
				                     (fn []
				                       (call-api "push_state"
				                                 "page"
				                                 {:name destination}))}
				                 text])
				  
				     (make-marker-box [uuid state content]
				                      [:input
				                       {:type "checkbox"
				                                    ;; checked attribute takes a boolean value
				                        :checked (= state "realized")
				                        :on-click
				                        (fn []
				                          (call-api "update_block" uuid
				                                    (str
				                                     (if (= state "realized")
				                                       "TODO"
				                                       "DONE")
				                                     " "
				                                     (clojure.string/replace
				                                      content
				                                      (re-pattern "(TODO|DONE)\\s")
				                                      ""))))}])
				  
				     (make-initialization-link [uuid content macro-name]
				                               [:button {:on-click
				                                         (fn []
				                                           (call-api "update_block"
				                                                     uuid
				                                                     (clojure.string/replace
				                                                      content
				                                                      (re-pattern (str "{{" macro-name "}}\\s"))
				                                                      (str "TODO {{" macro-name "}} "))))}
				                                "initialize"])
				     
				     
				     ]
				  
				     (fn [results]
				       (for [[state items] results]
				         (let [idea-type (-> items
				                             first :idea-type)]
				           [:div
				            [:table {:class "future-appointments"}
				             [:caption state " " idea-type "s"]
				             [:thead [:tr
				                      [:th {:width "80"} "Status"] [:th idea-type]]]
				             [:tbody 
				              (for [result items]
				                [:tr
				                 [:td (case (get-in result [:idea-state])
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
				                 [:td (make-link
				                       (get-in result [:display-text]) ;;(convert-bold )
				                       (get-in result [:uuid]))]])]]])) 
				         )
				     )
				     
				     }
				                                             
				   
				  #+END_QUERY
		- Older?
			- broken attempts at processing markdown to hiccup
				- #+BEGIN_QUERY
				  {:inputs [:query-page "issue"]
				   :query
				   [:find (pull ?r [*]) ?uuid ?content ?first-line ?macro-name
				    :keys issue uuid content first-line macro-name
				    :in $ ?current-page ?macro-name
				    :where
				    [?p :block/name ?current-page]
				    [?r :block/refs ?p]
				    [?r :block/macros ?m]
				    [?m :block/properties ?props]
				    [(get ?props :logseq.macro-name) ?macros]
				    [(= ?macros ?macro-name)]
				    [?r :block/uuid ?uuid]
				    [?r :block/content ?content]
				    [(re-pattern "(?<=^{{issue}} ).*") ?first-line-pattern]
				    [(re-find ?first-line-pattern ?content) ?first-line]
				  ]
				   :view (letfn
				          [(make-link [text destination]
				             [:a {:on-click
				               (fn [] (call-api "push_state" "page" {:name destination}))
				              } text])
				           (make-marker-box [uuid content]
				             [:button {:on-click
				               (fn [] (call-api "update_block" uuid
				                        (str (clojure.string/replace content
				   (re-pattern "{{issue}}\\s") "TODO {{issue}} "))
				                      ))}
				              "initialize" ])
				           (convert-bold [text]
				                     (clojure.string/replace text #"\*\*(.*?)\*\*"
				                                             (fn [[_ content]] [:strong content])))
				           
				           (convert-italic [text]
				             (clojure.string/replace text #"\*(.*?)\*"
				                                     (fn [[_ content]] [:em content])))
				           
				           (convert-link [text]
				             (clojure.string/replace text #"\[(.*?)\]\((.*?)\)"
				                                     (fn [[_ text url]] [:a {:href url} text])))
				           
				           (markdown->hiccup [text]
				             (-> text
				                 convert-bold
				                 convert-italic
				                 convert-link))
				          ]
				         
				          (fn [results] [:div
				            [:table {:class "future-appointments"}
				              [:caption "Uninitialized " (-> results first :macro-name)]
				              [:thead [:tr
				                [:th {:width "80"} "Status"] [:th (-> results first :macro-name)]]]
				              [:tbody (for [result results] [:tr
				                [:td (make-marker-box
				                    (:uuid result) (:content result))]
				                  [:td (markdown->hiccup (:first-line result))]
				                ])]
				            ]]
				          )
				         )
				   }
				  #+END_QUERY
				  {{untracked-issue-helper}}
				- #+BEGIN_QUERY
				  {:inputs [:query-page "issue"]
				   :query
				   [:find (pull ?r [*]) ?uuid ?content ?first-line ?macro-name
				    :keys issue uuid content first-line macro-name
				    :in $ ?current-page ?macro-name
				    :where
				    [?p :block/name ?current-page]
				    [?r :block/refs ?p]
				  
				    ;;[?r :block/marker ?marker]
				    ;;(not [(contains? #{"DONE"} ?marker)])
				  
				    [?r :block/macros ?m]
				    [?m :block/properties ?props]
				    [(get ?props :logseq.macro-name) ?macros]
				    [(= ?macros ?macro-name)]
				  
				    ;; info we want, now that we have a match
				    [?r :block/uuid ?uuid]
				  
				    [?r :block/content ?content]
				   [(re-pattern "(?<=^{{issue}} ).*") ?first-line-pattern]
				   [(re-find ?first-line-pattern ?content) ?first-line]
				  
				    ;;[?r :block/page ?p]
				    ;;[?p :block/journal-day ?date]
				  ]
				  
				   :view (letfn 
				          [(make-link [text destination]
				             [:a {:on-click 
				               (fn [] (call-api "push_state" "page" {:name destination}))
				              } text])
				           (make-marker-box [uuid content]
				             [:button {:on-click
				               (fn [] (call-api "update_block" uuid
				                        (str (clojure.string/replace content
				   (re-pattern "{{issue}}\\s") "TODO {{issue}} "))
				                      ))} 
				              "initialize" ])
				           (convert-bold [text]
				                     (clojure.string/replace text #"\*\*(.*?)\*\*"
				                                             (fn [[_ content]] [:strong content])))
				           
				                   (convert-italic [text]
				                     (clojure.string/replace text #"\*(.*?)\*"
				                                             (fn [[_ content]] [:em content])))
				           
				                   (convert-link [text]
				                     (clojure.string/replace text #"\[(.*?)\]\((.*?)\)"
				                                             (fn [[_ text url]] [:a {:href url} text])))
				           
				                   (markdown-hiccup [text]
				                     (-> text
				                         convert-bold
				                         convert-italic
				                         convert-link)) 
				          ]
				          
				          (fn [results] [:div
				            [:table {:class "future-appointments"}
				  [:caption "Uninitialized " (-> results first :macro-name)]
				             [:thead [:tr
				               [:th {:width "80"} "Status"] [:th (-> results first :macro-name)]]]
				             [:tbody (for [result results] [:tr 
				               [:td (make-marker-box 
				                   (get-in result [:uuid]) (get-in result [:content]))]
				                 [:td (markdown-hiccup (get-in result [:first-line]))
				                  ;;(make-link (get-in result [:first-line]) (get-in result [:uuid]))
				                  ]
				                 ])]
				             ]]
				            ) 
				           )
				   }
				  #+END_QUERY
				  {{untracked-issue-helper}}
		- uninitialized issues
			- ~~in progress~~
				- #+BEGIN_QUERY
				  ;; v1.4 to :result-transform 
				  
				  {:inputs [:query-page "issue"]
				   :query
				   [:find (pull ?r [*]) ?uuid ?content ?macro-name
				    :keys issue uuid content macro-name
				    :in $ ?current-page ?macro-name
				    :where
				    [?p :block/name ?current-page]
				    [?r :block/refs ?p]
				  
				    (not [?r :block/marker ?marker])
				  
				    [?r :block/macros ?m]
				    [?m :block/properties ?props]
				    [(get ?props :logseq.macro-name) ?macros]
				    [(= ?macros ?macro-name)]
				  
				    ;; info we want, now that we have a match
				    [?r :block/uuid ?uuid]
				    [?r :block/content ?content]
				  
				    ]
				  
				   :result-transform (letfn
				                      [(first-line [block-content]
				                         (first (clojure.string/split-lines block-content)))
				  
				                       (convert-bold [text]
				                         (clojure.string/replace text
				                                                 (re-pattern (str "\\*"))
				                                                 (str "lol")))]
				  
				                       (fn [result]
				                         (map (fn [item]
				                                {:content (:content item)
				                                 :uuid (:uuid item)
				                                 :macro-name (:macro-name item)
				                                 :first-line (first-line (:content item))
				                                 :converted (convert-bold (:content item))})
				                              result)))
				                       :view :pprint
				  }
				  
				  
				  
				  #+END_QUERY
				- Viewing the data **THIS ONE SEEMS TO BE MOST RECENT**
				  #+BEGIN_QUERY
				  ;; v1.4 to :result-transform 
				  ;; v1.4 to :result-transform 
				  
				  {:inputs [:query-page "issue"]
				   :query
				   [:find (pull ?r [*]) ?uuid ?content ?macro-name
				    :keys issue uuid content macro-name
				    :in $ ?current-page ?macro-name
				    :where
				    [?p :block/name ?current-page]
				    [?r :block/refs ?p]
				  
				    (not [?r :block/marker ?marker])
				    ;;(not [(contains? #{"DONE"} ?marker)])
				  
				    [?r :block/macros ?m]
				    [?m :block/properties ?props]
				    [(get ?props :logseq.macro-name) ?macros]
				    [(= ?macros ?macro-name)]
				  
				    ;; info we want, now that we have a match
				    [?r :block/uuid ?uuid]
				  
				    [?r :block/content ?content]
				  
				    ]
				  
				   :result-transform (letfn
				                      [(first-line [block-content]
				                                   (first (clojure.string/split-lines block-content))) 
				                       
				                       (make-link [text destination]
				                         [:a {:on-click
				                              (fn [] (call-api "push_state" "page" {:name destination}))} text])
				                       
				                       (make-initialization-link [uuid content macro-name]
				                         [:button {:on-click
				                                   (fn []
				                                     (call-api "update_block" uuid
				                                               (clojure.string/replace content
				                                                                       (re-pattern (str "{{" macro-name "}}\\s"))
				                                                                       (str "TODO {{" macro-name "}} "))))} "initialize"])
				                       (convert-bold [text]
				                         (clojure.string/replace text
				                                                 (re-pattern (str "\\*"))
				                                                 (str "lol")))]
				  
				                       (fn [result]
				                         (-> result
				                             (update :content (first-line (get-in result :content))))
				                         result)
				   )
				                       :view :pprint
				  }
				  
				  
				  #+END_QUERY
			- ~~pp-1~~ -> see pp-2
			  [:small "notes: This one contained uninitialized-identifier-v1.0 code.
			  This one moves code to split lines from :where into :result-transform"]
			  [:br]
			  [:small "issues: 
			  - I see the keys :macro-name :uuid and :content. I don't see the :first-line key nor the :converted key.
			  - There is no convert-bold function.
			  - The result is a list of maps, in which each map contains an :issue key. Why?"]
				- Query results:
					- ``` 
					  ({:issue
					    {:block/properties-text-values {},
					     :block/uuid #uuid "66b272ed-84e4-4188-a555-8c26227c9bc6",
					     :block/properties {},
					     :block/left {:db/id 29395},
					     :block/refs [{:db/id 136}],
					     :block/properties-order [],
					     :block/collapsed? true,
					     :block/format :markdown,
					     :block/content
					     "{{issue}} Activity cards where the event property contains a linked reference break the *upcoming appointments* display text, and the *quick-note* display text\ncollapsed:: true\n{{i f830}} #[[:logseq-events-and-appointments]]",
					     :db/id 29397,
					     :block/macros [{:db/id 125} {:db/id 268}],
					     :block/path-refs [{:db/id 136} {:db/id 153} {:db/id 26000}],
					     :block/parent {:db/id 29395},
					     :block/page {:db/id 26000}},
					    :uuid #uuid "66b272ed-84e4-4188-a555-8c26227c9bc6",
					    :content
					    "{{issue}} Activity cards where the event property contains a linked reference break the *upcoming appointments* display text, and the *quick-note* display text\ncollapsed:: true\n{{i f830}} #[[:logseq-events-and-appointments]]",
					    :macro-name "issue"}
					   {:issue
					    {:block/uuid #uuid "66ae89fd-de24-4f08-9f8a-f6acb75c0c7d",
					     :block/left {:db/id 25731},
					     :block/refs [{:db/id 136}],
					     :block/format :markdown,
					     :block/content
					     "{{issue}} [[:logseq-events-and-appointments]] no\nwhy",
					     :db/id 25732,
					     :block/macros [{:db/id 125}],
					     :block/path-refs [{:db/id 136}],
					     :block/parent {:db/id 25731},
					     :block/page {:db/id 136}},
					    :uuid #uuid "66ae89fd-de24-4f08-9f8a-f6acb75c0c7d",
					    :content "{{issue}} [[:logseq-events-and-appointments]] no\nwhy",
					    :macro-name "issue"}
					   {:issue
					    {:block/uuid #uuid "66abac4a-d9f5-4798-ace2-c32d1af3c504",
					     :block/journal? true,
					     :block/left {:db/id 24977},
					     :block/refs [{:db/id 136}],
					     :block/journal-day 20240801,
					     :block/format :markdown,
					     :block/content
					     "{{issue}} **Clicking tables opens editing mode.** Clicking the background of a logseq advanced query custom view table causes logseq to enter editing mode.\n{{i f830}} #[[:logseq-events-and-appointments]]",
					     :db/id 25011,
					     :block/macros [{:db/id 125} {:db/id 268}],
					     :block/path-refs [{:db/id 136} {:db/id 24883}],
					     :block/parent {:db/id 24883},
					     :block/page {:db/id 24883}},
					    :uuid #uuid "66abac4a-d9f5-4798-ace2-c32d1af3c504",
					    :content
					    "{{issue}} **Clicking tables opens editing mode.** Clicking the background of a logseq advanced query custom view table causes logseq to enter editing mode.\n{{i f830}} #[[:logseq-events-and-appointments]]",
					    :macro-name "issue"})
					  ```
				- original query
					- ```
					  #+BEGIN_QUERY
					  {:inputs [:query-page "issue"]
					   :query
					   [:find (pull ?r [*]) ?uuid ?content ?macro-name
					    :keys issue uuid content macro-name
					    :in $ ?current-page ?macro-name
					    :where
					    [?p :block/name ?current-page]
					    [?r :block/refs ?p]
					  
					    (not [?r :block/marker ?marker])
					  
					    [?r :block/macros ?m]
					    [?m :block/properties ?props]
					    [(get ?props :logseq.macro-name) ?macros]
					    [(= ?macros ?macro-name)]
					  
					    ;; info we want, now that we have a match
					    [?r :block/uuid ?uuid]
					    [?r :block/content ?content]
					  
					  ]
					  
					    :result-transform (letfn
					                      [(first-line [block-content]
					                         (first (clojure.string/split-lines block-content)))]
					   
					                       (fn [result]
					                         (map (fn [item]
					                                {:content (:content item)
					                                 :uuid (:uuid item)
					                                 :macro-name (:macro-name item)
					                                 :first-line (first-line (:content item))
					                                 :converted (convert-bold (:content item))})
					                              result)))
					  :view :pprint
					    
					  }
					  #+END_QUERY
					  ```
				- pp-2
				  [:small "notes:
				  - Experimenting with removing the :converted key, which made reference to a non-existant function"]
				  [:br]
				  [:small "results: 
				  - the first-line key now works"]
				  
				  #+BEGIN_QUERY
				  
				  
				  {:inputs [:query-page "issue"]
				   :query
				   [:find (pull ?r [*]) ?uuid ?content ?macro-name
				    :keys issue uuid content macro-name
				    :in $ ?current-page ?macro-name
				    :where
				    [?p :block/name ?current-page]
				    [?r :block/refs ?p]
				  
				    (not [?r :block/marker ?marker])
				  
				    [?r :block/macros ?m]
				    [?m :block/properties ?props]
				    [(get ?props :logseq.macro-name) ?macros]
				    [(= ?macros ?macro-name)]
				  
				    ;; info we want, now that we have a match
				    [?r :block/uuid ?uuid]
				    [?r :block/content ?content]
				  
				  ]
				  
				    :result-transform (letfn
				                      [(first-line [block-content]
				                         (first (clojure.string/split-lines block-content)))]
				   
				                       (fn [result]
				                         (map (fn [item]
				                                {:content (:content item)
				                                 :uuid (:uuid item)
				                                 :macro-name (:macro-name item)
				                                 :first-line (first-line (:content item))
				                                 })
				                              result)))
				  :view :pprint
				    
				  }
				  #+END_QUERY
				- **pp-3**
				  id:: 66cc9a90-01d1-4f7d-9fb7-f67b4b3e8c2f
				  [:small "notes:
				  Trying to change the :result-transform method to use threading
				  "]
					- #+BEGIN_QUERY
					  {:inputs [:query-page "issue"]
					   :query
					   [:find (pull ?r [*]) ?uuid ?content ?macro-name
					    :keys issue uuid content macro-name
					    :in $ ?current-page ?macro-name
					    :where
					    [?p :block/name ?current-page]
					    [?r :block/refs ?p]
					  
					    (not [?r :block/marker ?marker])
					  
					    [?r :block/macros ?m]
					    [?m :block/properties ?props]
					    [(get ?props :logseq.macro-name) ?macros]
					    [(= ?macros ?macro-name)]
					  
					    ;; info we want, now that we have a match
					    [?r :block/uuid ?uuid]
					    [?r :block/content ?content]]
					  
					  
					  
					   :result-transform (letfn
					                      [(first-line [block-content]
					                         (first (clojure.string/split-lines block-content)))
					                       
					                       (format-result [result]
					                         (let [content (get-in result [:content])
					                               uuid (get-in result [:uuid])
					                               macro-name (get-in result [:macro-name])
					                               first-line (first-line content)]
					                               {:content content
					                                :uuid uuid
					                                :macro-name macro-name
					                                :first-line first-line
					                                }))
					                       ]
					                       
					                       (fn [results]
					                         (->> results
					                              (map format-result))))
					   :view :pprint
					   
					   }
					  #+END_QUERY
				- *genesis* **UnIn-v1.3 R3** Trying to add markdown formatting 
				  id:: 66ae563f-5c0e-43dd-a3f0-a23a7549641f
				  [:small "This identifies markdown codes, and performs a replacement (successfully)"]
				  #+BEGIN_QUERY
				  
				  {:inputs [:query-page "issue"]
				   :query
				   [:find (pull ?r [*]) ?uuid ?content ?first-line ?macro-name
				    :keys issue uuid content first-line macro-name
				    :in $ ?current-page ?macro-name
				    :where
				    [?p :block/name ?current-page]
				    [?r :block/refs ?p]
				  
				    ;;[?r :block/marker ?marker]
				    ;;(not [(contains? #{"DONE"} ?marker)])
				  
				    [?r :block/macros ?m]
				    [?m :block/properties ?props]
				    [(get ?props :logseq.macro-name) ?macros]
				    [(= ?macros ?macro-name)]
				  
				    ;; info we want, now that we have a match
				    [?r :block/uuid ?uuid]
				  
				    [?r :block/content ?content]
				    [(str "(?<=^{{" ?macro-name "}} ).*") ?pattern-string]
				  [(re-pattern ?pattern-string) ?first-line-pattern]
				   [(re-find ?first-line-pattern ?content) ?first-line]
				  
				    ;;[?r :block/page ?p]
				    ;;[?p :block/journal-day ?date]
				  ]
				  
				   :view (letfn 
				          [(make-link [text destination]
				                      [:a {:on-click
				                           (fn [] (call-api "push_state" "page" {:name destination}))} text])
				           (make-initialization-link [uuid content macro-name]
				                                     [:button {:on-click
				                                               (fn []
				                                                 (call-api "update_block" uuid
				                                                           (clojure.string/replace content
				                                                                                   (re-pattern (str "{{" macro-name "}}\\s"))
				                                                                                   (str "TODO {{" macro-name "}} "))))} "initialize"])
				           (convert-bold [text]
				                         (clojure.string/replace text
				                                                 (re-pattern (str "\\*"))
				                                                 (str "lol")
				                                                 ))
				  ]
				          
				          (fn [results] 
				            (let [macro-name (-> results first :macro-name)]
				              [:div
				               [:table {:class "future-appointments"}
				                [:caption "Uninitialized " macro-name "s"]
				                [:thead [:tr
				                         [:th {:width "80"} "Status"] [:th macro-name]]]
				                [:tbody (for [result results] [:tr
				                                               [:td (make-initialization-link
				                                                     (get-in result [:uuid])
				                                                     (get-in result [:content])
				                                                     macro-name)]
				                                               [:td (make-link
				                                                     (convert-bold (get-in result [:first-line]))
				                                                     (get-in result [:uuid]))]])]]])
				            ) 
				           )
				   }
				  
				  
				  #+END_QUERY
					- *genesis* **UnIn-v1.3 R3.1** Trying to identify the purpose of commented out section 
					  [:small "This uncomments the block/marker stuff"]
					  [:small [:code "[?r :block/marker ?marker]"]]
					  [:small [:code "(not [(contains? #{"DONE"} ?marker)])"]]
					  #+BEGIN_QUERY
					  
					  {:inputs [:query-page "issue"]
					   :query
					   [:find (pull ?r [*]) ?uuid ?content ?first-line ?macro-name
					    :keys issue uuid content first-line macro-name
					    :in $ ?current-page ?macro-name
					    :where
					    [?p :block/name ?current-page]
					    [?r :block/refs ?p]
					  
					    [?r :block/marker ?marker]
					    (not [(contains? #{"DONE"} ?marker)])
					  
					    [?r :block/macros ?m]
					    [?m :block/properties ?props]
					    [(get ?props :logseq.macro-name) ?macros]
					    [(= ?macros ?macro-name)]
					  
					    ;; info we want, now that we have a match
					    [?r :block/uuid ?uuid]
					  
					    [?r :block/content ?content]
					    [(str "(?<=^{{" ?macro-name "}} ).*") ?pattern-string]
					  [(re-pattern ?pattern-string) ?first-line-pattern]
					   [(re-find ?first-line-pattern ?content) ?first-line]
					  
					    ;;[?r :block/page ?p]
					    ;;[?p :block/journal-day ?date]
					  ]
					  
					   :view (letfn 
					          [(make-link [text destination]
					                      [:a {:on-click
					                           (fn [] (call-api "push_state" "page" {:name destination}))} text])
					           (make-initialization-link [uuid content macro-name]
					                                     [:button {:on-click
					                                               (fn []
					                                                 (call-api "update_block" uuid
					                                                           (clojure.string/replace content
					                                                                                   (re-pattern (str "{{" macro-name "}}\\s"))
					                                                                                   (str "TODO {{" macro-name "}} "))))} "initialize"])
					           (convert-bold [text]
					                         (clojure.string/replace text
					                                                 (re-pattern (str "\\*"))
					                                                 (str "lol")
					                                                 ))
					  ]
					          
					          (fn [results] 
					            (let [macro-name (-> results first :macro-name)]
					              [:div
					               [:table {:class "future-appointments"}
					                [:caption "Uninitialized " macro-name "s"]
					                [:thead [:tr
					                         [:th {:width "80"} "Status"] [:th macro-name]]]
					                [:tbody (for [result results] [:tr
					                                               [:td (make-initialization-link
					                                                     (get-in result [:uuid])
					                                                     (get-in result [:content])
					                                                     macro-name)]
					                                               [:td (make-link
					                                                     (convert-bold (get-in result [:first-line]))
					                                                     (get-in result [:uuid]))]])]]])
					            ) 
					           )
					   }
					  
					  
					  #+END_QUERY
					- *genesis* **UnIn-v1.3 R3.2** Trying to identify the purpose of commented out section 
					  id:: 66cc8727-5f14-42cb-9777-6c0acc73d50f
					  [:small "This replaces the commented expressions with one found in a block up more."]
					  [:small [:code "(not [?r :block/marker ?marker])"]]
					  
					   [:b " " ]
					  {{i eb48}} **identify-uninitialized-v1.0** Most modern expression
					  [:small [:code "(not [?r :block/marker ?marker])"]]
					  
					  #+BEGIN_QUERY
					  {:inputs [:query-page "issue"]
					   :query
					   [:find (pull ?r [*]) ?uuid ?content ?first-line ?macro-name
					    :keys issue uuid content first-line macro-name
					    :in $ ?current-page ?macro-name
					    :where
					    [?p :block/name ?current-page]
					    [?r :block/refs ?p]
					  
					   (not [?r :block/marker ?marker])
					  
					    [?r :block/macros ?m]
					    [?m :block/properties ?props]
					    [(get ?props :logseq.macro-name) ?macros]
					    [(= ?macros ?macro-name)]
					  
					    ;; info we want, now that we have a match
					    [?r :block/uuid ?uuid]
					  
					    [?r :block/content ?content]
					    [(str "(?<=^{{" ?macro-name "}} ).*") ?pattern-string]
					  [(re-pattern ?pattern-string) ?first-line-pattern]
					   [(re-find ?first-line-pattern ?content) ?first-line]
					  
					    ;;[?r :block/page ?p]
					    ;;[?p :block/journal-day ?date]
					  ]
					  
					   :view (letfn 
					          [(make-link [text destination]
					                      [:a {:on-click
					                           (fn [] (call-api "push_state" "page" {:name destination}))} text])
					           (make-initialization-link [uuid content macro-name]
					                                     [:button {:on-click
					                                               (fn []
					                                                 (call-api "update_block" uuid
					                                                           (clojure.string/replace content
					                                                                                   (re-pattern (str "{{" macro-name "}}\\s"))
					                                                                                   (str "TODO {{" macro-name "}} "))))} "initialize"])
					           (convert-bold [text]
					                         (clojure.string/replace text
					                                                 (re-pattern (str "\\*"))
					                                                 (str "lol")
					                                                 ))
					  ]
					          
					          (fn [results] 
					            (let [macro-name (-> results first :macro-name)]
					              [:div
					               [:table {:class "future-appointments"}
					                [:caption "Uninitialized " macro-name "s"]
					                [:thead [:tr
					                         [:th {:width "80"} "Status"] [:th macro-name]]]
					                [:tbody (for [result results] [:tr
					                                               [:td (make-initialization-link
					                                                     (get-in result [:uuid])
					                                                     (get-in result [:content])
					                                                     macro-name)]
					                                               [:td (make-link
					                                                     (convert-bold (get-in result [:first-line]))
					                                                     (get-in result [:uuid]))]])]]])
					            ) 
					           )
					   }
					  
					  
					  #+END_QUERY
				- *genesis* **UnIn-v1.3 R2** Replacing hard-coded values in query with reference to input argument
				  
				  **v1.3 :view functions**
				  [:small [:code 
				  "(make-link [text destination])
				  (make-initialization-link [uuid content macro-name])"
				  ]]
				  
				  #+BEGIN_QUERY
				  
				  {:inputs [:query-page "issue"]
				   :query
				   [:find (pull ?r [*]) ?uuid ?content ?first-line ?macro-name
				    :keys issue uuid content first-line macro-name
				    :in $ ?current-page ?macro-name
				    :where
				    [?p :block/name ?current-page]
				    [?r :block/refs ?p]
				  
				    ;;[?r :block/marker ?marker]
				    ;;(not [(contains? #{"DONE"} ?marker)])
				  
				    [?r :block/macros ?m]
				    [?m :block/properties ?props]
				    [(get ?props :logseq.macro-name) ?macros]
				    [(= ?macros ?macro-name)]
				  
				    ;; info we want, now that we have a match
				    [?r :block/uuid ?uuid]
				  
				    [?r :block/content ?content]
				    [(str "(?<=^{{" ?macro-name "}} ).*") ?pattern-string]
				  [(re-pattern ?pattern-string) ?first-line-pattern]
				   [(re-find ?first-line-pattern ?content) ?first-line]
				  
				    ;;[?r :block/page ?p]
				    ;;[?p :block/journal-day ?date]
				  ]
				  
				   :view (letfn 
				          [(make-link [text destination]
				                      [:a {:on-click
				                           (fn [] (call-api "push_state" "page" {:name destination}))} text])
				           (make-initialization-link [uuid content macro-name]
				                            [:button {:on-click
				                                      (fn []
				                                        (call-api "update_block" uuid
				                                                  (clojure.string/replace content
				                                                                          (re-pattern (str "{{" macro-name "}}\\s"))
				                                                                          (str "TODO {{" macro-name "}} "))))
				                                      } "initialize"])
				          ]
				          
				          (fn [results] 
				            (let [macro-name (-> results first :macro-name)]
				              [:div
				               [:table {:class "future-appointments"}
				                [:caption "Uninitialized " macro-name "s"]
				                [:thead [:tr
				                         [:th {:width "80"} "Status"] [:th macro-name]]]
				                [:tbody (for [result results] [:tr
				                                               [:td (make-initialization-link
				                                                     (get-in result [:uuid])
				                                                     (get-in result [:content])
				                                                     macro-name)]
				                                               [:td (make-link
				                                                     (get-in result [:first-line])
				                                                     (get-in result [:uuid]))]])]]])
				            ) 
				           )
				   }
				  
				  
				  #+END_QUERY
				- *genesis* **UnIn-v1.2 R1**
				  [:small "replacing :where clause reference to hard-coded macro name with reference to input"]
				  
				  #+BEGIN_QUERY
				  {:inputs [:query-page "issue"]
				   :query
				   [:find (pull ?r [*]) ?uuid ?content ?first-line ?macro-name
				    :keys issue uuid content first-line macro-name
				    :in $ ?current-page ?macro-name
				    :where
				    [?p :block/name ?current-page]
				    [?r :block/refs ?p]
				  
				    ;;[?r :block/marker ?marker]
				    ;;(not [(contains? #{"DONE"} ?marker)])
				  
				    [?r :block/macros ?m]
				    [?m :block/properties ?props]
				    [(get ?props :logseq.macro-name) ?macros]
				    [(= ?macros ?macro-name)]
				  
				    ;; info we want, now that we have a match
				    [?r :block/uuid ?uuid]
				  
				    [?r :block/content ?content]
				    [(str "(?<=^{{" ?macro-name "}} ).*") ?pattern-string]
				  [(re-pattern ?pattern-string) ?first-line-pattern]
				   [(re-find ?first-line-pattern ?content) ?first-line]
				  
				    ;;[?r :block/page ?p]
				    ;;[?p :block/journal-day ?date]
				  ]
				  
				   :view (letfn 
				          [(make-link [text destination]
				             [:a {:on-click 
				               (fn [] (call-api "push_state" "page" {:name destination}))
				              } text])
				           (make-marker-box [uuid content]
				             [:button {:on-click
				               (fn [] (call-api "update_block" uuid
				                        (str (clojure.string/replace content
				   (re-pattern "{{issue}}\\s") "TODO {{issue}} "))
				                      ))} 
				              "initialize" ])
				          ]
				          
				          (fn [results] [:div
				            [:table {:class "future-appointments"}
				  [:caption "Uninitialized " (-> results first :macro-name)]
				             [:thead [:tr
				               [:th {:width "80"} "Status"] [:th (-> results first :macro-name)]]]
				             [:tbody (for [result results] [:tr 
				               [:td (make-marker-box 
				                   (get-in result [:uuid]) (get-in result [:content]))]
				                 [:td (make-link 
				                   (get-in result [:first-line]) (get-in result [:uuid]))
				                  ]
				                 ])]
				             ]]
				            ) 
				           )
				   }
				  #+END_QUERY
			-
			- #### old working
				- working 1.0
				  #+BEGIN_QUERY
				  {:inputs [:query-page "issue"]
				   :query
				   [:find (pull ?r [*]) ?uuid ?content ?first-line ?macro-name
				    :keys issue uuid content first-line macro-name
				    :in $ ?current-page ?macro-name
				    :where
				    [?p :block/name ?current-page]
				    [?r :block/refs ?p]
				  
				    ;;[?r :block/marker ?marker]
				    ;;(not [(contains? #{"DONE"} ?marker)])
				  
				    [?r :block/macros ?m]
				    [?m :block/properties ?props]
				    [(get ?props :logseq.macro-name) ?macros]
				    [(= ?macros ?macro-name)]
				  
				    ;; info we want, now that we have a match
				    [?r :block/uuid ?uuid]
				  
				    [?r :block/content ?content]
				   [(re-pattern "(?<=^{{issue}} ).*") ?first-line-pattern]
				   [(re-find ?first-line-pattern ?content) ?first-line]
				  
				    ;;[?r :block/page ?p]
				    ;;[?p :block/journal-day ?date]
				  ]
				  
				   :view (letfn 
				          [(make-link [text destination]
				             [:a {:on-click 
				               (fn [] (call-api "push_state" "page" {:name destination}))
				              } text])
				           (make-marker-box [uuid content]
				             [:button {:on-click
				               (fn [] (call-api "update_block" uuid
				                        (str (clojure.string/replace content
				   (re-pattern "{{issue}}\\s") "TODO {{issue}} "))
				                      ))} 
				              "initialize" ])
				          ]
				          
				          (fn [results] [:div
				            [:table {:class "future-appointments"}
				  [:caption "Uninitialized " (-> results first :macro-name)]
				             [:thead [:tr
				               [:th {:width "80"} "Status"] [:th (-> results first :macro-name)]]]
				             [:tbody (for [result results] [:tr 
				               [:td (make-marker-box 
				                   (get-in result [:uuid]) (get-in result [:content]))]
				                 [:td (make-link 
				                   (get-in result [:first-line]) (get-in result [:uuid]))
				                  ]
				                 ])]
				             ]]
				            ) 
				           )
				   }
				  #+END_QUERY
				  {{untracked-issue-helper}}
			- #+BEGIN_QUERY
			  {:inputs [:query-page "issue"]
			   :query
			   [:find (pull ?r [*]) ?uuid ?content ?first-line ?marker
			    :keys issue uuid content first-line state
			    :in $ ?current-page ?macro-name
			    :where
			    [?p :block/name ?current-page]
			    [?r :block/refs ?p]
			  
			    [?r :block/marker ?marker]
			    (not [(contains? #{"DONE"} ?marker)])
			  
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
			            [:table.future-appointments
			  [:caption "Open issues"]
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
			  {{open-issue-tracker}}
		  #+BEGIN_QUERY
		  {:inputs [:query-page "issue"]
		   :query
		   [:find (pull ?r [*]) ?uuid ?content ?first-line ?marker
		    :keys issue uuid content first-line state
		    :in $ ?current-page ?macro-name
		    :where
		    [?p :block/name ?current-page]
		    [?r :block/refs ?p]
		  
		    [?r :block/marker ?marker]
		    (not [(contains? #{"TODO"} ?marker)])
		  
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
		  {{closed-issue-tracker}}
- # Status
	- Current code base:
		- ((a0d265c5-7615-4121-b89a-61085e877fea))
- # {{objective}} objectives
	- Journal widget
		- DONE {{i f73a}} **Appointment countdown** feature. 
		  id:: 66817c36-1781-4f29-9095-b1268113d128
		  Shows days until next appointment at-a-glance
		- DONE **Next appointment data at-a-glance**. 
		  id:: 66817c41-f589-4d66-8f65-be55d49e1ea9
		  Event data for next upcoming appointment(s) always displayed
		- DONE **Next appointment quick-note**
		  id:: 66817c6f-8f3e-4f44-9ed3-d54d95b98cc7
		  Clicking appointment data adds a new block to journal
		- {{i fd1e}} **future appointments reference**
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
