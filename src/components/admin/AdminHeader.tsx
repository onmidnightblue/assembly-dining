"use client";

import { signOut } from "next-auth/react";
import { useSyncRestaurants } from "src/hooks/useSyncRestaurants";
import { SmallLoadingSpinner } from "@components/common";

const AdminHeader = () => {
  const isDevelopment = process.env.NODE_ENV === "development";
  const { sync, isLoading } = useSyncRestaurants();

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between w-full p-4 bg-gray-100">
      <div className="flex items-baseline gap-2 font-bold font-paperozi">
        <h1 className="text-3xl text-foreground">국회밥안</h1>
        <h3 className="text-foreground text-md">관리자</h3>
      </div>
      <div className="flex gap-4 text-foreground font-paperozi">
        {isDevelopment && (
          <div
            className="text-sm text-center cursor-pointer"
            onClick={() => sync()}
          >
            {isLoading ? <SmallLoadingSpinner /> : "다운로드"}
          </div>
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
