import Header from "src/components/layout/Header";
import Map from "src/components/map/Map";

const page = () => {
  return (
    <div className="flex flex-col w-full overflow-hidden h-dvh">
      <Header />
      <Map />
    </div>
  );
};

export default page;
