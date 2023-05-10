export declare type HashtagResponse = {
  hashtag: string;
  count: number;
};

declare const hashtagController: {
  get: {
    "/trending"(): HashtagResponse[];
  };
};

export default hashtagController;