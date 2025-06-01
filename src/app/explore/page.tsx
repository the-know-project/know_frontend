import { PageAuthGuard } from "@/src/features/auth/guards";

const Explore = () => {
  return (
    <PageAuthGuard requiresAuth>
      <div>Explore page</div>
    </PageAuthGuard>
  );
};

export default Explore;
