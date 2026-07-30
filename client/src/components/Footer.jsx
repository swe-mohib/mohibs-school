import { BsFacebook, BsInstagram, BsLinkedin, BsTwitter } from "react-icons/bs";
function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-[min(1180px,calc(100%-2rem))] flex-col items-center justify-between gap-4 py-6 text-sm text-slate-500 sm:flex-row">
        <p>© {year} MohibsSchool. Made for curious minds.</p>
        <div className="flex gap-4 text-lg text-slate-400">
          <a href="#" aria-label="Facebook" className="hover:text-blue-600">
            <BsFacebook />
          </a>
          <a href="#" aria-label="Instagram" className="hover:text-blue-600">
            <BsInstagram />
          </a>
          <a href="#" aria-label="LinkedIn" className="hover:text-blue-600">
            <BsLinkedin />
          </a>
          <a href="#" aria-label="Twitter" className="hover:text-blue-600">
            <BsTwitter />
          </a>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
