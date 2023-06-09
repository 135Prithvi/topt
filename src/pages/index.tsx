import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useState } from "react";
import Loading from "~/components/loading";
import Unauthenticated from "~/components/Unauthenticated";
import Error403 from "~/components/Error403";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { toast } from "react-hot-toast";
const Home: NextPage = () => {
  const utils = api.useContext();
  const { data, isLoading } = api.post.getPosts.useQuery();
  const { mutate } = api.post.postTweet.useMutation({
    async onSuccess() {
      setInput("");
      await utils.post.getPosts.invalidate();
    },
    onError: (e) => {
      const errors = JSON.parse(e.message);
      if (errors && errors[0]) {
        console.log(errors[0].message);
        toast.error(errors[0].message);
      } else {
        toast.error("Failed to post! Please try again later.");
      }
    },
  });

  const [input, setInput] = useState<string>("");
  const { data: sessionData, status } = useSession();
  if (status == "unauthenticated") {
    return (
      <Unauthenticated
        message="Please login"
        name="Unauthenticated"
        SvgElement={<Error403 />}
      />
    );
  } else if (status == "loading") return <Loading />;
  if (!data) return null;
  // if (error) return <Unauthenticated message={JSON.stringify(error.data?.code, null, 2)} name={JSON.stringify(error.data?.zodError, null, 2)} SvgElement={undefined} />
  if (isLoading) return <Loading />;
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen justify-center ">
        <div
          className="w-full max-w-lg border-x-2 border-slate-300 text-xl text-white
        "
        >
          <div className="flex w-full border-b border-slate-200 p-1">
            <img
              src={sessionData?.user.image as string}
              alt="twitter user"
              className="ml-3 h-14 w-14 rounded-full"
            />

            <form
              action=""
              onSubmit={(e) => {
                e.preventDefault();
                mutate({ content: input });
              }}
              className="w-full"
            >
              <input
                type="text"
                id="tweet"
                value={input}
                className="w-full flex-grow bg-transparent p-4 text-xl outline-none "
                placeholder="Type some emoji"
                onChange={(e) => setInput(e.target.value)}
                autoComplete="off"
              />
            </form>
          </div>
          <div className="flex w-full flex-col">
            {[...data]?.map((post) => (
              <div key={post.id} className="border-b border-slate-200 p-5">
                <div className="flex gap-2">
                  <Link href={`${post.author.name} `} shallow>
                    <img
                      src={post.author.image as string}
                      alt="twitter user"
                      className=" h-10 w-10 rounded-full"
                    />
                  </Link>
                  <div className="flex flex-col">
                    <span className="align-text-top text-xs opacity-50">
                      <Link href={`${post.author.name} `}>
                        {`@` + post.author.name?.split(" ").join("")}
                      </Link>
                      <span className="font-thin">{` · ${dayjs(
                        post.createdAt
                      ).fromNow()}`}</span>
                    </span>

                    <Link href={`/post/${post.id} `}>
                      <span>{post.content}</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
