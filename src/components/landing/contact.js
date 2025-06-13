import { FaMapLocationDot } from "react-icons/fa6";
import { BsFillTelephoneInboundFill } from "react-icons/bs";
import { MdMarkEmailUnread } from "react-icons/md";

function Contact() {
  return (
    <section id="contact" className="px-16 py-20">
      <div className="container mx-auto">
        <div className="flex flex-col gap-15 md:gap-5 md:flex-row items-center">
          {/* Left Side - Contact Info */}
          <div className="w-full md:w-1/2 md:pr-12">
            <h2 className="text-[#0798C5] font-medium text-xl mb-2">
              Hubungi Kami
            </h2>
            <h1 className="text-5xl font-bold mb-6 text-black">
              Mari Berdiskusi
              <br />
              <span className="text-[#0798C5]">Bersama</span>
            </h1>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Kami siap membantu perjalanan belajar Anda. Hubungi tim
              StudyFinder untuk konsultasi, pertanyaan, atau saran mengenai
              platform pembelajaran kami.
            </p>

            {/* Contact Info Cards */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center p-4 bg-gray-50 rounded-2xl">
                <div className="bg-[#0798C5] p-4 rounded-xl mr-4">
                  <FaMapLocationDot />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Alamat</h4>
                  <p className="text-gray-600">
                    Jl. Prof. Soedarto No.50275, Tembalang, Kec. Tembalang, Kota
                    Semarang, Jawa Tengah 50275
                  </p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-2xl">
                <div className="bg-[#0798C5] p-4 rounded-xl mr-4">
                  <BsFillTelephoneInboundFill />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Telepon</h4>
                  <p className="text-gray-600">+62 81 XXX XXX XXX</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-2xl">
                <div className="bg-[#0798C5] p-4 rounded-xl mr-4">
                  <MdMarkEmailUnread />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Email</h4>
                  <p className="text-gray-600">info@studyfinder.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="w-full md:w-1/2 relative z-10">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Kirim Pesan
              </h3>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0798C5] focus:border-[#0798C5] outline-none transition-colors text-sm text-gray-800"
                      placeholder="Masukkan nama lengkap Anda"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0798C5] focus:border-[#0798C5] outline-none transition-colors text-sm text-gray-800"
                      placeholder="Masukkan email Anda"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Subjek
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0798C5] focus:border-[#0798C5] outline-none transition-colors text-sm text-gray-800"
                    placeholder="Masukkan subjek pesan Anda"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Pesan
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0798C5] focus:border-[#0798C5] outline-none transition-colors text-sm text-gray-800"
                    placeholder="Tulis pesan Anda di sini..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-[#0798C5] text-white font-semibold rounded-xl hover:bg-[#0690B8] transition-colors duration-200 shadow-lg hover:shadow-xl cursor-pointer"
                >
                  Kirim Pesan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
