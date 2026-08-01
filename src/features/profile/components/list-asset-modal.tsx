import ReactDOM from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { logger } from "@/src/utils/logger";
import Image from "next/image";
import { ListAssetForm } from "./list-asset-form";

export interface IListAssetModalProps {
  image: string;
  isOpen: boolean;
  onClose: () => void;
}

const ListAssetModal: React.FC<IListAssetModalProps> = ({
  image,
  isOpen,
  onClose,
}) => {
  logger.debug("ListAssetModal", {
    isOpen,
  });

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
  };

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              delay: 0.05,
              ease: "easeInOut",
              duration: 0.09,
            }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 w-full max-w-sm rounded-lg bg-white p-6 shadow-lg sm:max-w-md"
          >
            <h2 className="font-bebas mb-4 text-lg font-semibold tracking-wider">
              List Asset
            </h2>
            <div className="flex flex-col gap-4 mb-4">
              <div className="flex justify-center">
                <Image
                  src={image}
                  alt="user_asset"
                  quality={100}
                  width={400}
                  height={300}
                  className="rounded-[15px] max-h-48 object-contain transition-all duration-300 select-none"
                />
              </div>
              
              <ListAssetForm 
                onSubmit={(values) => {
                  logger.debug("Asset listed successfully", values);
                  // Add your listing API call here
                  handleClose();
                }}
              />
              
              <button
                onClick={handleClose}
                className="w-full text-center py-2 text-xs font-semibold text-neutral-500 hover:text-neutral-800 transition-colors uppercase tracking-wider"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,

    document.body,
  );
};

export default ListAssetModal;
