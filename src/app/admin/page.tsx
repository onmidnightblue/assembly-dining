"use client";

import AdminHeader from "@admin/AdminHeader";
import RestaurantList from "@admin/RestaurantList";
import Filter from "@admin/Filter";

const page = ({}) => {
  const getRestaurantToGovHandler = async () => {
    try {
      const response = await fetch("/api/restaurants/sync");
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <AdminHeader />
      {/* <button onClick={getRestaurantToGovHandler}>정부 데이터 가져오기</button> */}
      <Filter />
      <RestaurantList />
    </>
  );
};

export default page;
