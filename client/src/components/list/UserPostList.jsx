import Card from "../card/Card";
import './list.scss';

function UserPostList({ posts, currentUser }) {
  // Filter posts to only those owned by currentUser
  const userPosts = posts.filter(post => currentUser && post.userId === currentUser.id);

  return (
    <div className="list">
      {userPosts.map(item => (
        <Card key={item.id} item={item} currentUser={currentUser} />
      ))}
    </div>
  );
}

export default UserPostList;
