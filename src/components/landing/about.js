import { MdAddTask } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { TiLightbulb } from "react-icons/ti";
import { RiUserCommunityFill } from "react-icons/ri";

function About() {
    return (
        <section id="about" className="relative py-20 bg-transparent overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-[400px] h-[400px] overflow-hidden">
                <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-[#7FD8E8]/10 to-[#0798C5]/10 rounded-full -top-1/4 -left-1/4"></div>
            </div>
            
            <div className="container mx-auto px-16 relative z-10">
                <div className="flex items-center min-h-[700px]">
                {/* Left Side - About Content */}
                <div className="w-1/2 pr-12">
                    <h2 className="text-[#0798C5] font-medium text-xl mb-2">Tentang Kami</h2>
                    <h1 className="text-5xl font-bold mb-6 text-black">
                    Membangun Masa Depan<br/>
                    <span className="text-[#0798C5]">Pembelajaran</span>
                    </h1>
                    
                    <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                    StudyFinder hadir sebagai platform pembelajaran inovatif yang menggabungkan teknologi 
                    modern dengan pendekatan personal untuk menciptakan pengalaman belajar yang efektif dan menyenangkan.
                    </p>
                    
                    <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                    Kami percaya bahwa setiap individu memiliki gaya belajar yang unik. Melalui fitur-fitur canggih 
                    seperti analisis gaya belajar, kolaborasi tim, dan sistem manajemen waktu, kami membantu siswa 
                    mencapai potensi maksimal mereka dalam perjalanan pendidikan.
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-[#0798C5] mb-2">5000+</div>
                        <div className="text-gray-600 text-sm">Siswa Aktif</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-[#0798C5] mb-2">98%</div>
                        <div className="text-gray-600 text-sm">Tingkat Kepuasan</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-[#0798C5] mb-2">24/7</div>
                        <div className="text-gray-600 text-sm">Dukungan</div>
                    </div>
                    </div>
                </div>

                {/* Right Side - Features Grid */}
                <div className="w-1/2 relative z-10">
                    <div className="grid grid-cols-2 gap-6">
                    {/* Mission Card */}
                    <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 hover:scale-105 transition-transform duration-300 hover:shadow-xl transition-shadow duration-300">
                        <div className="bg-gradient-to-br from-[#0798C5] to-[#7FD8E8] p-4 rounded-2xl mb-4 w-fit">
                            <MdAddTask />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Misi Kami</h3>
                        <p className="text-gray-600 text-sm">
                        Memberikan akses pendidikan berkualitas dengan teknologi terdepan untuk semua kalangan.
                        </p>
                    </div>

                    {/* Vision Card */}
                    <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 hover:scale-105 transition-transform duration-300 hover:shadow-xl transition-shadow duration-300">
                        <div className="bg-gradient-to-br from-[#0798C5] to-[#7FD8E8] p-4 rounded-2xl mb-4 w-fit">
                            <FaEye />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Visi Kami</h3>
                        <p className="text-gray-600 text-sm">
                        Menjadi platform pembelajaran terdepan yang mengubah cara dunia belajar dan berkembang.
                        </p>
                    </div>

                    {/* Innovation Card */}
                    <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 hover:scale-105 transition-transform duration-300 hover:shadow-xl transition-shadow duration-300">
                        <div className="bg-gradient-to-br from-[#0798C5] to-[#7FD8E8] p-4 rounded-2xl mb-4 w-fit">
                            <TiLightbulb />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Inovasi</h3>
                        <p className="text-gray-600 text-sm">
                        Mengintegrasikan AI dan analitik untuk personalisasi pengalaman belajar setiap pengguna.
                        </p>
                    </div>

                    {/* Community Card */}
                    <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 hover:scale-105 transition-transform duration-300 hover:shadow-xl transition-shadow duration-300">
                        <div className="bg-gradient-to-br from-[#0798C5] to-[#7FD8E8] p-4 rounded-2xl mb-4 w-fit">
                            <RiUserCommunityFill />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Komunitas</h3>
                        <p className="text-gray-600 text-sm">
                        Membangun ekosistem pembelajaran kolaboratif yang saling mendukung dan menginspirasi.
                        </p>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </section>
    )
}

export default About;