"use client";

import { signOut } from "next-auth/react";

const AdminHeader = () => {
  const isDevelopment = process.env.NODE_ENV === "development";
  const getURL = "/api/restaurants/sync";
  const updateURL = "/api/restaurants/sync-closed";
  // get gov restaurant data
  const getRestaurantToGovHandler = async () => {
    try {
      const response = await fetch(getURL);
      // const response = await fetch(updateURL);
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between w-full p-4 bg-gray-100">
      <div className="flex items-baseline gap-2 font-bold font-paperozi">
        <h1 className="text-3xl text-foreground">국회밥안</h1>
        <h3 className="text-foreground text-md">관리자</h3>
      </div>
      <div className="flex gap-2 text-foreground font-paperozi">
        {isDevelopment && (
          <>
            <div
              className="text-sm cursor-pointer"
              onClick={getRestaurantToGovHandler}
            >
              개업
            </div>
            <div
              className="text-sm cursor-pointer"
              onClick={getRestaurantToGovHandler}
            >
              폐업
            </div>
          </>
        )}
        <div
          className="text-sm cursor-pointer"
          onClick={() => signOut({ callbackUrl: "/assembly-dining/admin" })}
        >
          로그아웃
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
