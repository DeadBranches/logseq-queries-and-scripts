tags:: project
-icon:: f830

- [[Friday, Jun 14th, 2024]] Renamed page from `[[logseq-appointments-journal-widget]]` to `[[logseq-events-and-appointments]]` to reflect the fact that the MS-journal, medical appointments, and journal widget are all an overlapping concern.
- {{kitButton idea helper,collapseBlock,ea76,-button-style full-width small-caps}}
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
	  {{untracked-idea-helper}}
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
	-
- {{kitButton issue tracker,collapseBlock,ea76,-button-style full-width small-caps}}
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
		- in progress
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
			- Viewing the data
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
			-
			- v1.3 Trying to add markdown formatting
			  [:small "this replaces soem text"]
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
			- v1.2 Replacing hard-coded values in query with reference to input argument
			  
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
			- working 1.1
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
			  {{untracked-issue-helper}}
		- test data
			- {{issue}} [[:logseq-events-and-appointments]] no
			  why
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
