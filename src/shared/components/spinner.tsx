interface ISpinner {
  borderColor?: string;
}

const Spinner: React.FC<ISpinner> = ({ borderColor = "border-white" }) => {
  return (
    <div
      className={`flex h-5 w-5 animate-spin items-center self-center rounded-full border-b-2 ${borderColor} accent-white`}
    ></div>
  );
};

export default Spinner;
