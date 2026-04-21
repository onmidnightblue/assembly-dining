"use client";

import { signOut } from "next-auth/react";

const AdminHeader = () => {
  return (
    <header className="w-full bg-gray-100 sticky top-0 flex items-center justify-between p-4 z-10">
      <div className="flex gap-2 items-baseline font-paperozi font-bold">
        <h1 className="text-3xl">국회밥안</h1>
        <h3 className="text-md">관리자</h3>
      </div>
      <div
        className="font-paperozi text-sm cursor-pointer"
        onClick={() => signOut({ callbackUrl: "/admin" })}
      >
        로그아웃
      </div>
    </header>
  );
};

export default AdminHeader;
