import React from "react";
import { Link } from "@heroui/react";
import strings from "@/common/strings";

interface Props {}

const Footer = (props: Props) => {
  return (
    <footer className="w-full text-center justify-center p-3">
      <div className="text-white">
        {strings.siteTitle} was created by{" "}
        <Link href={"https://www.jenniferhaggerty.com"}>Jennifer Haggerty</Link>{" "}
        using <Link href={"https://nextjs.org"}>Next.js</Link>,{" "}
        <Link href="https://openai.com">OpenAI</Link>, and{" "}
        <Link href="https://www.firecrawl.dev">Firecrawl</Link>, and deployed
        with <Link href="https://vercel.com">Vercel</Link>.
      </div>
    </footer>
  );
};

export default Footer;
