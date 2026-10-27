

/**
 * 1件分の投稿データから、画面に表示するためのDOM要素(div)を生成して返す関数
 * 初期描画時にも、新しく作られた投稿の表示にも使われる
 *
 * @param {object} post - bacefook.newsfeed に格納されている投稿オブジェクト
 * @param {string} post.friend - 投稿した友達の名前
 * @param {string} post.text - 投稿本文）
 * @param {Date} post.timestamp - 投稿日時
 */



const renderPost = (post) => {
  const friendEl = document.createElement('div');
  friendEl.className = 'friend';
  friendEl.innerText = post.friend;


  const postEl = document.createElement('div');
  postEl.className = 'post';
  postEl.innerText = post.text;
  postEl.append(friendEl);


  //あってるかわからん　投稿日時

  const timeEl = document.createElement('div');
timeEl.className = 'timestamp';

//relativetimeのために入れた10/23
timeEl.innerText = dayjs(post.timestamp).fromNow();
postEl.append(timeEl);

//あってるかわからん2

const feelingEl = document.createElement('div');
feelingEl.className = 'feeling';
feelingEl.innerText = `Feeling: ${post.feeling}`;
postEl.append(feelingEl);

//あってるかわからん3

// 画像を表示する
if (post.image) {
  const imgEl = document.createElement('img');
  imgEl.src = post.image;
  imgEl.className = 'post-image';
  imgEl.style.width = '200px';
  postEl.append(imgEl);
}


if(post.likes === undefined){
  post.likes =0;
}

//いいねボタン10/27

const likeButton = document.createElement('button');
likeButton.className='like-button';
likeButton.innerText = `♡ いいね ${post.likes}`;

//押下時

likeButton.addEventListener('click',() =>{
  post.likes++;
  likeButton.innerText = `♡ いいね ${post.likes}`;
});

 postEl.append(likeButton);



//削除機能

const username = localStorage.getItem('username');

if (post.friend === username){
  const deleteButton = document.createElement('button');

  deleteButton.className ='delete-button';
  deleteButton.innerText ='削除';

  deleteButton.addEventListener('click',() =>{

    const index = bacefook.newsfeed.indexOf(post);

    if (index !== -1){
      bacefook.newsfeed.splice(index,1);
    }

    localStorage.setItem(
      "posts",
      JSON.stringify(bacefook.newsfeed)
    );

    postEl.remove();
  });
  postEl.append(deleteButton);
}
  return postEl;
};



const createUserPost = (text, imageDataUrl) => {
  const username = localStorage.getItem('username') || "You";

  const newPost = {
    friend: username,
    text: text,
    feeling: "happy",
    image: imageDataUrl,
    timestamp: new Date(),
    likes:0
  };

  bacefook.newsfeed.unshift(newPost);
  return newPost;
};

window.addEventListener('load', () => {

  //localstorage
   const containerEl = document.querySelector('#newsfeed');

    const saved = JSON.parse(localStorage.getItem("posts"));
  if (saved) {
    bacefook.newsfeed =  [...saved, ...bacefook.newsfeed];
  }

  // ここで saved を画面に表示する
bacefook.newsfeed.forEach(post => {
    containerEl.append(renderPost(post));
  });





  // username が保存されているかどうかを確認
  let username = localStorage.getItem('username');
  if (!username) {
    // username が見つからない場合は入力を求める
    username = window.prompt('What is your name?');
    localStorage.setItem('username', username);
  }



//   // DOM にデータを追加
//   for (let index = bacefook.newsfeed.length - 1; index >= 0; index--) {
//     const post = bacefook.newsfeed[index];
//     containerEl.append(renderPost(post));
//   }




  const form = document.querySelector('#postForm');
  const inputText = document.querySelector('#postText');
  const inputImage = document.querySelector('#postImage');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const file = inputImage.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const newPost = createUserPost(inputText.value, reader.result);
        containerEl.prepend(renderPost(newPost));
        localStorage.setItem("posts", JSON.stringify(bacefook.newsfeed));
      };

      reader.readAsDataURL(file);
    } else {
      const newPost = createUserPost(inputText.value, null);
      containerEl.prepend(renderPost(newPost));
      localStorage.setItem("posts", JSON.stringify(bacefook.newsfeed));
    }

    inputText.value = "";
    inputImage.value = "";
  });




  //あってるかわからんけど更新ボタン
  const refreshBtn=document.querySelector('#refresh');
   refreshBtn.addEventListener('click', () => {
    const latestPost = bacefook.newsfeed[bacefook.newsfeed.length - 1];
    containerEl.prepend(renderPost(latestPost));
});
});



// //DOM全消し

// // const refreshButton=document.querySelector('#refresh');

