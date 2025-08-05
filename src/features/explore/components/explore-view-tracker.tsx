"use client";

import { useEffect, useRef } from "react";
import { useIsExploreContentToggled } from "../state/explore-content.store";
import { useIncrementPostViews } from "../../metrics/hooks/use-incr-post-views";

const ExploreViewTracker = () => {
  const { toggledContentId } = useIsExploreContentToggled();
  const { mutate: incrementView } = useIncrementPostViews();
  const trackedIds = useRef(new Set<string>());

  useEffect(() => {
    if (toggledContentId && !trackedIds.current.has(toggledContentId)) {
      trackedIds.current.add(toggledContentId);

      incrementView({
        fileId: toggledContentId,
      });
    }
  }, [toggledContentId, incrementView]);

  // This component doesn't render anything
  return null;
};

export default ExploreViewTracker;
