const UploadEditor = () => {
  return (
    <section className="flex w-full flex-col gap-[100px]">
      {/* Size Editor */}
      <div className="flex flex-col items-start gap-3">
        <h3 className="font-bebas text-lg tracking-wider text-neutral-900">
          size
        </h3>
      </div>

      <div className="flex flex-col items-start gap-3">
        <h3 className="font-bebas text-lg tracking-wider text-neutral-900">
          Tags
        </h3>
      </div>

      <div className="flex flex-col items-start gap-3">
        <h3 className="font-bebas text-lg tracking-wider text-neutral-900">
          Art Category
        </h3>
      </div>
    </section>
  );
};

export default UploadEditor;
