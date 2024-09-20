repository:: DeadBranches/logseq-queries-and-scripts

- {{kitButton items on the list,collapseBlock,ef40,-button-style}}
  id:: 667992b0-0c2b-4343-9c1a-9c7e5e4ada50
	- id:: 6682d241-16ee-4991-bf3f-85c90add7dbd
	  #+BEGIN_QUERY
	  {:inputs ["grocery"]
	   :query
	   [:find (pull ?b [*])
	    :in $ ?macro-name %
	    :where
	    [?b :block/marker ?marker]
	    (not [(contains? #{"DONE"} ?marker)])
	    (using-macro ?b ?macro-name)
	   ]
	  :rules [
	          [(using-macro ?b ?macro-name)
	           [?b :block/macros ?m]
	           [?m :block/properties ?props]
	           [(get ?props :logseq.macro-name) ?macros]
	           [(= ?macros ?macro-name)]]
	  ]
	   :result-transform
	   (fn [result]
	     (sort-by 
	      (juxt
	       (fn [r] (get r :block/scheduled 99999999)) 
	       (fn [r] (get r :block/content))) 
	      (map 
	       (fn [m] 
	         (update 
	          m :block/properties 
	          (fn [u] 
	            (assoc 
	             u :scheduled (get-in m [:block/scheduled] "-")))))
	       result))) 
	   :breadcrumb-show? false
	    }
	  #+END_QUERY
	  #+BEGIN_QUERY
	  {:inputs [:start-of-today-ms "grocery"]
	   :query
	   [:find (pull ?b [*])
	    :in $ ?start-of-today ?macro-name %
	    :where
	    (marked-done-today ?b ?start-of-today)
	    (using-macro ?b ?macro-name)]
	   
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
	      (juxt
	       (fn [r] (get r :block/scheduled 99999999))
	       (fn [r] (get r :block/content)))
	      (map (fn [m]
	             (update m :block/properties (fn [u] (assoc u
	                                    :scheduled (get-in m [:block/scheduled] "-"))))) result)))
	  
	   :breadcrumb-show? false
	  }
	  #+END_QUERY
- {{kitButton previous purchases,collapseBlock,eb9b,-button-style}}
	- {{embed ((66c12458-4744-4f60-bc2b-8396c7bd3819))}}
- #### {{i f5f8}} in my basket..
  id:: 667992b0-0de4-46c7-a490-296854304e56
	- id:: 6682d241-e03c-4501-9c07-243c18d7f606
	  #+BEGIN_QUERY
	  {:inputs [:start-of-today-ms "grocery"]
	   :query
	   [:find (pull ?b [*])
	    :in $ ?start-of-today ?macro-name %
	    :where
	    (marked-done-today ?b ?start-of-today)
	    (using-macro ?b ?macro-name)]
	   
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
	      (juxt
	       (fn [r] (get r :block/scheduled 99999999))
	       (fn [r] (get r :block/content)))
	      (map (fn [m]
	             (update m :block/properties (fn [u] (assoc u
	                                    :scheduled (get-in m [:block/scheduled] "-"))))) result)))
	  
	   :breadcrumb-show? false
	  }
	  #+END_QUERY
