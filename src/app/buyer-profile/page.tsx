import { PageAuthGuard } from "@/src/features/auth/guards";

const Page = () => {
  return (
    <PageAuthGuard requiredRoles={["BUYER"]} requiresAuth={true}>
      <div>
        <h1>Buyer Profile</h1>
        <p>This is the buyer profile page.</p>
      </div>
    </PageAuthGuard>
  );
};

export default Page;
