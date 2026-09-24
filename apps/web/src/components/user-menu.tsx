import { Button } from "@CampusLink/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@CampusLink/ui/components/dropdown-menu";
import { Skeleton } from "@CampusLink/ui/components/skeleton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function UserMenu() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  if (session?.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" className="rounded-xl" />}>
          {session.user.name}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-card">
          <DropdownMenuGroup>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-xs text-muted-foreground">
              {session.user.email}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              My Student Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => {
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      router.push("/");
                    },
                  },
                });
              }}
            >
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Link href="/login">
      <Button
        variant="outline"
        className="rounded-xl border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold"
      >
        Sign In
      </Button>
    </Link>
  );
}
