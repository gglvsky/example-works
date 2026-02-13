import React from 'react';
import PostItem from './PostItem';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { useRef } from 'react';

const PostList = ({ posts, title, remove }) => {
  if (!posts.length) {
    return <h1 style={{ textAlign: 'center' }}>No Posts Were Found!</h1>;
  }

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>{title}</h1>

      <TransitionGroup>
        {posts.map((post, index) => {
          const nodeRef = React.createRef();

          return (
            <CSSTransition
              key={post.id}
              timeout={500}
              classNames="post"
              nodeRef={nodeRef}
              unmountOnExit
            >
              <div ref={nodeRef}>
                <PostItem
                  remove={remove}
                  number={index + 1}
                  post={post}
                />
              </div>
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    </div>
  );
};

export default PostList;
