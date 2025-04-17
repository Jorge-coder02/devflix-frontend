// Este spinner es más moderno
const Spinner = ({
  text = "",
  color = "border-orange-600",
  text_color = "text-orange-600",
}: {
  text?: string;
  color?: string;
  text_color?: string;
}) => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <div
        className={`animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 ${color}`}
      ></div>
      <p className={`${text_color} text-orange-600 font-medium`}>{text}</p>
    </div>
  );
};

export default Spinner;
