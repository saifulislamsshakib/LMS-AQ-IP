import { Menu, School, Store } from "lucide-react";
import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";
// import { Avatar } from "radix-ui";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import DarkMode from "@/DarkMode";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";
import { Label } from "@/components/ui/label";
import { Input } from "./input";
// import { Separator } from "radix-ui";
import { Separator } from "./separator";
import { Link, useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "@/features/api/authApi";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";
const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();
  const logoutHandler = async () => {
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "User log out");
      navigate("/login");
    }
  }, [isSuccess]);
  return (
    <div className=" h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10">
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full">
        {/* <div className="w-full px-5 hidden md:flex justify-between items-center gap-10 h-full"> */}
        {/* <div className="w-full px-6 lg:px-10 hidden md:flex justify-between items-center h-full"> */}
        <div className="flex items-center gap-2">
          <School size={30} />
          <Link to="/">
            <h1 className="font-extrabold text-2xl">E-learning</h1>
          </Link>
        </div>
        {/* user icon and dark icon */}
        <div className="flex items-center gap-8">
          {user ? (
            <DropdownMenu>
              {/* <DropdownMenuTrigger asChild>
                
                <Avatar>
                  <AvatarImage
                    src={user?.photoUrl || "https://github.com/shadcn.png"}
                    alt="@shadcn"
                    className="grayscale"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger> */}

              <DropdownMenuTrigger asChild>
                <button>
                  <Avatar>
                    <AvatarImage
                      src={user?.photoUrl || "https://github.com/shadcn.png"}
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40" align="start">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <Link to="my-learning">My Learning</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="profile">Edit Profile</Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={logoutHandler}>
                  Log out
                </DropdownMenuItem>
                {user.role === "instructor" && (
                  <>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem>Dashboard</DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button onClick={() => navigate("/login")}>Signup</Button>
            </div>
          )}
          <DarkMode />
        </div>
      </div>
      {/* mobile device */}

      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <h1 className="font-extrabold text-2xl">E-learning</h1>
        <MobileNavbar />
      </div>
    </div>
  );
};

export default Navbar;

const MobileNavbar = () => {
  const role = "student";
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className={"rounded-full bg-gray-200 hover:bg-gray-200"}
          variant="outline"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="flex flex-row items-center justify-between mt-2">
          <SheetTitle>E-learning</SheetTitle>
          <DarkMode />
        </SheetHeader>
        <Separator className="mr-2" />
        <nav className="flex flex-col space-y-4">
          <span>My Learning</span>
          <span>Edit Profile</span>
          <p>Log Out</p>
        </nav>
        {role === "instructor" && (
          <SheetFooter className="mt-4">
            <Button type="submit">Dashboard</Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
