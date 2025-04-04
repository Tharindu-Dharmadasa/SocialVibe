import { getPosts } from "@/actions/post.action";
import { getProfileByUsername, getUserLikedPosts, getUserPosts, isFollowing } from "@/actions/profile.action";
import { notFound } from "next/navigation";
import { title } from "process";
import ProfilePageClient from "./ProfilePageClient";

export async function generateMetadata({params} : {params: {username: string}}) {
  const user = await getProfileByUsername(params.username);

  if(!user) return;

  return{
    title: `${user.name ?? user.userName}`,
    description: user.bio || `Ckeck out ${user.userName}'s profile.`,
  };
  
}

async function ProfilePageServer({params} : {params: {username: string}}) {
    const user = await getProfileByUsername(params.username);

    if(!user) notFound();

    const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
      getUserPosts(user.id),
      getUserLikedPosts(user.id),
      isFollowing(user.id), 
    ]);

  return (
    <ProfilePageClient 
      user={user}
      posts={posts}
      likedPosts={likedPosts}
      isFollowing={isCurrentUserFollowing}
    />
  )
}

export default ProfilePageServer;