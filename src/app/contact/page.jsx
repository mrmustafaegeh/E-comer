import ContactForm from "../../Component/contact/ContactForm";

export const metadata = {
  title: "Contact Us - QuickCart",
  description: "Get in touch with our team for support or inquiries.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Left Col: Info */}
            <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 block">Communication Protocol</span>
                <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter mb-8 leading-[0.9]">
                    Get in <br className="hidden md:block" /> Touch.
                </h1>
                <p className="text-xl text-gray-400 font-medium max-w-md leading-relaxed mb-12">
                    Our team is available for global support, business inquiries, and strategic partnerships.
                </p>

                <div className="space-y-8">
                    <div>
                        <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-2">Direct Terminal</p>
                        <p className="text-lg font-bold text-gray-400">hello@quickcart.console</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-2">Global Operations</p>
                        <p className="text-lg font-bold text-gray-400">One Apple Park Way, <br />Cupertino, CA 95014</p>
                    </div>
                </div>
            </div>

            {/* Right Col: Form */}
            <div className="bg-gray-50 p-8 md:p-12 rounded-[3.5rem] border border-gray-100">
                <ContactForm />
            </div>
        </div>
      </div>
    </div>
  );
}
