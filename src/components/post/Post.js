const Post = (props) => {
  const { post, onItemClicked } = props;

  const selectPost = () => {
    onItemClicked(post);
  };

  return (
    <div className="post" onClick={selectPost}>
      { post.post_category === 1 &&
        <img src={`http://localhost:8080${post.post_content}`} alt={`${post.post_created_by} - ${post.post_created_date}`}/>
      }
      { post.post_category === 2 &&
        <video width="320" height="240">
          <source src={`http://localhost:8080${post.post_content}`} type="video/mp4"></source>
        </video>
      }
    </div>
  );
};
export default Post;