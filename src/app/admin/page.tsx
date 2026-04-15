"use client";

import AdminHeader from "@/src/components/admin/AdminHeader";

const page = ({}) => {
  const testHandler = async () => {
    try {
      const response = await fetch("/api/restaurants");
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <AdminHeader />
      <button onClick={testHandler}>test</button>
    </>
  );
};

export default page;
