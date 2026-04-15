import React from "react";
import { auth, signIn } from "@auth";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session) {
    return (
      <div className="h-dvh flex justify-center items-center">
        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <button type="submit">Signin with Google</button>
        </form>
      </div>
    );
  }

  if (session?.user?.email !== process.env.ADMIN_EMAIL) {
    return (
      <div className="flex flex-col h-screen items-center justify-center text-red-800">
        <h1 className="text-md font-bold">Access Denied.</h1>
        <p>This area is restricted to administrators only.</p>
      </div>
    );
  }

  return <div>{children}</div>;
};

export default layout;
