import AboutUs from "../../Component/aboutusPage/AboutUs.jsx";

export const metadata = {
  title: "About Us - QuickCart",
  description:
    "Learn more about QuickCart - your trusted partner for quality electronics with fast delivery and top-notch service.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <AboutUs />
    </div>
  );
}
