import Link from "next/link";

const Footer = () => {
  return (
    <div className="py-8 text-center">
      <p className="text-primary-text text-sm">
        Crafted by{" "}
        <Link
          href="https://www.newweborder.co/"
          target="_blank"
          className="hover:cursor-pointer hover:bg-black/90 py-px rounded-sm hover:text-[#23FA4B] hover:transition-color ease-in-out duration-300"
        >
          ◬ ɴᴇᴡ ᴡᴇʙ ᴏʀᴅᴇʀ_
        </Link>
      </p>
    </div>
  );
};

export default Footer;
