// components/SkeletonLoader.tsx
import React from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

const SkeletonLoader: React.FC = () => {
  return (
    <Stack spacing={1}>
      {/* Profile Image Skeleton */}
      <Skeleton variant="circular" width={80} height={80} />

      {/* Profile Details Skeleton */}
      <Skeleton variant="text" width="60%" height={30} />
      <Skeleton variant="text" width="40%" height={20} />
      <Skeleton variant="text" width="40%" height={20} />
      <Skeleton variant="text" width="40%" height={20} />
      <Skeleton variant="text" width="60%" height={20} />

      {/* Tabs Skeleton */}
      <Skeleton variant="rectangular" width="100%" height={48} />

      {/* Content Skeleton */}
      <Skeleton variant="rectangular" width="100%" height={200} />
    </Stack>
  );
};

export default SkeletonLoader;
