import { PostRow } from "@/lib/types/type-collection";
import Image from "next/image";

export default async function Post({ post }: { post: PostRow }) {
  let postImageURL;
  if (post.image_path) {
    postImageURL = `${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL}/storage/v1/object/public/post_images/${post.image_path}`;
    console.log("post image", postImageURL);
  }

  return (
    <div className="flex border border-sky-500">
      <div className="flex basis-16 bg-cyan-500"></div>
      <div className="flex flex-col">
        <div>name</div>
        <div>{post.content}</div>
        <div>
          {postImageURL && (
            <Image
              src={postImageURL}
              alt="post image"
              width={200}
              height={200}
            />
          )}
        </div>

        <div>interactions</div>
      </div>
    </div>
  );
}
