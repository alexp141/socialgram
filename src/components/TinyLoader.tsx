export default function TinyLoader({ style = "" }: { style?: string }) {
  return (
    <div className={style}>
      <span className="tiny-loader"></span>
    </div>
  );
}