- #### admin
	- Full list of every purchased item
		- {{i fdaa}} search string
			- cat food
			  id:: 66d5df7f-7228-469c-b845-a5a74067efb4
		- Results
			- #+BEGIN_QUERY
			  ;; original
			   {:inputs ["grocery" :today "66d5df7f-7228-469c-b845-a5a74067efb4" "cat food"]
			    :query
			    [:find (pull ?b [*])
			     ;;:keys content journal-day today-journal-day today today-journal-uuid marker
			  
			     :in $ ?macro-name ?today-journal-day ?query-block-uuid ?manual-search-string %
			  
			     :where
			     [?b :block/marker ?marker]
			     ;;[(contains? #{"DONE"} ?marker)]
			     (using-macro ?b ?macro-name)
			  
			     [?b :block/content ?content]
			     ;; Return only a subset of grocery items.
			     ;;
			     ;; - Return only items where a substring is in :block/content
			     ;; - Dynamically fetch the substring from a block in the graph
			     ;;   - Identify the substring-containing block via UUID hardcoded
			     ;;     in the query inputs.
			     ;;
			     ;; ?q represents the query string block.
			    [?q :block/uuid "66d5df7f-7228-469c-b845-a5a74067efb4"]
			     ;;[?q :block/content ?search-string]
			     ;;[(clojure.string/includes? ?content ?search-string)]
			  
			     [?b :block/page ?p]
			     [?p :block/journal-day ?journal-day]
			  
			     [?j :block/journal-day ?today-journal-day]
			     [?j :block/name ?today]
			     [?j :block/uuid ?today-journal-uuid]]
			  
			  
			    :rules
			    [[(using-macro ?b ?macro-name)
			      [?b :block/macros ?m]
			      [?m :block/properties ?props]
			      [(get ?props :logseq.macro-name) ?macros]
			      [(= ?macros ?macro-name)]]]
			   :view :pprint
			                 
			  
			    :breadcrumb-show? false}
			  #+END_QUERY
- future-appointments compact more compact
	- #+BEGIN_QUERY
	  ;; original ()not working)
	   {:inputs ["grocery" :today]
	    :query
	    [:find ?content ?journal-day ?today-journal-day ?today ?today-journal-uuid ?marker
	     :keys content journal-day today-journal-day today today-journal-uuid marker
	     :in $ ?macro-name ?today-journal-day %
	  
	     :where
	     [?b :block/marker ?marker]
	     ;;[(contains? #{"DONE"} ?marker)]
	     (using-macro ?b ?macro-name)
	  
	     [?b :block/content ?content]
	     [?b :block/page ?p]
	     [?p :block/journal-day ?journal-day]
	  
	     [?j :block/journal-day ?today-journal-day]
	     [?j :block/name ?today]
	     [?j :block/uuid ?today-journal-uuid]]
	  
	  
	    :rules
	    [[(using-macro ?b ?macro-name)
	      [?b :block/macros ?m]
	      [?m :block/properties ?props]
	      [(get ?props :logseq.macro-name) ?macros]
	      [(= ?macros ?macro-name)]]]
	  
	  
	    :result-transform
	    (letfn
	     [(convert-range [value [old-range-min old-range-max] [new-range-min new-range-max]]
	        ^{:doc "Given a value within a range, converts the value to a different range"
	          :example "(convert-range -4 [-30 0] [0 255]) ;; => 221"}
	        (+
	         (/
	          (*
	           (- value
	              old-range-min)
	                        ;; * 
	           (- new-range-max
	              new-range-min))
	                       ;;----------------
	          (- old-range-max
	             old-range-min))
	                       ;; +
	         new-range-min))
	  
	  
	  
	      (integer-floor
	        [number]
	        ^{:doc "Returns the largest double less than or equal to number,
	              and equal to a mathematical integer. Equivalent to clojure.math/floor"
	          :example "(integer-floor 11.1) => ;; => 11"}
	        (if (>= number 0)
	          (int number)
	          (dec (int number))))
	  
	  
	  
	      (number-absolute
	        [number]
	        ^{:doc "Returns the absolute value of a number. Equivalent to abs."
	          :example "(number-absolute -10) ;; => 10"}
	        (if (>= number 0)
	          number
	          (- number)))
	  
	  
	  
	      (date/today
	        []
	        ^{:doc "Returns today's date as an integer in the format YYYYMMDD.
	              Uses the datascript_query API to fetch the current date."
	          :example "(date/today) ; => 20240918"}
	        (let [query-result (call-api "datascript_query"
	                                     "[:find ?today :in $ ?today :where [_ :block/name _]]"
	                                     ":today")
	  
	              date-integer (read-string (apply
	                                         str
	                                         query-result))]
	          date-integer))
	  
	  
	  
	      (date/journal-day->julian-day
	        [year month day]
	        ^{:doc "Converts a Gregorian calendar date to a Julian day number.
	              This function is used for date calculations.
	              Parameters:
	                year: Integer representing the year
	                month: Integer representing the month (1-12)
	                day: Integer representing the day of the month
	              Returns: Integer representing the Julian day number"
	          :example "(date/journal-day->julian-day 2024 9 18) ; => 2460211"}
	        (let [adjustment (integer-floor (/ (- month
	                                              14)
	                                           12))
	  
	              adjusted-year (+ year
	                               4800
	                               adjustment)
	  
	              adjusted-month (+ month
	                                (* 12
	                                   adjustment)
	                                -3)]
	  
	          (+ (integer-floor (+ (* 365.25
	                                  adjusted-year)
	                               0.5))
	             (integer-floor (+ (* 30.6001
	                                  (+ adjusted-month
	                                     1))
	                               0.5))
	             day
	             -32075)))
	  
	  
	  
	      (date/get-difference
	        ([journal-day] (date/get-difference journal-day (date/today)))
	        ^{:doc "Calculates the absolute difference in days between a date and today.
	              Parameters:
	                journal-day: Integer representing a date in YYYYMMDD format."}
	        ([journal-day1 journal-day2]
	         ^{:doc "Calculates the absolute difference in days between two dates.
	              Parameters:
	                journal-day1: Integer representing a date in YYYYMMDD format
	                journal-day2: Integer representing a date in YYYYMMDD format
	              Returns: Integer representing the number of days between the two dates"
	           :example "(date/get-difference 20240918 20240610) ; => 100"}
	  
	         (let [extract-date (fn [date]
	                              [(quot date 10000)
	                               (rem (quot date 100) 100)
	                               (rem date 100)])
	               [year1 month1 day1] (extract-date
	                                    journal-day1)
	               [year2 month2 day2] (extract-date
	                                    journal-day2)
	               julian-day-number1 (date/journal-day->julian-day
	                                   year1
	                                   month1
	                                   day1)
	               julian-day-number2 (date/journal-day->julian-day
	                                   year2
	                                   month2
	                                   day2)]
	           (number-absolute (- julian-day-number1
	                               julian-day-number2)))))]
	  
	      (fn [results]
	        (let [first-line (fn [item]
	                           (if (clojure.string/index-of item "\n")
	                             (subs item 0 (clojure.string/index-of item "\n"))
	                             item))
	              query-data (first results)
	              query-results (map (fn [result]
	                                   (dissoc result :today-journal-day :today :today-journal-uuid))
	                                 results)
	              transformed-results
	              (->> query-results
	                   (map (fn [result]
	                          (update result :content
	                                  (fn [item]
	                                    (-> item
	                                        first-line
	                                        clojure.string/lower-case
	                                        (clojure.string/replace
	                                         (re-pattern "(?:done|todo) \\{\\{grocery\\}\\} ") "")
	                                        (clojure.string/replace (re-pattern "x\\d$") "")
	                                        clojure.string/trim)))))
	                   (group-by :content)
	  
	                   (sort-by (fn [[_ entries]]
	                              (count entries))
	                            >)
	  
	                   (map (fn [[grocery-item entries]]
	                          [grocery-item (map (fn [entry]
	                                               (dissoc entry :content))
	                                             entries)]))
	  
	                   (map (fn [[grocery-item purchase-data]]
	                          (let [in-basket?
	                                (some (fn [entry]
	                                        (=
	                                         (:marker entry)
	                                         "TODO"))
	                                      purchase-data)
	  
	                                first-purchase-date
	                                (->> purchase-data
	                                     (map :journal-day)
	                                     (apply min))
	  
	                                days-from-first-purchase ;;first-purchase-days
	                                (date/get-difference first-purchase-date)
	  
	                                last-purchase-date
	                                (->> purchase-data
	                                     (map :journal-day)
	                                     (apply max))
	  
	                                days-from-last-purchase ;;last-purchase-days
	                                (date/get-difference last-purchase-date)
	  
	                                purchase-count
	                                (count purchase-data)
	  
	                               ;; Don't count items on the list for purchase
	                               ;; because that's cheating.
	                                adjusted-purchase-count
	                                (if in-basket?
	                                  (dec purchase-count)
	                                  purchase-count)
	  
	                               ;; Average number of days between purchases beginning from
	                               ;; the first purchase and until the last purchase.
	                                average-purchase-in-days
	                                (integer-floor
	                                 (/ (- days-from-first-purchase
	                                       days-from-last-purchase)
	                                    adjusted-purchase-count))
	  
	                                expected-purchase-in-days (- average-purchase-in-days
	                                                             days-from-last-purchase)
	  
	                                overdue-purchase? (< expected-purchase-in-days 1)
	  
	                               ;; Go from red to black over -1 to -30 days of overdue
	                               ;; purchase time
	                               ;; -1 = 88% 58%
	                               ;; -30 = 53% 29%
	                                text-color {:saturation-percent (integer-floor
	                                                                 (convert-range
	                                                                  expected-purchase-in-days
	                                                                  [-30 -1]
	                                                                  [88 58]))
	                                            :lightness-percent (integer-floor (convert-range
	                                                                               expected-purchase-in-days
	                                                                               [-30 -1]
	                                                                               [53 29]))}]
	  
	  
	                            [grocery-item {:purchase-count adjusted-purchase-count
	                                           :first-purchase-date first-purchase-date
	                                           :last-purchase-date last-purchase-date
	                                           :days-from-first-purchase days-from-first-purchase
	                                           :days-from-last-purchase days-from-last-purchase
	                                           :average-purchase-days average-purchase-in-days
	                                           :expected-purchase-in-days expected-purchase-in-days
	                                           :purchase-overdue? overdue-purchase?
	                                           :in-basket in-basket?
	                                           :text-color text-color
	                                           :purchase-data purchase-data}]))))]
	  
	  
	          (assoc {}
	                 :query-data (select-keys query-data
	                                          [:today-journal-day
	                                           :today
	                                           :today-journal-uuid])
	                 :query-results transformed-results))))
	  
	  
	    ;; :view :pprint
	    :view (letfn [(sanitize-string [s] (-> s
	                                           (clojure.string/replace " " "-")
	                                           (clojure.string/replace (re-pattern "\\[\\[") "")
	                                           (clojure.string/replace (re-pattern "\\]\\]") "")
	                                           (clojure.string/replace (re-pattern "[\\(\\)]") "")))
	                  (make-link [text journal-uuid class-addition]
	                    [:a
	                     {:class class-addition
	                      :on-click (fn []
	                                  (call-api
	                                   "append_block_in_page"
	                                   (str journal-uuid)
	                                   (str "TODO {{grocery}} " text)))}
	                     text])
	                  (make-icon [item-name]
	                    (let [icon-table {:cream "ef13"
	                                      :frozen-berries "f511"
	                                      :yogurt "f4c8"
	                                      :cat-food "f287"
	                                      :naan "efa3"
	                                      :patties "feb5"
	                                      :eggs "f500"
	                                      :water "ef0b"
	                                      :sour-cream "ee9f"
	                                      :milk "ef13"
	                                      :cheese "ef26"
	                                      :cheese-powder "ee92"
	                                      :cat-litter "f65b"
	                                      :salad "f50a"
	                                      :tomato-sauce "edbb"
	                                      :automatic-toilet-bowl-cleaner-pucks "efd3"
	                                      :fries "fae9"
	                                      :detergent "f30e"
	                                      :wax-paper "eb2f"
	                                      :perogies "feb5"
	                                      :potatoes "eb8a"
	                                      :sapporo-ramen-noodle "fd90"
	                                      :frozen-veg "f21c"
	                                      :butter "fab5"
	                                      :berries "f511"
	                                      :sodium-bicarbonate "ef16"
	                                      :peanut-oil "ef60"
	                                      :dried-meat "ef17"
	                                      :smokies "ef17"
	                                      :brioche-hotdog-buns "f3a5"
	                                      :sodium-bicarbonate-laundry-booster "f311"
	                                      :garbage-bags "f02f"
	                                      :downy-rinse-and-refresh-laundry-stripper "f311"
	                                      :borax-laundry-booster "f311"
	                                      :little-tissues "f4c9"}
	  
	                          sanitized-item-name (-> item-name
	                                                  (clojure.string/replace " " "-")
	                                                  (clojure.string/replace (re-pattern "\\[\\[") "")
	                                                  (clojure.string/replace (re-pattern "\\]\\]") "")
	                                                  (clojure.string/replace (re-pattern "[\\(\\)]") ""))
	                          icon-code (get icon-table
	                                         (keyword sanitized-item-name)
	                                         "0000")]
	                      (str "&#x" icon-code ";")))]
	  
	            (fn [results]
	              (let [query-data (get-in results [:query-data])
	                    query-results (get-in results [:query-results])]
	  
	                [:div
	                 [:table.future-appointments.more-compact.needs-disclosure-listener
	                  [:thead
	                   [:tr
	                    [:th.days-until ""]
	                    [:th "Item"]
	                    [:th.disclosure]]]
	                  [:tbody
	                   (for [[grocery-item item-data] query-results]
	                     (let [table-name (str "grocery-purchases")
	                           class-addition (if (:in-basket item-data)
	                                            "strikethrough"
	                                            "")
	                           sanitized-id (sanitize-string grocery-item)]
	                       [:<>
	                        [:tr
	                         [:td.days-until {:rowspan "2"}
	                          [:span {:class "bti bigger"
	                                  :dangerouslySetInnerHTML
	                                  {:__html (make-icon grocery-item)}}]]
	  
	                         [:td.touch-screen
	                          (make-link grocery-item
	                                     (get-in query-data
	                                             [:today-journal-uuid])
	                                     class-addition)]
	  
	                         [:td.touch-screen.ti.disclosure
	                          [:a.disclosure-trigger
	                           {:id (str table-name 
	                                     "-disclosure-trigger-" 
	                                     sanitized-id)
	                            :data-target (str table-name 
	                                              "-secondary-content-" 
	                                              sanitized-id)
	                            }
	                           (str "▼")]]]
	  
	                        [:tr
	                         [:td.closed.event-info.secondary-content
	                          {:colspan "2"
	                           :id (str table-name 
	                                    "-secondary-content-" 
	                                    sanitized-id)}
	                          [:div.quick-view-container
	                           [:span.content-slot
	                            (str "Purchased " (sanitize-string grocery-item) (:purchase-count item-data) " times.")]]]]]))]]]
	                            
	                            )))
	  
	  
	  
	  
	    :breadcrumb-show? false}
	  #+END_QUERY
- future-events-table
	- #+BEGIN_QUERY
	  ;; original ()not working)
	   {:inputs ["grocery" :today]
	    :query
	    [:find ?content ?journal-day ?today-journal-day ?today ?today-journal-uuid ?marker
	     :keys content journal-day today-journal-day today today-journal-uuid marker
	     :in $ ?macro-name ?today-journal-day %
	  
	     :where
	     [?b :block/marker ?marker]
	     ;;[(contains? #{"DONE"} ?marker)]
	     (using-macro ?b ?macro-name)
	  
	     [?b :block/content ?content]
	     [?b :block/page ?p]
	     [?p :block/journal-day ?journal-day]
	  
	     [?j :block/journal-day ?today-journal-day]
	     [?j :block/name ?today]
	     [?j :block/uuid ?today-journal-uuid]]
	  
	  
	    :rules
	    [[(using-macro ?b ?macro-name)
	      [?b :block/macros ?m]
	      [?m :block/properties ?props]
	      [(get ?props :logseq.macro-name) ?macros]
	      [(= ?macros ?macro-name)]]]
	  
	  
	    :result-transform
	    (letfn
	     [(convert-range [value [old-range-min old-range-max] [new-range-min new-range-max]]
	        ^{:doc "Given a value within a range, converts the value to a different range"
	          :example "(convert-range -4 [-30 0] [0 255]) ;; => 221"}
	        (+
	         (/
	          (*
	           (- value
	              old-range-min)
	                        ;; * 
	           (- new-range-max
	              new-range-min))
	                       ;;----------------
	          (- old-range-max
	             old-range-min))
	                       ;; +
	         new-range-min))
	  
	  
	  
	      (integer-floor
	        [number]
	        ^{:doc "Returns the largest double less than or equal to number,
	              and equal to a mathematical integer. Equivalent to clojure.math/floor"
	          :example "(integer-floor 11.1) => ;; => 11"}
	        (if (>= number 0)
	          (int number)
	          (dec (int number))))
	  
	  
	  
	      (number-absolute
	        [number]
	        ^{:doc "Returns the absolute value of a number. Equivalent to abs."
	          :example "(number-absolute -10) ;; => 10"}
	        (if (>= number 0)
	          number
	          (- number)))
	  
	  
	  
	      (date/today
	        []
	        ^{:doc "Returns today's date as an integer in the format YYYYMMDD.
	              Uses the datascript_query API to fetch the current date."
	          :example "(date/today) ; => 20240918"}
	        (let [query-result (call-api "datascript_query"
	                                     "[:find ?today :in $ ?today :where [_ :block/name _]]"
	                                     ":today")
	  
	              date-integer (read-string (apply
	                                         str
	                                         query-result))]
	          date-integer))
	  
	  
	  
	      (date/journal-day->julian-day
	        [year month day]
	        ^{:doc "Converts a Gregorian calendar date to a Julian day number.
	              This function is used for date calculations.
	              Parameters:
	                year: Integer representing the year
	                month: Integer representing the month (1-12)
	                day: Integer representing the day of the month
	              Returns: Integer representing the Julian day number"
	          :example "(date/journal-day->julian-day 2024 9 18) ; => 2460211"}
	        (let [adjustment (integer-floor (/ (- month
	                                              14)
	                                           12))
	  
	              adjusted-year (+ year
	                               4800
	                               adjustment)
	  
	              adjusted-month (+ month
	                                (* 12
	                                   adjustment)
	                                -3)]
	  
	          (+ (integer-floor (+ (* 365.25
	                                  adjusted-year)
	                               0.5))
	             (integer-floor (+ (* 30.6001
	                                  (+ adjusted-month
	                                     1))
	                               0.5))
	             day
	             -32075)))
	  
	  
	  
	      (date/get-difference
	        ([journal-day] (date/get-difference journal-day (date/today)))
	        ^{:doc "Calculates the absolute difference in days between a date and today.
	              Parameters:
	                journal-day: Integer representing a date in YYYYMMDD format."}
	        ([journal-day1 journal-day2]
	         ^{:doc "Calculates the absolute difference in days between two dates.
	              Parameters:
	                journal-day1: Integer representing a date in YYYYMMDD format
	                journal-day2: Integer representing a date in YYYYMMDD format
	              Returns: Integer representing the number of days between the two dates"
	           :example "(date/get-difference 20240918 20240610) ; => 100"}
	  
	         (let [extract-date (fn [date]
	                              [(quot date 10000)
	                               (rem (quot date 100) 100)
	                               (rem date 100)])
	               [year1 month1 day1] (extract-date
	                                    journal-day1)
	               [year2 month2 day2] (extract-date
	                                    journal-day2)
	               julian-day-number1 (date/journal-day->julian-day
	                                   year1
	                                   month1
	                                   day1)
	               julian-day-number2 (date/journal-day->julian-day
	                                   year2
	                                   month2
	                                   day2)]
	           (number-absolute (- julian-day-number1
	                               julian-day-number2)))))]
	  
	      (fn [results]
	        (let [first-line (fn [item]
	                           (if (clojure.string/index-of item "\n")
	                             (subs item 0 (clojure.string/index-of item "\n"))
	                             item))
	              query-data (first results)
	              query-results (map (fn [result]
	                                   (dissoc result :today-journal-day :today :today-journal-uuid))
	                                 results)
	              transformed-results
	              (->> query-results
	                   (map (fn [result]
	                          (update result :content
	                                  (fn [item]
	                                    (-> item
	                                        first-line
	                                        clojure.string/lower-case
	                                        (clojure.string/replace
	                                         (re-pattern "(?:done|todo) \\{\\{grocery\\}\\} ") "")
	                                        (clojure.string/replace (re-pattern "x\\d$") "")
	                                        clojure.string/trim)))))
	                   (group-by :content)
	  
	                   (sort-by (fn [[_ entries]]
	                              (count entries))
	                            >)
	  
	                   (map (fn [[grocery-item entries]]
	                          [grocery-item (map (fn [entry]
	                                               (dissoc entry :content))
	                                             entries)]))
	  
	                   (map (fn [[grocery-item purchase-data]]
	                          (let [in-basket?
	                                (some (fn [entry]
	                                        (=
	                                         (:marker entry)
	                                         "TODO"))
	                                      purchase-data)
	  
	                                first-purchase-date
	                                (->> purchase-data
	                                     (map :journal-day)
	                                     (apply min))
	  
	                                days-from-first-purchase ;;first-purchase-days
	                                (date/get-difference first-purchase-date)
	  
	                                last-purchase-date
	                                (->> purchase-data
	                                     (map :journal-day)
	                                     (apply max))
	  
	                                days-from-last-purchase ;;last-purchase-days
	                                (date/get-difference last-purchase-date)
	  
	                                purchase-count
	                                (count purchase-data)
	  
	                               ;; Don't count items on the list for purchase
	                               ;; because that's cheating.
	                                adjusted-purchase-count
	                                (if in-basket?
	                                  (dec purchase-count)
	                                  purchase-count)
	  
	                               ;; Average number of days between purchases beginning from
	                               ;; the first purchase and until the last purchase.
	                                average-purchase-in-days
	                                (integer-floor
	                                 (/ (- days-from-first-purchase
	                                       days-from-last-purchase)
	                                    adjusted-purchase-count))
	  
	                                expected-purchase-in-days (- average-purchase-in-days
	                                                             days-from-last-purchase)
	  
	                                overdue-purchase? (< expected-purchase-in-days 1)
	  
	                               ;; Go from red to black over -1 to -30 days of overdue
	                               ;; purchase time
	                               ;; -1 = 88% 58%
	                               ;; -30 = 53% 29%
	                                text-color {:saturation-percent (integer-floor
	                                                                 (convert-range
	                                                                  expected-purchase-in-days
	                                                                  [-30 -1]
	                                                                  [88 58]))
	                                            :lightness-percent (integer-floor (convert-range
	                                                                               expected-purchase-in-days
	                                                                               [-30 -1]
	                                                                               [53 29]))}]
	  
	  
	                            [grocery-item {:purchase-count adjusted-purchase-count
	                                           :first-purchase-date first-purchase-date
	                                           :last-purchase-date last-purchase-date
	                                           :days-from-first-purchase days-from-first-purchase
	                                           :days-from-last-purchase days-from-last-purchase
	                                           :average-purchase-days average-purchase-in-days
	                                           :expected-purchase-in-days expected-purchase-in-days
	                                           :purchase-overdue? overdue-purchase?
	                                           :in-basket in-basket?
	                                           :text-color text-color
	                                           :purchase-data purchase-data}]))))]
	  
	  
	          (assoc {}
	                 :query-data (select-keys query-data
	                                          [:today-journal-day
	                                           :today
	                                           :today-journal-uuid])
	                 :query-results transformed-results))))
	  
	  
	    ;; :view :pprint
	    :view (letfn [(sanitize-string [s] (-> s
	                                           (clojure.string/replace " " "-")
	                                           (clojure.string/replace (re-pattern "\\[\\[") "")
	                                           (clojure.string/replace (re-pattern "\\]\\]") "")
	                                           (clojure.string/replace (re-pattern "[\\(\\)]") "")))
	                  (make-link [text journal-uuid class-addition]
	                    [:a
	                     {:class class-addition
	                      :on-click (fn []
	                                  (call-api
	                                   "append_block_in_page"
	                                   (str journal-uuid)
	                                   (str "TODO {{grocery}} " text)))}
	                     text])
	                  (make-icon [item-name]
	                    (let [icon-table {:cream "ef13"
	                                      :frozen-berries "f511"
	                                      :yogurt "f4c8"
	                                      :cat-food "f287"
	                                      :naan "efa3"
	                                      :patties "feb5"
	                                      :eggs "f500"
	                                      :water "ef0b"
	                                      :sour-cream "ee9f"
	                                      :milk "ef13"
	                                      :cheese "ef26"
	                                      :cheese-powder "ee92"
	                                      :cat-litter "f65b"
	                                      :salad "f50a"
	                                      :tomato-sauce "edbb"
	                                      :automatic-toilet-bowl-cleaner-pucks "efd3"
	                                      :fries "fae9"
	                                      :detergent "f30e"
	                                      :wax-paper "eb2f"
	                                      :perogies "feb5"
	                                      :potatoes "eb8a"
	                                      :sapporo-ramen-noodle "fd90"
	                                      :frozen-veg "f21c"
	                                      :butter "fab5"
	                                      :berries "f511"
	                                      :sodium-bicarbonate "ef16"
	                                      :peanut-oil "ef60"
	                                      :dried-meat "ef17"
	                                      :smokies "ef17"
	                                      :brioche-hotdog-buns "f3a5"
	                                      :sodium-bicarbonate-laundry-booster "f311"
	                                      :garbage-bags "f02f"
	                                      :downy-rinse-and-refresh-laundry-stripper "f311"
	                                      :borax-laundry-booster "f311"
	                                      :little-tissues "f4c9"}
	  
	                          sanitized-item-name (-> item-name
	                                                  (clojure.string/replace " " "-")
	                                                  (clojure.string/replace (re-pattern "\\[\\[") "")
	                                                  (clojure.string/replace (re-pattern "\\]\\]") "")
	                                                  (clojure.string/replace (re-pattern "[\\(\\)]") ""))
	                          icon-code (get icon-table
	                                         (keyword sanitized-item-name)
	                                         "0000")]
	                      (str "&#x" icon-code ";")))]
	  
	            (fn [results]
	              (let [query-data (get-in results [:query-data])
	                    query-results (get-in results [:query-results])]
	  
	                [:div
	                 [:table.future-event-table.compact.more-compact.needs-disclosure-listener
	                  [:thead
	                   [:tr
	                    [:th.days-until ""]
	                    [:th "Item"]
	                    [:th.disclosure]]]
	                  [:tbody
	                   (for [[grocery-item item-data] query-results]
	                     (let [table-name (str "grocery-purchases")
	                           class-addition (if (:in-basket item-data)
	                                            "strikethrough"
	                                            "")
	                           sanitized-id (sanitize-string grocery-item)]
	                       [:<>
	                        [:tr
	                         [:td.days-until {:rowspan "2"}
	                          [:span {:class "bti bigger"
	                                  :dangerouslySetInnerHTML
	                                  {:__html (make-icon grocery-item)}}]]
	  
	                         [:td.touch-screen
	                          (make-link grocery-item
	                                     (get-in query-data
	                                             [:today-journal-uuid])
	                                     class-addition)]
	  
	                         [:td.touch-screen.ti.disclosure
	                          [:a.disclosure-trigger
	                           {:id (str table-name 
	                                     "-disclosure-trigger-" 
	                                     sanitized-id)
	                            :data-target (str table-name 
	                                              "-secondary-content-" 
	                                              sanitized-id)
	                            }
	                           (str "▼")]]]
	  
	                        [:tr
	                         [:td.closed.event-info.secondary-content
	                          {:colspan "2"
	                           :id (str table-name 
	                                    "-secondary-content-" 
	                                    sanitized-id)}
	                          [:div.quick-view-container
	                           [:span.content-slot
	                            (str "Purchased " (sanitize-string grocery-item) (:purchase-count item-data) " times.")]]]]]))]]]
	                            
	                            )))
	  
	  
	  
	  
	    :breadcrumb-show? false}
	  #+END_QUERY
- ```clj :results
  (def data {:text-color {:saturation-percent 62, :lightness-percent 32}})
  (:text-color data)
  ```
- fet 2
	- #+BEGIN_QUERY
	  ;; original ()not working)
	   {:inputs ["grocery" :today]
	    :query
	    [:find ?content ?journal-day ?today-journal-day ?today ?today-journal-uuid ?marker
	     :keys content journal-day today-journal-day today today-journal-uuid marker
	     :in $ ?macro-name ?today-journal-day %
	  
	     :where
	     [?b :block/marker ?marker]
	     ;;[(contains? #{"DONE"} ?marker)]
	     (using-macro ?b ?macro-name)
	  
	     [?b :block/content ?content]
	     [?b :block/page ?p]
	     [?p :block/journal-day ?journal-day]
	  
	     [?j :block/journal-day ?today-journal-day]
	     [?j :block/name ?today]
	     [?j :block/uuid ?today-journal-uuid]]
	  
	  
	    :rules
	    [[(using-macro ?b ?macro-name)
	      [?b :block/macros ?m]
	      [?m :block/properties ?props]
	      [(get ?props :logseq.macro-name) ?macros]
	      [(= ?macros ?macro-name)]]]
	  
	  
	    :result-transform
	    (letfn
	     [(convert-range [value [old-range-min old-range-max] [new-range-min new-range-max]]
	        ^{:doc "Given a value within a range, converts the value to a different range"
	          :example "(convert-range -4 [-30 0] [0 255]) ;; => 221"}
	        (+
	         (/
	          (*
	           (- value
	              old-range-min)
	                        ;; * 
	           (- new-range-max
	              new-range-min))
	                       ;;----------------
	          (- old-range-max
	             old-range-min))
	                       ;; +
	         new-range-min))
	  
	  
	  
	      (integer-floor
	        [number]
	        ^{:doc "Returns the largest double less than or equal to number,
	              and equal to a mathematical integer. Equivalent to clojure.math/floor"
	          :example "(integer-floor 11.1) => ;; => 11"}
	        (if (>= number 0)
	          (int number)
	          (dec (int number))))
	  
	  
	  
	      (number-absolute
	        [number]
	        ^{:doc "Returns the absolute value of a number. Equivalent to abs."
	          :example "(number-absolute -10) ;; => 10"}
	        (if (>= number 0)
	          number
	          (- number)))
	  
	  
	  
	      (date/today
	        []
	        ^{:doc "Returns today's date as an integer in the format YYYYMMDD.
	              Uses the datascript_query API to fetch the current date."
	          :example "(date/today) ; => 20240918"}
	        (let [query-result (call-api "datascript_query"
	                                     "[:find ?today :in $ ?today :where [_ :block/name _]]"
	                                     ":today")
	  
	              date-integer (read-string (apply
	                                         str
	                                         query-result))]
	          date-integer))
	  
	  
	  
	      (date/journal-day->julian-day
	        [year month day]
	        ^{:doc "Converts a Gregorian calendar date to a Julian day number.
	              This function is used for date calculations.
	              Parameters:
	                year: Integer representing the year
	                month: Integer representing the month (1-12)
	                day: Integer representing the day of the month
	              Returns: Integer representing the Julian day number"
	          :example "(date/journal-day->julian-day 2024 9 18) ; => 2460211"}
	        (let [adjustment (integer-floor (/ (- month
	                                              14)
	                                           12))
	  
	              adjusted-year (+ year
	                               4800
	                               adjustment)
	  
	              adjusted-month (+ month
	                                (* 12
	                                   adjustment)
	                                -3)]
	  
	          (+ (integer-floor (+ (* 365.25
	                                  adjusted-year)
	                               0.5))
	             (integer-floor (+ (* 30.6001
	                                  (+ adjusted-month
	                                     1))
	                               0.5))
	             day
	             -32075)))
	  
	  
	  
	      (date/get-difference
	        ([journal-day] (date/get-difference journal-day (date/today)))
	        ^{:doc "Calculates the absolute difference in days between a date and today.
	              Parameters:
	                journal-day: Integer representing a date in YYYYMMDD format."}
	        ([journal-day1 journal-day2]
	         ^{:doc "Calculates the absolute difference in days between two dates.
	              Parameters:
	                journal-day1: Integer representing a date in YYYYMMDD format
	                journal-day2: Integer representing a date in YYYYMMDD format
	              Returns: Integer representing the number of days between the two dates"
	           :example "(date/get-difference 20240918 20240610) ; => 100"}
	  
	         (let [extract-date (fn [date]
	                              [(quot date 10000)
	                               (rem (quot date 100) 100)
	                               (rem date 100)])
	               [year1 month1 day1] (extract-date
	                                    journal-day1)
	               [year2 month2 day2] (extract-date
	                                    journal-day2)
	               julian-day-number1 (date/journal-day->julian-day
	                                   year1
	                                   month1
	                                   day1)
	               julian-day-number2 (date/journal-day->julian-day
	                                   year2
	                                   month2
	                                   day2)]
	           (number-absolute (- julian-day-number1
	                               julian-day-number2)))))]
	  
	      (fn [results]
	        (let [first-line (fn [item]
	                           (if (clojure.string/index-of item "\n")
	                             (subs item 0 (clojure.string/index-of item "\n"))
	                             item))
	              query-data (first results)
	              query-results (map (fn [result]
	                                   (dissoc result :today-journal-day :today :today-journal-uuid))
	                                 results)
	              transformed-results
	              (->> query-results
	                   (map (fn [result]
	                          (update result :content
	                                  (fn [item]
	                                    (-> item
	                                        first-line
	                                        clojure.string/lower-case
	                                        (clojure.string/replace
	                                         (re-pattern "(?:done|todo) \\{\\{grocery\\}\\} ") "")
	                                        (clojure.string/replace (re-pattern "x\\d$") "")
	                                        clojure.string/trim)))))
	                   (group-by :content)
	  
	                   (sort-by (fn [[_ entries]]
	                              (count entries))
	                            >)
	  
	                   (map (fn [[grocery-item entries]]
	                          [grocery-item (map (fn [entry]
	                                               (dissoc entry :content))
	                                             entries)]))
	  
	                   (map (fn [[grocery-item purchase-data]]
	                          (let [in-basket?
	                                (some (fn [entry]
	                                        (=
	                                         (:marker entry)
	                                         "TODO"))
	                                      purchase-data)
	  
	                                first-purchase-date
	                                (->> purchase-data
	                                     (map :journal-day)
	                                     (apply min))
	  
	                                days-from-first-purchase ;;first-purchase-days
	                                (date/get-difference first-purchase-date)
	  
	                                last-purchase-date
	                                (->> purchase-data
	                                     (filter (fn [m]
	                                               (= (:marker m) "DONE")))
	                                     (map :journal-day)
	                                     (apply max))
	  
	                                days-from-last-purchase ;;last-purchase-days
	                                (date/get-difference last-purchase-date)
	  
	                                purchase-count
	                                (count purchase-data)
	  
	                               ;; Don't count items on the list for purchase
	                               ;; because that's cheating.
	                                adjusted-purchase-count
	                                (if in-basket?
	                                  (dec purchase-count)
	                                  purchase-count)
	  
	                               ;; Average number of days between purchases beginning from
	                               ;; the first purchase and until the last purchase.
	                                average-purchase-in-days
	                                (integer-floor
	                                 (/ (- days-from-first-purchase
	                                       days-from-last-purchase)
	                                    adjusted-purchase-count))
	  
	                                expected-purchase-in-days (- average-purchase-in-days
	                                                             days-from-last-purchase)
	  
	                                overdue-purchase? (< expected-purchase-in-days 1)
	  
	                               ;; Go from red to black over -1 to -30 days of overdue
	                               ;; purchase time
	                               ;; -1 = 88% 58%
	                               ;; -30 = 53% 29%
	                                text-color {:saturation-percent (integer-floor
	                                                                 (convert-range
	                                                                  expected-purchase-in-days
	                                                                  [-30 -1]
	                                                                  [88 58]))
	                                            :lightness-percent (integer-floor (convert-range
	                                                                               expected-purchase-in-days
	                                                                               [-30 -1]
	                                                                               [53 29]))}]
	  
	  
	                            [grocery-item {:purchase-count adjusted-purchase-count
	                                           :first-purchase-date first-purchase-date
	                                           :last-purchase-date last-purchase-date
	                                           :days-from-first-purchase days-from-first-purchase
	                                           :days-from-last-purchase days-from-last-purchase
	                                           :average-purchase-days average-purchase-in-days
	                                           :expected-purchase-in-days expected-purchase-in-days
	                                           :purchase-overdue? overdue-purchase?
	                                           :in-basket in-basket?
	                                           :text-color text-color
	                                           :purchase-data purchase-data}]))))]
	  
	  
	          (assoc {}
	                 :query-data (select-keys query-data
	                                          [:today-journal-day
	                                           :today
	                                           :today-journal-uuid])
	                 :query-results transformed-results))))
	  
	  
	     :view :pprint
	  
	  
	  
	  
	    :breadcrumb-show? false}
	  #+END_QUERY
- #+BEGIN_QUERY
  ;; original ()not working)
   {:inputs ["grocery" :today]
    :query
    [:find ?content ?journal-day ?today-journal-day ?today ?today-journal-uuid ?marker
     :keys content journal-day today-journal-day today today-journal-uuid marker
     :in $ ?macro-name ?today-journal-day %
  
     :where
     [?b :block/marker ?marker]
     ;;[(contains? #{"DONE"} ?marker)]
     (using-macro ?b ?macro-name)
  
     [?b :block/content ?content]
     [?b :block/page ?p]
     [?p :block/journal-day ?journal-day]
  
     [?j :block/journal-day ?today-journal-day]
     [?j :block/name ?today]
     [?j :block/uuid ?today-journal-uuid]]
  
  
    :rules
    [[(using-macro ?b ?macro-name)
      [?b :block/macros ?m]
      [?m :block/properties ?props]
      [(get ?props :logseq.macro-name) ?macros]
      [(= ?macros ?macro-name)]]]
  
  
    :result-transform
    (letfn
     [(convert-range [value [old-range-min old-range-max] [new-range-min new-range-max]]
        ^{:doc "Given a value within a range, converts the value to a different range"
          :example "(convert-range -4 [-30 0] [0 255]) ;; => 221"}
        (+
         (/
          (*
           (- value
              old-range-min)
                        ;; * 
           (- new-range-max
              new-range-min))
                       ;;----------------
          (- old-range-max
             old-range-min))
                       ;; +
         new-range-min))
  
  
  
      (integer-floor
        [number]
        ^{:doc "Returns the largest double less than or equal to number,
              and equal to a mathematical integer. Equivalent to clojure.math/floor"
          :example "(integer-floor 11.1) => ;; => 11"}
        (if (>= number 0)
          (int number)
          (dec (int number))))
  
  
  
      (number-absolute
        [number]
        ^{:doc "Returns the absolute value of a number. Equivalent to abs."
          :example "(number-absolute -10) ;; => 10"}
        (if (>= number 0)
          number
          (- number)))
  
  
  
      (date/today
        []
        ^{:doc "Returns today's date as an integer in the format YYYYMMDD.
              Uses the datascript_query API to fetch the current date."
          :example "(date/today) ; => 20240918"}
        (let [query-result (call-api "datascript_query"
                                     "[:find ?today :in $ ?today :where [_ :block/name _]]"
                                     ":today")
  
              date-integer (read-string (apply
                                         str
                                         query-result))]
          date-integer))
  
  
  
      (date/journal-day->julian-day
        [year month day]
        ^{:doc "Converts a Gregorian calendar date to a Julian day number.
              This function is used for date calculations.
              Parameters:
                year: Integer representing the year
                month: Integer representing the month (1-12)
                day: Integer representing the day of the month
              Returns: Integer representing the Julian day number"
          :example "(date/journal-day->julian-day 2024 9 18) ; => 2460211"}
        (let [adjustment (integer-floor (/ (- month
                                              14)
                                           12))
  
              adjusted-year (+ year
                               4800
                               adjustment)
  
              adjusted-month (+ month
                                (* 12
                                   adjustment)
                                -3)]
  
          (+ (integer-floor (+ (* 365.25
                                  adjusted-year)
                               0.5))
             (integer-floor (+ (* 30.6001
                                  (+ adjusted-month
                                     1))
                               0.5))
             day
             -32075)))
  
  
  
      (date/get-difference
        ([journal-day] (date/get-difference journal-day (date/today)))
        ^{:doc "Calculates the absolute difference in days between a date and today.
              Parameters:
                journal-day: Integer representing a date in YYYYMMDD format."}
        ([journal-day1 journal-day2]
         ^{:doc "Calculates the absolute difference in days between two dates.
              Parameters:
                journal-day1: Integer representing a date in YYYYMMDD format
                journal-day2: Integer representing a date in YYYYMMDD format
              Returns: Integer representing the number of days between the two dates"
           :example "(date/get-difference 20240918 20240610) ; => 100"}
  
         (let [extract-date (fn [date]
                              [(quot date 10000)
                               (rem (quot date 100) 100)
                               (rem date 100)])
               [year1 month1 day1] (extract-date
                                    journal-day1)
               [year2 month2 day2] (extract-date
                                    journal-day2)
               julian-day-number1 (date/journal-day->julian-day
                                   year1
                                   month1
                                   day1)
               julian-day-number2 (date/journal-day->julian-day
                                   year2
                                   month2
                                   day2)]
           (number-absolute (- julian-day-number1
                               julian-day-number2)))))]
  
      (fn [results]
        (let [first-line (fn [item]
                           (if (clojure.string/index-of item "\n")
                             (subs item 0 (clojure.string/index-of item "\n"))
                             item))
              query-data (first results)
              query-results (map (fn [result]
                                   (dissoc result :today-journal-day :today :today-journal-uuid))
                                 results)
              transformed-results
              (->> query-results
                   (map (fn [result]
                          (update result :content
                                  (fn [item]
                                    (-> item
                                        first-line
                                        clojure.string/lower-case
                                        (clojure.string/replace
                                         (re-pattern "(?:done|todo) \\{\\{grocery\\}\\} ") "")
                                        (clojure.string/replace (re-pattern "x\\d$") "")
                                        clojure.string/trim)))))
                   (group-by :content)
  
                   (sort-by (fn [[_ entries]]
                              (count entries))
                            >)
  
                   (map (fn [[grocery-item entries]]
                          [grocery-item (map (fn [entry]
                                               (dissoc entry :content))
                                             entries)]))
  
                   (map (fn [[grocery-item purchase-data]]
                          (let [in-basket?
                                (some (fn [entry]
                                        (=
                                         (:marker entry)
                                         "TODO"))
                                      purchase-data)
  
                                first-purchase-date
                                (->> purchase-data
                                     (map :journal-day)
                                     (apply min))
  
                                days-from-first-purchase ;;first-purchase-days
                                (date/get-difference first-purchase-date)
  
                                last-purchase-date
                                (->> purchase-data
                                     (filter (fn [m]
                                               (= (:marker m) "DONE")))
                                     (map :journal-day)
                                     (apply max))
  
                                days-from-last-purchase ;;last-purchase-days
                                (date/get-difference last-purchase-date)
  
                                purchase-count
                                (count purchase-data)
  
                               ;; Don't count items on the list for purchase
                               ;; because that's cheating.
                                adjusted-purchase-count
                                (if in-basket?
                                  (dec purchase-count)
                                  purchase-count)
  
                               ;; Average number of days between purchases beginning from
                               ;; the first purchase and until the last purchase.
                                average-purchase-in-days
                                (integer-floor
                                 (/ (- days-from-first-purchase
                                       days-from-last-purchase)
                                    adjusted-purchase-count))
  
                                expected-purchase-in-days (- average-purchase-in-days
                                                             days-from-last-purchase)
  
                                overdue-purchase? (< expected-purchase-in-days 1)
  
                               ;; Go from red to black over -1 to -30 days of overdue
                               ;; purchase time
                               ;; -1 = 88% 58%
                               ;; -30 = 53% 29%
                                text-color {:saturation-percent (integer-floor
                                                                 (convert-range
                                                                  expected-purchase-in-days
                                                                  [-30 -1]
                                                                  [88 58]))
                                            :lightness-percent (integer-floor (convert-range
                                                                               expected-purchase-in-days
                                                                               [-30 -1]
                                                                               [53 29]))}]
  
  
                            [grocery-item {:purchase-count adjusted-purchase-count
                                           :first-purchase-date first-purchase-date
                                           :last-purchase-date last-purchase-date
                                           :days-from-first-purchase days-from-first-purchase
                                           :days-from-last-purchase days-from-last-purchase
                                           :average-purchase-days average-purchase-in-days
                                           :expected-purchase-in-days expected-purchase-in-days
                                           :purchase-overdue? overdue-purchase?
                                           :in-basket in-basket?
                                           :text-color text-color
                                           :purchase-data purchase-data}]))))]
  
  
          (assoc {}
                 :query-data (select-keys query-data
                                          [:today-journal-day
                                           :today
                                           :today-journal-uuid])
                 :query-results transformed-results))))
  
  
    ;;  :view :pprint
  
    :view (letfn [(sanitize-string [s] (-> s
                                           (clojure.string/replace " " "-")
                                           (clojure.string/replace (re-pattern "\\[\\[") "")
                                           (clojure.string/replace (re-pattern "\\]\\]") "")
                                           (clojure.string/replace (re-pattern "[\\(\\)]") "")))
                  (make-link ([text journal-uuid class-addition]
                    [:a
                     {:class class-addition
                      :on-click (fn []
                                  (call-api
                                   "append_block_in_page"
                                   (str journal-uuid)
                                   (str "TODO {{grocery}} " text)))}
                     text])
                             ([text journal-uuid class-addition hsl-map]
                              [:a
                               {:class class-addition
                                ;; :style (str "color: hsl(0, "
                                ;;             (:saturation-percent hsl-map)
                                ;;             "%, "
                                ;;             (:lightness-percent hsl-map)
                                ;;             "%);")
                                :on-click (fn []
                                            (call-api
                                             "append_block_in_page"
                                             (str journal-uuid)
                                             (str "TODO {{grocery}} " text)))
                                }
                               text])
                             )
                  (make-icon [item-name]
                    (let [icon-table {:cream "ef13"
                                      :frozen-berries "f511"
                                      :yogurt "f4c8"
                                      :cat-food "f287"
                                      :naan "efa3"
                                      :patties "feb5"
                                      :eggs "f500"
                                      :water "ef0b"
                                      :sour-cream "ee9f"
                                      :milk "ef13"
                                      :cheese "ef26"
                                      :cheese-powder "ee92"
                                      :cat-litter "f65b"
                                      :salad "f50a"
                                      :tomato-sauce "edbb"
                                      :automatic-toilet-bowl-cleaner-pucks "efd3"
                                      :fries "fae9"
                                      :detergent "f30e"
                                      :wax-paper "eb2f"
                                      :perogies "feb5"
                                      :potatoes "eb8a"
                                      :sapporo-ramen-noodle "fd90"
                                      :frozen-veg "f21c"
                                      :butter "fab5"
                                      :berries "f511"
                                      :sodium-bicarbonate "ef16"
                                      :peanut-oil "ef60"
                                      :dried-meat "ef17"
                                      :smokies "ef17"
                                      :brioche-hotdog-buns "f3a5"
                                      :sodium-bicarbonate-laundry-booster "f311"
                                      :garbage-bags "f02f"
                                      :downy-rinse-and-refresh-laundry-stripper "f311"
                                      :borax-laundry-booster "f311"
                                      :little-tissues "f4c9"}
    
                          sanitized-item-name (-> item-name
                                                  (clojure.string/replace " " "-")
                                                  (clojure.string/replace (re-pattern "\\[\\[") "")
                                                  (clojure.string/replace (re-pattern "\\]\\]") "")
                                                  (clojure.string/replace (re-pattern "[\\(\\)]") ""))
                          icon-code (get icon-table
                                         (keyword sanitized-item-name)
                                         "0000")]
                      (str "&#x" icon-code ";")))]
    
            (fn [results]
              (let [query-data (get-in results [:query-data])
                    query-results (get-in results [:query-results])]
    
                [:div
                 [:table.display-table.compact.more-compact.needs-disclosure-listener
                  [:thead
                   [:tr
                    [:th.left-column ""]
                    [:th "Item"]
                    [:th.disclosure]]]
                  [:tbody
                   (for [[grocery-item item-data] query-results]
                     (let [table-name (str "grocery-purchases")
                           class-addition (if (:in-basket item-data)
                                            "strikethrough"
                                            "")
                           sanitized-id (sanitize-string grocery-item)]
                       [:<>
                        [:tr
                         [:td.left-column {:rowspan "2"}
                          [:span {:class "bti bigger"
                                  :dangerouslySetInnerHTML
                                  {:__html (make-icon grocery-item)}}]]
    
                         [:td.touch-screen 
                          (make-link grocery-item
                                     (get-in query-data
                                             [:today-journal-uuid])
                                     class-addition
                                     (:text-color item-data))]
    
                         [:td.touch-screen.ti
                          [:a.disclosure-trigger
                           {:id (str table-name
                                     "-disclosure-trigger-"
                                     sanitized-id)
                            :data-target (str table-name
                                              "-secondary-content-"
                                              sanitized-id)}
                           (str "▼")]]]
    
                        [:tr
                         [:td.closed.event-info.secondary-content
                          {:colspan "2"
                           :id (str table-name
                                    "-secondary-content-"
                                    sanitized-id)}
                          [:div.quick-view-container
                           [:span.content-slot
                            (str "Purchased "
                                 (sanitize-string grocery-item)
                                 " "
                                 (:purchase-count item-data)
                                 " times.")
                            [:br]
                            (str "on average every "
                                 (:average-purchase-days item-data)
                                 " days,")
                            [:br]
                            (str "last "
                                 (:days-from-last-purchase item-data)
                                 " days ago.")]]]]]))]]])))
  
  
  
  
    :breadcrumb-show? false}
  #+END_QUERY
- #+BEGIN_QUERY
  ;; original ()not working)
   {:inputs ["grocery" :today]
    :query
    [:find ?content ?journal-day ?today-journal-day ?today ?today-journal-uuid ?marker
     :keys content journal-day today-journal-day today today-journal-uuid marker
     :in $ ?macro-name ?today-journal-day %
  
     :where
     [?b :block/marker ?marker]
     ;;[(contains? #{"DONE"} ?marker)]
     (using-macro ?b ?macro-name)
  
     [?b :block/content ?content]
     [?b :block/page ?p]
     [?p :block/journal-day ?journal-day]
  
     [?j :block/journal-day ?today-journal-day]
     [?j :block/name ?today]
     [?j :block/uuid ?today-journal-uuid]]
  
  
    :rules
    [[(using-macro ?b ?macro-name)
      [?b :block/macros ?m]
      [?m :block/properties ?props]
      [(get ?props :logseq.macro-name) ?macros]
      [(= ?macros ?macro-name)]]]
  
  
    :result-transform
    (letfn
     [(convert-range [value [old-range-min old-range-max] [new-range-min new-range-max]]
        ^{:doc "Given a value within a range, converts the value to a different range"
          :example "(convert-range -4 [-30 0] [0 255]) ;; => 221"}
        (+
         (/
          (*
           (- value
              old-range-min)
                        ;; * 
           (- new-range-max
              new-range-min))
                       ;;----------------
          (- old-range-max
             old-range-min))
                       ;; +
         new-range-min))
  
  
  
      (integer-floor
        [number]
        ^{:doc "Returns the largest double less than or equal to number,
              and equal to a mathematical integer. Equivalent to clojure.math/floor"
          :example "(integer-floor 11.1) => ;; => 11"}
        (if (>= number 0)
          (int number)
          (dec (int number))))
  
  
  
      (number-absolute
        [number]
        ^{:doc "Returns the absolute value of a number. Equivalent to abs."
          :example "(number-absolute -10) ;; => 10"}
        (if (>= number 0)
          number
          (- number)))
  
  
  
      (date/today
        []
        ^{:doc "Returns today's date as an integer in the format YYYYMMDD.
              Uses the datascript_query API to fetch the current date."
          :example "(date/today) ; => 20240918"}
        (let [query-result (call-api "datascript_query"
                                     "[:find ?today :in $ ?today :where [_ :block/name _]]"
                                     ":today")
  
              date-integer (read-string (apply
                                         str
                                         query-result))]
          date-integer))
  
  
  
      (date/journal-day->julian-day
        [year month day]
        ^{:doc "Converts a Gregorian calendar date to a Julian day number.
              This function is used for date calculations.
              Parameters:
                year: Integer representing the year
                month: Integer representing the month (1-12)
                day: Integer representing the day of the month
              Returns: Integer representing the Julian day number"
          :example "(date/journal-day->julian-day 2024 9 18) ; => 2460211"}
        (let [adjustment (integer-floor (/ (- month
                                              14)
                                           12))
  
              adjusted-year (+ year
                               4800
                               adjustment)
  
              adjusted-month (+ month
                                (* 12
                                   adjustment)
                                -3)]
  
          (+ (integer-floor (+ (* 365.25
                                  adjusted-year)
                               0.5))
             (integer-floor (+ (* 30.6001
                                  (+ adjusted-month
                                     1))
                               0.5))
             day
             -32075)))
  
  
  
      (date/get-difference
        ([journal-day] (date/get-difference journal-day (date/today)))
        ^{:doc "Calculates the absolute difference in days between a date and today.
              Parameters:
                journal-day: Integer representing a date in YYYYMMDD format."}
        ([journal-day1 journal-day2]
         ^{:doc "Calculates the absolute difference in days between two dates.
              Parameters:
                journal-day1: Integer representing a date in YYYYMMDD format
                journal-day2: Integer representing a date in YYYYMMDD format
              Returns: Integer representing the number of days between the two dates"
           :example "(date/get-difference 20240918 20240610) ; => 100"}
  
         (let [extract-date (fn [date]
                              [(quot date 10000)
                               (rem (quot date 100) 100)
                               (rem date 100)])
               [year1 month1 day1] (extract-date
                                    journal-day1)
               [year2 month2 day2] (extract-date
                                    journal-day2)
               julian-day-number1 (date/journal-day->julian-day
                                   year1
                                   month1
                                   day1)
               julian-day-number2 (date/journal-day->julian-day
                                   year2
                                   month2
                                   day2)]
           (number-absolute (- julian-day-number1
                               julian-day-number2)))))]
  
      (fn [results]
        (let [first-line (fn [item]
                           (if (clojure.string/index-of item "\n")
                             (subs item 0 (clojure.string/index-of item "\n"))
                             item))
              query-data (first results)
              query-results (map (fn [result]
                                   (dissoc result :today-journal-day :today :today-journal-uuid))
                                 results)
              transformed-results
              (->> query-results
                   (map (fn [result]
                          (update result :content
                                  (fn [item]
                                    (-> item
                                        first-line
                                        clojure.string/lower-case
                                        (clojure.string/replace
                                         (re-pattern "(?:done|todo) \\{\\{grocery\\}\\} ") "")
                                        (clojure.string/replace (re-pattern "x\\d$") "")
                                        clojure.string/trim)))))
                   (group-by :content)
  
                   (sort-by (fn [[_ entries]]
                              (count entries))
                            >)
  
                   (map (fn [[grocery-item entries]]
                          [grocery-item (map (fn [entry]
                                               (dissoc entry :content))
                                             entries)]))
  
                   (map (fn [[grocery-item purchase-data]]
                          (let [in-basket?
                                (some (fn [entry]
                                        (=
                                         (:marker entry)
                                         "TODO"))
                                      purchase-data)
  
                                first-purchase-date
                                (->> purchase-data
                                     (map :journal-day)
                                     (apply min))
  
                                days-from-first-purchase ;;first-purchase-days
                                (date/get-difference first-purchase-date)
  
                                last-purchase-date
                                (->> purchase-data
                                     (filter (fn [m]
                                               (= (:marker m) "DONE")))
                                     (map :journal-day)
                                     (apply max))
  
                                days-from-last-purchase ;;last-purchase-days
                                (date/get-difference last-purchase-date)
  
                                purchase-count
                                (count purchase-data)
  
                               ;; Don't count items on the list for purchase
                               ;; because that's cheating.
                                adjusted-purchase-count
                                (if in-basket?
                                  (dec purchase-count)
                                  purchase-count)
  
                               ;; Average number of days between purchases beginning from
                               ;; the first purchase and until the last purchase.
                                average-purchase-in-days
                                (integer-floor
                                 (/ (- days-from-first-purchase
                                       days-from-last-purchase)
                                    adjusted-purchase-count))
  
                                expected-purchase-in-days (- average-purchase-in-days
                                                             days-from-last-purchase)
  
                                overdue-purchase? (< expected-purchase-in-days 1)
  
                               ;; Go from red to black over -1 to -30 days of overdue
                               ;; purchase time
                               ;; -1 = 88% 58%
                               ;; -30 = 53% 29%
                                text-color {:saturation-percent (integer-floor
                                                                 (convert-range
                                                                  expected-purchase-in-days
                                                                  [-30 -1]
                                                                  [88 58]))
                                            :lightness-percent (integer-floor (convert-range
                                                                               expected-purchase-in-days
                                                                               [-30 -1]
                                                                               [53 29]))}]
  
  
                            [grocery-item {:purchase-count adjusted-purchase-count
                                           :first-purchase-date first-purchase-date
                                           :last-purchase-date last-purchase-date
                                           :days-from-first-purchase days-from-first-purchase
                                           :days-from-last-purchase days-from-last-purchase
                                           :average-purchase-days average-purchase-in-days
                                           :expected-purchase-in-days expected-purchase-in-days
                                           :purchase-overdue? overdue-purchase?
                                           :in-basket in-basket?
                                           :text-color text-color
                                           :purchase-data purchase-data}]))))]
  
  
          (assoc {}
                 :query-data (select-keys query-data
                                          [:today-journal-day
                                           :today
                                           :today-journal-uuid])
                 :query-results transformed-results))))
  
  
    ;;  :view :pprint
  
    :view (letfn [(sanitize-string [s] (-> s
                                           (clojure.string/replace " " "-")
                                           (clojure.string/replace (re-pattern "\\[\\[") "")
                                           (clojure.string/replace (re-pattern "\\]\\]") "")
                                           (clojure.string/replace (re-pattern "[\\(\\)]") "")))
                  (make-link ([text journal-uuid class-addition]
                    [:a
                     {:class class-addition
                      :on-click (fn []
                                  (call-api
                                   "append_block_in_page"
                                   (str journal-uuid)
                                   (str "TODO {{grocery}} " text)))}
                     text])
                             ([text journal-uuid class-addition hsl-map]
                              [:a
                               {:class class-addition
                                :style (str "color: hsl(0, "
                                            (:saturation-percent hsl-map)
                                            "%, "
                                            (:lightness-percent hsl-map)
                                            "%);")
                                :on-click (fn []
                                            (call-api
                                             "append_block_in_page"
                                             (str journal-uuid)
                                             (str "TODO {{grocery}} " text)))}
                               text])
                             )
                  (make-icon [item-name]
                    (let [icon-table {:cream "ef13"
                                      :frozen-berries "f511"
                                      :yogurt "f4c8"
                                      :cat-food "f287"
                                      :naan "efa3"
                                      :patties "feb5"
                                      :eggs "f500"
                                      :water "ef0b"
                                      :sour-cream "ee9f"
                                      :milk "ef13"
                                      :cheese "ef26"
                                      :cheese-powder "ee92"
                                      :cat-litter "f65b"
                                      :salad "f50a"
                                      :tomato-sauce "edbb"
                                      :automatic-toilet-bowl-cleaner-pucks "efd3"
                                      :fries "fae9"
                                      :detergent "f30e"
                                      :wax-paper "eb2f"
                                      :perogies "feb5"
                                      :potatoes "eb8a"
                                      :sapporo-ramen-noodle "fd90"
                                      :frozen-veg "f21c"
                                      :butter "fab5"
                                      :berries "f511"
                                      :sodium-bicarbonate "ef16"
                                      :peanut-oil "ef60"
                                      :dried-meat "ef17"
                                      :smokies "ef17"
                                      :brioche-hotdog-buns "f3a5"
                                      :sodium-bicarbonate-laundry-booster "f311"
                                      :garbage-bags "f02f"
                                      :downy-rinse-and-refresh-laundry-stripper "f311"
                                      :borax-laundry-booster "f311"
                                      :little-tissues "f4c9"}
    
                          sanitized-item-name (-> item-name
                                                  (clojure.string/replace " " "-")
                                                  (clojure.string/replace (re-pattern "\\[\\[") "")
                                                  (clojure.string/replace (re-pattern "\\]\\]") "")
                                                  (clojure.string/replace (re-pattern "[\\(\\)]") ""))
                          icon-code (get icon-table
                                         (keyword sanitized-item-name)
                                         "0000")]
                      (str "&#x" icon-code ";")))]
    
            (fn [results]
              (let [query-data (get-in results [:query-data])
                    query-results (get-in results [:query-results])]
    
                [:div
                 [:table.display-table.compact.more-compact.needs-disclosure-listener
                  [:thead
                   [:tr
                    [:th.left-column ""]
                    [:th "Item"]
                    [:th.disclosure]]]
                  [:tbody
                   (for [[grocery-item item-data] query-results]
                     (let [table-name (str "grocery-purchases")
                           class-addition (if (:in-basket item-data)
                                            "strikethrough"
                                            "")
                           sanitized-id (sanitize-string grocery-item)]
                       [:<>
                        [:tr
                         [:td.left-column {:rowspan "2"}
                          [:span {:class "bti bigger"
                                  :dangerouslySetInnerHTML
                                  {:__html (make-icon grocery-item)}}]]
    
                         [:td.touch-screen 
                          (make-link grocery-item
                                     (get-in query-data
                                             [:today-journal-uuid])
                                     class-addition
                                     (:text-color item-data))]
    
                         [:td.touch-screen.ti
                          [:a.disclosure-trigger
                           {:id (str table-name
                                     "-disclosure-trigger-"
                                     sanitized-id)
                            :data-target (str table-name
                                              "-secondary-content-"
                                              sanitized-id)}
                           (str "▼")]]]
    
                        [:tr
                         [:td.closed.event-info.secondary-content
                          {:colspan "2"
                           :id (str table-name
                                    "-secondary-content-"
                                    sanitized-id)}
                          [:div.quick-view-container
                           [:span.content-slot
                            (str "Purchased "
                                 (sanitize-string grocery-item)
                                 " "
                                 (:purchase-count item-data)
                                 " times.")
                            [:br]
                            (str "on average every "
                                 (:average-purchase-days item-data)
                                 " days,")
                            [:br]
                            (str "last "
                                 (:days-from-last-purchase item-data)
                                 " days ago.")]]]]]))]]])))
  
  
  
  
    :breadcrumb-show? false}
  #+END_QUERY
