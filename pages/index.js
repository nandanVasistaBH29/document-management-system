import Head from "next/head";
import Card from "../components/Card";
import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import { useEffect } from "react";
export default function Home({ dirs, check }) {
  useEffect(() => {
    console.log(check); // for testing path
  }, []);
  return (
    <div>
      <Head>
        <title>Document Management System</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <main className="flex flex-col justify-center items-center">
        <div className="flex-col items-center p-4 m-4 space-y-2 ">
          {/* 3 props are mandatory for Card component*/}
          <Card
            heading={"Register"}
            description={
              "Be a part of community of organizations and improve your day-to-day productivity"
            }
            toLink={"/auth/register-org"}
          />
          <Card
            heading={"Multiple Users"}
            description={
              "Create multiple users for an organization and manage their work flows"
            }
            toLink={"/auth/login-user"}
          />
        </div>

        <h2 className="text-3xl text-orange-600">Our Clients</h2>

        <div className="flex h-40 w-screen overflow-x-scroll">
          {dirs.map((item, index) => (
            <img
              src={`/logo/${item}`}
              className="text-blue-500 h-full m-4 p-4 rounded-3xl overflow-x-auto"
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps = async () => {
  const props = { dirs: [] };
  try {
    const check = process.cwd();
    const dirs = await fs.readdir(path.join(process.cwd(), "/public/logo"));
    props.dirs = dirs;
    props.check = check;
    return { props };
  } catch (error) {
    return { props };
  }
};
