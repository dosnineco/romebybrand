"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";

const PageViewTracker = () => {
  const router = useRouter();
  const [lastHourViews, setLastHourViews] = useState(0);

  useEffect(() => {
    const captureReferrer = () => {
      const referrer = document.referrer;

      if (referrer && !localStorage.getItem("referrer")) {
        localStorage.setItem("referrer", referrer); // Store referrer in local storage
      }
    };

    captureReferrer();
  }, []);
  useEffect(() => {
    const handlePageView = async (url) => {
      if (!url) return;

      try {
        // Check if the page already exists in the database
        const { data, error } = await supabase
          .from("page_views")
          .select("view_count")
          .eq("page_url", url)
          .single();

        if (error) {
          if (error.code === "PGRST116") {
            // Insert a new record if it doesn't exist
            const { error: insertError } = await supabase
              .from("page_views")
              .insert({ page_url: url, view_count: 1 });

            if (insertError) {
              console.error("Error inserting new page view record:", insertError);
            }
          } else {
            console.error("Error fetching page view data:", error);
          }
        } else if (data) {
          // Increment the view count for an existing record
          const { error: updateError } = await supabase
            .from("page_views")
            .update({ view_count: data.view_count + 1 })
            .eq("page_url", url);

          if (updateError) {
            console.error("Error updating page view record:", updateError);
          }
        }
      } catch (err) {
        console.error("Unexpected error in handlePageView:", err);
      }
    };

    const fetchLastHourViews = async () => {
      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);

      try {
        const { data, error } = await supabase
          .from("page_views")
          .select("view_count")
          .gte("last_viewed", oneHourAgo.toISOString());

        if (error) {
          console.error("Error fetching last hour views:", error);
        } else {
          const totalViews = data.reduce((sum, page) => sum + page.view_count, 0);
          setLastHourViews(totalViews);
        }
      } catch (err) {
        console.error("Unexpected error in fetchLastHourViews:", err);
      }
    };

    // Track initial page view
    handlePageView(router.asPath);

    // Fetch last hour views on component mount
    fetchLastHourViews();

    // Listen for route changes and track page views
    const handleRouteChange = (url) => {
      handlePageView(url);
      fetchLastHourViews(); // Update last hour views on route change
    };
    router.events.on("routeChangeComplete", handleRouteChange);

    // Cleanup listener on unmount
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);

  return (
    <div className="fixed bottom-4 right-4 bg-blue-500 text-white text-sm font-medium rounded-full px-4 py-2 shadow-md flex items-center justify-center">
      <span className="mr-2">Active Users:</span>
      <span className="font-bold">{lastHourViews}</span>
    </div>
  );
};

export default PageViewTracker;