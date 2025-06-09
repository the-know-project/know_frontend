import SizePickerForm from "./size-picker.form";
import TagPickerForm from "./tag-picker.form";
import CategoryPickerForm from "./category-picker.form";

const UploadEditor = () => {
  
  return (
    <section className="flex w-full flex-col gap-[100px]">
      {/* Size Editor */}
      <div className="flex flex-col items-start gap-3">
        <h3 className="font-bebas text-lg tracking-wider text-neutral-900">
          size
        </h3>
        <SizePickerForm />
      </div>

      <div className="flex flex-col items-start gap-3">
        <h3 className="font-bebas text-lg tracking-wider text-neutral-900">
          Tags
        </h3>
        <TagPickerForm />
      </div>

      <div className="flex flex-col items-start gap-3">
        <h3 className="font-bebas text-lg tracking-wider text-neutral-900">
          Art Category
        </h3>
        <CategoryPickerForm />
      </div>
    </section>
  );
};

export default UploadEditor;
