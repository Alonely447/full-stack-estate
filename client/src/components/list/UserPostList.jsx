import Card from "../card/Card";
import './list.scss';

function UserPostList({ posts, currentUser }) {
  // Filter posts to only those owned by currentUser and exclude flagged posts
  const userPosts = posts.filter(post => currentUser && post.userId === currentUser.id && post.status !== "flagged" && post.status !== "hidden");

  return (
    <div className="list">
      {userPosts.map(item => (
        <Card key={item.id} item={item} currentUser={currentUser} />
      ))}
    </div>
  );
}

export default UserPostList;
