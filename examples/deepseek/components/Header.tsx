import Image from "next/image";
import Link from "next/link";
import logo from "../public/favicon.svg";
import GithubIcon from "./github-icon";

export default function Header() {
  return (
    <header className="relative flex items-center justify-center w-full px-2 mx-auto mt-5 pb-7 sm:px-4">
      <Link href="/" className="absolute flex items-center gap-2">
        <Image alt="DeepseekCoder Logo" src={logo} className="w-5 h-5" />
        <h1 className="text-xl tracking-tight">
          <span className="text-blue-600">Deepseek</span>Coder
        </h1>
      </Link>
      <a
        href="https://github.com/TencentEdgeOne/pages-templates/tree/main/examples/deepseek"
        target="_blank"
        className="items-center hidden gap-3 px-6 py-2 ml-auto bg-white rounded-2xl sm:flex"
      >
        <GithubIcon className="w-4 h-4" />
        <span>GitHub Repo</span>
      </a>
    </header>
  );
}
