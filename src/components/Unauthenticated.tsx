import Link from "next/link";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal } from "react";

export default function Unauthenticated(props: { SvgElement: React.ReactNode | undefined;  name: string |  undefined; message: string  | undefined; }) {


    return (
        <div className="flex min-h-screen items-center justify-center p-5 w-full bg-white select-none">
        <div className="text-center">
          <div className="inline-flex rounded-full bg-red-100 p-4">
            <div className="rounded-full stroke-red-600 bg-red-200 p-4">
{props.SvgElement}
            </div>
          </div>
          <h1 className="mt-5 text-[36px] font-bold text-slate-800 lg:text-[50px]">{props.name} {props.message}</h1>
      
          <p className="text-slate-600 mt-5 lg:text-lg">Oops please Login/Signup. {" " }<Link href={"/api/auth/signin"} className="text-blue-600 hover:text-blue-400">Click me</Link>  <br/> Try to refresh this page orfeel free to contact us if any problem presists.</p>
        </div>
      </div>
);
}