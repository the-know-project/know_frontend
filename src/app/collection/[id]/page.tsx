"use client";

import React from "react";
import { showLog } from "@/src/utils/logger";

interface ICollection {
  params: Promise<{
    id: string;
  }>;
}

const Page: React.FC<ICollection> = ({ params }) => {
  const { id } = React.use(params);
  showLog({
    context: "Dynamic Collection Page",
    data: {
      collectionId: id,
    },
  });
  return (
    <section>
      <h1>Collection Page</h1>
    </section>
  );
};

export default Page;
