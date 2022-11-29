import Link from "next/link";
//This component is imported to every page as the import statement is in _app.js
const Header = () => {
  return (
    <>
      <header className="px-5 py-5 flex items-center justify-around bg-orange-100 text-orange-600">
        <div>
          <Link href={"/"}>
            <h2>The Complete Document Management System</h2>
          </Link>
        </div>
        <div className="space-x-3">
          <Link href={"/about"}>About</Link>
          <Link href={"/contact"}>Contact</Link>
        </div>
      </header>
    </>
  );
};

export default Header;
