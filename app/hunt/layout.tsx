import MapboxMap from "@/components/map/MapboxMap";
import BottomNavigation from "@/components/navigation/BottomNavigation";

export default function HuntLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <MapboxMap />
      <BottomNavigation />
    </>
  );
}
