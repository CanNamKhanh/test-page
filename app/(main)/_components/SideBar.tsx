"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Compass, Ellipse, Ellipsis, Home, User2 } from "lucide-react";
import { useRouter } from "next/navigation";

function SideBar() {
  const router = useRouter();

  return (
    <>
      <div className="fixed hidden border-r border-white/10 h-full w-auto z-9999 py-10 sm:flex flex-col gap-5 px-2">
        <div
          onClick={() => router.push("/")}
          className="text-white flex px-2 py-2 rounded-xl cursor-pointer items-center gap-3 hover:bg-white/20 w-auto"
        >
          <Home className="text-white" />
          <span className="hidden md:block">Home</span>
        </div>
        <div
          onClick={() => router.push("/explore")}
          className="text-white flex px-2 py-2 rounded-xl cursor-pointer items-center gap-3 hover:bg-white/20 w-auto"
        >
          <Compass className="text-white" />
          <span className="hidden md:block">Explore</span>
        </div>
        <div
          onClick={() => router.push("/profile")}
          className="text-white flex px-2 py-2 rounded-xl cursor-pointer items-center gap-3 hover:bg-white/20 w-auto"
        >
          <User2 className="text-white" />
          <span className="hidden md:block">Profile</span>
        </div>
      </div>
      <div className="sm:hidden block">
        <Sheet>
          <SheetTrigger className="cursor-pointer fixed z-99999 top-3 left-3">
            <div className="w-10 h-10 flex items-center justify-center cursor-pointer rounded-full bg-white/20">
              <Ellipsis className="text-white" />
            </div>
          </SheetTrigger>
          <SheetContent side="left" className="bg-black w-auto!">
            <SheetTitle />
            <SheetDescription />
            <div className="fixed border-r bg-black border-white/10 h-full w-auto z-9999 py-10 flex flex-col gap-5 px-2">
              <div
                onClick={() => router.push("/")}
                className="text-white flex px-2 py-2 rounded-xl cursor-pointer items-center gap-3 hover:bg-white/20 w-auto"
              >
                <Home className="text-white" />
                <span>Home</span>
              </div>
              <div
                onClick={() => router.push("/explore")}
                className="text-white flex px-2 py-2 rounded-xl cursor-pointer items-center gap-3 hover:bg-white/20 w-auto"
              >
                <Compass className="text-white" />
                <span>Explore</span>
              </div>
              <div
                onClick={() => router.push("/profile")}
                className="text-white flex px-2 py-2 rounded-xl cursor-pointer items-center gap-3 hover:bg-white/20 w-auto"
              >
                <User2 className="text-white" />
                <span>Profile</span>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

export default SideBar;
