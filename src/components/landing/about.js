import { MdAddTask } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { TiLightbulb } from "react-icons/ti";
import { RiUserCommunityFill } from "react-icons/ri";

function About() {
    return (
        <section id="about" className="px-16 py-20">
            {/* Background Decorative Elements - Responsive */}
            <div className="absolute top-0 left-0 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] lg:w-[400px] lg:h-[400px] ">
                <div className="absolute w-[120%] h-[120%] bg-gradient-to-r from-[#7FD8E8]/10 to-[#0798C5]/10 rounded-full -top-1/4 -left-1/4"></div>
            </div>
            
            <div className="container mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-0">
                    
                    {/* Left Side - About Content */}
                    <div className="w-full lg:w-1/2 text-center lg:text-left lg:pr-12">
                        <h2 className="text-[#0798C5] font-medium text-lg sm:text-xl mb-2">Tentang Kami</h2>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6 text-black leading-tight">
                            Membangun Masa Depan<br/>
                            <span className="text-[#0798C5]">Pembelajaran</span>
                        </h1>
                        
                        <p className="text-gray-600 mb-4 lg:mb-6 text-base lg:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                            StudyFinder hadir sebagai platform pembelajaran inovatif yang menggabungkan teknologi 
                            modern dengan pendekatan personal untuk menciptakan pengalaman belajar yang efektif dan menyenangkan.
                        </p>
                        
                        <p className="text-gray-600 mb-6 lg:mb-8 text-base lg:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                            Kami percaya bahwa setiap individu memiliki gaya belajar yang unik. Melalui fitur-fitur canggih 
                            seperti analisis gaya belajar, kolaborasi tim, dan sistem manajemen waktu, kami membantu siswa 
                            mencapai potensi maksimal mereka dalam perjalanan pendidikan.
                        </p>

                        {/* Stats - Responsive Grid */}
                        <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
                            <div className="text-center">
                                <div className="text-2xl sm:text-3xl font-bold text-[#0798C5] mb-1 lg:mb-2">5000+</div>
                                <div className="text-gray-600 text-xs sm:text-sm">Siswa Aktif</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl sm:text-3xl font-bold text-[#0798C5] mb-1 lg:mb-2">98%</div>
                                <div className="text-gray-600 text-xs sm:text-sm">Tingkat Kepuasan</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl sm:text-3xl font-bold text-[#0798C5] mb-1 lg:mb-2">24/7</div>
                                <div className="text-gray-600 text-xs sm:text-sm">Dukungan</div>
                            </div>
                        </div>

                        {/* Call to Action Button - Mobile Only */}
                        <div className="lg:hidden">
                            <button className="px-6 py-3 bg-[#0798C5] text-white font-semibold rounded-full hover:bg-[#0690B8] transition-colors duration-200 shadow-lg hover:shadow-xl cursor-pointer">
                                Pelajari Lebih Lanjut
                            </button>
                        </div>
                    </div>

                    {/* Right Side - Features Grid */}
                    <div className="w-full lg:w-1/2 relative z-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 max-w-2xl mx-auto lg:max-w-none">
                            
                            {/* Mission Card */}
                            <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-lg border border-gray-100 hover:scale-105 transition-transform duration-300 hover:shadow-xl">
                                <div className="bg-gradient-to-br from-[#0798C5] to-[#7FD8E8] p-3 sm:p-4 rounded-2xl mb-3 sm:mb-4 w-fit text-white">
                                    <MdAddTask className="text-lg sm:text-xl" />
                                </div>
                                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">Misi Kami</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Memberikan akses pendidikan berkualitas dengan teknologi terdepan untuk semua kalangan.
                                </p>
                            </div>

                            {/* Vision Card */}
                            <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-lg border border-gray-100 hover:scale-105 transition-transform duration-300 hover:shadow-xl">
                                <div className="bg-gradient-to-br from-[#0798C5] to-[#7FD8E8] p-3 sm:p-4 rounded-2xl mb-3 sm:mb-4 w-fit text-white">
                                    <FaEye className="text-lg sm:text-xl" />
                                </div>
                                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">Visi Kami</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Menjadi platform pembelajaran terdepan yang mengubah cara dunia belajar dan berkembang.
                                </p>
                            </div>

                            {/* Innovation Card */}
                            <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-lg border border-gray-100 hover:scale-105 transition-transform duration-300 hover:shadow-xl">
                                <div className="bg-gradient-to-br from-[#0798C5] to-[#7FD8E8] p-3 sm:p-4 rounded-2xl mb-3 sm:mb-4 w-fit text-white">
                                    <TiLightbulb className="text-lg sm:text-xl" />
                                </div>
                                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">Inovasi</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Mengintegrasikan AI dan analitik untuk personalisasi pengalaman belajar setiap pengguna.
                                </p>
                            </div>

                            {/* Community Card */}
                            <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-lg border border-gray-100 hover:scale-105 transition-transform duration-300 hover:shadow-xl">
                                <div className="bg-gradient-to-br from-[#0798C5] to-[#7FD8E8] p-3 sm:p-4 rounded-2xl mb-3 sm:mb-4 w-fit text-white">
                                    <RiUserCommunityFill className="text-lg sm:text-xl" />
                                </div>
                                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">Komunitas</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Membangun ekosistem pembelajaran kolaboratif yang saling mendukung dan menginspirasi.
                                </p>
                            </div>
                        </div>

                        {/* Call to Action Button - Desktop Only */}
                        <div className="hidden lg:block mt-8">
                            <button className="px-8 py-3 bg-[#0798C5] text-white font-semibold rounded-full hover:bg-[#0690B8] transition-colors duration-200 shadow-lg hover:shadow-xl cursor-pointer">
                                Pelajari Lebih Lanjut
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About;