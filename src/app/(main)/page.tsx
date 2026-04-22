import Header from "src/components/layout/Header";
import Map from "src/components/map/Map";

const page = () => {
  return (
    <div className="flex flex-col w-full overflow-hidden h-dvh">
      <Header />
      <main className="flex items-center justify-center w-full h-full">
        <Map />
      </main>
    </div>
  );
};

export default page;
