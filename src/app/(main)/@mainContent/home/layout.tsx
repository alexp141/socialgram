import HomeFeedPicker from "@/components/HomeFeedPicker";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <HomeFeedPicker />
      {children}
    </div>
  );
}
