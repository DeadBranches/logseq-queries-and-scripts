tags:: page
description:: Cataloguing custom logseq kit functions
alias:: kits

- # Kits list
  #+BEGIN_QUERY
  {
    :query
  [:find ?kit-name ?macro ?display-name
   :keys kit-name macro display-name
   :where
   [?b :block/properties ?props]
   [(get ?props :kit) ?macro]
   [?b :block/name ?kit-name]
   [?b :block/original-name ?display-name]]
  :result-transform (fn [result]
                      (sort-by (fn [r] (get r :block/name)) result))
  :view (fn [results]
          [:div
           (map (fn [result]
                  (let [{:keys [kit-name macro display-name]}
                        result] ; Correct destructuring syntax
                    [:article
                     [:a {:data-ref kit-name
                          :on-click (fn [] (call-api "push_state" "page" {:name kit-name}))}
                      (str display-name)]
                     [:span {:class "smaller italic enclosed"} macro]]))
                results)])}
  #+END_QUERY