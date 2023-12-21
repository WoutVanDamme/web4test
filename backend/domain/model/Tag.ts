

class Tag {
  readonly tagId: number;
  readonly name: string;

  constructor(tag:{tagId: number, name: string}) {
    this.tagId = tag.tagId;
    this.name = tag.name;
  }


}

export {Tag};