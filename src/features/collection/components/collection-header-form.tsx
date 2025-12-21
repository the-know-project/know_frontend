import { showLog } from "@/src/utils/logger";
import { ICollectionHeaderForm } from "../interface/collection.interface";

const CollectionHeaderForm: React.FC<ICollectionHeaderForm> = ({
  firstName,
  lastName,
  title,
  description,
  bannerUrl,
  profileUrl,
  numOfArt,
  price,
}) => {
  const handleSubmit = () => {
    showLog({
      context: "Collection header form",
      data: {
        message: "Is submitting",
      },
    });
  };

  return <form onSubmit={handleSubmit}></form>;
};
export default CollectionHeaderForm;
