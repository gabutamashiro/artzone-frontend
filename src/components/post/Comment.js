import { useCallback, useContext, useEffect, useState } from "react";
import Context from '../../context';
import axios from "axios";
import { useHistory } from "react-router";

const Comment = (props) => {
    const { comment } = props;

    const [replies, setReplies] = useState(null);

    const [commentUser, setCommentUser] = useState(null);
    let loadUser = null;
    let loadReplies = null;

    const { setIsLoading, user, setHasNewComment } = useContext(Context);

    const history = useHistory();

    useEffect(() => {
        if (comment) {
          loadUser();
          loadReplies();
        }
    }, [loadUser, comment, loadReplies]);

    loadUser = useCallback(async () => {
        try {
            const userId = comment.userId;
          if (!userId) {
            return;
          }
          setIsLoading(true);
          const url = `http://localhost:8080/users/${userId}`
          const response = await axios.get(url);
          if (response && response.data && response.data.message) {
            alert(response.data.message);
          } else {
            setCommentUser(response.data[0]);
          }
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
        }
    }, [comment, setIsLoading]);

    const viewProfile = () => {
    if (!commentUser) {
        return;
    }
        history.push(`/profile/${commentUser.id}`);
    };

   loadReplies = useCallback( async () => {
        try {
          setIsLoading(true);
          const url = `http://localhost:8080/posts/${comment.id}/0/comments/`;
          const response = await axios.get(url);
          setReplies(response.data)
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
          console.error(error);
        }
    }, [setReplies, setIsLoading, comment]);

    const deleteComment = async () => {
      const wantDelete = window.confirm('Deletar o comentário?');
      if (wantDelete) {
        const url = `http://localhost:8080/comments/delete/${comment.id}`;
        const response = await axios.post(url, {commentId: comment.id});
        setHasNewComment(true);
      }
    }

    if (comment.deletedAt && replies && replies.length <= 0) {
      return <></>;
    }

    return (
      <div className="post-detail__comment">
        { commentUser &&
            <div className="comment-detail__user">
                <img className="comment-detail__avatar" src={`http://localhost:8080${commentUser?.user_avatar}`} alt={commentUser?.user_full_name}></img>
                <span className="comment-detail__name" onClick={viewProfile}>{commentUser?.user_full_name}</span>
                { commentUser && user.id === commentUser.id && 
              <span className="comment-detail__delete" onClick={deleteComment}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                  <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                </svg>
              </span>
            }
            </div>
        }

        { !comment.deletedAt &&
          <div className="comment-container">
            <p>{comment.commentContent}</p>
          </div>
        } { comment.deletedAt &&
          <div className="comment-container__deleted">
            [comentário deletado]
          </div>
        }

        { replies && replies.length > 0 &&
            <div className="post-detail__replies">
                { replies.map( replie =>
                    <Comment comment={replie} key={replie}/>
                ) }
            </div>
        }
      </div>
    );
};
export default Comment;