import ReactDOM from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { logger } from "@/src/utils/logger";
import Image from "next/image";

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
            <p className="font-grotesk mb-4 text-sm font-light text-neutral-600">
              Are you sure you want to list this asset?
            </p>
            {/*Asset Image and list form*/}
            <div className="items-center` mb-4 flex gap-5">
              <Image
                src={image}
                alt="user_asset"
                quality={100}
                width={400}
                height={300}
                className="rounded-[15px] object-contain transition-all duration-300 select-none"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={handleClose}
                className="font-bebas relative z-10 rounded-lg bg-neutral-500 px-2 py-1 text-sm font-normal tracking-wider text-black shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 sm:px-4 sm:py-2 lg:text-[16px]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Add your listing logic here
                  handleClose();
                }}
                className="font-bebas relative z-10 rounded-lg bg-[#1E3A8A] px-2 py-1 text-sm font-normal tracking-wider text-white shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 sm:px-4 sm:py-2 lg:text-[16px]"
              >
                List
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
