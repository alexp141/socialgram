"use client";

import { postComment } from "@/lib/actions";
import { PostRow } from "@/lib/types/type-collection";
import { toast } from "react-toastify";

export default function CommentCreator({ post }: { post: PostRow }) {
  async function handleAction(formData: FormData) {
    const res = await postComment(post.id, post.user_id, formData);
    if (res.error) {
      console.log(res.error);
      toast.error(res.error);
      return;
    }
    toast.success("Comment posted");
  }

  return (
    <div className="grid grid-cols-[auto_1fr] border-t border-red-500 py-2 px-1">
      <div className="">
        <div className="w-12 h-12 bg-orange-500 border rounded-full mx-1"></div>
      </div>
      <form action={handleAction}>
        <textarea
          onFocus={() => console.log("focused")}
          onBlur={() => console.log("unfocused")}
          className="w-full focus:min-h-32"
          placeholder="Post your reply"
          maxLength={300}
          name="comment"
        />
        <input type="file" name="post_image" id="post_image" />
        <button>Post</button>
      </form>
    </div>
  );
}
