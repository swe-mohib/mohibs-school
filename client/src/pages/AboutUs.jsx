import aboutUsImg from "../assets/images/aboutUsImg.png";
import CarouselSlide from "../components/CarouselSlide";
import { CelebretyData } from "../constant/CelebretyData";
import HomeLayout from "../layout/HomeLayout";

function AboutUs() {
  return (
    <HomeLayout>
      <div className="page-wrap flex flex-col justify-center items-center space-y-16">
        <div className="flex flex-col md:flex-row justify-center items-center gap-10">
          <section className="w-full md:w-1/2 space-y-6">
            <span className="eyebrow">Our mission</span>
            <h1 className="section-title">Affordable and quality education</h1>
            <p className="text-slate-600 text-lg leading-8">
              Our goal is to provide the afoordable and quality education to the
              world. We are providing the platform for the aspiring teachers and
              students to share their skills, creativity and knowledge to each
              other to empower and contribute in the growth and wellness of
              mankind.
            </p>
          </section>
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <img
              src={aboutUsImg}
              alt="About Us Image"
              className="w-[80%] rounded-3xl shadow-xl"
            />
          </div>
        </div>

        {/* Carousel */}
        <div className="carousel w-full md:w-2/3 rounded-2xl shadow-lg">
          {CelebretyData &&
            CelebretyData.map((celebrety) => (
              <CarouselSlide
                {...celebrety}
                key={celebrety.slideNumber}
                totalSlides={CelebretyData.length}
              />
            ))}
        </div>
      </div>
    </HomeLayout>
  );
}

export default AboutUs;
