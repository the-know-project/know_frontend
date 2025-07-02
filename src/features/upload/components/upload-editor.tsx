import SizePickerForm from "./size-picker.form";
import TagPickerForm from "./tag-picker.form";
import CategoryPickerForm from "./category-picker.form";
import DescriptionForm from "./description.form";

const UploadEditor = () => {
  return (
    <section className="flex w-full flex-col gap-[50px]">
      <div className="flex flex-col items-start gap-3">
        <h3 className="editor_title_font">Description</h3>
        <DescriptionForm />
      </div>

      <div className="flex flex-col items-start gap-3">
        <h3 className="editor_title_font">Add Tags</h3>
        <TagPickerForm />
      </div>

      <div className="flex flex-col items-start gap-3">
        <h3 className="editor_title_font">edit size</h3>
        <SizePickerForm />
      </div>

      <div className="flex flex-col items-start gap-3">
        <h3 className="editor_title_font">Choose Category</h3>
        <CategoryPickerForm />
      </div>
    </section>
  );
};

export default UploadEditor;
