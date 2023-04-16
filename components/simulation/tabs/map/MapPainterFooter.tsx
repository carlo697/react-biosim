import MapObjectProperties from "./MapObjectProperties";

export default function MapPainterFooter() {
  return (
    <div className="grid grid-cols-2 gap-5">
      <div></div>
      <div>
        <MapObjectProperties />
      </div>
    </div>
  );
}
