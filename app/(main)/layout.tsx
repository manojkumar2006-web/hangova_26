import LeftSidebar from "@/components/layout/LeftSidebar";
import BottomTabBar from "@/components/layout/BottomTabBar";
import TopBar from "@/components/layout/TopBar";

const MOCK_USER = {
  name: "Alex Chen",
  username: "alexchen",
  avatarUrl: null,
  isAdmin: true,
  groupName: "The Boys 🔥",
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh overflow-hidden" style={{ background: "#080808" }}>
      <LeftSidebar user={MOCK_USER} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar user={MOCK_USER} />
        <main className="flex-1 overflow-y-auto">{children}</main>
        <BottomTabBar />
      </div>
    </div>
  );
}
