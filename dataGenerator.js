

/**
 * Bacefook アプリ全体で使用するデータを格納するオブジェクト
 * - newsfeed: 投稿一覧
 * - friends: 友達ごとの投稿一覧
 * - friendNames: 友達の名前リスト
 */


(() => {
  window.bacefook = {}; //ファイルをまたぐからいる
  bacefook.newsfeed = [];
  bacefook.friends = {};
  bacefook.friendNames = ['hanako', 'taro', 'yuko', 'jiro', 'hikaru'];
  bacefook.friendNames.forEach((name) => {
    bacefook.friends[name] = [];
  });




  /**
 * 配列からランダムな要素を1つ返す関数
 *
 * @param {Array} array - ランダムに要素を取り出したい配列
 * @returns {*} 配列の中のランダムな要素
 */



  const getRandomElement = (array) => {
    // 配列からランダムな要素を返す
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  };

  const starters = [
    'totally just',
    'just',
    'completely',
    'waaaaah! i',
    'i just',
    'a salaryman',
    'a salaryman',
    'yesterday I',
    'a ninja',
    'my boss',
  ];
  const verbs = [
    'ate',
    'drank',
    'refactored',
    'iterated on',
    'thought about',
    'saw',
    'walked to',
    'got lost in',
    'walked into',
    'googled',
    'drove',
    'ran to',
    'worked on',
    'slept on',
    'slept in',
  ];
  const fillers = [
    'my',
    'my favorite',
    'a beautiful',
    'a delicious',
    'that',
    'this',
    'an interesting',
    '',
    'the best',
    'the greatest',
    'a delightful',
  ];
  const nouns = [
    'DIG',
    'restaurant',
    'omakase',
    'hitomedia',
    'family mart',
    'private jet',
    'lawsons',
    'conbini',
    'whisky',
    'onigiri',
    'car',
    'food',
    'house',
    'toilet',
    'tokyo',
    'city',
    'iphone',
    'google',
    'unicorn',
    'mess',
    'pirate ship',
    'ninja',
  ];
  const hashtags = [
    '#DIG',
    '#techlife',
    '#toyota',
    '#tokyo',
    '#japan',
    '#interesting',
    '#til',
    '#lol',
    '#tgifriday',
    '#hashtags',
    '#japanlife',
    '#oops',
    '#wakuwaku',
  ];
  const feelings = [
    'happy',
    'smug',
    'lovestruck',
    'gross',
    'scared',
    'tired',
    'angry',
    'frustrated',
    'excited',
    'surprised',
  ];
  // 画像機能（任意課題）に挑戦する場合は、ここに画像の URL を追加してください

  const images = [
    'images/zundamon_default.jpg',
    'images/metan_image.jpg'
  ];


  /**
 * ランダムな文章を生成して返す関数
 * starters / verbs / fillers / nouns / hashtags の各配列から
 * ランダムに1つずつ要素を取り出し、スペース区切りで結合した文字列を返す
 *
 * @returns {string} ランダムに生成された文章
 */


  const generateRandomText = () => {
    return [
      getRandomElement(starters),
      getRandomElement(verbs),
      getRandomElement(fillers),
      getRandomElement(nouns),
      getRandomElement(hashtags),
    ].join(' ');
  };


  /**
 * ランダムな投稿オブジェクトを生成する関数
 * timeOffset が指定されている場合は、その分だけ過去の timestamp を作る
 *
 * @param {number|object} timeOffset - 2-21時間の範囲に散らしたm秒単位の数値 or null
 * @returns {Object} 投稿したユーザーの投稿の情報を入れたオブジェクト
 */

  const generatePostObj = (timeOffset) => {
    // offset が指定されている場合は、その分だけタイムスタンプを過去にする
    // 指定されていない場合は、現在時刻を使用する
    const timestamp = timeOffset
      ? new Date(new Date().getTime() - timeOffset)
      : new Date();

      //ここから演習問題(timestamp/feeling/imageの表示)


    return {
      friend: getRandomElement(bacefook.friendNames),
      text: generateRandomText(),
      feeling: getRandomElement(feelings),
      image: getRandomElement(images),
      timestamp:timestamp,
      likes:0
    };
  };



  // let timestamp;　if (timeOffset){
  // timestamp = new Date(new Date().getTime() - timeOffset);
  // } else {timestamp = new Date();
  // }でも書ける

  /**
 * 投稿オブジェクトを bacefook.newsfeed と bacefook.friends に追加する関数
 * 友達ごとの投稿配列にも、全体のニュースフィードにも同時に追加される
 *window.bacefookobjectの中のデータにobjectを追加していく関数
 * @param {object} obj - 投稿の投稿データを含んだオブジェクト
 * @returns {void}
 */


  const addPost = (obj) => {
    const friend = obj.friend;
    bacefook.friends[friend].push(obj);
    bacefook.newsfeed.push(obj);
  };

  /**
   * 
    * 引数として渡されたtimeOffsetを使って、userの投稿の情報を詰め込んだobject
 　* @param {number} timeOffset　2-21時間の範囲に散らしたm秒単位の数値
　 * @returns {void}
   */

  const createPost = (timeOffset) => {
    const newPost = generatePostObj(timeOffset);
    addPost(newPost);
  };

  for (let i = 0; i < 10; i++) {
    // 初期処理として、過去およそ 2 〜 21 時間の範囲に散らした 10 件分の投稿を作成
    const timeOffset = (2 * (10 - i) + Math.random()) * 60 * 60 * 1000;
    createPost(timeOffset);
  }

  // scheduler はページが開いている間ずっと動き続け、3〜8秒ごとに
  // bacefook.newsfeed（と該当する friend の配列）に新しい投稿を追加する。
  // ただし、投稿が追加されたことを知らせるイベントやコールバックは用意されていない。
  // 新しい投稿を画面に反映するには、app.js 側で定期的に配列の変化を
  // チェックする仕組みを自分で作る必要がある。
  const scheduler = () => {
    createPost(null);
    setTimeout(scheduler, (3 + Math.random() * 5) * 1000); // 3 〜 8 秒ごとに新しい投稿を生成
  };

  scheduler();
})();
