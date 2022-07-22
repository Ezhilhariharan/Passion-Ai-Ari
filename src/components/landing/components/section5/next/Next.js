import "./styles/Next.scss";
function Next(props) {
  const { className,onClick } = props;
  return (
    <div className={`${className} slide-next`} style={{}} onClick={onClick} />
  );
}
export default Next;
